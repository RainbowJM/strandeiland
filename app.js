const express = require("express");
const app = express();
const http = require("http").createServer(app);
const path = require("path");
const io = require("socket.io")(http);
const port = process.env.PORT || 6954;
const bodyParser = require("body-parser");

app.set("view engine", "ejs");
app.set("views", "./views");

app.use(express.static(path.resolve("public")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

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

app.get("/detailPage-1", (req, res) => {
  res.render("detailPage-1", {
    title: "detail",
  });
});

app.get("/form", (req, res) => {
  res.render("form", {
    title: "Formulier",
  });
});

io.on("connection", (socket) => {
  console.log(`user ${socket.id} connected`);

  // socket.emit('history', history)

  socket.on("message", (message) => {
    console.log("socket in")
    console.log('socket', message)
    // while (history.length > historySize) {
    //     history.shift()
    // }
    // history.push(message)

    io.emit("message", message);
  });

  socket.on("disconnect", () => {
    console.log(`user ${socket.id} disconnected`);
  });
});

http.listen(port, () => {
  console.log(`Example app listening on  http://localhost:${port}`);
});
