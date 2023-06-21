require('dotenv').config()
const express = require("express");
const app = express();
const http = require("http").createServer(app);
const path = require("path");
const io = require("socket.io")(http);
const port = process.env.PORT || 6954;
const bodyParser = require("body-parser");
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  'https://yyufywjwwwmgfjmenluv.supabase.co',
  `${process.env.SUPABASE_KEY}`);
const historySize = 100;
let history = [];
let typing = [];

app.set("view engine", "ejs");
app.set("views", "./views");

app.use(express.static(path.resolve("public")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", async (req, res) => {
  // Fetch the theme and suggestion data from Supabase
  const { data: themeData, themeError } = await supabase
    .from('theme')
    .select()

  const { data: themeSuggestions, themeSuggestionsError } = await supabase
    .from('suggestion_theme')
    .select()

  const { data: suggestionsData, error: suggestionsError } = await supabase
    .from('suggestion')
    .select()

  const { data: latestSuggestionsData, latestSuggestionsError } = await supabase
    .from('suggestion')
    .select()
    .order('created_at', { ascending: false })
    .limit(3);

  const { count, error } = await supabase
    .from('suggestion')
    .select('*', { count: 'exact', head: true })

  console.log(count);
  for (const suggestion of suggestionsData) {
    const relatedTheme = themeSuggestions.find((ts) => ts.suggestionId === suggestion.id);
    if (relatedTheme) {
      const theme = themeData.find((t) => t.id === relatedTheme.themaId);
      if (theme) {
        suggestion.theme = theme;
      }
    }
  }


  for (const latestSuggestion of latestSuggestionsData) {
    const latestRelatedTheme = themeSuggestions.find((ts) => ts.suggestionId === latestSuggestion.id);
    if (latestRelatedTheme) {
      const theme = themeData.find((t) => t.id === latestRelatedTheme.themaId);
      if (theme) {
        latestSuggestion.theme = theme;
      }
    }
  }

  if (themeError || suggestionsError || latestSuggestionsError || themeSuggestionsError) {
    console.error('Error:', themeError || suggestionsError || latestSuggestionsError || themeSuggestionsError);
  } else {
    res.render("index", {
      title: "Wensen",
      themes: themeData,
      suggestions: suggestionsData,
      latestSuggestions: latestSuggestionsData,
      totalSuggestions: count
    });
  }
});

app.get('/sent', (req, res) => {
  res.render('sent', {
    title: 'Bevesting',
  })
});

app.get('/wens/:id', async (req, res) => {
  const suggestionId = req.params.id;

  // Fetch the suggestion data from Supabase based on the provided ID
  const { data: suggestionData, error } = await supabase
    .from('suggestion')
    .select()
    .eq('id', suggestionId)
    .single();

  if (error) {
    console.error('Error fetching suggestion:', error);
    // Handle the error appropriately, e.g., render an error page
  } else {
    res.render('detailPage-1', {
      title: 'Wens',
      suggestion: suggestionData
    });
  }
});


app.get("/form", (req, res) => {
  res.render("form", {
    title: "Formulier",
  });
});

app.post("/form", async (req, res) => {
  const { error } = await supabase
    .from('form')
    .insert({
      title: req.body.titel,
      description: req.body.beschrijving,
      theme: req.body.thema,
      image: req.body.imageLink,
      link: req.body.file
    })
  if (error) {
    res.send(error);
  }
  res.send("created!!");
});

app.get("/offline", (req, res) => {
  res.render("offline", {
    title: "Offline",
  });
});

io.on("connection", (socket) => {
  console.log("user connected");

  socket.emit("history", history);

  socket.on("message", (message) => {
    // Add the message to the history.
    while (history.length > historySize) {
      // Remove the oldest message.
      history.shift();
    }
    // Add the message to the history.
    history.push(message);

    // Emit the message to all connected users.
    io.emit("message", {
      message: message.message,
      name: message.name,
      id: socket.id,
      time: message.time,
    });
  });

  socket.on("typing", (user) => {
    let exists = false

    // Check if the user is already in the array.
    typing.forEach((client) => {
      if (client[1] == socket.id) {
        exists = true
      }
    })

    if (user.typing && !exists) {
      // Add the name and connection ID to the list of typing users.
      typing.push([user.name, socket.id])
    } else if (!user.typing) {
      // Remove the name and connection ID from the list of typing users.
      typing.forEach((client, index) => {
        if (client[1] == socket.id) {
          // Remove the user from the list of typing users.
          typing.splice(index, 1);
        }
      })
    }

    // Emit the array of typing users.
    io.emit("typing", typing)
  })

  socket.on("disconnect", () => {
    console.log(`user ${socket.id} disconnected`);
  });
});

http.listen(port, () => {
  console.log(`Example app listening on  http://localhost:${port}`);
});
