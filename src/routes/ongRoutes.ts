import express from 'express';
import { getOngProfile, updateOngProfile } from '../controllers/ongController';
import { authenticate } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/profile', authenticate, getOngProfile);
router.put('/profile', authenticate, updateOngProfile);

export default router;