"use client";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Calendar, MapPin, Tag, IndianRupee, Search } from "lucide-react";
import { getEventsAPI } from "@/services/api/event/eventAPI";
import { setEvents } from "@/redux/slices/eventSlice";
import BookingModal from "@/components/events/BookingModal";

const CATEGORIES = ["All", "Music", "Tech", "Workshop", "Sports", "Other"];

export default function CustomerDashboard() {
  const dispatch = useDispatch();
  const { events, totalPages, currentPage } = useSelector((state) => state.event);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  const fetchEvents = async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (category !== "All") params.append("category", category);
      if (debouncedSearch) params.append("search", debouncedSearch);
      params.append("page", page);
      params.append("limit", 9);
      const result = await getEventsAPI(`?${params.toString()}`);
      dispatch(setEvents(result.data));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [category, page, debouncedSearch]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">Browse Events</h1>
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setPage(1);
          }}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {loading && (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-600 border-t-transparent" />
        </div>
      )}
      {error && <p className="text-red-600 text-center py-4">{error}</p>}
      {!loading && events.length === 0 && (
        <p className="text-gray-500 text-center py-10">No events found.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <div key={event._id} className="bg-white rounded-xl shadow-md p-5 flex flex-col">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-lg">{event.title}</h3>
              <span
                className={`text-xs px-2 py-1 rounded-full font-medium ${
                  event.availableTickets === 0
                    ? "bg-red-100 text-red-700"
                    : event.availableTickets <= 5
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {event.availableTickets === 0 ? "Sold Out" : `${event.availableTickets} left`}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-2 line-clamp-2">{event.description}</p>
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
                <Tag className="w-4 h-4 text-orange-500" />
                {event.category}
              </p>
              <p className="flex items-center gap-2 font-semibold text-gray-800">
                <IndianRupee className="w-4 h-4 text-emarald-600" />
                {event.ticketPrice} / ticket
              </p>
            </div>
            <button
              onClick={() => setSelectedEvent(event)}
              disabled={event.availableTickets === 0}
              className="mt-auto bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {event.availableTickets === 0 ? "Sold Out" : "Book Now"}
            </button>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`px-3 py-1.5 rounded-lg ${
                p === currentPage
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {selectedEvent && (
        <BookingModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onSuccess={fetchEvents}
        />
      )}
    </div>
  );
}