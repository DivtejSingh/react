import { baseApi } from "../../utils/fetchBaseQuery";


const ContactService = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        contactDetails: builder.mutation({
            query: (contactData) => ({
                url: '/contact',  // Replace with your actual endpoint URL
                method: 'POST',
                body: contactData,
                // headers: {
                //     'Content-Type': 'application/json',
                //   },
            }),
        }),
    }),
});

export const { useContactDetailsMutation } = ContactService
export default ContactService