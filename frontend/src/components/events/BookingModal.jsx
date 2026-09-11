"use client";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { bookEventAPI } from "@/services/api/booking/bookingAPI";
import { addBooking } from "@/redux/slices/bookingSlice";

export default function BookingModal({ event, onClose, onSuccess }) {
    const dispatch = useDispatch();
    const [ticketsInput, setTicketsInput] = useState("1");
    const [loading, setLoading] = useState(false);

    const tickets = Number(ticketsInput) || 0;
    const totalCost = tickets * event.ticketPrice;

    const handleTicketsChange = (e) => {
        const val = e.target.value;
        if (val === "" || /^[0-9]+$/.test(val)) {
            setTicketsInput(val);
        }
    };

    const handleTicketsBlur = () => {
        let num = Number(ticketsInput);
        if (isNaN(num) || num < 1) num = 1;
        setTicketsInput(String(num));
    };

    const handleBook = async () => {
        const requested = Number(ticketsInput);

        if (!requested || requested < 1) {
            toast.error("Please enter a valid number of tickets");
            return;
        }

        if (requested > event.availableTickets) {
            toast.error(`Only ${event.availableTickets} tickets available`);
            return;
        }

        setLoading(true);
        try {
            const result = await bookEventAPI(event._id, requested);
            dispatch(addBooking(result.data.data));
            toast.success("Booking confirmed!");
            onSuccess();
            onClose();
        } catch (err) {
            toast.error(err.response?.data?.message || "Booking failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6 relative">
                <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl">×</button>
                <h2 className="text-lg font-semibold mb-1">{event.title}</h2>
                <p className="text-sm text-gray-500 mb-4">{event.availableTickets} tickets available</p>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Number of tickets</label>
                    <input
                        type="number"
                        min={1}
                        value={ticketsInput}
                        onChange={handleTicketsChange}
                        onBlur={handleTicketsBlur}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
                <div className="flex justify-between items-center mb-6 text-sm">
                    <span className="text-gray-600">Total cost</span>
                    <span className="text-lg font-semibold">₹{totalCost}</span>
                </div>
                <button
                    onClick={handleBook}
                    disabled={loading || event.availableTickets === 0}
                    className="w-full bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50"
                >
                    {loading ? "Booking..." : "Confirm Booking"}
                </button>
            </div>
        </div>
    );
}