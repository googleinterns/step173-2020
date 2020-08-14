const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
//const { RTCPeerConnection, RTCSessionDescription } = window;

// console.log that your server is up and running
const server = app.listen(port, () => console.log(`Listening on port ${port}`));

var io = require('socket.io').listen(server);

const configuration = {
    iceServers: [
      {
        urls: [
          'stun:stun1.l.google.com:19302',
          'stun:stun2.l.google.com:19302',
        ],
      }
    ],
    iceCandidatePoolSize: 10,
};

// create a GET route
app.get('/', (req, res) => {
  res.send("hola");
});

io.on('connection', function (socket) {
    console.log('connected to socket');

    socket.on("joinSocketRoom", (roomId, uid) => {
        socket.join(roomId);
        console.log("joined room " + roomId);
        socket.to(roomId).emit('newUser', socket.id, uid);
    });

    socket.on("sendOffer", (offer, socketId, uid) => {
        console.log('sendOffer');
        io.to(socketId).emit("receiveOffer", offer, socket.id, uid);
    })

    socket.on("sendAnswer", (answer, socketId) => {
        console.log('sendAnswer');
        io.to(socketId).emit("receiveAnswer", answer, socket.id);
    })

    socket.on("newICE", (candidate, socketId) => {
      console.log('newIce');
        io.to(socketId).emit("receiveICE", candidate, socket.id);
    });

    socket.on("leaveSocketRoom", (roomId) => {
      console.log('leave room');
        io.to(roomId).emit("userLeft", socket.id);
    })

    socket.on("disconnect", () => {
        console.log("Client disconnected");
    });
});