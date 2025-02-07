// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'


export const casResponseApi = createApi({
    reducerPath: 'casresponseApi',
    baseQuery: fetchBaseQuery({ 
        baseUrl: 'https://backend-school-web.onrender.com/api/',
        credentials: 'include',
     }),
     tagTypes: ['CASResponse'],
     endpoints: (builder) => ({
        createCASResponse: builder.mutation({
            query: (newResponse) => ({
                url: `/response/create`,
                method: "POST",
                body: newResponse,
                credentials: "include",
            }),
            invalidatesTags: (result, error, {casId}) => [{type: 'Response', id: casId}],

        }),

        deleteCASResponse: builder.mutation({
            query: (id) => ({
                url: `/response/${id}`,
                method: "DELETE",
                credentials: "include",
            }),
            invalidatesTags: (result, error, {id}) => [{ type: 'CASResponse', id }],
        }),
        getAllOneCasResponse: builder.mutation({
                query: (CasId) => `/response/fromCas/${CasId}`,
        }),

     })


})

  export const  {useCreateCASResponseMutation, useDeleteCASResponseMutation } = casResponseApi;


