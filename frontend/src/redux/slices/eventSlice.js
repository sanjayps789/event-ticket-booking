import { createSlice } from "@reduxjs/toolkit";

const eventSlice = createSlice({
  name: "event",
  initialState: {
    events: [],
    totalPages: 1,
    currentPage: 1,
    myEvents: [],
    attendees: [],
  },
  reducers: {
    setEvents: (state, action) => {
      state.events = action.payload.data;
      state.totalPages = action.payload.totalPages;
      state.currentPage = action.payload.currentPage;
    },
    setMyEvents: (state, action) => {
      state.myEvents = action.payload;
    },
    addMyEvent: (state, action) => {
      state.myEvents.unshift(action.payload);
    },
    setAttendees: (state, action) => {
      state.attendees = action.payload;
    },
    clearAttendees: (state) => {
      state.attendees = [];
    },
  },
});

export const { setEvents, setMyEvents, addMyEvent, setAttendees, clearAttendees } = eventSlice.actions;
export default eventSlice.reducer;