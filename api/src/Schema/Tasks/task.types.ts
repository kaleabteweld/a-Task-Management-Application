import Joi from "joi";
import mongoose from "mongoose";

export enum PriorityEnum {
    low = 'low',
    medium = 'medium',
    high = 'high',
}

export enum StatusEnum {
    pending = 'pending',
    completed = 'completed',
}

export interface ICategories extends Document {
    name: string
    tasks: mongoose.Schema.Types.ObjectId[] | ITask[];
}

export interface ITask extends Document {
    title: string;
    description: string;
    deadline: Date;
    priority: string;
    status: string;
    user: mongoose.Schema.Types.ObjectId;
    categories: mongoose.Schema.Types.ObjectId[] | ICategories[];
}

export interface ITaskMethods {
    encryptPassword(this: ITask, password?: string): Promise<String>
    checkPassword(this: ITask, password: string): Promise<boolean>
}

export interface ITaskDocument extends ITask, ITaskMethods, mongoose.Document { }

export interface ITaskModel extends mongoose.Model<ITaskDocument> {
    validator<T>(userInput: T, schema: Joi.ObjectSchema<T>): Promise<any>
    getById(_id: string): Promise<ITaskDocument>
    update(_id: string, newUser: ITaskUpdateFrom, populatePath?: string | string[]): Promise<ITaskDocument | null>
    removeByID(_id: string): Promise<void>
}

export interface INewTask {
    title: string;
    description: string;
    deadline: Date;
    priority: PriorityEnum;
    status: StatusEnum;
    categories: string[]
}

export interface ITaskUpdateFrom extends Partial<INewTask> { }

export interface ISearchBuilderJson {
    title?: string
    description?: string
    priority?: PriorityEnum
    status?: StatusEnum
    categories?: string[]
    sortBy: 'priority' | 'deadline'
}