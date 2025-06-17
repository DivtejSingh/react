import { configureStore } from '@reduxjs/toolkit';
import { baseApi } from '../utils/FetchBaseQuery';
import CartSlice from './slice/CartSlice';

const store = configureStore({
    reducer: {
        [baseApi.reducerPath]: baseApi.reducer,
        [CartSlice.reducerPath]: CartSlice.reducer,
        // Add other reducers here
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(baseApi.middleware),
});

export default store;
