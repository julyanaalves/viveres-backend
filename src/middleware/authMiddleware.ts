// src/middleware/authMiddleware.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ApiResponse } from "../utils/apiResponse";

export const authenticate = (req: any, res: Response, next: NextFunction) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return ApiResponse.error(res, "Access denied", 401);

  try {
    const decoded = jwt.verify(token, "JWT_SECRET") as { userId: number };
    req.userId = decoded.userId; // Agora isso não causa erro de tipo
    next();
  } catch (error) {
    ApiResponse.error(res, "Invalid token", 401);
  }
};
  