import Event from "../models/event.model.js";
import Booking from "../models/booking.model.js";
import asyncHandler from "../utils/asyncHandler.js";

export const bookEvent = asyncHandler(async (req, res) => {
  const { requestedTickets } = req.body;
  const eventId = req.params.id;

  const event = await Event.findOneAndUpdate(
    {
      _id: eventId,
      availableTickets: { $gte: requestedTickets },
    },
    {
      $inc: { availableTickets: -requestedTickets },
    },
    { new: true }
  );

  if (!event) {
    const existingEvent = await Event.findById(eventId);
    if (!existingEvent) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }
    return res.status(400).json({ success: false, message: "Sold out — not enough tickets available" });
  }

  const totalAmount = requestedTickets * event.ticketPrice;

  const booking = await Booking.create({
    customer: req.user._id,
    event: event._id,
    ticketsBooked: requestedTickets,
    totalAmount,
    bookingStatus: "CONFIRMED",
  });

  res.status(201).json({
    success: true,
    message: "Booking confirmed",
    data: booking,
  });
});

export const getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ customer: req.user._id })
    .populate("event", "title date location ticketPrice");

  res.status(200).json({
    success: true,
    count: bookings.length,
    data: bookings,
  });
});
