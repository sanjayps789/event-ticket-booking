import { createSlice } from "@reduxjs/toolkit";

const bookingSlice = createSlice({
  name: "booking",
  initialState: { myBookings: [] },
  reducers: {
    setMyBookings: (state, action) => {
      state.myBookings = action.payload;
    },
    addBooking: (state, action) => {
      state.myBookings.unshift(action.payload);
    },
  },
});

export const { setMyBookings, addBooking } = bookingSlice.actions;
export default bookingSlice.reducer;