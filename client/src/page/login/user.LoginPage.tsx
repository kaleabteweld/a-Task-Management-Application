import { Person2Outlined, LockOutlined } from "@mui/icons-material";
import { z } from 'zod';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "../../features/slices/user.slice";
import { setAccessToken } from "../../features/apiSlice";
import { Button } from "@mui/material";

const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long")
});


const UserLoginPage = () => {

    const navigate = useNavigate();

    const [errorMsg, setErrorMsg] = useState(null);
    const [logIn, { isLoading, isError }] = useLoginMutation();
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: { email: string; password: string }) => {
        try {
            const _data = await logIn(data).unwrap();
            setAccessToken((_data as any).accessToken);
            navigate("/");
        } catch (err: any) {
            setErrorMsg(err.data.error.msg);
            console.error("Failed to log in:", err);
        }
    };


    return (
        <div className="flex h-svh">
            <div className="w-1/2 bg-black flex flex-col gap-8 items-center justify-center">
                <h1 className="text-white text-8xl font-bold">login</h1>
            </div>

            <Button onClick={() => navigate("/signup")} variant="contained">Sign Up</Button>
            <div className="flex flex-col items-center p-6 gap-8 w-1/2 border-2 justify-center">
                <h2 className="text-6xl font-bold">Login</h2>
                <form onSubmit={handleSubmit(onSubmit as any)} className="flex flex-col gap-3 w-full">
                    <span className="flex gap-2 p-2 border rounded-lg border-neutral-400">
                        <Person2Outlined />
                        <input
                            className="w-full focus:outline-none"
                            placeholder="Email"
                            type="text"
                            {...register('email')}
                        />
                    </span>
                    {errors.email && <span className="text-red-500">{(errors as any).email.message}</span>}

                    <span className="flex gap-2 p-2 border rounded-lg border-neutral-400">
                        <LockOutlined />
                        <input
                            className="w-full focus:outline-none"
                            placeholder="Password"
                            type="password"
                            {...register('password')}
                        />
                    </span>
                    {errors.password && <span className="text-red-500">{(errors as any).password.message}</span>}


                    <button
                        type="submit"
                        className="bg-black text-white text-lg w-full text-center p-3 rounded-lg mt-4 disabled:bg-neutral-500 disabled:text-amber-950"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Logging in...' : 'Login'}
                    </button>
                    {(isError || errorMsg) && <span className="text-red-500">{errorMsg ?? "Failed to log in"}</span>}

                </form>
            </div>
        </div>
    );
}

export default UserLoginPage;