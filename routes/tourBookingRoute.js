import express from "express";
import { createTourBooking, getMyTourBookings, getBookingsByTour, cancelTourBooking } from "../controllers/tourBookingController.js";
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route("/").get(protect, getMyTourBookings)
                .post(createTourBooking);
router.get("/tour/:tourId", protect, getBookingsByTour);
router.put("/:id/cancel", cancelTourBooking);

export default router;
