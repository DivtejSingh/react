import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    admin: null
}

const AdminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {
         setAdmin: (state, action) => {
             state.admin = action.payload;
         },
    }
})

export const { setAdmin } = AdminSlice.actions
export default AdminSlice