import expressAsyncHandler from "express-async-handler";
import type { AuthRequest } from "../middleware/auth";
import type { Response } from "express";
import { User } from "../models/User";

export const getUsers = expressAsyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { userId } = req;

    const users = await User.find({ _id: { $ne: userId } })
      .select("name email avatar")
      .limit(50);

    res.status(200).json(users);
  },
);
