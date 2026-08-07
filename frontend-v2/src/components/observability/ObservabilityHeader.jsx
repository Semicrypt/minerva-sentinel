import {
    Activity,
    CheckCircle2,
    RefreshCw,
    TriangleAlert,
    CircleX
} from "lucide-react";

function getStatusConfig(
    status
) {

    const value =
        String(
            status || ""
        ).toUpperCase();

    if (
        value === "WARNING"
    ) {

        return {

            label:
                "Warning",

            icon:
                TriangleAlert,

            color:
                "text-amber-400",

            background:
                "bg-amber-500/10"

        };

    }

    if (
        value === "OFFLINE"
    ) {

        return {

            label:
                "Offline",

            icon:
                CircleX,

            color:
                "text-red-400",

            background:
                "bg-red-500/10"

        };

    }

    return {

        label:
            "Healthy",

        icon:
            CheckCircle2,

        color:
            "text-emerald-400",

        background:
            "bg-emerald-500/10"

    };

}

export default function ObservabilityHeader({

    hostname,

    status,

    refreshing = false,

    onRefresh

}) {

    const statusConfig =
        getStatusConfig(
            status
        );

    const StatusIcon =
        statusConfig.icon;

    return (

        <section className="rounded-[32px] border border-slate-800 bg-[#111827] p-8 shadow-xl shadow-black/20">

            <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

                <div>

                    <div className="flex items-center gap-4">

                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-500/10">

                            <Activity
                                size={30}
                                className="text-cyan-400"
                            />

                        </div>

                        <div>

                            <p className="text-sm uppercase tracking-[0.28em] text-slate-500">

                                Monitoring & Observability

                            </p>

                            <h1 className="mt-1 text-4xl font-black text-white">

                                Observability Center

                            </h1>

                        </div>

                    </div>

                    <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-400">

                        Monitor live and historical infrastructure metrics
                        {hostname ? ` for ${hostname}` : ""}.

                    </p>

                </div>

                <div className="grid gap-4">

                    <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/50 px-5 py-4">

                        <span className="text-slate-300">

                            Platform Status

                        </span>

                        <div
                            className={`flex items-center gap-2 rounded-full px-3 py-1 ${statusConfig.background}`}
                        >

                            <StatusIcon
                                size={18}
                                className={statusConfig.color}
                            />

                            <span
                                className={`font-semibold ${statusConfig.color}`}
                            >

                                {statusConfig.label}

                            </span>

                        </div>

                    </div>

                    <button
                        type="button"
                        onClick={onRefresh}
                        disabled={refreshing}
                        className="
                            flex
                            items-center
                            justify-center
                            gap-3
                            rounded-2xl
                            bg-gradient-to-r
                            from-cyan-600
                            to-blue-600
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
                                : "Refresh Metrics"
                        }

                    </button>

                </div>

            </div>

        </section>

    );

}