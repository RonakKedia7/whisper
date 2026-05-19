import expressAsyncHandler from "express-async-handler";
import type { AuthRequest } from "../middleware/auth";
import type { Request, Response } from "express";
import { User } from "../models/User";
import { clerkClient, getAuth } from "@clerk/express";

export const getMe = expressAsyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { userId } = req;

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json(user);
  },
);

export const authCallback = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { userId: clerkId } = getAuth(req);

    if (!clerkId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    let user = await User.findOne({ clerkId });
    if (!user) {
      // get user info from clerk and save to db
      const clerkUser = await clerkClient.users.getUser(clerkId);

      const email = clerkUser.primaryEmailAddress?.emailAddress;

      user = await User.create({
        clerkId,
        name: clerkUser.firstName
          ? `${clerkUser.firstName} ${clerkUser.lastName || ""}`.trim()
          : email?.split("@")[0],
        email,
        avatar: clerkUser.imageUrl,
      });
    }

    res.status(200).json(user);
  },
);
