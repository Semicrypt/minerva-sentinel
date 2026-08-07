import {
    User,
    Mail,
    Shield,
    Building2,
    Calendar,
    Pencil
} from "lucide-react";

export default function ProfileSettings() {

    return (

        <section className="rounded-3xl border border-slate-800 bg-[#111827] p-8">

            <div className="flex items-center justify-between">

                <div>

                    <h2 className="text-3xl font-bold text-white">

                        Profile Settings

                    </h2>

                    <p className="mt-2 text-slate-400">

                        Manage your account information and administrator profile.

                    </p>

                </div>

                <button
                    className="
                        flex
                        items-center
                        gap-2
                        rounded-2xl
                        bg-sky-600
                        px-5
                        py-3
                        font-semibold
                        text-white
                        transition
                        hover:bg-sky-500
                    "
                >

                    <Pencil size={18} />

                    Edit Profile

                </button>

            </div>

            <div className="mt-10 grid gap-8 lg:grid-cols-3">

                <div className="flex flex-col items-center rounded-3xl border border-slate-800 bg-slate-900/40 p-8">

                    <div
                        className="
                            flex
                            h-28
                            w-28
                            items-center
                            justify-center
                            rounded-full
                            bg-sky-500/10
                        "
                    >

                        <User
                            size={56}
                            className="text-sky-400"
                        />

                    </div>

                    <h3 className="mt-6 text-2xl font-bold text-white">

                        Administrator

                    </h3>

                    <p className="mt-2 text-slate-400">

                        Minerva Sentinel

                    </p>

                </div>

                <div className="lg:col-span-2">

                    <div className="grid gap-6 md:grid-cols-2">

                        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">

                            <div className="flex items-center gap-3">

                                <User
                                    size={20}
                                    className="text-sky-400"
                                />

                                <span className="text-slate-400">

                                    Full Name

                                </span>

                            </div>

                            <p className="mt-4 text-lg font-semibold text-white">

                                Minerva Administrator

                            </p>

                        </div>

                        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">

                            <div className="flex items-center gap-3">

                                <Mail
                                    size={20}
                                    className="text-cyan-400"
                                />

                                <span className="text-slate-400">

                                    Email

                                </span>

                            </div>

                            <p className="mt-4 text-lg font-semibold text-white">

                                admin@minerva.local

                            </p>

                        </div>

                        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">

                            <div className="flex items-center gap-3">

                                <Shield
                                    size={20}
                                    className="text-emerald-400"
                                />

                                <span className="text-slate-400">

                                    Role

                                </span>

                            </div>

                            <p className="mt-4 text-lg font-semibold text-emerald-400">

                                Super Administrator

                            </p>

                        </div>

                        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">

                            <div className="flex items-center gap-3">

                                <Building2
                                    size={20}
                                    className="text-violet-400"
                                />

                                <span className="text-slate-400">

                                    Organization

                                </span>

                            </div>

                            <p className="mt-4 text-lg font-semibold text-white">

                                Minerva Cloud Operations

                            </p>

                        </div>

                    </div>

                    <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/40 p-5">

                        <div className="flex items-center gap-3">

                            <Calendar
                                size={20}
                                className="text-amber-400"
                            />

                            <span className="text-slate-400">

                                Last Login

                            </span>

                        </div>

                        <p className="mt-4 text-lg font-semibold text-white">

                            Today · 09:42 UTC
                        </p>

                    </div>

                </div>

            </div>

        </section>

    );

}