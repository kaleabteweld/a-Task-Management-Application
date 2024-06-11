import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const getAccessToken = () => {
    return localStorage.getItem('accessToken');
};

export const setAccessToken = (token: string) => {
    localStorage.setItem('accessToken', token);
};
export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_API_URL, credentials: 'include', mode: 'cors' }),
    endpoints: () => ({
    }),

});

export default apiSlice;