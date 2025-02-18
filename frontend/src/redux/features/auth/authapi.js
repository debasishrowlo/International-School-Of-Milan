import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import Cookies from 'js-cookie'  // Import js-cookie if not already imported

export const postApi = createApi({
  reducerPath: 'postsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BACKEND_URL,
    credentials: 'include',
    prepareHeaders: (headers) => {
      // Get the token from cookie
      const token = Cookies.get('token')

      // If token exists, add it to headers
      if (token) {
        headers.set('Authorization', `Bearer ${token}`)
      }

      headers.set('Content-Type', 'application/json')
      return headers
    },
  }),
  tagTypes: ['Posts'],
  endpoints: (builder) => ({
    fetchPosts: builder.query({
      query: ({ search = '', category = '', location = '' }) => ({
        url: `/posts?search=${search}&category=${category}&location=${location}`,
        credentials: 'include'
      }),
      providesTags: ['Posts']
    }),
    fetchPostById: builder.query({
      query: (id) => ({
        url: `/posts/${id}`,
        credentials: 'include'
      }),
    }),
    fetchRelatedPosts: builder.query({
      query: (id) => ({
        url: `/posts/related/${id}`,
        credentials: 'include'
      })
    }),
    createPost: builder.mutation({
      query: (newPost) => ({
        url: `/posts`,
        method: "POST",
        body: newPost,  // No need to JSON.stringify
        credentials: "include",
      }),
      invalidatesTags: ['Posts'],
    }),
    updatePost: builder.mutation({
      query: ({ id, ...rest }) => ({
        url: `/posts/update-post/${id}`,
        method: "PATCH",
        body: rest,
        credentials: "include",
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Posts', id }],
    }),
    deletePost: builder.mutation({
      query: (id) => ({
        url: `/posts/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Posts', id }],
    }),
  })
})

export const {
  useFetchPostsQuery,
  useFetchPostByIdQuery,
  useFetchRelatedPostsQuery,
  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation
} = postApi
