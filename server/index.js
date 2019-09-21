const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const fs = require("fs");
const uuid = require("uuid/v1");

// Set up Express
const app = express();
const port = process.env.PORT || 4001;

// routing
app.use("/", (req, res) => {
  res.send({ response: "I am alive" }).status(200);
});

// http server
const server = http.createServer(app);

// socket
const io = socketIO(server, {
  pingInterval: 1000 // interval of 1 second for consistent counting
});

// load in local data
const data = JSON.parse(fs.readFileSync("./mock/challenge_data.json", "utf8"));

// server listen
server.listen(port, () => {
  console.log(`Server Started`);
  console.log(`Listening on port ${port}`);
});

// io
io.on("connection", socket => {
  console.log("Socket Connection opened");
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
          let newEvent = Object.assign({}, event, { uid: uuid() });
          io.sockets.emit("newOrder", newEvent, sec);
          console.log(event);
        }
      } else {
        io.sockets.emit("newOrder", {}, sec);
        console.log({});
      }
    }, 1000);
  }

  // Handle Updates
  socket.on("updateOrder", orderData => {
    let newData = data;

    // for the purpose of this challenge, the updated data is simply pushed to existing json file along with the timestamp (sent_at_second)
    newData.push(orderData);
    fs.writeFile(
      "./mock/challenge_data.json",
      JSON.stringify(newData),
      function(err) {
        if (err) throw err;
        console.log("New order update appended to file!");
        console.log("Order Details", orderData);
      }
    );
  });

  // Reconnect
  socket.on("reconnect", () => {
    console.log("Socket Reconnected!");
  });

  // Disconnect
  socket.on("disconnect", reason => {
    if (reason === "client namespace disconnect") {
      console.log("Client disconnected");
    }
    clearInterval(interval);
    sec = 0;
    socket.disconnect();
    console.log("Closed Socket Connection");
  });
});
