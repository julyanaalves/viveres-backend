import express from 'express';
import { getOngProfile, updateOngProfile, getDonationHistory, requestDonation } from '../controllers/ongController';
import { authenticate } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/profile', authenticate, getOngProfile);
router.put('/profile', authenticate, updateOngProfile);
router.get('/donation-history', authenticate, getDonationHistory);
router.post('/request-donation', authenticate, requestDonation);

export default router;