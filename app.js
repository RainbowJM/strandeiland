require("dotenv").config();
const express = require("express");
const app = express();
const http = require("http").createServer(app);
const path = require("path");
const io = require("socket.io")(http);
const port = process.env.PORT || 6954;
const bodyParser = require("body-parser");
const router = require('./routes/route')
const historySize = 100;

let history = [];
let typing = [];

app.set("view engine", "ejs");
app.set("views", "./views");

app.use(express.static(path.resolve("public")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/', router);

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