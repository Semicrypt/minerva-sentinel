import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
    ArrowRight,
    Menu,
    ShieldCheck,
    X
} from "lucide-react";

const links = [
    ["Technical Solutions", "#technical-solutions"],
    ["Features", "#features"],
    ["Dashboard", "#dashboard"],
    ["Architecture", "#architecture"],
    ["Pricing", "#pricing"],
    ["About", "#about"],
    ["Docs", "#docs"]
];

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        if (!menuOpen) return undefined;

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        function closeOnEscape(event) {
            if (event.key === "Escape") {
                setMenuOpen(false);
            }
        }

        window.addEventListener("keydown", closeOnEscape);

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener("keydown", closeOnEscape);
        };
    }, [menuOpen]);

    function closeMenu() {
        setMenuOpen(false);
    }

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
            <div className="mx-auto mt-6 w-[94%] max-w-7xl rounded-2xl border border-white/10 bg-slate-900/70 shadow-2xl shadow-black/30 backdrop-blur-2xl">
                <div className="flex items-center justify-between px-5 py-4 sm:px-8">
                    <Link
                        to="/"
                        onClick={closeMenu}
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

                    <nav className="hidden items-center gap-10 lg:flex">
                        {links.slice(1, 5).map(([label, href]) => (
                            <a
                                key={href}
                                href={href}
                                className="group relative text-sm font-medium text-slate-300 transition hover:text-white"
                            >
                                {label}

                                <span className="absolute -bottom-2 left-0 h-[2px] w-0 bg-cyan-400 transition-all duration-300 group-hover:w-full" />
                            </a>
                        ))}
                    </nav>

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

                    <button
                        type="button"
                        aria-label={
                            menuOpen
                                ? "Close navigation menu"
                                : "Open navigation menu"
                        }
                        aria-expanded={menuOpen}
                        aria-controls="mobile-navigation"
                        onClick={() => setMenuOpen(value => !value)}
                        className="rounded-xl border border-slate-700 p-2 text-slate-300 transition hover:border-cyan-500 hover:text-white lg:hidden"
                    >
                        {menuOpen ? (
                            <X size={22} />
                        ) : (
                            <Menu size={22} />
                        )}
                    </button>
                </div>

                {menuOpen && (
                    <div
                        id="mobile-navigation"
                        className="max-h-[calc(100vh-7rem)] overflow-y-auto border-t border-white/10 px-5 pb-5 pt-3 lg:hidden"
                    >
                        <nav className="grid gap-1">
                            {links.map(([label, href]) => (
                                <a
                                    key={href}
                                    href={href}
                                    onClick={closeMenu}
                                    className="rounded-xl px-3 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/5 hover:text-cyan-300"
                                >
                                    {label}
                                </a>
                            ))}
                        </nav>

                        <div className="mt-3 grid grid-cols-2 gap-3 border-t border-white/10 pt-4">
                            <Link
                                to="/register"
                                onClick={closeMenu}
                                className="rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-3 text-center text-sm font-semibold text-white"
                            >
                                Start Free
                            </Link>

                            <Link
                                to="/login"
                                onClick={closeMenu}
                                className="rounded-xl border border-slate-700 px-4 py-3 text-center text-sm font-semibold text-slate-200"
                            >
                                Sign In
                            </Link>
                        </div>

                        <a
                            href="mailto:admin@minervasentinel.com"
                            onClick={closeMenu}
                            className="mt-3 block rounded-xl px-3 py-3 text-center text-sm text-cyan-300 transition hover:bg-white/5"
                        >
                            Contact Us · admin@minervasentinel.com
                        </a>
                    </div>
                )}
            </div>
        </motion.header>
    );
}