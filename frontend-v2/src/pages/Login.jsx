import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import {
    Mail,
    Lock,
    Eye,
    EyeOff
} from "lucide-react";

import { login } from "../services/authService";

export default function Login() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);

    const [rememberMe, setRememberMe] = useState(false);

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    async function handleSubmit(event) {

        event.preventDefault();

        setLoading(true);

        setError("");

        try {

            await login(email, password);

            if (rememberMe) {

                localStorage.setItem("rememberEmail", email);

            }

            else {

                localStorage.removeItem("rememberEmail");

            }

            navigate("/dashboard");

        }

        catch (err) {

            console.error(err);

            setError(

                err.response?.data?.message ||

                "Invalid email or password."

            );

        }

        finally {

            setLoading(false);

        }

    }

    return (

        <div className="flex min-h-screen items-center justify-center bg-[#050B16] px-6 py-10">

            <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-[#111827] p-8 shadow-2xl">

                <div className="mb-8 text-center">

                    <h1 className="text-3xl font-bold text-white">

                        Welcome Back

                    </h1>

                    <p className="mt-2 text-slate-400">

                        Sign in to Minerva Sentinel

                    </p>

                </div>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-6"
                >

                    {/* Email */}

                    <div>

                        <label className="mb-2 block text-sm text-slate-400">

                            Email Address

                        </label>

                        <div className="relative">

                            <Mail

                                size={18}

                                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"

                            />

                            <input

                                type="email"

                                value={email}

                                onChange={(e) => setEmail(e.target.value)}

                                required

                                className="w-full rounded-xl border border-slate-700 bg-slate-900 py-3 pl-11 pr-4 text-white outline-none transition focus:border-blue-500"

                            />

                        </div>

                    </div>

                    {/* Password */}

                    <div>

                        <label className="mb-2 block text-sm text-slate-400">

                            Password

                        </label>

                        <div className="relative">

                            <Lock

                                size={18}

                                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"

                            />

                            <input

                                type={showPassword ? "text" : "password"}

                                value={password}

                                onChange={(e) => setPassword(e.target.value)}

                                required

                                className="w-full rounded-xl border border-slate-700 bg-slate-900 py-3 pl-11 pr-12 text-white outline-none transition focus:border-blue-500"

                            />

                            <button

                                type="button"

                                onClick={() =>

                                    setShowPassword(!showPassword)

                                }

                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"

                            >

                                {

                                    showPassword

                                        ?

                                        <EyeOff size={18} />

                                        :

                                        <Eye size={18} />

                                }

                            </button>

                        </div>

                    </div>

                    {/* Remember */}

                    <div className="flex items-center justify-between">

                        <label className="flex items-center gap-3 text-sm text-slate-400">

                            <input

                                type="checkbox"

                                checked={rememberMe}

                                onChange={(e) =>

                                    setRememberMe(e.target.checked)

                                }

                                className="h-4 w-4 rounded border-slate-700"

                            />

                            Remember Me

                        </label>

                        <button

                            type="button"

                            className="text-sm text-blue-400 hover:text-blue-300"

                        >

                            Forgot Password?

                        </button>

                    </div>

                    {error && (

                        <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">

                            {error}

                        </div>

                    )}

                    <button

                        type="submit"

                        disabled={loading}

                        className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 py-3 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"

                    >

                        {

                            loading

                                ?

                                "Signing In..."

                                :

                                "Sign In"

                        }

                    </button>

                </form>

                <div className="mt-8 border-t border-slate-800 pt-6">

                    <p className="text-center text-sm text-slate-400">

                        Don't have an account?{" "}

                        <Link

                            to="/register"

                            className="font-semibold text-blue-400 hover:text-blue-300"

                        >

                            Create Account

                        </Link>

                    </p>

                </div>

            </div>

        </div>

    );

}