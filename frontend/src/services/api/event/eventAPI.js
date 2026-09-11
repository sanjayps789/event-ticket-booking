import { commonAPI } from "@/services/commonAPI.js";

export const createEventAPI = async (eventData) => {
  return await commonAPI("POST", "/events", eventData, "");
};

export const getEventsAPI = async (queryParams = "") => {
  return await commonAPI("GET", `/events${queryParams}`, "", "");
};

export const getEventByIdAPI = async (id) => {
  return await commonAPI("GET", `/events/${id}`, "", "");
};

export const getMyEventsAPI = async () => {
  return await commonAPI("GET", "/events/organizer/my-events", "", "");
};

export const getAttendeesAPI = async (id) => {
  return await commonAPI("GET", `/events/${id}/attendees`, "", "");
};