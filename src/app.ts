import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import donationRoutes from './routes/donationRoutes';
import userRoutes from './routes/userRoutes';
import ongRoutes from './routes/ongRoutes';
import dotenv from 'dotenv';
import { errorMiddleware } from './middleware/errorMiddleware';
import { PrismaClient } from '@prisma/client';

dotenv.config();

export const prisma = new PrismaClient();

const app = express();

app.use(cors());
app.use(express.json());

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/users', userRoutes);
app.use('/api/ongs', ongRoutes);

// Middleware de erro
app.use(errorMiddleware);

export default app;