import {    Server} from 'socket.io';
import http from 'http';
import express from 'express';

const app = express();
const server = http.createServer(app);


const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173'],
  
  },
});

export function getReceiverSocketId(userId) {
  // This function retrieves the socket ID for a given user ID
  return userSocketMap[userId];
}

// used  to store online users
const userSocketMap = {};

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  const userId = socket.handshake.query.userId; // Assuming userId is sent as a query parameter
  if(userId) userSocketMap[userId] = socket.id;

  //io.emit () is used to send to alll the connecteed clients
  io.emit("getOnlineUsers",Object.keys(userSocketMap));

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers",Object.keys(userSocketMap)); 
  });

//   // Handle other events here
//   socket.on('message', (data) => {
//     console.log('Message received:', data);
//     // Broadcast the message to all connected clients
//     io.emit('message', data);
//   });
});

export{io, server,app};