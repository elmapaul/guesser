import { join } from "path";
import express from "express";
import socketIO from "socket.io";
import logger from "morgan";

const PORT = 5000;
const app = express();
app.set("view engine", "pug");
app.set("views", join(__dirname, "views"));

app.use(logger("dev"));
app.use(express.static(join(__dirname, "static")));

app.get("/", (req, res) => {
  res.render("home");
});

const server = app.listen(PORT, () => console.log("Server running..."));

const io = socketIO.listen(server);

io.on("connection", socket => {
  console.log("First show nickname: ", socket.nickname);

  socket.on("newMessage", ({ message }) => {
    socket.broadcast.emit("messageNotif", {
      message,
      nickname: socket.nickname || "Anon"
    });
  });

  socket.on("setNickname", ({ nickname }) => {
    socket.nickname = nickname;
    console.log("Second show nickname: ", socket.nickname);
  });

});

