"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAttendeesAPI } from "@/services/api/event/eventAPI";
import { setAttendees, clearAttendees } from "@/redux/slices/eventSlice";
import { X } from "lucide-react";

export default function AttendeesModal({ eventId, onClose }) {
    const dispatch = useDispatch();
    const { attendees } = useSelector((state) => state.event);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchAttendees = async () => {
            try {
                const result = await getAttendeesAPI(eventId);
                dispatch(setAttendees(result.data.data));
            } catch (err) {
                setError(err.response?.data?.message || "Failed to load attendees");
            } finally {
                setLoading(false);
            }
        };
        fetchAttendees();
        return () => dispatch(clearAttendees());
    }, [eventId, dispatch]);

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl h-100 flex flex-col relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-xl z-10"
                >
                    <X />
                </button>

                <div className="px-6 pt-6 pb-4 border-b border-gray-100 shrink-0">
                    <h2 className="text-lg font-semibold">Attendees</h2>
                </div>

                {loading && (
                    <div className="flex-1 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-4 border-indigo-600 border-t-transparent" />
                    </div>
                )}

                {error && (
                    <div className="flex-1 flex items-center justify-center">
                        <p className="text-red-600 text-sm">{error}</p>
                    </div>
                )}

                {!loading && !error && attendees.length === 0 && (
                    <div className="flex-1 flex items-center justify-center">
                        <p className="text-gray-500 text-sm">No bookings yet for this event.</p>
                    </div>
                )}

                {!loading && !error && attendees.length > 0 && (
                    <div className="flex-1 overflow-y-auto">
                        <table className="w-full text-sm">
                            <thead className="sticky top-0 bg-white border-b border-gray-200">
                                <tr className="text-left text-black">
                                    <th className="px-6 py-3 font-semibold">Name</th>
                                    <th className="px-6 py-3 font-semibold">Email</th>
                                    <th className="px-6 py-3 font-semibold text-right">Tickets</th>
                                </tr>
                            </thead>
                            <tbody>
                                {attendees.map((booking) => (
                                    <tr
                                        key={booking._id}
                                        className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200"
                                    >
                                        <td className="px-6 py-4 font-medium text-gray-900">
                                            {booking.customer?.name}
                                        </td>

                                        <td className="px-6 py-4 text-gray-600">
                                            {booking.customer?.email}
                                        </td>

                                        <td className="px-6 py-4 text-right font-semibold text-indigo-600">
                                            {booking.ticketsBooked}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}