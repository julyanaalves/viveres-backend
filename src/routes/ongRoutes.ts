import express from 'express';
import { getOngProfile, updateOngProfile, getDonationHistory, requestDonation,getAvailableDonations } from '../controllers/ongController';
import { authenticate } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/profile', authenticate, getOngProfile);
router.put('/profile', authenticate, updateOngProfile);
router.get('/donation-history', authenticate, getDonationHistory);
router.post('/request-donation/:donationId', authenticate, requestDonation);
router.get('/available-donations', authenticate, getAvailableDonations); // Novo endpoint

export default router;