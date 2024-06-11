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
            transformResponse: (response: any) => response.data
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
            transformResponse: (response: any) => response.data
        }),
        searchTasks: builder.query<ITask[], Partial<INewTask>>({
            query: (searchParams) => ({
                url: 'private/task/search',
                method: 'POST',
                body: searchParams,
                headers: {
                    authorization: `Bearer ${(getAccessToken())}`
                }
            }),
            transformResponse: (response: any) => response.data
        }),
        categories: builder.query<ICategories[], { skip: number; limit: number }>({
            query: ({ skip, limit }) => ({
                url: `private/task/category/list/${skip}/${limit}`,
                method: 'GET',
            }),
            transformResponse: (response: any) => response.data
        })
    }),
})

export const { useCreateTaskMutation, useUpdateTaskMutation, useSearchTasksQuery, useCategoriesQuery } = tasksApiSlice