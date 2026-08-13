import {
    useEffect,
    useState
} from "react";

import {
    Link,
    useNavigate
} from "react-router-dom";

import {
    Eye,
    EyeOff,
    Lock,
    Mail
} from "lucide-react";

import { login } from "../services/authService";
import { useAuth } from "../context/AuthContext";

export default function Login() {
    const navigate = useNavigate();

    const {
        refreshUser
    } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const rememberedEmail =
            localStorage.getItem("rememberEmail");

        if (rememberedEmail) {
            setEmail(rememberedEmail);
            setRememberMe(true);
        }
    }, []);

    async function handleSubmit(event) {
        event.preventDefault();

        setLoading(true);
        setError("");

        try {
            await login(
                email.trim(),
                password
            );

            await refreshUser();

            if (rememberMe) {
                localStorage.setItem(
                    "rememberEmail",
                    email.trim()
                );
            } else {
                localStorage.removeItem(
                    "rememberEmail"
                );
            }

            navigate(
                "/dashboard",
                { replace: true }
            );
        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Unable to sign in. Please check your details and try again."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-[#050816] px-4 py-10 sm:px-6">
            <section className="w-full max-w-md rounded-3xl border border-slate-800 bg-[#111827] p-6 shadow-2xl sm:p-8">
                <div className="mb-8 text-center">
                    <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 text-2xl shadow-lg shadow-cyan-500/20">
                        🛡️
                    </div>

                    <h1 className="text-3xl font-bold tracking-tight text-white">
                        Welcome Back
                    </h1>

                    <p className="mt-2 text-slate-400">
                        Sign in to Minerva Sentinel
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >
                    <div>
                        <label
                            htmlFor="email"
                            className="mb-2 block text-sm font-medium text-slate-300"
                        >
                            Email Address
                        </label>

                        <div className="relative">
                            <Mail
                                size={18}
                                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                            />

                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(event) =>
                                    setEmail(event.target.value)
                                }
                                placeholder="you@example.com"
                                autoComplete="email"
                                required
                                className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-11 pr-4 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                            />
                        </div>
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            className="mb-2 block text-sm font-medium text-slate-300"
                        >
                            Password
                        </label>

                        <div className="relative">
                            <Lock
                                size={18}
                                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                            />

                            <input
                                id="password"
                                type={
                                    showPassword
                                        ? "text"
                                        : "password"
                                }
                                value={password}
                                onChange={(event) =>
                                    setPassword(event.target.value)
                                }
                                placeholder="Enter your password"
                                autoComplete="current-password"
                                required
                                className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-11 pr-12 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                            />

                            <button
                                type="button"
                                aria-label={
                                    showPassword
                                        ? "Hide password"
                                        : "Show password"
                                }
                                onClick={() =>
                                    setShowPassword(
                                        (visible) => !visible
                                    )
                                }
                                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-500 transition hover:text-white"
                            >
                                {showPassword ? (
                                    <EyeOff size={18} />
                                ) : (
                                    <Eye size={18} />
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                        <label className="flex items-center gap-2 text-sm text-slate-400">
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(event) =>
                                    setRememberMe(
                                        event.target.checked
                                    )
                                }
                                className="h-4 w-4 rounded border-slate-700 bg-slate-950 text-blue-500 focus:ring-blue-500"
                            />

                            Remember me
                        </label>

                        <button
                            type="button"
                            onClick={() =>
                                setError(
                                    "Password recovery is not available yet."
                                )
                            }
                            className="text-sm text-blue-400 transition hover:text-blue-300"
                        >
                            Forgot password?
                        </button>
                    </div>

                    {error && (
                        <div
                            role="alert"
                            className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300"
                        >
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 py-3.5 font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {loading
                            ? "Signing in..."
                            : "Sign in"}
                    </button>
                </form>

                <p className="mt-7 text-center text-sm text-slate-400">
                    Don&apos;t have an account?{" "}

                    <Link
                        to="/register"
                        className="font-semibold text-blue-400 transition hover:text-blue-300"
                    >
                        Create one
                    </Link>
                </p>
            </section>
        </main>
    );
}