import Joi from "joi";
import { INewTask, ITaskUpdateFrom, PriorityEnum, StatusEnum } from "./task.types";

export const newTaskSchema = Joi.object<INewTask>({
    title: Joi.string().required(),
    description: Joi.string().required(),
    deadline: Joi.date().required(),
    priority: Joi.string().valid(...Object.values(PriorityEnum)).required(),
    status: Joi.string().valid(...Object.values(StatusEnum)).required(),
});

export const taskUpdateSchema = Joi.object<ITaskUpdateFrom>({
    title: Joi.string().optional(),
    description: Joi.string().optional(),
    deadline: Joi.date().optional(),
    priority: Joi.string().valid(...Object.values(PriorityEnum)).optional(),
    status: Joi.string().valid(...Object.values(StatusEnum)).optional(),
});