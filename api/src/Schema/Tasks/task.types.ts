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

export interface ITask extends Document {
    title: string;
    description: string;
    deadline: Date;
    priority: string;
    status: string;
    user: mongoose.Schema.Types.ObjectId;
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
}

export interface ITaskUpdateFrom extends Partial<INewTask> { }