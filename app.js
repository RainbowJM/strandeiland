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
  
app.get('/detailPage-1', (req, res) => {
    res.render('detailPage-1',{
    title: "Detail",
  });
});

app.get("/form", (req, res) => {
  res.render("form", {
    title: "Formulier",
  });
});


app.post("/form", async (req, res) => {
  console.log(req.body);
  try {
      const { data, error } = await supabase
          .from('suggestion')
          .insert([{ title: req.body.title, description: req.body.description, image: req.body.imageLink}])
          .select();

      const insertId = data[0].id ?? null;
      console.log(insertId);

      if (error || !insertId) {
          throw error;
      }

      const { error: themeError } = await supabase
          .from('suggestion_theme')
          .insert([{
              suggestionId: insertId,
              themaId: req.body.theme
          }]);

      if (themeError) {
          throw themeError;
      }

      res.render('sent');
  } catch (error) {
      res.status(500).json({ error: 'Het toevoegen van de wens ging fout, probeer opnieuw' });
      console.log(error);
      return;
  }
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
