import Event from "../models/event.model.js";
import Booking from "../models/booking.model.js";
import asyncHandler from "../utils/asyncHandler.js";

export const createEvent = asyncHandler(async (req, res) => {
  const { title, description, category, date, location, ticketPrice, totalTickets } = req.body;

  const event = await Event.create({
    title,
    description,
    category,
    date,
    location,
    ticketPrice,
    totalTickets,
    availableTickets: totalTickets,   // defaults to totalTickets
    organizer: req.user._id,
  });

  res.status(201).json({
    success: true,
    message: "Event created successfully",
    data: event,
  });
});

export const getEvents = asyncHandler(async (req, res) => {
  const { category, search } = req.query;

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const filter = { date: { $gte: new Date() } };

  if (category) {
    filter.category = category;
  }

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  const totalEvents = await Event.countDocuments(filter);

  const events = await Event.find(filter)
    .populate("organizer", "name email")
    .sort({ date: 1 })
    .skip(skip)
    .limit(limit);

  res.status(200).json({
    success: true,
    count: events.length,
    totalEvents,
    totalPages: Math.ceil(totalEvents / limit),
    currentPage: page,
    data: events,
  });
});

export const getEventById = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id).populate("organizer", "name email");

  if (!event) {
    return res.status(404).json({ success: false, message: "Event not found" });
  }

  res.status(200).json({
    success: true,
    data: event,
  });
});

export const getMyEvents = asyncHandler(async (req, res) => {
  const events = await Event.find({ organizer: req.user._id });

  const eventsWithSummary = events.map((event) => {
    const ticketsSold = event.totalTickets - event.availableTickets;
    const revenue = ticketsSold * event.ticketPrice;

    return {
      ...event.toObject(),
      ticketsSold,
      revenue,
    };
  });

  res.status(200).json({
    success: true,
    count: eventsWithSummary.length,
    data: eventsWithSummary,
  });
});

export const getAttendees = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    return res.status(404).json({ success: false, message: "Event not found" });
  }

  if (event.organizer.toString() !== req.user._id.toString()) {
    return res.status(403).json({ success: false, message: "Not authorized to view this event's attendees" });
  }

  const bookings = await Booking.find({ event: event._id, bookingStatus: "CONFIRMED" })
    .populate("customer", "name email");

  res.status(200).json({
    success: true,
    count: bookings.length,
    data: bookings,
  });
});