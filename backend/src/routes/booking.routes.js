import express from "express";
import { getMyBookings } from "../controllers/booking.controller.js";
import { protect, authorize } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/my-bookings", protect, authorize("CUSTOMER"), getMyBookings);

export default router;