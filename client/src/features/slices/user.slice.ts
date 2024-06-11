import apiSlice, { getAccessToken } from "../apiSlice";
import { IUser, IUserLogInFrom } from "../types/user.type";

const userApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({

        login: builder.mutation<IUser, IUserLogInFrom>({
            query: ({ email, password }) => ({
                url: 'public/auth/user/logIn',
                method: 'POST',
                body: {
                    email,
                    password
                }
            }),
            invalidatesTags: ['users']
        }),

        signUp: builder.mutation<IUser, IUserLogInFrom>({
            query: (body) => ({
                url: 'public/auth/user/signUp',
                method: 'POST',
                body
            }),
            invalidatesTags: ['users']

        }),

        user: builder.query<IUser, void>({
            query: () => ({
                url: `private/user/`,
                method: 'GET',
                headers: {
                    authorization: `Bearer ${(getAccessToken())}`
                }
            }),
            providesTags: ['users']
        }),

        logout: builder.mutation<void, void>({
            query: () => ({
                url: 'private/auth/user/logOut',
                method: 'DELETE',
                headers: {
                    authorization: `Bearer ${(getAccessToken())}`
                }
            }),
            invalidatesTags: ['users', 'tasks']
        }),
    })
})

export const { useLoginMutation, useSignUpMutation, useUserQuery, useLogoutMutation } = userApiSlice