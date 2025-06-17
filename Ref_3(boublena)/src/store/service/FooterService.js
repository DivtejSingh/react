import { baseApi } from "../../utils/fetchBaseQuery";


const FooterService = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        newsLetter: builder.mutation({
            query: (payload) => ({
                url: "/newsletters",
                method: "POST",
                body: payload,
            }),
        }),
        overrideExisting: false,
    })
});

export const { useNewsLetterMutation } = FooterService
export default FooterService