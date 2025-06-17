import { baseApi } from "../../utils/fetchBaseQuery";


const HomeService = baseApi.injectEndpoints({
      endpoints: (builder) => ({
        clientApi: builder.query({
            query: () => "/ClientLogo",
        }),
        getData: builder.query({
            query: () => "/product_testing",
        }),
        partnerSection: builder.query({
            query: () => "/pages/home_top_section",
        }),
        // SingleVideoData: builder.query({
        //     query: () => "/product_random",
        // }),
        SingleVideoData: builder.query({
            query: (id) => `/hrz_product_by_cat_testing/${id}`,
        }),
        navigationData: builder.query({
            query: () => "/category",
        }),
        randomColor: builder.query({
            query: () => "/BgOptions",
        }),
    })
})

export const { useGetDataQuery , usePartnerSectionQuery , useSingleVideoDataQuery , useNavigationDataQuery , useRandomColorQuery , useClientApiQuery} = HomeService
export default HomeService