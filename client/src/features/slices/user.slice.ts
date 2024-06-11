import apiSlice from "../apiSlice";
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
            extraOptions: {
                withCredentials: true,
                crossDomain: true,
            }

        }),

        signUp: builder.mutation<IUser, IUserLogInFrom>({
            query: (body) => ({
                url: 'public/auth/user/signUp',
                method: 'POST',
                body
            }),
        }),

        user: builder.query<IUser, void>({
            query: () => ({
                url: `private/user/`,
                method: 'GET',
            }),
        }),

        logout: builder.mutation<void, void>({
            query: () => ({
                url: 'public/auth/user/logout',
                method: 'POST',
            }),
        }),
    })
})

export const { useLoginMutation, useSignUpMutation, useUserQuery, useLogoutMutation } = userApiSlice