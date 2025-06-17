import { baseApi } from "../../utils/FetchBaseQuery";


const MyOrdersService = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        viewOrders: builder.query({
            query: (id) => (`/Order_details/${id}`),
            providesTags: ['Products'],
        }),
        myOrder: builder.query({
            query: (id) => (`/my_orders/${id}`),
            providesTags: ['Products'],
        }),
    }),
});

export const { useViewOrdersQuery , useMyOrderQuery } = MyOrdersService
export default MyOrdersService