// Store.js
import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "../utils/fetchBaseQuery";
import videoSlice from "./slice/VideoSlice";
import categorySlice from "./slice/categorySlice";

const Store = configureStore({
    reducer: {
        [baseApi.reducerPath]: baseApi.reducer,
        [videoSlice.reducerPath]: videoSlice.reducer,
        [categorySlice.reducerPath]: categorySlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(baseApi.middleware)
});

export default Store;
