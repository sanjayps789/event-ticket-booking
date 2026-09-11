import { commonAPI } from "@/services/commonAPI.js";

export const bookEventAPI = async (id, requestedTickets) => {
  return await commonAPI("POST", `/events/${id}/book`, { requestedTickets }, "");
};

export const getMyBookingsAPI = async () => {
  return await commonAPI("GET", "/bookings/my-bookings", "", "");
};