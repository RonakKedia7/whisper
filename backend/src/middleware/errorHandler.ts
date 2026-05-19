import type { Request, Response, NextFunction } from "express";

export const errorMiddleware = (
  err: Error & { status?: number; statusCode?: number },
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error("ERROR 💥", err);

  res.status(err.status || err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};
