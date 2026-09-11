"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { createEventAPI } from "@/services/api/event/eventAPI";
import { addMyEvent } from "@/redux/slices/eventSlice";

const CATEGORIES = ["Music", "Tech", "Workshop", "Sports", "Other"];

export default function CreateEventPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState(
    { title: "", description: "", category: "Other", date: "", location: "", ticketPrice: "", totalTickets: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const selectedDate = new Date(formData.date);
    if (selectedDate <= new Date()) {
      toast.error("Event date must be in the future");
      return;
    }
    if (Number(formData.totalTickets) < 1) {
      toast.error("Total tickets must be at least 1");
      return;
    }
    if (Number(formData.ticketPrice) < 0) {
      toast.error("Ticket price cannot be negative");
      return;
    }

    setLoading(true);
    try {
      const result = await createEventAPI({ ...formData, ticketPrice: Number(formData.ticketPrice), totalTickets: Number(formData.totalTickets) });
      dispatch(addMyEvent(result.data.data));
      toast.success("Event created successfully!");
      router.push("/organizer/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">Create Event</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} required rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select name="category" value={formData.category} onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
            {CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
          <input type="datetime-local" name="date" value={formData.date} onChange={handleChange} required
            min={new Date().toISOString().slice(0, 16)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
          <input type="text" name="location" value={formData.location} onChange={handleChange} required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <div className="mb-4 grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ticket Price (₹)</label>
            <input type="number" name="ticketPrice" value={formData.ticketPrice} onChange={handleChange} required min={0}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Total Tickets</label>
            <input type="number" name="totalTickets" value={formData.totalTickets} onChange={handleChange} required min={1}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
        </div>
        <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50">
          {loading ? "Creating..." : "Create Event"}
        </button>
      </form>
    </div>
  );
}