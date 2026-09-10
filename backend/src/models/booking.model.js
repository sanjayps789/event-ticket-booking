import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    ticketsBooked: {
      type: Number,
      required: true,
      min: 1,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    bookingStatus: {
      type: String,
      enum: ["CONFIRMED", "CANCELLED"],
      default: "CONFIRMED",
    },
  },
  { timestamps: true }
);


const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;