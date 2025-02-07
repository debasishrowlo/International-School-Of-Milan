// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const casApi = createApi({
    reducerPath: 'casApi',
    baseQuery: fetchBaseQuery({ 
        baseUrl: 'https://backend-school-web.onrender.com/api/',
        credentials: 'include',
     }),
     tagTypes: ['CAS'],
     endpoints:  (builder) => ({
        fetchCas: builder.query({
            query: ({search='', category='', location=''}) =>  `/cas?search=${search}&category=${category}&location=${location}`,
            providesTags: ['CAS']

        }),
        fetchCasById: builder.query({
            query: (id) => `/cas/${id}`,
        }),
        createCas: builder.mutation({
            query: (newCas) => ({
                url: `/cas/create`,
                method: "POST",
                body: newCas,
                credentials: "include",
            }),
            invalidatesTags: ['CAS'],

        }),
        updateCas: builder.mutation({
            query: ({id, ...rest}) => ({
                url: `/cas/update/${id}`,
                method: "PATCH",
                body: rest,
                credentials: "include",
            }),
            invalidatesTags: (result, error, {id}) => [{ type: 'CAS', id }],
        }),

        deleteCas: builder.mutation({
            query: (id) => ({
                url: `/cas/${id}`,
                method: "DELETE",
                credentials: "include",
            }),
            invalidatesTags: (result, error, {id}) => [{ type: 'CAS', id }],
        }),

     })


})

  export const  {useFetchCasQuery, useFetchCasByIdQuery, useCreateCasMutation, useUpdateCasMutation, useDeleteCasMutation } = casApi;

  export default casApi;


