import mongoose from 'mongoose';
import { mongooseErrorPlugin } from '../Middleware/errors.middleware';
import { IUser, IUserMethods, IUserModel } from './user.type';
import { checkPassword, encryptPassword, getByEmail, getById, removeByID, update, validator } from './user.extended';


export const userSchema = new mongoose.Schema<IUser, IUserModel, IUserMethods>({

    email: { type: String, required: true },
    password: { type: String, required: true },
    userName: { type: String, required: true },
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],

}, {
    timestamps: true,
    toJSON: {
        transform: function (doc, ret, opt) {
            delete ret['password'];
            return ret;
        }
    },
    statics: {
        validator,
        getByEmail,
        getById,
        removeByID,
        update,
    },
    methods: {
        encryptPassword,
        checkPassword,
    }
});

userSchema.plugin<any>(mongooseErrorPlugin);
const UserModel = mongoose.model<IUser, IUserModel>('User', userSchema);
export default UserModel;
