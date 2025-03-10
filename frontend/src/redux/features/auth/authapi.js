import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { logout } from "@/redux/features/auth/authSlice"

const baseQuery = fetchBaseQuery({
  baseUrl: `/api/auth`,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    headers.set("Content-Type", "application/json")
    return headers
  }
})

const baseQueryWith401Handler = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions)
  if (result.error && result.error.status === 401) {
    api.dispatch(logout())
  }
  return result
}

const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQueryWith401Handler,
  endpoints: (builder) => ({
    registerUser: builder.mutation({
      query: (newUser) => ({
        url: "/register",
        method: "POST",
        body: newUser,
      })
    }),
    loginUser: builder.mutation({
      query: (credentials) => ({
        url: "/login",
        method: "POST",
        body: JSON.stringify(credentials),

        headers: {
          "Content-Type": "application/json",
        }
      })
    }),
    logoutUser: builder.mutation({
      query: () => ({
        url: "/logout",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        }
      })
    }),
    getUserProfile: builder.query({
      query: () => ({
        url: "/users",
        method: "GET",
      }),
      refetchOnMount: true,
      providesTags: ["User"], // Fix the usage of invalidation/providesTags
    }),
    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `/users/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
    updateUserRole: builder.mutation({
      query: ({ userId, role }) => ({
        url: `/users/${userId}`,
        method: "PUT",
        body: { role },
      }),
      invalidatesTags: ["User"],
    }),
  })
})

export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useLogoutUserMutation,
  useGetUserProfileQuery,
  useDeleteUserMutation,
  useUpdateUserRoleMutation
} = authApi

export default authApi
