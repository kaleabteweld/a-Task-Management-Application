import Joi from "joi";
import { MakeValidator } from "../../Util";
import { ITask, ITaskUpdateFrom } from "./task.types";
import mongoose from "mongoose";
import { ValidationErrorFactory } from "../../Types/error";
import { BSONError } from 'bson';

export function validator<T>(taskInput: T, schema: Joi.ObjectSchema<T>) {
    return MakeValidator<T>(schema, taskInput);
}

export async function getById(this: mongoose.Model<ITask>, _id: string): Promise<ITask> {
    try {
        const task = await this.findById(new mongoose.Types.ObjectId(_id));
        if (task == null) {
            throw ValidationErrorFactory({
                msg: "task not found",
                statusCode: 404,
                type: "Validation"
            }, "_id")
        }
        return task;
    } catch (error) {
        if (error instanceof BSONError) {
            throw ValidationErrorFactory({
                msg: "Input must be a 24 character hex string, 12 byte Uint8Array, or an integer",
                statusCode: 400,
                type: "validation",
            }, "id");
        }
        throw error;
    }

}

export async function removeByID(this: mongoose.Model<ITask>, _id: string): Promise<void> {
    try {
        const result = await this.deleteOne({ _id: new mongoose.Types.ObjectId(_id) })
        if (result.deletedCount === 0) {
            throw ValidationErrorFactory({
                msg: "task not found",
                statusCode: 404,
                type: "Validation"
            }, "_id")
        }
    } catch (error) {
        if (error instanceof BSONError) {
            throw ValidationErrorFactory({
                msg: "Input must be a 24 character hex string, 12 byte Uint8Array, or an integer",
                statusCode: 400,
                type: "validation",
            }, "id");
        }
        throw error;
    }
}

export async function update(this: mongoose.Model<ITask>, _id: string, newTask: ITaskUpdateFrom): Promise<ITask | null> {

    try {
        const result = await this.findByIdAndUpdate({ _id: new mongoose.Types.ObjectId(_id) }, newTask);
        if (result == null) {
            throw ValidationErrorFactory({
                msg: "Task not found",
                statusCode: 404,
                type: "Validation"
            }, "_id")
        }
        return result;
    } catch (error) {
        if (error instanceof BSONError) {
            throw ValidationErrorFactory({
                msg: "Input must be a 24 character hex string, 12 byte Uint8Array, or an integer",
                statusCode: 400,
                type: "validation",
            }, "id");
        }
        throw error;
    }
}