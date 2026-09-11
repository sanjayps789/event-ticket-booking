"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Calendar, MapPin } from "lucide-react";
import { getMyBookingsAPI } from "@/services/api/booking/bookingAPI";
import { setMyBookings } from "@/redux/slices/bookingSlice";

export default function MyBookingsPage() {
  const dispatch = useDispatch();
  const { myBookings } = useSelector((state) => state.booking);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const result = await getMyBookingsAPI();
        dispatch(setMyBookings(result.data.data));
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load bookings");
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [dispatch]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">My Bookings</h1>

      {loading && (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-600 border-t-transparent" />
        </div>
      )}

      {error && <p className="text-red-600 text-center py-4">{error}</p>}

      {!loading && myBookings.length === 0 && (
        <p className="text-gray-500 text-center py-10">No bookings yet.</p>
      )}

      <div className="space-y-4">
        {myBookings.map((booking) => (
          <div
            key={booking._id}
            className="bg-white rounded-xl shadow-md p-5 flex justify-between items-center"
          >
            <div>
              <h3 className="font-semibold">{booking.event?.title}</h3>
              <p className="text-sm text-black flex items-center gap-3 mt-1">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4 text-indigo-400" />
                  {booking.event?.date && new Date(booking.event.date).toLocaleDateString("en-GB", )}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-rose-500" />
                  {booking.event?.location}
                </span>
              </p>
              <p className="text-sm text-gray-800 mt-1 ">
                Tickets: {booking.ticketsBooked} · Status:{" "}
                <span
                  className={`
                    ${booking.bookingStatus === "CONFIRMED"
                      ? "bg-green-600 text-white font-medium"
                      : "bg-red-600 text-white font-medium"}
                      ms-2 rounded-full px-2 py-1 text-xs`
                      
                  }
                >
                  {booking.bookingStatus}
                </span>
              </p>
            </div>
            <div className="text-lg font-semibold">₹{booking.totalAmount}</div>
          </div>
        ))}
      </div>
    </div>
  );
}