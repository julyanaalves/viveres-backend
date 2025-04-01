import { Request, Response } from "express";
import { prisma } from "../app";
import { ApiResponse } from "../utils/apiResponse";

export const createDonation = async (req: Request, res: Response) => {
  const { feiranteId, items } = req.body;

  try {
    const feirante = await prisma.user.findUnique({
      where: { id: feiranteId },
    });
    if (!feirante) return ApiResponse.error(res, "Feirante not found", 404);

    const donation = await prisma.donation.create({
      data: {
        feiranteId,
        items: {
          create: items.map((item: any) => ({
            foodType: item.foodType,
            quantity: item.quantity,
          })),
        },
      },
      include: { items: true },
    });

    ApiResponse.success(res, donation, 201);
  } catch (error) {
    console.log(error);
    ApiResponse.error(res, "Failed to create donation", 400);
  }
};

export const getDonations = async (req: Request, res: Response) => {
  try {
    const donations = await prisma.donation.findMany({
      include: {
        feirante: true,
        items: true,
        requests: true,
      },
    });
    ApiResponse.success(res, donations);
  } catch (error) {
    ApiResponse.error(res, "Failed to get donations", 400);
  }
};

export const getDonationById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const donation = await prisma.donation.findUnique({
      where: { id: Number(id) },
      include: {
        feirante: true,
        items: true,
        requests: {
          include: {
            ong: true,
          },
        },
      },
    });
    if (!donation) return ApiResponse.error(res, "Donation not found", 404);

    ApiResponse.success(res, donation);
  } catch (error) {
    ApiResponse.error(res, "Failed to get donation", 400);
  }
};

export const getDonationsByFeiranteId = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const donations = await prisma.donation.findMany({
      where: { feiranteId: Number(id), status: "AVAILABLE" },
      include: {
        items: true,
        requests: true,
      },
    });
    if (!donations) return ApiResponse.error(res, "No donations found", 404);

    ApiResponse.success(res, donations);
  } catch (error) {
    ApiResponse.error(res, "Failed to get donations", 400);
  }
};

export const getDonationsAprovedByFeiranteId = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const donations = await prisma.donation.findMany({
      where: { feiranteId: Number(id), status: "COMPLETED" },
      include: {
        items: true,
        requests: true,
      },
    });
    if (!donations) return ApiResponse.error(res, "No donations found", 404);

    ApiResponse.success(res, donations);
  }
  catch (error) {
    ApiResponse.error(res, "Failed to get donations", 400);
  }
}

export const saveImageDonation = async (req: Request, res: Response) => {
  const { donationId, url, aiAnalysis, manualOverride } = req.body;

  try {
    const img = await prisma.image.create({
      data: {
        donationId,
        url,
        aiAnalysis,
        manualOverride,
      },
    });

    ApiResponse.success(res, img);
  } catch (error) {
    ApiResponse.error(res, "Failed to save image", 400);
  }
};

export const getActiveDonations = async (req: Request, res: Response) => {
  try {
    const donations = await prisma.donation.findMany({
      where: { status: "AVAILABLE" },
      include: { items: true, feirante: true },
    });
    ApiResponse.success(res, donations);
  } catch (error) {
    ApiResponse.error(res, "Failed to fetch active donations", 400);
  }
};

export const getRequestsForDonation = async (req: Request, res: Response) => {
  const { donationId } = req.params;

  try {
    const requests = await prisma.request.findMany({
      where: { donationId: Number(donationId) },
      include: { ong: true },
    });
    ApiResponse.success(res, requests);
  } catch (error) {
    ApiResponse.error(res, "Failed to fetch requests", 400);
  }
};

export const approveDonation = async (req: Request, res: Response) => {
  const { requestId } = req.body;

  try {
    const request = await prisma.request.update({
      where: { id: requestId },
      data: { status: "ACCEPTED" },
    });

    await prisma.donation.update({
      where: { id: request.donationId ?? undefined },
      data: { status: "COMPLETED" },
    });

    ApiResponse.success(res, request);
  } catch (error) {
    ApiResponse.error(res, "Failed to approve donation", 400);
  }
};
