import express from "express";

import { clerkMiddleware } from "@clerk/express";
import { errorMiddleware } from "./middleware/errorHandler";

import authRoutes from "./routes/authRoutes";
import chatRoutes from "./routes/chatRoutes";
import messageRoutes from "./routes/messageRoutes";
import userRoutes from "./routes/userRoutes";

const app = express();

app.use(express.json());
app.use(clerkMiddleware());

app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

/* GLOBAL ERROR MIDDLEWARE */
app.use(errorMiddleware);

export default app;
