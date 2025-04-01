import express from "express";
import {
  createDonation,
  getDonations,
  getDonationById,
  getDonationsByFeiranteId,
  saveImageDonation,
} from "../controllers/donationController";
import { authenticate } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/", authenticate, createDonation);
router.get("/", authenticate, getDonations);
router.get("/:id", authenticate, getDonationById);
router.get("/feirante/:id", authenticate, getDonationsByFeiranteId);
router.post("img", authenticate, saveImageDonation);
export default router;
