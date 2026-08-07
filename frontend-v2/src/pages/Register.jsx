import { useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import {
    User,
    Mail,
    Lock,
    Eye,
    EyeOff,
    CheckCircle2,
    XCircle
} from "lucide-react";

import { register } from "../services/authService";

export default function Register() {

    const navigate = useNavigate();

    const [form, setForm] = useState({

        fullName: "",

        email: "",

        password: "",

        confirmPassword: ""

    });

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    const [showPassword, setShowPassword] = useState(false);

    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    function handleChange(event) {

        setForm({

            ...form,

            [event.target.name]: event.target.value

        });

    }

    const passwordChecks = useMemo(() => ({

        length: form.password.length >= 8,

        uppercase: /[A-Z]/.test(form.password),

        lowercase: /[a-z]/.test(form.password),

        number: /\d/.test(form.password),

        special: /[^A-Za-z0-9]/.test(form.password)

    }), [form.password]);

    const passwordScore = Object

        .values(passwordChecks)

        .filter(Boolean)

        .length;

    const passwordStrength = useMemo(() => {

        if (passwordScore <= 2) {

            return {

                text: "Weak",

                color: "bg-red-500",

                width: "20%"

            };

        }

        if (passwordScore <= 4) {

            return {

                text: "Medium",

                color: "bg-yellow-500",

                width: "65%"

            };

        }

        return {

            text: "Strong",

            color: "bg-emerald-500",

            width: "100%"

        };

    }, [passwordScore]);

    const passwordsMatch =

        form.confirmPassword.length > 0 &&

        form.password === form.confirmPassword;

    const formValid =

        form.fullName.trim() !== "" &&

        form.email.trim() !== "" &&

        passwordsMatch &&

        passwordStrength.text !== "Weak";

    async function handleSubmit(event) {

        event.preventDefault();

        setError("");

        if (!passwordsMatch) {

            setError("Passwords do not match.");

            return;

        }

        if (passwordStrength.text === "Weak") {

            setError("Please choose a stronger password.");

            return;

        }

        setLoading(true);

        try {

            await register(

                form.fullName,

                form.email,

                form.password

            );

            alert("Registration successful.");

            navigate("/login");

        }

        catch (error) {

            console.error(error);

            setError(

                error.response?.data?.message ||

                "Registration failed."

            );

        }

        finally {

            setLoading(false);

        }

    }

    function Requirement({

        passed,

        text

    }) {

        return (

            <div className="flex items-center gap-3">

                {

                    passed

                        ?

                        <CheckCircle2

                            size={18}

                            className="text-emerald-400"

                        />

                        :

                        <XCircle

                            size={18}

                            className="text-slate-500"

                        />

                }

                <span

                    className={

                        passed

                            ?

                            "text-sm text-emerald-400"

                            :

                            "text-sm text-slate-400"

                    }

                >

                    {text}

                </span>

            </div>

        );

    }
        return (

        <div className="flex min-h-screen items-center justify-center bg-[#050B16] px-6 py-12">

            <div className="w-full max-w-lg rounded-3xl border border-slate-800 bg-[#111827] p-8 shadow-2xl">

                <h1 className="text-center text-3xl font-bold text-white">

                    Create Account

                </h1>

                <p className="mt-2 text-center text-slate-400">

                    Register to start monitoring your infrastructure.

                </p>

                <form
                    onSubmit={handleSubmit}
                    className="mt-8 space-y-6"
                >

                    {/* Full Name */}

                    <div>

                        <label className="mb-2 block text-sm text-slate-400">

                            Full Name

                        </label>

                        <div className="relative">

                            <User
                                size={18}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                            />

                            <input
                                type="text"
                                name="fullName"
                                value={form.fullName}
                                onChange={handleChange}
                                required
                                className="w-full rounded-xl border border-slate-700 bg-slate-900 py-3 pl-11 pr-4 text-white outline-none transition focus:border-blue-500"
                            />

                        </div>

                    </div>

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
                                name="email"
                                value={form.email}
                                onChange={handleChange}
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
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                required
                                className="w-full rounded-xl border border-slate-700 bg-slate-900 py-3 pl-11 pr-12 text-white outline-none transition focus:border-blue-500"
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
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

                        {/* Strength */}

                        <div className="mt-4">

                            <div className="h-2 overflow-hidden rounded-full bg-slate-800">

                                <div

                                    className={`h-full transition-all duration-500 ${passwordStrength.color}`}

                                    style={{

                                        width: passwordStrength.width

                                    }}

                                />

                            </div>

                            <div className="mt-2 flex justify-between">

                                <span className="text-sm text-slate-400">

                                    Password Strength

                                </span>

                                <span className="text-sm font-semibold text-white">

                                    {passwordStrength.text}

                                </span>

                            </div>

                        </div>

                        {/* Requirements */}

                        <div className="mt-5 space-y-3 rounded-2xl border border-slate-800 bg-slate-950/40 p-4">

                            <p className="text-xs uppercase tracking-wider text-slate-500">

                                Password Requirements

                            </p>

                            <Requirement
                                passed={passwordChecks.length}
                                text="At least 8 characters"
                            />

                            <Requirement
                                passed={passwordChecks.uppercase}
                                text="One uppercase letter"
                            />

                            <Requirement
                                passed={passwordChecks.lowercase}
                                text="One lowercase letter"
                            />

                            <Requirement
                                passed={passwordChecks.number}
                                text="One number"
                            />

                            <Requirement
                                passed={passwordChecks.special}
                                text="One special character"
                            />

                        </div>

                    </div>

                    {/* Confirm Password */}

                    <div>

                        <label className="mb-2 block text-sm text-slate-400">

                            Confirm Password

                        </label>

                        <div className="relative">

                            <Lock
                                size={18}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                            />

                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                name="confirmPassword"
                                value={form.confirmPassword}
                                onChange={handleChange}
                                required
                                className="w-full rounded-xl border border-slate-700 bg-slate-900 py-3 pl-11 pr-12 text-white outline-none transition focus:border-blue-500"
                            />

                            <button
                                type="button"
                                onClick={() =>

                                    setShowConfirmPassword(

                                        !showConfirmPassword

                                    )

                                }
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                            >

                                {

                                    showConfirmPassword

                                        ?

                                        <EyeOff size={18} />

                                        :

                                        <Eye size={18} />

                                }

                            </button>

                        </div>

                        {

                            form.confirmPassword.length > 0 &&

                            (

                                <div className="mt-3 flex items-center gap-2">

                                    {

                                        passwordsMatch

                                            ?

                                            <>

                                                <CheckCircle2

                                                    size={18}

                                                    className="text-emerald-400"

                                                />

                                                <span className="text-sm text-emerald-400">

                                                    Passwords match

                                                </span>

                                            </>

                                            :

                                            <>

                                                <XCircle

                                                    size={18}

                                                    className="text-red-400"

                                                />

                                                <span className="text-sm text-red-400">

                                                    Passwords do not match

                                                </span>

                                            </>

                                    }

                                </div>

                            )

                        }

                    </div>

                    {

                        error &&

                        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-400">

                            {error}

                        </div>

                    }

                    <button
                        type="submit"
                        disabled={!formValid || loading}
                        className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 py-3 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                    >

                        {

                            loading

                                ?

                                "Creating Account..."

                                :

                                "Create Account"

                        }

                    </button>

                </form>

                <p className="mt-8 text-center text-slate-400">

                    Already have an account?{" "}

                    <Link

                        to="/login"

                        className="font-medium text-blue-400 hover:text-blue-300"

                    >

                        Sign In

                    </Link>

                </p>

            </div>

        </div>

    );

}