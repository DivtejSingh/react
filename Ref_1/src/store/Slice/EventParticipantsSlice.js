import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  participants: null,
};

const ParticipantsSlice = createSlice({
  name: "participants",
  initialState,
  reducers: {
    setParticipants: (state, action) => {
      state.participants = action.payload;
    },
  },
});

export const { setParticipants } = ParticipantsSlice.actions;
export default ParticipantsSlice;
