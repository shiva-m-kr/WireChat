import http from "http";
import { Server } from "socket.io";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "https://wirechat-f.onrender.com",
    credentials: true,
  },
});

const userSocketMap = new Map();

export const getReceiverSocketId = (receiver) => {
  return userSocketMap.get(receiver);
};

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  if (userId) {
    userSocketMap.set(userId, socket.id);
  }

  io.emit("getOnlineUsers", [...userSocketMap.keys()]);

  socket.on("disconnect", () => {
    if (userId) {
      userSocketMap.delete(userId);
    }

    io.emit("getOnlineUsers", [...userSocketMap.keys()]);
  });
});

export { app, server, io };
