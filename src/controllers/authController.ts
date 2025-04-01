import { Request, Response } from "express";
import { prisma } from "../app";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ApiResponse } from "../utils/apiResponse";

const JWT_SECRET = process.env.JWT_SECRET!;

export const register = async (req: Request, res: Response) => {
  const { name, email, password, role, cpf, cnpj, address } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return ApiResponse.error(res, "User already exists", 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash: hashedPassword,
        role,
        cpf,
        cnpj,
        address,
      },
    });

    const token = jwt.sign({ userId: user.id }, "JWT_SECRET", {
      expiresIn: "1h",
    });
    ApiResponse.success(res, { user, token }, 201);
  } catch (error) {
    console.log(error);
    ApiResponse.error(res, "Registration failed", 400);
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return ApiResponse.error(res, "Invalid credentials", 401);

    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword)
      return ApiResponse.error(res, "Invalid credentials", 401);

    const token = jwt.sign({ userId: user.id }, "JWT_SECRET", {
      expiresIn: "1h",
    });
    ApiResponse.success(res, { token, user });
  } catch (error) {
    console.log(error);
    ApiResponse.error(res, "Login failed", 400);
  }
};
