import { Socket, Server as SocketServer } from "socket.io";
import { Server as HttpServer } from "http";
import { verifyToken } from "@clerk/express";

import { User } from "../models/User";
import { Chat } from "../models/Chat";
import { Message } from "../models/Message";

/**
 * Stores currently online users.
 *
 * Key   = MongoDB userId
 * Value = socket.id
 *
 * Example:
 * "65abc123" => "socket_XYZ"
 */
export const onlineUsers: Map<string, string> = new Map();

/**
 * Returns all frontend URLs that are allowed to connect to Socket.io.
 * filter(Boolean) removes undefined values like missing FRONTEND_URL.
 */
const getAllowedOrigins = () => {
  return [
    "http://localhost:8081", // Expo mobile app
    "http://localhost:5173", // Vite web app
    process.env.FRONTEND_URL, // Production frontend
  ].filter(Boolean) as string[];
};

/**
 * Initializes Socket.io on top of the existing HTTP server.
 *
 * Express handles normal REST APIs.
 * Socket.io handles real-time events like messages, online status, etc.
 */
export const initializeSocket = (httpServer: HttpServer) => {
  const io = new SocketServer(httpServer, {
    cors: {
      origin: getAllowedOrigins(),
      credentials: true,
    },
  });

  /**
   * Socket authentication middleware.
   *
   * This runs BEFORE the socket connection is accepted.
   * Client must send Clerk token while connecting.
   */
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;

      if (!token) {
        return next(new Error("Authentication token missing"));
      }

      /**
       * Verify Clerk token.
       * If token is invalid or expired, this will throw an error.
       */
      const session = await verifyToken(token, {
        secretKey: process.env.CLERK_SECRET_KEY!,
      });

      /**
       * Clerk user id.
       * This is not MongoDB _id.
       */
      const clerkId = session.sub;

      /**
       * Find the matching user from our MongoDB database.
       * We only need _id here, so select("_id") is enough.
       */
      const user = await User.findOne({ clerkId }).select("_id");

      if (!user) {
        return next(new Error("User not found in database"));
      }

      /**
       * Attach MongoDB user id to this socket.
       * Now we can access socket.userId later inside events.
       */
      socket.data.userId = user._id.toString();

      /**
       * Allow socket connection.
       */
      next();
    } catch {
      return next(new Error("Invalid or expired token"));
    }
  });

  /**
   * Runs when a user successfully connects to Socket.io.
   */
  io.on("connection", (socket) => {
    const userId = socket.data.userId;

    console.log("Socket connected:", userId);

    /**
     * Send currently online users to this newly connected user.
     * socket.emit sends only to the current socket.
     */
    socket.emit("online-users", {
      userIds: Array.from(onlineUsers.keys()),
    });

    /**
     * Mark this user as online.
     */
    onlineUsers.set(userId, socket.id);

    /**
     * Tell everyone else that this user came online.
     * socket.broadcast.emit sends to everyone except this socket.
     */
    socket.broadcast.emit("user-online", { userId });

    /**
     * Join a private room for this user.
     *
     * Example room:
     * user:65abc123
     *
     * This helps us send events directly to a specific user.
     */
    socket.join(`user:${userId}`);

    /**
     * User joins a chat room when they open a chat screen.
     *
     * Example room:
     * chat:987xyz
     */
    socket.on("join-chat", (chatId: string) => {
      socket.join(`chat:${chatId}`);
    });

    /**
     * User leaves a chat room when they close the chat screen.
     */
    socket.on("leave-chat", (chatId: string) => {
      socket.leave(`chat:${chatId}`);
    });

    /**
     * Runs when user sends a message from frontend.
     *
     * Frontend emits:
     * socket.emit("send-message", { chatId, text })
     */
    socket.on(
      "send-message",
      async (data: { chatId: string; text: string }) => {
        try {
          const { chatId, text } = data;

          /**
           * Check whether this chat exists and this user is a participant.
           * This prevents users from sending messages to chats they don't belong to.
           */
          const chat = await Chat.findOne({
            _id: chatId,
            participants: userId,
          });

          if (!chat) {
            socket.emit("socket-error", {
              message: "Chat not found",
            });
            return;
          }

          /**
           * Save the actual message in MongoDB.
           */
          const message = await Message.create({
            chat: chatId,
            sender: userId,
            text,
          });

          /**
           * Update chat's last message.
           * Useful for showing latest message in conversation list.
           */
          chat.lastMessage = message._id;
          chat.lastMessageAt = new Date();
          await chat.save();

          /**
           * Replace sender id with sender details.
           */
          await message.populate("sender", "name email avatar");

          /**
           * Send real-time message to users currently inside this chat room.
           */
          io.to(`chat:${chatId}`).emit("new-message", message);

          /**
           * Notify all chat participants that chat preview has changed.
           *
           * This is better than emitting "new-message" again,
           * because users inside the chat room may otherwise receive duplicates.
           */
          for (const participantId of chat.participants) {
            io.to(`user:${participantId}`).emit("chat-updated", {
              chatId,
              lastMessage: message,
            });
          }
        } catch {
          socket.emit("socket-error", {
            message: "Failed to send message",
          });
        }
      },
    );

    /**
     * Runs when user disconnects.
     *
     * This can happen when:
     * - app is closed
     * - internet disconnects
     * - user logs out
     * - browser tab closes
     */
    socket.on("disconnect", () => {
      onlineUsers.delete(userId);

      /**
       * Tell everyone else that this user is offline.
       */
      socket.broadcast.emit("user-offline", { userId });

      console.log("Socket disconnected:", userId);
    });
  });

  /**
   * Return io instance so it can be reused elsewhere if needed.
   */
  return io;
};
