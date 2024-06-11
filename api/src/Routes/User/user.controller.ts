import UserModel from "../../Schema/User/user.schema";
import { IUser, IUserLogInFrom, IUserSignUpFrom, IUserUpdateFrom } from "../../Schema/User/user.type";
import { userLogInSchema, userSignUpSchema, userUpdateSchema } from "../../Schema/User/user.validation";
import { IResponseType, IResponseWithHeaderType } from "../../Types";
import { MakeTokens, removeRefreshToken, verifyAccessToken, verifyRefreshToken } from "../../Util/jwt";
import { UserType } from "../../Util/jwt/jwt.types";


export default class UserController {

    static async signUp(_user: IUserSignUpFrom): Promise<IResponseWithHeaderType<IUser>> {


        await UserModel.validator(_user, userSignUpSchema)
        const user = await new UserModel((_user as any));
        await user!.encryptPassword();
        await user.save();
        const { accessToken, refreshToken } = await MakeTokens(user.toJSON(), UserType.user);

        return { body: { ...user!.toJSON() as any, accessToken }, header: { accessToken, refreshToken } }
    }

    static async logIn(from: IUserLogInFrom): Promise<IResponseWithHeaderType<IUser>> {
        await UserModel.validator(from, userLogInSchema);
        const user = await UserModel.getByEmail(from.email);
        await user!.checkPassword(from.password);

        const { accessToken, refreshToken } = await MakeTokens(user!.toJSON(), UserType.user);
        return { body: { ...user!.toJSON() as any, accessToken }, header: { accessToken, refreshToken } }

    }

    static async refreshToken(_refreshToken: string): Promise<IResponseWithHeaderType<undefined>> {

        const tokenUser = await verifyRefreshToken<IUser>(_refreshToken, UserType.user);
        const user = await UserModel.getById(tokenUser!._id as any);
        const { accessToken, refreshToken } = await MakeTokens(user!.toJSON(), UserType.user);

        return { body: undefined, header: { accessToken, refreshToken } }
    }

    static async logOut(token: string): Promise<void> {
        const user = await verifyAccessToken<IUser>(token, UserType.user);
        await removeRefreshToken(user._id as any);
    }

    static async update(_user: IUserUpdateFrom, userId: string): Promise<IResponseType<IUser | null>> {

        await UserModel.validator(_user, userUpdateSchema)
        const user = await UserModel.getById(userId);
        const updateUser = await UserModel.update(user.id, _user)
        return { body: (updateUser as any).toJSON() }
    }

    static async getById(user: IUser): Promise<IResponseType<IUser | null>> {
        return { body: ((await UserModel.getById(user._id ?? "" as any))?.toJSON() as any) };
    }

    static async removeById(userId: string, user: IUser): Promise<IResponseType<{} | null>> {
        const event = await UserModel.getById(userId);
        await UserModel.removeByID(event?.id)

        return { body: {} };

    }
}
