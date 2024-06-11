import apiSlice, { getAccessToken } from "../apiSlice";
import { ICategories, INewTask, ITask } from "../types/task.type";

const tasksApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createTask: builder.mutation<void, INewTask>({
            query: (task) => ({
                url: 'private/task/create',
                method: 'POST',
                body: task,
                headers: {
                    authorization: `Bearer ${(getAccessToken())}`
                }
            }),
            transformResponse: (response: any) => response.body,
            invalidatesTags: ['tasks']
        }),
        updateTask: builder.mutation<void, { id: string; task: Partial<INewTask> }>({
            query: ({ id, task }) => ({
                url: `private/task/update/${id}`,
                method: 'PATCH',
                body: task,
                headers: {
                    authorization: `Bearer ${(getAccessToken())}`
                }
            }),
            transformResponse: (response: any) => response.body,
            invalidatesTags: ['tasks']

        }),
        searchTasks: builder.query<ITask[], { page: number, searchParams: Partial<INewTask> }>({
            query: ({ searchParams, page }) => ({
                url: `private/task/search/${page}`,
                method: 'POST',
                body: searchParams,
                headers: {
                    authorization: `Bearer ${(getAccessToken())}`
                }
            }),
            transformResponse: (response: any) => response.body,
            providesTags: ['tasks']
        }),
        removeTask: builder.mutation<void, string>({
            query: (id) => ({
                url: `private/task/delete/${id}`,
                method: 'DELETE',
                headers: {
                    authorization: `Bearer ${(getAccessToken())}`
                }
            }),
            invalidatesTags: ['tasks']
        }),
        categories: builder.query<ICategories[], { skip: number; limit: number }>({
            query: ({ skip, limit }) => ({
                url: `public/task/category/list/${skip}/${limit}`,
                method: 'GET',
            }),
            transformResponse: (response: any) => response.body
        })
    }),
})

export const { useCreateTaskMutation, useUpdateTaskMutation, useSearchTasksQuery, useCategoriesQuery, useRemoveTaskMutation, useLazySearchTasksQuery } = tasksApiSlice