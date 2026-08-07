import {
    Box,
    RefreshCw,
    Package,
    CheckCircle2,
    AlertTriangle
} from "lucide-react";

export default function ContainersHeader({

    dockerInfo,

    loading,

    refreshing,

    error,

    onRefresh

}) {

    const connected =
        Boolean(
            dockerInfo
        ) &&
        !error;

    return (

        <section className="rounded-[32px] border border-slate-800 bg-[#111827] p-8 shadow-xl shadow-black/20">

            <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

                <div>

                    <div className="flex items-center gap-4">

                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-500/10">

                            <Box
                                size={30}
                                className="text-sky-400"
                            />

                        </div>

                        <div>

                            <p className="text-sm uppercase tracking-[0.28em] text-slate-500">

                                Docker Engine

                            </p>

                            <h1 className="mt-1 text-4xl font-black text-white">

                                Containers

                            </h1>

                        </div>

                    </div>

                    <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-400">

                        Monitor Docker containers, images, networks, volumes,
                        CPU usage, memory consumption and runtime health from a
                        single dashboard.

                    </p>

                    {error && (

                        <div className="mt-6 flex items-center gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4">

                            <AlertTriangle
                                size={18}
                                className="text-red-400"
                            />

                            <span className="text-sm text-red-300">

                                {error}

                            </span>

                        </div>

                    )}

                </div>

                <div className="grid gap-4">

                    <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/50 px-5 py-4">

                        <div className="flex items-center gap-3">

                            <Package
                                size={18}
                                className="text-cyan-400"
                            />

                            <span className="text-slate-300">

                                Docker Version

                            </span>

                        </div>

                        <span className="font-semibold text-white">

                            {
                                loading
                                    ? "Loading..."
                                    : dockerInfo?.serverVersion ||
                                      "Unavailable"
                            }

                        </span>

                    </div>

                    <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/50 px-5 py-4">

                        <div className="flex items-center gap-3">

                            <CheckCircle2
                                size={18}
                                className={
                                    connected
                                        ? "text-emerald-400"
                                        : "text-red-400"
                                }
                            />

                            <span className="text-slate-300">

                                Engine

                            </span>

                        </div>

                        <span
                            className={
                                connected
                                    ? "font-semibold text-emerald-400"
                                    : "font-semibold text-red-400"
                            }
                        >

                            {
                                loading
                                    ? "Checking..."
                                    : connected
                                      ? "Connected"
                                      : "Disconnected"
                            }

                        </span>

                    </div>

                    <button
                        type="button"
                        onClick={onRefresh}
                        disabled={
                            refreshing ||
                            loading
                        }
                        className="
                            flex
                            items-center
                            justify-center
                            gap-3
                            rounded-2xl
                            bg-gradient-to-r
                            from-sky-500
                            to-cyan-500
                            px-6
                            py-4
                            font-semibold
                            text-white
                            transition
                            hover:scale-[1.02]
                            disabled:cursor-not-allowed
                            disabled:opacity-60
                        "
                    >

                        <RefreshCw
                            size={18}
                            className={
                                refreshing
                                    ? "animate-spin"
                                    : ""
                            }
                        />

                        {
                            refreshing
                                ? "Refreshing..."
                                : "Refresh Docker"
                        }

                    </button>

                </div>

            </div>

        </section>

    );

}