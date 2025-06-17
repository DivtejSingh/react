import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    category: null
}

const categorySlice = createSlice({
    name: "category",
    initialState,
    reducers: {
        setCategoryData: (state, action) => {
            state.category = action.payload;
        },
    }
});

export const { setCategoryData } = categorySlice.actions;

export default categorySlice;
