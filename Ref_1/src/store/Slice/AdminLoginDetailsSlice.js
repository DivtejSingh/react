import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    data: null
}

const AdminDetailsSlice = createSlice({
    name: 'admindetails',
    initialState,
    reducers: {
         setAdminDetails: (state, action) => {
             state.data = action.payload;
         },
    }
})

export const { setAdminDetails } = AdminDetailsSlice.actions
export default AdminDetailsSlice