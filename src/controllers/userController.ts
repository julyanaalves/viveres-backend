// src/controllers/userController.ts
import { Request, Response } from "express";
import prisma from "../prisma";
import { ApiResponse } from "../utils/apiResponse";

export const getUserProfile = async (req: any, res: Response) => {
  const userId = req.userId; // Agora isso não causa erro de tipo

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return ApiResponse.error(res, "User not found", 404);

    ApiResponse.success(res, user);
  } catch (error) {
    ApiResponse.error(res, "Failed to get user profile", 400);
  }
};

export const updateUserProfile = async (req: any, res: Response) => {
  const userId = req.userId; // Agora isso não causa erro de tipo
  const { name, email, phone, address } = req.body;

  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { name, email, phone, address },
    });
    ApiResponse.success(res, user);
  } catch (error) {
    ApiResponse.error(res, "Failed to update user profile", 400);
  }
};
