import Joi from "joi";
import mongoose from "mongoose";
import { ITask } from "../Tasks/task.types";


export interface IUser extends mongoose.Document {
    email: string;
    password: string;
    userName: string;
    tasks: mongoose.Schema.Types.ObjectId[] | ITask[];

}

export interface IUserMethods {
    encryptPassword(this: IUser, password?: string): Promise<String>
    checkPassword(this: IUser, password: string): Promise<boolean>
}

export interface IUserDocument extends IUser, IUserMethods, mongoose.Document { }

export interface IUserModel extends mongoose.Model<IUserDocument> {
    validator<T>(userInput: T, schema: Joi.ObjectSchema<T>): Promise<any>
    getByEmail(email: string): Promise<IUserDocument>
    getById(_id: string): Promise<IUserDocument>
    update(_id: string, newUser: IUserUpdateFrom, populatePath?: string | string[]): Promise<IUserDocument | null>
    removeByID(_id: string): Promise<void>
}

export interface IUserLogInFrom {
    email: string;
    password: string;
}

export interface IUserSignUpFrom {
    email: string;
    password: string;
    userName: string;
}

export interface IUserUpdateFrom extends Partial<IUserSignUpFrom> {
}
