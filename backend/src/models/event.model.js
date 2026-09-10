import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, trim: true },
        description: { type: String, required: true },
        category: {
            type: String,
            enum: ["Music", "Tech", "Workshop", "Sports", "Other"],
            default: "Other",
        },
        date: { type: Date, required: true },
        location: { type: String, required: true },
        ticketPrice: { type: Number, required: true, min: 0 },
        totalTickets: { type: Number, required: true, min: 1 },
        availableTickets: { type: Number, required: true },
        organizer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true }
);

eventSchema.index({ title: "text", description: "text" });

const Event = mongoose.model("Event", eventSchema);

export default Event;