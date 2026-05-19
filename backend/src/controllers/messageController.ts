import expressAsyncHandler from "express-async-handler";
import type { AuthRequest } from "../middleware/auth";
import type { Response } from "express";
import { Chat } from "../models/Chat";
import { Message } from "../models/Message";

export const getMessages = expressAsyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { userId } = req;
    const { chatId } = req.params;

    const chat = await Chat.findOne({
      _id: chatId,
      participants: userId,
    });
    if (!chat) {
      res.status(404).json({ message: "Chat not found" });
    }

    const messages = await Message.find({ chat: chatId })
      .populate("sender", "name email avatar")
      .sort({ createdAt: 1 }); //oldest first

    res.json(messages);
  },
);
