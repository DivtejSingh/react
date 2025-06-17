import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    state: false,
};

const ToggleMenuStateSlice = createSlice({
  name: "menuToggle",
  initialState,
  reducers: {
    setMenuToggle: (state, action) => {
        state.state = action.payload;
    },
  },
});

export const { setMenuToggle } = ToggleMenuStateSlice.actions;
export default ToggleMenuStateSlice;
