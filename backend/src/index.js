// // const express =require("express"); or
// import express from "express"
// import dotenv from "dotenv"
// import authRoutes from "./routes/auth.route.js"
// import { connectDB } from "./lib/db.js";
// import cookieParser from "cookie-parser"
// import messageRoutes from "./routes/message.routes.js";
// import cors from 'cors'
// import { app, server } from "./lib/socket.js";

// import path from 'path';

// dotenv.config();



// const PORT=process.env.PORT

// const __dirname = path.resolve();

// app.use(express.json());
// app.use(cookieParser());

// app.use(cors({
//     origin:"http://localhost:5173",
//     credentials:true
// }))

// app.use("/api/auth",authRoutes)
// app.use("/api/messages",messageRoutes)

// if(process.env.NODE_ENV === "production") {
//     app.use(express.static(path.join(__dirname, '../frontend/dist')));

//     app.get('*', (req, res) => {
//         res.sendFile(path.join(__dirname, '../frontend',"dist", 'index.html'));
//     });
// }

// server.listen(PORT,()=>{
//     console.log("server is running on PORT: " + PORT);
//     connectDB();
// })

///////
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from 'cors';
import path from 'path';
import http from 'http';

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.routes.js";
import { connectDB } from "./lib/db.js";
import { setupSocket } from "./lib/socket.js";

dotenv.config();
const __dirname = path.resolve();

const app = express();
const server = http.createServer(app);

// Middleware
app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// Serve frontend in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'dist', 'index.html'));
  });
}

// Setup socket server
setupSocket(server);

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  connectDB();
});
