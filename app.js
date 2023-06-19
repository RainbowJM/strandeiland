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

// app.get('/thema', async (req, res) => {
//   const {data, error} = await supabase
//       .from('thema')
//       .select()
//   res.send(data);
// });

app.get("/", (req, res) => {
  res.render("index", {
    title: "Wensen",
  });
});

app.get("/chat", (req, res) => {
  res.render("chat", {
    title: "Chat",
  });
});

app.get('/sent', (req, res) => {
    res.render('sent',{
        title: 'Bevesting',
    })
});
  
app.get('/detailPage-1/:id', async (req, res) => {
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
    console.log(suggestionData);
    res.render('detailPage-1', {
      title: 'Detail',
      suggestion: suggestionData
    });
  }
  console.log(suggestionData)

});


app.get("/form", (req, res) => {
  res.render("form", {
    title: "Formulier",
  });
});

app.post("/form", async (req, res) => {

  console.log('even kijken');
  
  const {error} = await supabase
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

app.get("/user", (req, res) => {
  res.render("user", {
    title: "User",
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
