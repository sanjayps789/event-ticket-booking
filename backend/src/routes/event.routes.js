import express from "express";
import {
  createEvent,
  getEvents,
  getEventById,
  getMyEvents,
  getAttendees,
} from "../controllers/event.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { createEventSchema } from "../validators/event.validation.js";
import { protect, authorize } from "../middlewares/auth.middleware.js";
import { bookEvent } from "../controllers/booking.controller.js";
import { bookTicketsSchema } from "../validators/booking.validation.js";
const router = express.Router();

// specific routes before /:id to avoid conflicts
router.get("/organizer/my-events", protect, authorize("ORGANIZER"), getMyEvents);

router.get("/", getEvents);
router.post("/", protect, authorize("ORGANIZER"), validate(createEventSchema), createEvent);

router.get("/:id", getEventById);
router.get("/:id/attendees", protect, authorize("ORGANIZER"), getAttendees);
router.post("/:id/book", protect, authorize("CUSTOMER"), validate(bookTicketsSchema), bookEvent);

export default router;