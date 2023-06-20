require("dotenv").config();
const express = require("express");
const app = express();
const http = require("http").createServer(app);
const path = require("path");
const io = require("socket.io")(http);
const port = process.env.PORT || 6954;
const bodyParser = require("body-parser");
const { createClient } = require("@supabase/supabase-js");
const { time } = require("console");
const supabase = createClient(
  "https://yyufywjwwwmgfjmenluv.supabase.co",
  `${process.env.SUPABASE_KEY}`
);
const historySize = 100;
let history = [];
let typing = [];
let localDateString;

app.set("view engine", "ejs");
app.set("views", "./views");

app.use(express.static(path.resolve("public")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// app.get('/thema', async (req, res) => {
//   const {data, error} = await supabase
//       .from('thema')
//       .select()
//   res.send(data);
// });

app.get("/", async (req, res) => {
  const { data: themeData, themeError } = await supabase.from("theme").select();

  const { data: themeSuggestions, themeSuggestionsError } = await supabase
    .from("suggestion_theme")
    .select();

  const { data: suggestionsData, error: suggestionsError } = await supabase
    .from("suggestion")
    .select();

  const { data: latestSuggestionsData, latestSuggestionsError } = await supabase
    .from("suggestion")
    .select()
    .order("created_at", { ascending: false })
    .limit(3);

  for (const suggestion of suggestionsData) {
    const relatedTheme = themeSuggestions.find(
      (ts) => ts.suggestionId === suggestion.id
    );
    if (relatedTheme) {
      const theme = themeData.find((t) => t.id === relatedTheme.themaId);
      if (theme) {
        suggestion.theme = theme;
      }
    }
  }

  for (const latestSuggestion of latestSuggestionsData) {
    const latestRelatedTheme = themeSuggestions.find(
      (ts) => ts.suggestionId === latestSuggestion.id
    );
    if (latestRelatedTheme) {
      const theme = themeData.find((t) => t.id === latestRelatedTheme.themaId);
      if (theme) {
        latestSuggestion.theme = theme;
      }
    }
  }

  for (let i = 0; i < latestSuggestionsData.length; i++) {
    const dateString = latestSuggestionsData[i].created_at;
    const date = new Date(dateString);
    localDateString = date.toLocaleString("nl-NL", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  res.render("index", {
    title: "Wensen",
    themes: themeData,
    suggestions: suggestionsData,
    latestSuggestions: latestSuggestionsData,
    time: localDateString,
  });
});

app.get("/sent", (req, res) => {
  res.render("sent", {
    title: "Bevesting",
  });
});

app.get("/wens/:id", async (req, res) => {
  const suggestionId = req.params.id;

  // Fetch the suggestion data from Supabase based on the provided ID
  const { data: suggestionData, error } = await supabase
    .from("suggestion")
    .select()
    .eq("id", suggestionId)
    .single();

  if (error) {
    console.error("Error fetching suggestion:", error);
    // Handle the error appropriately, e.g., render an error page
  } else {
    res.render("detailPage-1", {
      title: "Wens",
      suggestion: suggestionData,
    });
  }
});

app.get("/user/:first_name", async (req, res) => {
  const firstName = req.params.first_name;
  const { data: userData, error: userError } = await supabase
    .from("resident")
    .select()
    .eq("first_name", firstName)
    .single();

  let defaultTime = userData.created_at;
  let date = new Date(defaultTime).toLocaleDateString("nl-NL", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const { data: residentSuggestionData, residentSuggestionError } =
    await supabase.from("resident_suggestion").select();

  const { data: suggestionData, suggestionError } = await supabase
    .from("suggestion")
    .select();

  let int = 0;
  let listSuggestions = [];
  for (const suggestion of suggestionData) {
    for (const residentSuggestion of residentSuggestionData) {
      if (suggestion.id === residentSuggestion.suggestion_id) {
        if (userData.id === residentSuggestion.resident_id) {
          int++;
          listSuggestions.push(suggestion);
        }
      }
    }
  }

  const { data: themeData, themeError } = await supabase
  .from("theme")
  .select();

  const { data: suggestionThemeData, suggestionThemeError } = await supabase
    .from("suggestion_theme")
    .select();

  for (const suggestion of listSuggestions) {
    let relatedTheme = null;
    for (const suggestionTheme of suggestionThemeData) {
      if (suggestionTheme.suggestionId === suggestion.id) {
        relatedTheme = suggestionTheme;
        break;
      }
    }
    if (relatedTheme) {
      let theme = null;
      for (const theme of themeData) {
        if (theme.id === relatedTheme.themaId) {
          theme = theme;
          break;
        }
      }
      if (theme) {
        suggestion.theme = theme;
      }
    }
  }
  console.log(listSuggestions);

  if (userError || residentSuggestionError || suggestionError) {
    console.error(
      "Error:",
      userError || residentSuggestionError || suggestionError
    );
  } else {
    res.render("user", {
      title: "Gebruiker",
      user: userData,
      time: date,
      amount: int,
      suggestions: listSuggestions,
    });
  }
});

app.get("/form", (req, res) => {
  res.render("form", {
    title: "Formulier",
  });
});

app.post("/form", async (req, res) => {
  const { error } = await supabase.from("form").insert({
    title: req.body.titel,
    description: req.body.beschrijving,
    theme: req.body.thema,
    image: req.body.imageLink,
    link: req.body.file,
  });
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
    let exists = false;

    // Check if the user is already in the array.
    typing.forEach((client) => {
      if (client[1] == socket.id) {
        exists = true;
      }
    });

    if (user.typing && !exists) {
      // Add the name and connection ID to the list of typing users.
      typing.push([user.name, socket.id]);
    } else if (!user.typing) {
      // Remove the name and connection ID from the list of typing users.
      typing.forEach((client, index) => {
        if (client[1] == socket.id) {
          // Remove the user from the list of typing users.
          typing.splice(index, 1);
        }
      });
    }

    // Emit the array of typing users.
    io.emit("typing", typing);
  });

  socket.on("disconnect", () => {
    console.log(`user ${socket.id} disconnected`);
  });
});

http.listen(port, () => {
  console.log(`Example app listening on  http://localhost:${port}`);
});
