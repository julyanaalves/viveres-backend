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
    
    console.error(error);
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
    
    console.error(error);
    ApiResponse.error(res, "Failed to update ONG profile", 400);
  }
};

export const getDonationHistory = async (req: any, res: Response) => {
  const ongId = req.userId;

  try {
    const donations = await prisma.request.findMany({
      where: { ongId },
      include: {
        donation: {
          include: { feirante: true, items: true },
        },
      },
    });
    ApiResponse.success(res, donations);
  } catch (error) {
    
    console.error(error);
    ApiResponse.error(res, "Failed to fetch donation history", 400);
  }
};

export const requestDonation = async (req: any, res: Response) => {
  const ongId = req.userId;
  const { donationId } = req.params;

  try {
    const donation = await prisma.donation.findUnique({
      where: { id: Number(donationId) },
      include: { items: true },
    });
    if (!donation) return ApiResponse.error(res, "Donation not found", 404);
    



    const request = await prisma.request.create({
      data: {
        ongId,
        donationId: Number(donationId),
        status: "PENDING",
        donationItemId: donation.items[0].id, // Assuming you want to request the first item,
      },
    });
    ApiResponse.success(res, request, 201);
  } catch (error) {
    console.error(error);
    ApiResponse.error(res, "Failed to request donation", 400);
  }
};
