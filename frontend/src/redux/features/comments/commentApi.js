import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const commentApi = createApi({
  reducerPath: 'commentApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_BACKEND_URL}/comments`,
    credentials: "include",
  }),
  tagTypes: ['Comments'],
  endpoints: (builder) => ({
    postComment: builder.mutation({
      query: (commentData) => ({
        url: '/post-comment',
        method: 'POST',
        body: commentData,
      }),
      invalidatesTags: (result, error, { postId }) => [{ type: 'Comments', id: postId }],
    }),
    getComments: builder.query({
      query: () => ({
        url: '/total-comments',
        method: 'GET',

      }),
    }),
    deleteComment: builder.mutation({
      query: (id) => ({
        url: `/delete-comment/${id}`,
        method: 'DELETE',
      })
    })
  }),
})

export const { useGetCommentsQuery, useDeleteCommentMutation, usePostCommentMutation } = commentApi;

export default commentApi;
