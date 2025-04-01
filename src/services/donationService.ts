import { prisma } from '../app';
import { Donation, DonationItem } from '@prisma/client';

export const createDonation = async (feiranteId: number, items: { foodType: string; quantity: number }[]) => {
  const donation = await prisma.donation.create({
    data: {
      feiranteId,
      items: {
        create: items.map(item => ({
          foodType: item.foodType,
          quantity: item.quantity,
        })),
      },
    },
    include: {
      items: true,
    },
  });
  return donation;
};

export const getDonations = async () => {
  const donations = await prisma.donation.findMany({
    include: {
      items: true,
    },
  });
  return donations;
};