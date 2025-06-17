import { baseApi } from "../../utils/FetchBaseQuery";


const AuthService = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        loginApi: builder.mutation({
            query: (data) => ({
                url: '/auth',  // Replace with your actual endpoint URL
                method: 'POST',
                body: data,
            }),
        }),
    }),
});

export const { useLoginApiMutation } = AuthService
export default AuthService