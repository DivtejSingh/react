import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    group: null
}

const GroupSlice = createSlice({
    name: 'group',
    initialState,
    reducers: {
         setGroup: (state, action) => {
             state.group = action.payload;
         },
    }
})

export const { setGroup } = GroupSlice.actions
export default GroupSlice