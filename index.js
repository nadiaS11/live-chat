const express = require("express");
// const cors = require("cors");

const app = express();
const http = require("http").createServer(app);

const PORT = process.env.PORT || 8000;

 
  http.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

const users = {};

app.get("/", (req, res) => {
  res.send('hello');
});

// Socket
// const io = require("socket.io")(http, {
//   cors: {
//     origin: [
//       "http://localhost:5173",
//       "http://localhost:5174",
//       "https://contesthub-project.web.app",
//     ],
//     credentials: true,
//   },
// });
const io = require("socket.io")(http, {
  cors: {
    origin: "*",
    credentials: true,
  },
});
io.on("connection", (socket) => {
  console.log("Connected...");

  // Listen for messages from clients
  socket.on("message", (msg) => {
    // Here 'msg' is the data sent from the frontend
    console.log(`Received message from client: ${msg}`);

    // Broadcast the message to all connected clients, including the sender
    io.emit("message", msg);
  });

  // Additional logic for handling user information
  socket.on("user-info", (userInfo) => {
    // Here 'userInfo' is the data sent from the frontend
    console.log(`Received user info from client: ${userInfo}`);

    // Store user information in the 'users' object (or your preferred data structure)
    users[socket.id] = userInfo;

    // Broadcast the updated user information to all connected clients
    io.emit("user-list", users);
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    // Remove user information when a client disconnects
    delete users[socket.id];

    // Broadcast the updated user information to all connected clients
    io.emit("user-list", users);
  });
});
