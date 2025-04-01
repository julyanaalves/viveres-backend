import { Response } from 'express';

export class ApiResponse {
  static success(res: Response, data: any, statusCode: number = 200) {
    res.status(statusCode).json({ success: true, data });
  }

  static error(res: Response, message: string, statusCode: number = 400) {
    res.status(statusCode).json({ success: false, error: message });
  }
}