import express from "express";
import isAuth from "../middlewares/isAuth.js";
import upload from "../middlewares/multer.js";
import { sendMessage, getMessages } from "../controllers/message.controller.js";

const messageRouter = express.Router();

// Send a message
messageRouter.post(
  "/send/:receiver",
  isAuth,
  upload.single("image"),
  sendMessage
);

// Get all messages
messageRouter.get(
  "/get/:receiver",
  isAuth,
  getMessages
);

export default messageRouter;