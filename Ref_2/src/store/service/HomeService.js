import { baseApi } from "../../utils/FetchBaseQuery";


const HomeService = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        products: builder.query({
            query: (id) => (`/assigned_product/${id}`),
        }),
        slider: builder.query({
            query: () => (`/slider`),
        }),
        order: builder.mutation({
            query: (payload) => ({
                url: `order/${payload.id}`,
                method: 'POST',
                body: payload.productsDetails
            }),
            invalidatesTags: ['Products'],
        }),
    }),
});

export const { useProductsQuery, useOrderMutation , useSliderQuery } = HomeService
export default HomeService