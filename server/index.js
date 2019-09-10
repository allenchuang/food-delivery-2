// express
const express = require("express");
const app = express();
const port = process.env.PORT || 4001;

// routing
app.use("/", (req, res) => {
  res.send({ response: "I am alive" }).status(200);
});

// http server
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  pingInterval: 1000 // interval of 1 second for consistent counting
});

// load in local data
const fs = require("fs");
const data = JSON.parse(fs.readFileSync("./mock/challenge_data.json", "utf8"));

// server listen
server.listen(port, () => {
  console.log(`Server Started`);
  console.log(`Listening on port ${port}`);
});

// io
io.on("connection", socket => {
  console.log("New client connected");
  let sec = 0,
    interval;
  if (typeof interval === "undefined") {
    interval = setInterval(function() {
      sec++;
      console.log(sec);
      let events = data.filter(i => i.sent_at_second === sec);
      if (events.length > 0) {
        let event;
        for (event of events) {
          io.sockets.emit("newOrder", event, sec);
          console.log(event);
        }
      } else {
        io.sockets.emit("newOrder", {}, sec);
        console.log({});
      }
    }, 1000);
  }

  socket.on("reconnect", () => {
    console.log("Socket Reconnected!");
  });

  socket.on("disconnect", () => {
    clearInterval(interval);
    sec = 0;
    socket.disconnect();
    console.log("Client disconnected");
  });
});
