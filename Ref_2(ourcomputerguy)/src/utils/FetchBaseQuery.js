import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import baseUrl from "./environment";

const baseQueryInterceptor = async (args, api, options) => {
    try {
        let result = await baseQuery(args, api, options);
        return result;
    } catch (error) {
        console.error('Error in baseQueryInterceptor:', error);
        throw error;
    }
};

export const baseApi = createApi({
    reducerPath: "api",
    baseQuery: baseQueryInterceptor,
    tagTypes: ["Products"],
    endpoints: () => ({}),
});