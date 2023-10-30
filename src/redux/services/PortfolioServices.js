import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ENDPOINT, TOKEN } from "../../constants";
import Cookies from "js-cookie";

export const portfolioService = createApi({
    reducerPath: "portfolio",
    baseQuery: fetchBaseQuery({
        baseUrl: `${ENDPOINT}api/v1/`,
        prepareHeaders: (headers) => {
            headers.set("Authorization", `Bearer ${Cookies.get(TOKEN)}`);
            return headers;
        },
    }),
    endpoints: (builder) => ({
        getPortfolios: builder.query({
            query: (page) => `portfolios?page=${page}`,
            transformResponse: (res) => res,
        }),
        getPortfolio: builder.mutation({
            query: (id) => ({
                url: `portfolios/${id}`,
                method: "GET",
            }),
        }),
        addPortfolio: builder.mutation({
            query: (body) => ({
                url: "portfolios",
                method: "POST",
                body,
            }),
        }),
        updatePortfolio: builder.mutation({
            query: ({ id, body }) => ({
                url: `portfolios/${id}`,
                method: "PUT",
                body,
            }),
        }),
        deletePortfolio: builder.mutation({
            query: (id) => ({
                url: `portfolios/${id}`,
                method: "DELETE",
            }),
        }),
    }),
});


export const {
    useGetPortfoliosQuery,
    useGetPortfolioMutation,
    useAddPortfolioMutation,
    useUpdatePortfolioMutation,
    useDeletePortfolioMutation,
} = portfolioService;

export default portfolioService.reducer;
