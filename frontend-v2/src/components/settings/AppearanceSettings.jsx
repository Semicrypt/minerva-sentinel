import {
    Palette,
    Moon,
    Monitor,
    LayoutDashboard,
    Clock3,
    CheckCircle2
} from "lucide-react";

export default function AppearanceSettings() {

    return (

        <section className="rounded-3xl border border-slate-800 bg-[#111827] p-8">

            <div className="flex items-center justify-between">

                <div>

                    <h2 className="text-3xl font-bold text-white">

                        Appearance & Preferences

                    </h2>

                    <p className="mt-2 text-slate-400">

                        Customize the dashboard appearance and user experience.

                    </p>

                </div>

                <span className="rounded-full bg-sky-500/10 px-4 py-2 text-sm font-semibold text-sky-400">

                    Personalized

                </span>

            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-2">

                <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">

                    <div className="flex items-center gap-3">

                        <Moon
                            size={22}
                            className="text-indigo-400"
                        />

                        <h3 className="text-xl font-bold text-white">

                            Theme

                        </h3>

                    </div>

                    <div className="mt-6 flex gap-4">

                        <button className="flex-1 rounded-xl border border-indigo-500 bg-indigo-500/20 px-4 py-3 font-semibold text-indigo-300">

                            Dark

                        </button>

                        <button className="flex-1 rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-slate-300">

                            Light

                        </button>

                        <button className="flex-1 rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-slate-300">

                            System

                        </button>

                    </div>

                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">

                    <div className="flex items-center gap-3">

                        <Palette
                            size={22}
                            className="text-pink-400"
                        />

                        <h3 className="text-xl font-bold text-white">

                            Accent Color

                        </h3>

                    </div>

                    <div className="mt-6 flex gap-4">

                        <div className="h-10 w-10 rounded-full bg-cyan-500"></div>

                        <div className="h-10 w-10 rounded-full bg-indigo-500 ring-2 ring-white"></div>

                        <div className="h-10 w-10 rounded-full bg-emerald-500"></div>

                        <div className="h-10 w-10 rounded-full bg-orange-500"></div>

                        <div className="h-10 w-10 rounded-full bg-rose-500"></div>

                    </div>

                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">

                    <div className="flex items-center gap-3">

                        <LayoutDashboard
                            size={22}
                            className="text-cyan-400"
                        />

                        <h3 className="text-xl font-bold text-white">

                            Dashboard Layout

                        </h3>

                    </div>

                    <div className="mt-6 flex items-center justify-between">

                        <span className="text-slate-300">

                            Comfortable Layout

                        </span>

                        <CheckCircle2
                            size={22}
                            className="text-emerald-400"
                        />

                    </div>

                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">

                    <div className="flex items-center gap-3">

                        <Clock3
                            size={22}
                            className="text-amber-400"
                        />

                        <h3 className="text-xl font-bold text-white">

                            Auto Refresh

                        </h3>

                    </div>

                    <div className="mt-6">

                        <select
                            className="
                                w-full
                                rounded-xl
                                border
                                border-slate-700
                                bg-slate-800
                                px-4
                                py-3
                                text-white
                                outline-none
                            "
                        >

                            <option>5 Seconds</option>
                            <option>10 Seconds</option>
                            <option>30 Seconds</option>
                            <option>1 Minute</option>
                            <option>5 Minutes</option>

                        </select>

                    </div>

                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 lg:col-span-2">

                    <div className="flex items-center gap-3">

                        <Monitor
                            size={22}
                            className="text-emerald-400"
                        />

                        <h3 className="text-xl font-bold text-white">

                            Default Dashboard

                        </h3>

                    </div>

                    <div className="mt-6 grid gap-4 md:grid-cols-4">

                        <button className="rounded-xl bg-slate-800 px-4 py-3 text-slate-300">

                            Dashboard

                        </button>

                        <button className="rounded-xl bg-slate-800 px-4 py-3 text-slate-300">

                            Infrastructure

                        </button>

                        <button className="rounded-xl bg-sky-600 px-4 py-3 font-semibold text-white">

                            Observability

                        </button>

                        <button className="rounded-xl bg-slate-800 px-4 py-3 text-slate-300">

                            Cost Explorer

                        </button>

                    </div>

                </div>

            </div>

        </section>

    );

}