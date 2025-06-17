import { configureStore } from "@reduxjs/toolkit";
import UserSlice from "./Slice/UserSlice";
import GroupSlice from "./Slice/GroupSlice";
import AdminSlice from "./Slice/AdminSlice";
import EventSlice from "./Slice/EventSlice";
import ParticipantsSlice from "./Slice/EventParticipantsSlice";
import ToggleMenuStateSlice from "./Slice/MenuToggleStateSlice";
import AdminDetailsSlice from "./Slice/AdminLoginDetailsSlice";
export const store = configureStore({
  reducer: {
    [UserSlice.name]: UserSlice.reducer,
    [GroupSlice.name]: GroupSlice.reducer,
    [AdminSlice.name]: AdminSlice.reducer,
    [AdminSlice.name]: AdminSlice.reducer,
    [EventSlice.name]: EventSlice.reducer,
    [ToggleMenuStateSlice.name]: ToggleMenuStateSlice.reducer,
    [ParticipantsSlice.name]: ParticipantsSlice.reducer,
    [AdminDetailsSlice.name]: AdminDetailsSlice.reducer,
  },
});
