import mongoose from "mongoose";
import { ICategories, ITask, ITaskMethods, ITaskModel, PriorityEnum, StatusEnum } from "./task.types";
import { getById, removeByID, update, validator } from "./task.extended";
import { IUser } from "../User/user.type";
import { mongooseErrorPlugin } from "../Middleware/errors.middleware";

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

taskSchema.post('save', async function (doc) {
    try {
        const user = await mongoose.model('User').findById(doc.user);
        if (user) {
            if (!user.tasks.includes(doc._id as any)) {
                user.tasks.push(doc._id as any);
                await user.save();
            }
        }
    } catch (error) {
        console.error("Error updating tasks on User:", error);
    }
});

taskSchema.plugin<any>(mongooseErrorPlugin);
const TaskModel = mongoose.model<ITask, ITaskModel>('Task', taskSchema);
export default TaskModel;