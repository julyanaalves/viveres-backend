import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../app';
import { User } from '@prisma/client';

const JWT_SECRET = process.env.JWT_SECRET!;

export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    throw new Error('Invalid email or password');
  }

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
  return token;
};

export const registerUser = async (name: string, email: string, password: string, role: string, cpf?: string, cnpj?: string, address?: string) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash: hashedPassword,
      role: role as 'FEIRANTE' | 'ONG' | 'ADMIN',
      cpf,
      cnpj,
      address,
    },
  });
  return user;
};