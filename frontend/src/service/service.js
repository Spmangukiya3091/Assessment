import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const managementApi = createApi({
  reducerPath: "managementApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `http://localhost:5000/`,
    prepareHeaders: (headers, { getState }) => {
      const cookies = document.cookie.split(";");
      let jwtCookie = null;
      cookies.map((cookie) => {
        if (cookie.includes("authToken=")) {
          jwtCookie = cookie;
        }
        return null;
      });

      if (jwtCookie) {
        headers.set("authorization", jwtCookie);
      }

      return headers;
    },
  }),
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (body) => ({
        url: "/login",
        method: "POST",
        body: body,
      }),
    }),
    SignUp: builder.mutation({
      query: (body) => ({
        url: "/signup",
        method: "POST",
        body: body,
      }),
    }),
    getUserById: builder.query({
      query: (id) => ({
        url: `/user/${id}`,
        method: "GET",
      }),
    }),

    // Employee Api

    getEmployees: builder.query({
      query: (filter) => ({
        url: `employees?page=${filter.page}&limit=${filter.limit}&sort=${filter.sort}`,
        method: "GET",
      }),
    }),
    getSingleEmployees: builder.query({
      query: (id) => ({
        url: `employee/${id}`,
        method: "GET",
      }),
    }),

    addEmployee: builder.mutation({
      query: (body) => ({
        url: `/employee`,
        method: "POST",
        body: body,
      }),
    }),

    updateEmployee: builder.mutation({
      query: (body) => ({
        url: `/employee/${body.id}`,
        method: "PUT",
        body: body,
      }),
    }),

    deleteEmployee: builder.mutation({
      query: (id) => ({
        url: `/employee/${id}`,
        method: "DELETE",
      }),
    }),

    // Department Apis
    getDepartments: builder.query({
      query: () => ({
        url: `/department`,
        method: "GET",
      }),
    }),

    getSingleDepartment: builder.query({
      query: (id) => ({
        url: `/department/${id}`,
        method: "GET",
      }),
    }),

    addDepartment: builder.mutation({
      query: (body) => ({
        url: `/department`,
        method: "POST",
        body: body,
      }),
    }),

    updateDepartment: builder.mutation({
      query: (body) => ({
        url: `/department/${body.id}`,
        method: "PUT",
        body: body,
      }),
    }),

    deleteDepartment: builder.mutation({
      query: (id) => ({
        url: `/department/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useDeleteDepartmentMutation,
  useDeleteEmployeeMutation,
  useGetDepartmentsQuery,
  useGetEmployeesQuery,
  useGetSingleDepartmentQuery,
  useGetSingleEmployeesQuery,
  useGetUserByIdQuery,
  useSignUpMutation,
  useLoginMutation,
  useAddEmployeeMutation,
  useAddDepartmentMutation,
  useUpdateDepartmentMutation,
  useUpdateEmployeeMutation,
} = managementApi;
