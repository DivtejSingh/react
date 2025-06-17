import { baseApi } from "../../utils/fetchBaseQuery";


const AboutService = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        aboutData: builder.query({
            query: () => "/Aboutus",
            keepUnusedDataFor: 3600, // Keep unused data for 1 hour
            refetchOnMountOrArgChange: true, // Refetch on mount or argument change
        }),
    }),
    overrideExisting: false, // This should be outside the endpoints definition
});

export const { useAboutDataQuery } = AboutService
export default AboutService