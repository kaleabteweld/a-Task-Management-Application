import TaskModel from "../../Schema/Tasks/task.schema";
import { INewTask, ITask, ITaskUpdateFrom } from "../../Schema/Tasks/task.types";
import { newTaskSchema, taskUpdateSchema } from "../../Schema/Tasks/task.validation";
import UserModel from "../../Schema/User/user.schema";
import { IUser } from "../../Schema/User/user.type";
import { IResponseType } from "../../Types";
import TaskSearchBuilder from '../../Schema/Tasks/task.util';



export default class TaskController {

    static async create(_task: INewTask, user: IUser): Promise<IResponseType<ITask>> {

        await UserModel.getById(user._id as any);
        await TaskModel.validator(_task, newTaskSchema)
        const Task = await new TaskModel({ ..._task, user: user._id });
        await Task.save();

        return { body: Task.toJSON() as any }
    }

    static async update(_task: ITaskUpdateFrom, taskId: string, user: IUser): Promise<IResponseType<ITask | null>> {

        await UserModel.getById(user._id as any);
        await TaskModel.validator(_task, taskUpdateSchema)
        const updateTask = await TaskModel.update(taskId, _task)
        return { body: (updateTask as any).toJSON() }
    }

    static async getById(taskId: string): Promise<IResponseType<ITask | null>> {
        return { body: ((await TaskModel.getById(taskId ?? ""))?.toJSON() as any) };
    }

    static async removeById(taskId: string, user: IUser): Promise<IResponseType<{} | null>> {
        await UserModel.getById(user._id as any);
        const event = await TaskModel.getById(taskId);
        await TaskModel.removeByID(event?.id)

        return { body: {} };

    }

    static async search(json: any, page: number, user: IUser): Promise<IResponseType<ITask[] | null>> {
        const query = TaskSearchBuilder.fromJSON(json).byUser(user._id as any);
        return { body: ((await query?.exec(page))) as any };
    }

}
