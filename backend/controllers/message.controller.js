import Message from "../models/message.model.js";
import Conversation from "../models/conversation.model.js";
import uploadOnCloudnery from "../config/cloudnery.js";
import { io, getReceiverSocketId } from "../socket/socket.js";
// ================= SEND MESSAGE =================
export const sendMessage = async (req, res) => {
    try {
        const sender = req.userId;
        const { receiver } = req.params;
        const { message } = req.body;

        let image = "";

        // Upload image if present
        if (req.file) {
            image = await uploadOnCloudnery(req.file.path);
        }

        // Prevent empty messages
        if (!message && !image) {
            return res.status(400).json({
                message: "Message or image is required."
            });
        }

        // Find existing conversation
        let conversation = await Conversation.findOne({
            participants: { $all: [sender, receiver] }
        });

        // Create new message
        const newMessage = await Message.create({
            sender,
            receiver,
            message,
            image
        });

        // Create conversation if it doesn't exist
        if (!conversation) {
            conversation = await Conversation.create({
                participants: [sender, receiver],
                messages: [newMessage._id]
            });
        } else {
            conversation.messages.push(newMessage._id);
            await conversation.save();
        }
        const receiverSocketId = getReceiverSocketId(receiver);

        if(receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }


        return res.status(201).json(newMessage);

    } catch (error) {
        return res.status(500).json({
            message: `sendMessage error: ${error.message}`
        });
    }
};


// ================= GET ALL MESSAGES =================
export const getMessages = async (req, res) => {
    try {
        const sender = req.userId;
        const { receiver } = req.params;

        const conversation = await Conversation.findOne({
            participants: { $all: [sender, receiver] }
        }).populate("messages");

        if (!conversation) {
            return res.status(200).json([]);
        }

        return res.status(200).json(conversation.messages);

    } catch (error) {
        return res.status(500).json({
            message: `getMessages error: ${error.message}`
        });
    }
};