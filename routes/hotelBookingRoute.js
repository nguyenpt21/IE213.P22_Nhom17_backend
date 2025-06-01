import express from "express";
import {
    createBooking,
    updateBookingStatus,
    cancelBooking,
    getMyBookings,
    getBookingsByHotel
} from "../controllers/hotelBookingController.js";
import { protect } from '../middleware/authMiddleware.js';
const router = express.Router();

router.get('/', protect, getMyBookings);
router.get('/hotel/:hotelId', protect, getBookingsByHotel);
router.post("/", createBooking);
router.put("/:id/status", updateBookingStatus);
router.put("/:id/cancel", cancelBooking);

export default router;