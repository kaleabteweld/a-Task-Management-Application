import { Person2Outlined, LockOutlined, AccountCircleOutlined } from "@mui/icons-material";
import { z } from 'zod';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSignUpMutation } from "../../features/slices/user.slice";
import { IUserSignUpFrom } from "../../features/types/user.type";

const signUpSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    userName: z.string().min(3, "Username must be at least 3 characters long")
});

const UserSignUpPage = () => {

    const navigate = useNavigate();

    const [errorMsg, setErrorMsg] = useState(null);
    const [signUp, { isLoading, isError }] = useSignUpMutation();
    const { register, handleSubmit, formState: { errors } } = useForm<IUserSignUpFrom>({
        resolver: zodResolver(signUpSchema),
    });

    const onSubmit = async (data: IUserSignUpFrom) => {
        try {
            await signUp(data).unwrap();
            navigate("/");
        } catch (err: any) {
            setErrorMsg(err.data.error.msg);
            console.error("Failed to sign up:", err);
        }
    };

    return (
        <div className="flex h-svh">
            <div className="w-1/2 bg-black flex flex-col gap-8 items-center justify-center">
                <h1 className="text-white text-8xl font-bold">Sign Up</h1>
            </div>

            <div className="flex flex-col items-center p-6 gap-8 w-1/2 border-2 justify-center">
                <h2 className="text-6xl font-bold">Sign Up</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3 w-full">
                    <span className="flex gap-2 p-2 border rounded-lg border-neutral-400">
                        <AccountCircleOutlined />
                        <input
                            className="w-full focus:outline-none"
                            placeholder="Username"
                            type="text"
                            {...register('userName')}
                        />
                    </span>
                    {errors.userName && <span className="text-red-500">{errors.userName.message}</span>}

                    <span className="flex gap-2 p-2 border rounded-lg border-neutral-400">
                        <Person2Outlined />
                        <input
                            className="w-full focus:outline-none"
                            placeholder="Email"
                            type="text"
                            {...register('email')}
                        />
                    </span>
                    {errors.email && <span className="text-red-500">{errors.email.message}</span>}

                    <span className="flex gap-2 p-2 border rounded-lg border-neutral-400">
                        <LockOutlined />
                        <input
                            className="w-full focus:outline-none"
                            placeholder="Password"
                            type="password"
                            {...register('password')}
                        />
                    </span>
                    {errors.password && <span className="text-red-500">{errors.password.message}</span>}

                    <button
                        type="submit"
                        className="bg-black text-white text-lg w-full text-center p-3 rounded-lg mt-4 disabled:bg-neutral-500 disabled:text-amber-950"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Signing up...' : 'Sign Up'}
                    </button>
                    {(isError || errorMsg) && <span className="text-red-500">{errorMsg ?? "Failed to sign up"}</span>}
                </form>
            </div>
        </div>
    );
}

export default UserSignUpPage;
