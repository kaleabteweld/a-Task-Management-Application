import { ITask } from "./task.type";

export interface IUser {
    email: string;
    password: string;
    userName: string;
    tasks: ITask[];
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