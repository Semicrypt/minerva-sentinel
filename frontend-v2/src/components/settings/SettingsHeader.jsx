import {
    Save,
    Settings,
    User
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

function getDisplayName(user) {
    if (user?.full_name?.trim()) {
        return user.full_name.trim();
    }

    if (user?.email) {
        return user.email;
    }

    return "User";
}

export default function SettingsHeader() {
    const { user } = useAuth();

    const displayName = getDisplayName(user);

    return (
        <section className="rounded-[32px] border border-slate-800 bg-[#111827] p-8 shadow-xl shadow-black/20">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <div className="flex items-center gap-4">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-500/10">
                            <Settings
                                size={30}
                                className="text-sky-400"
                            />
                        </div>

                        <div>
                            <p className="text-sm uppercase tracking-[0.28em] text-slate-500">
                                Application Settings
                            </p>

                            <h1 className="mt-1 text-4xl font-black text-white">
                                Settings
                            </h1>
                        </div>
                    </div>

                    <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-400">
                        Configure your Minerva Sentinel account, monitoring
                        preferences, notifications and application behavior.
                    </p>
                </div>

                <div className="grid gap-4">
                    <div className="flex items-center justify-between gap-6 rounded-2xl border border-slate-800 bg-slate-900/50 px-5 py-4">
                        <div className="flex items-center gap-3">
                            <User
                                size={18}
                                className="text-sky-400"
                            />

                            <span className="text-slate-300">
                                Logged In As
                            </span>
                        </div>

                        <span className="max-w-48 truncate font-bold text-white">
                            {displayName}
                        </span>
                    </div>

                    <button
                        type="button"
                        className="flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-sky-600 to-cyan-600 px-6 py-4 font-semibold text-white transition hover:scale-[1.02]"
                    >
                        <Save size={18} />
                        Save Settings
                    </button>
                </div>
            </div>
        </section>
    );
}