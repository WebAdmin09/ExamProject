import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ENDPOINT, TOKEN } from "../../constants";
import Cookies from "js-cookie";

export const userService = createApi({
    reducerPath: "user",
    baseQuery: fetchBaseQuery({
        baseUrl: `${ENDPOINT}api/v1/`,
        prepareHeaders: (headers) => {
            headers.set("Authorization", `Bearer ${Cookies.get(TOKEN)}`);
            return headers;
        },
    }),
    endpoints: (builder) => ({
        getUsers: builder.query({
            query: (page) => `users?page=${page}`,
            transformResponse: (res) => res,
        }),
        getUser: builder.mutation({
            query: (id) => ({
                url: `users/${id}`,
                method: "GET",
            }),
        }),
        addUser: builder.mutation({
            query: (body) => ({
                url: "users",
                method: "POST",
                body,
            }),
        }),
        updateUser: builder.mutation({
            query: ({ id, body }) => ({
                url: `users/${id}`,
                method: "PUT",
                body,
            }),
        }),
        deleteUser: builder.mutation({
            query: (id) => ({
                url: `users/${id}`,
                method: "DELETE",
            }),
        }),
    }),
});
export const {
    useGetUsersQuery,
    useGetUserMutation,
    useAddUserMutation,
    useUpdateUserMutation,
    useDeleteUserMutation,
} = userService;

export default userService.reducer;
