import { baseApi } from "../../utils/fetchBaseQuery";


const VerticleService = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        verticleReels: builder.query({
            query: (id) => `/Vrt_product_by_cat/${id}`,
        }),
        testSide: builder.query({
            query: () => `/All_vertical`,
        }),
    })
})

export const { useVerticleReelsQuery , useTestSideQuery } = VerticleService
export default VerticleService