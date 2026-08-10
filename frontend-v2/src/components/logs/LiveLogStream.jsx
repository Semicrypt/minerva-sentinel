import {
    Terminal,
    CircleCheck,
    TriangleAlert,
    CircleX,
    ShieldAlert
} from "lucide-react";

function getLevelAppearance(
    level
) {

    switch (
        String(
            level ||
            ""
        ).toUpperCase()
    ) {

        case "WARNING":

            return {

                icon:
                    TriangleAlert,

                color:
                    "text-amber-400"

            };

        case "ERROR":

            return {

                icon:
                    CircleX,

                color:
                    "text-red-400"

            };

        case "CRITICAL":

            return {

                icon:
                    ShieldAlert,

                color:
                    "text-red-500"

            };

        default:

            return {

                icon:
                    CircleCheck,

                color:
                    "text-emerald-400"

            };

    }

}

function formatTime(
    value
) {

    if (
        !value
    ) {

        return "--:--:--";

    }

    const date =
        new Date(
            value
        );

    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return "--:--:--";

    }

    return date.toLocaleTimeString(
        [],
        {

            hour:
                "2-digit",

            minute:
                "2-digit",

            second:
                "2-digit"

        }
    );

}

export default function LiveLogStream({

    logs = [],

    loading = false

}) {

    return (

        <section className="overflow-hidden rounded-3xl border border-slate-800 bg-[#111827]">

            <div className="flex items-center justify-between border-b border-slate-800 px-8 py-5">

                <div className="flex items-center gap-3">

                    <Terminal
                        size={24}
                        className="text-indigo-400"
                    />

                    <h2 className="text-2xl font-bold text-white">

                        Live Log Stream

                    </h2>

                </div>

                <span className="rounded-full bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-400">

                    Live Feed

                </span>

            </div>

            {
                loading
                    ? (

                        <div className="bg-[#0B1220] px-8 py-16 text-center text-slate-500">

                            Loading logs...

                        </div>

                    )
                    : logs.length === 0
                        ? (

                            <div className="bg-[#0B1220] px-8 py-16 text-center text-slate-500">

                                No logs match the current filters.

                            </div>

                        )
                        : (

                            <div className="max-h-[600px] overflow-y-auto bg-[#0B1220] font-mono">

                                {
                                    logs.map(
                                        log => {

                                            const appearance =
                                                getLevelAppearance(
                                                    log.level
                                                );

                                            const Icon =
                                                appearance.icon;

                                            return (

                                                <div
                                                    key={
                                                        log.id
                                                    }
                                                    className="
                                                        flex
                                                        flex-col
                                                        gap-4
                                                        border-b
                                                        border-slate-800
                                                        px-8
                                                        py-5
                                                        transition
                                                        hover:bg-slate-900/40
                                                        lg:flex-row
                                                        lg:items-center
                                                    "
                                                >

                                                    <span className="w-28 text-sm text-slate-500">

                                                        {
                                                            formatTime(
                                                                log.created_at
                                                            )
                                                        }

                                                    </span>

                                                    <div className="flex w-36 items-center gap-2">

                                                        <Icon
                                                            size={18}
                                                            className={
                                                                appearance.color
                                                            }
                                                        />

                                                        <span
                                                            className={`font-bold ${appearance.color}`}
                                                        >

                                                            {
                                                                log.level
                                                            }

                                                        </span>

                                                    </div>

                                                    <span className="w-56 font-semibold text-cyan-400">

                                                        {
                                                            log.source
                                                        }

                                                    </span>

                                                    <span className="flex-1 break-words text-slate-300">

                                                        {
                                                            log.message
                                                        }

                                                    </span>

                                                </div>

                                            );

                                        }
                                    )
                                }

                            </div>

                        )
            }

        </section>

    );

}