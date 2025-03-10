// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const postApi = createApi({
  reducerPath: 'postsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: "/",
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
      const token = localStorage.getItem("token")
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      headers.set("Content-Type", "application/json");
      return headers
    }
  }),
  tagTypes: ['Posts'],
  endpoints: (builder) => ({
    fetchPosts: builder.query({
      query: ({ search = '', category = '', location = '' }) => `/api/posts?search=${search}&category=${category}&location=${location}`,
      providesTags: ['Posts']
    }),
    fetchPostById: builder.query({
      query: (id) => `/api/posts/${id}`,
    }),
    fetchRelatedPosts: builder.query({
      query: (id) => `/api/posts/related/${id}`
    }),
    createPost: builder.mutation({
      query: (newPost) => ({
        url: `/api/posts`,
        method: "POST",
        body: JSON.stringify(newPost),
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }),
      invalidatesTags: ['Posts'],

    }),
    updatePost: builder.mutation({
      query: ({ id, ...rest }) => ({
        url: `/api/posts/update-post/${id}`,
        method: "PATCH",
        body: rest,
        credentials: "include",
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Posts', id }],
    }),

    deletePost: builder.mutation({
      query: (id) => ({
        url: `/api/posts/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Posts', id }],
    }),
  })
})

export const { useFetchPostsQuery, useFetchPostByIdQuery, useFetchRelatedPostsQuery, useCreatePostMutation, useUpdatePostMutation, useDeletePostMutation } = postApi;


