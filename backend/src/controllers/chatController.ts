import expressAsyncHandler from "express-async-handler";
import type { AuthRequest } from "../middleware/auth";
import type { Response } from "express";
import { Chat } from "../models/Chat";
import { Types } from "mongoose";

export const getChats = expressAsyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { userId } = req;

    const chats = await Chat.find({ participants: userId })
      .populate("participants", "name email avatar")
      .populate("lastMessage")
      .sort({ lastMessageAt: -1 });

    const formattedChats = chats.map((chat) => {
      const otherParticipant = chat.participants.find(
        (p) => p._id.toString() !== userId,
      );
      return {
        _id: chat._id,
        participant: otherParticipant ?? null,
        lastMessage: chat.lastMessage,
        lastMessageAt: chat.lastMessageAt,
      };
    });

    res.json(formattedChats);
  },
);

export const getOrCreateChat = expressAsyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { userId } = req;
    const { participantId } = req.params;

    if (!participantId) {
      res.status(400).json({ error: "Participant ID is required" });
      return;
    }

    if (!Types.ObjectId.isValid(participantId as string)) {
      res.status(400).json({ error: "Invalid participant Id" });
      return;
    }

    if (userId === participantId) {
      res.status(400).json({ error: "Cannot create chat with yourself" });
      return;
    }

    // check if chat already exists
    let chat = await Chat.findOne({
      participants: { $all: [userId, participantId] },
    })
      .populate("participants", "name email avatar")
      .populate("lastMessage");

    if (!chat) {
      const newChat = new Chat({ participants: [userId, participantId] });
      await newChat.save();
      chat = await newChat.populate("participants", "name email avatar");
    }

    const otherParticipant = chat.participants.find(
      (p) => p._id.toString() !== userId,
    );

    res.json({
      _id: chat._id,
      participant: otherParticipant ?? null,
      lastMessage: chat.lastMessage,
      lastMessageAt: chat.lastMessageAt,
    });
  },
);
