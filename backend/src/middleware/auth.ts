import type { Request, Response, NextFunction } from "express";
import { getAuth } from "@clerk/express";
import expressAsyncHandler from "express-async-handler";

import { User } from "../models/User";

export type AuthRequest = Request & {
  userId?: string;
};

export const protectRoute = expressAsyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { userId: clerkId } = getAuth(req);

    if (!clerkId) {
      res.status(401).json({ message: "Unauthorized - invalid token" });
      return;
    }

    const user = await User.findOne({ clerkId });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    req.userId = user._id.toString();

    next();
  },
);
