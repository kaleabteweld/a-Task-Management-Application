import Joi from "joi";
import { IUserSignUpFrom, IUserLogInFrom, IUserUpdateFrom } from "./user.type";


export const userSignUpSchema = Joi.object<IUserSignUpFrom>({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    userName: Joi.string().required(),
});

export const userLogInSchema = Joi.object<IUserLogInFrom>({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
});

export const userUpdateSchema = Joi.object<IUserUpdateFrom>({
    userName: Joi.string().optional(),
    password: Joi.string().min(8).optional(),
    email: Joi.string().email().optional(),
});



