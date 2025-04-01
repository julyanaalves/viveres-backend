import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from './apiResponse';

export const validateRegister = (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password || !role) {
    return ApiResponse.error(res, 'Missing required fields', 400);
  }
  next();
};