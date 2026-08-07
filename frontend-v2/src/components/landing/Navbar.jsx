import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
    Menu,
    ShieldCheck,
    ArrowRight
} from "lucide-react";

export default function Navbar() {

    return (

        <motion.header

            initial={{ opacity: 0, y: -60 }}

            animate={{ opacity: 1, y: 0 }}

            transition={{

                duration: 0.7,

                ease: "easeOut"

            }}

            className="fixed inset-x-0 top-0 z-50"

        >

            <div className="mx-auto mt-6 flex w-[94%] max-w-7xl items-center justify-between rounded-2xl border border-white/10 bg-slate-900/70 px-8 py-4 backdrop-blur-2xl shadow-2xl shadow-black/30">

                {/* Logo */}

                <Link
                    to="/"
                    className="flex items-center gap-4"
                >

                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 shadow-lg shadow-cyan-500/30">

                        <ShieldCheck
                            size={24}
                            className="text-white"
                        />

                    </div>

                    <div>

                        <h1 className="text-2xl font-bold tracking-tight text-white">

                            Minerva

                        </h1>

                        <p className="text-xs uppercase tracking-[0.35em] text-cyan-400">

                            Sentinel

                        </p>

                    </div>

                </Link>

                {/* Navigation */}

                <nav className="hidden items-center gap-10 lg:flex">

                    <a
                        href="#features"
                        className="group relative text-sm font-medium text-slate-300 transition hover:text-white"
                    >

                        Features

                        <span className="absolute -bottom-2 left-0 h-[2px] w-0 bg-cyan-400 transition-all duration-300 group-hover:w-full" />

                    </a>

                    <a
                        href="#dashboard"
                        className="group relative text-sm font-medium text-slate-300 transition hover:text-white"
                    >

                        Dashboard

                        <span className="absolute -bottom-2 left-0 h-[2px] w-0 bg-cyan-400 transition-all duration-300 group-hover:w-full" />

                    </a>

                    <a
                        href="#architecture"
                        className="group relative text-sm font-medium text-slate-300 transition hover:text-white"
                    >

                        Architecture

                        <span className="absolute -bottom-2 left-0 h-[2px] w-0 bg-cyan-400 transition-all duration-300 group-hover:w-full" />

                    </a>

                    <a
                        href="#pricing"
                        className="group relative text-sm font-medium text-slate-300 transition hover:text-white"
                    >

                        Pricing

                        <span className="absolute -bottom-2 left-0 h-[2px] w-0 bg-cyan-400 transition-all duration-300 group-hover:w-full" />

                    </a>

                </nav>

                {/* Right Side */}

                <div className="hidden items-center gap-4 lg:flex">

                    <Link

                        to="/login"

                        className="rounded-xl border border-slate-700 px-5 py-2.5 text-sm font-medium text-slate-300 transition hover:border-cyan-500 hover:text-white"

                    >

                        Sign In

                    </Link>

                    <Link

                        to="/register"

                        className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-cyan-500/40"

                    >

                        Start Free

                        <ArrowRight size={16} />

                    </Link>

                </div>

                {/* Mobile */}

                <button className="rounded-xl border border-slate-700 p-2 text-slate-300 transition hover:border-cyan-500 hover:text-white lg:hidden">

                    <Menu size={22} />

                </button>

            </div>

        </motion.header>

    );

}