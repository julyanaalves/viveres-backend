// src/controllers/ongController.ts
import { Request, Response } from "express";
import prisma from "../prisma";
import { ApiResponse } from "../utils/apiResponse";

export const getOngProfile = async (req: any, res: Response) => {
  const ongId = req.userId;

  try {
    // Use findFirst para filtrar por id e role
    const ong = await prisma.user.findFirst({
      where: { id: ongId, role: "ONG" },
    });

    if (!ong) return ApiResponse.error(res, "ONG not found", 404);

    ApiResponse.success(res, ong);
  } catch (error) {
    ApiResponse.error(res, "Failed to get ONG profile", 400);
  }
};

export const updateOngProfile = async (req: any, res: Response) => {
  const ongId = req.userId;
  const { name, email, phone, address } = req.body;

  try {
    // Use updateMany para filtrar por id e role
    const ong = await prisma.user.updateMany({
      where: { id: ongId, role: "ONG" },
      data: { name, email, phone, address },
    });

    if (ong.count === 0) return ApiResponse.error(res, "ONG not found", 404);

    ApiResponse.success(res, { message: "ONG profile updated successfully" });
  } catch (error) {
    ApiResponse.error(res, "Failed to update ONG profile", 400);
  }
};
