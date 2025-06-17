import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  event: null,
};

const EventSlice = createSlice({
  name: "event",
  initialState,
  reducers: {
    setEvent: (state, action) => {
      state.event = action.payload;
    },
  },
});

export const { setEvent } = EventSlice.actions;
export default EventSlice;
