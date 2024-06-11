import mongoose from "mongoose";
import { ICategories, ITask, ITaskMethods, ITaskModel, PriorityEnum, StatusEnum } from "./task.types";
import { getById, removeByID, update, validator } from "./task.extended";

const categorySchema = new mongoose.Schema<ICategories>({
    name: { type: String, required: true, unique: true },
}, {
    timestamps: true,
});

export const CategoryModel = mongoose.model('Category', categorySchema);


const taskSchema = new mongoose.Schema<ITask, ITaskModel, ITaskMethods>({
    title: { type: String, required: true },
    description: { type: String, required: true },
    deadline: { type: Date, required: true },
    priority: { type: String, enum: Object.values(PriorityEnum), required: true },
    status: { type: String, enum: Object.values(StatusEnum), default: StatusEnum.pending },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, {
    timestamps: true,
    statics: {
        validator,
        getById,
        update,
        removeByID,
    }
});

const TaskModel = mongoose.model<ITask, ITaskModel>('Task', taskSchema);
export default TaskModel;