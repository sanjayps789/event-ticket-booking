"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { Calendar, MapPin, Ticket, IndianRupee } from "lucide-react";
import { getMyEventsAPI } from "@/services/api/event/eventAPI";
import { setMyEvents } from "@/redux/slices/eventSlice";
import AttendeesModal from "@/components/events/AttendeesModal";

export default function OrganizerDashboard() {
  const dispatch = useDispatch();
  const { myEvents } = useSelector((state) => state.event);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [attendeesEventId, setAttendeesEventId] = useState(null);

  useEffect(() => {
    const fetchMyEvents = async () => {
      try {
        const result = await getMyEventsAPI();
        dispatch(setMyEvents(result.data.data));
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load your events");
      } finally {
        setLoading(false);
      }
    };
    fetchMyEvents();
  }, [dispatch]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">My Events</h1>
        <Link
          href="/organizer/create-event"
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
        >
          + Create Event
        </Link>
      </div>

      {loading && (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-600 border-t-transparent" />
        </div>
      )}

      {error && <p className="text-red-600 text-center py-4">{error}</p>}

      {!loading && myEvents.length === 0 && (
        <p className="text-gray-500 text-center py-10">
         {` You haven't created any events yet.`}
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {myEvents.map((event) => (
          <div key={event._id} className="bg-white rounded-xl shadow-md p-5">
            <h3 className="font-semibold text-lg mb-2">{event.title}</h3>
            <div className="text-sm text-gray-500 space-y-1.5 mb-4">
              <p className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-500" />
                {new Date(event.date).toLocaleDateString()}
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-rose-500" />
                {event.location}
              </p>
              <p className="flex items-center gap-2">
                <Ticket className="w-4 h-4 text-orange-500" />
                {event.availableTickets} / {event.totalTickets} remaining
              </p>
              <p className="flex items-center gap-2 font-semibold text-gray-800">
                <IndianRupee className="w-4 h-4 text-emerald-600" />
                Revenue: {event.revenue}
              </p>
            </div>
            <button
              onClick={() => setAttendeesEventId(event._id)}
              className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200"
            >
              View Attendees
            </button>
          </div>
        ))}
      </div>

      {attendeesEventId && (
        <AttendeesModal
          eventId={attendeesEventId}
          onClose={() => setAttendeesEventId(null)}
        />
      )}
    </div>
  );
}