import { prisma } from '../app';
import { User } from '@prisma/client';

export const getUserProfile = async (userId: number) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new Error('User not found');
  }
  return user;
};

export const updateUserProfile = async (userId: number, name: string, email: string, phone: string, address: string) => {
  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      name,
      email,
      phone,
      address,
    },
  });
  return user;
};