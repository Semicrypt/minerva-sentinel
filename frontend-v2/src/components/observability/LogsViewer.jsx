import {
    useEffect,
    useState
} from "react";

import {
    FileText,
    CircleCheck,
    TriangleAlert,
    CircleX,
    ShieldAlert
} from "lucide-react";

import {
    getLogs
} from "../../services/log.service";

import socket
    from "../../services/socketService";

/*
|--------------------------------------------------------------------------
| Log Appearance
|--------------------------------------------------------------------------
*/

function getLogAppearance(
    level
) {

    const normalized =
        String(
            level || ""
        ).toUpperCase();

    switch (
        normalized
    ) {

        case "WARNING":

            return {

                icon:
                    TriangleAlert,

                color:
                    "text-amber-400",

                background:
                    "bg-amber-500/10"

            };

        case "ERROR":

            return {

                icon:
                    CircleX,

                color:
                    "text-red-400",

                background:
                    "bg-red-500/10"

            };

        case "CRITICAL":

            return {

                icon:
                    ShieldAlert,

                color:
                    "text-red-500",

                background:
                    "bg-red-500/10"

            };

        default:

            return {

                icon:
                    CircleCheck,

                color:
                    "text-emerald-400",

                background:
                    "bg-emerald-500/10"

            };

    }

}

/*
|--------------------------------------------------------------------------
| Format Time
|--------------------------------------------------------------------------
*/

function formatTime(
    value
) {

    if (
        !value
    ) {

        return "--:--:--";

    }

    const raw =
        String(
            value
        );

    /*
    |--------------------------------------------------------------------------
    | PostgreSQL UTC Timestamp Normalization
    |--------------------------------------------------------------------------
    */

    const normalized =
        raw &&
        !raw.endsWith("Z") &&
        !/[+-]\d{2}:\d{2}$/.test(
            raw
        )
            ? `${raw}Z`
            : raw;

    const date =
        new Date(
            normalized
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

/*
|--------------------------------------------------------------------------
| Logs Viewer
|--------------------------------------------------------------------------
*/

export default function LogsViewer() {

    const [logs, setLogs] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState(null);

    /*
    |--------------------------------------------------------------------------
    | Initial Logs
    |--------------------------------------------------------------------------
    */

    async function loadLogs() {

        try {

            setError(
                null
            );

            const data =
                await getLogs(
                    {

                        timeRange:
                            "1h",

                        limit:
                            20

                    }
                );

            setLogs(
                Array.isArray(
                    data
                )
                    ? data
                    : []
            );

        }

        catch (
            requestError
        ) {

            console.error(
                "Unable to load observability logs:",
                requestError
            );

            setError(
                "Unable to load recent logs."
            );

        }

        finally {

            setLoading(
                false
            );

        }

    }

    /*
    |--------------------------------------------------------------------------
    | Load + Live Socket Events
    |--------------------------------------------------------------------------
    */

    useEffect(
        () => {

            loadLogs();

            function handleLogEvent(
                log
            ) {

                setLogs(
                    currentLogs => {

                        if (
                            currentLogs.some(
                                item =>
                                    item.id ===
                                    log.id
                            )
                        ) {

                            return currentLogs;

                        }

                        return [
                            log,
                            ...currentLogs
                        ].slice(
                            0,
                            20
                        );

                    }
                );

            }

            socket.on(
                "log:event",
                handleLogEvent
            );

            return () => {

                socket.off(
                    "log:event",
                    handleLogEvent
                );

            };

        },
        []
    );

    /*
    |--------------------------------------------------------------------------
    | Page
    |--------------------------------------------------------------------------
    */

    return (

        <section className="overflow-hidden rounded-3xl border border-slate-800 bg-[#111827]">

            {/* Header */}

            <div className="flex flex-col gap-4 border-b border-slate-800 px-8 py-6 md:flex-row md:items-center md:justify-between">

                <div className="flex items-center gap-4">

                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10">

                        <FileText
                            size={24}
                            className="text-indigo-400"
                        />

                    </div>

                    <div>

                        <h2 className="text-2xl font-bold text-white">

                            Recent Logs

                        </h2>

                        <p className="mt-1 text-sm text-slate-400">

                            Latest events from the Minerva Sentinel logging pipeline.

                        </p>

                    </div>

                </div>

                <div className="flex items-center gap-3">

                    <span className="flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-400">

                        <span className="h-2 w-2 rounded-full bg-emerald-400" />

                        Live

                    </span>

                    <span className="rounded-full bg-indigo-500/10 px-4 py-2 text-sm font-semibold text-indigo-400">

                        {logs.length} Events

                    </span>

                </div>

            </div>

            {/* Error */}

            {
                error && (

                    <div className="border-b border-red-500/20 bg-red-500/10 px-8 py-4 text-red-300">

                        {error}

                    </div>

                )
            }

            {/* Loading */}

            {
                loading && (

                    <div className="bg-[#0B1220] px-8 py-16 text-center text-slate-500">

                        Loading recent logs...

                    </div>

                )
            }

            {/* Empty */}

            {
                !loading &&
                logs.length === 0 && (

                    <div className="bg-[#0B1220] px-8 py-16 text-center text-slate-500">

                        No recent logs available.

                    </div>

                )
            }

            {/* Logs */}

            {
                !loading &&
                logs.length > 0 && (

                    <div className="max-h-[500px] overflow-y-auto bg-[#0B1220]">

                        {
                            logs.map(
                                log => {

                                    const appearance =
                                        getLogAppearance(
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
                                                xl:flex-row
                                                xl:items-center
                                            "
                                        >

                                            {/* Time */}

                                            <span className="w-28 shrink-0 font-mono text-sm text-slate-500">

                                                {
                                                    formatTime(
                                                        log.created_at
                                                    )
                                                }

                                            </span>

                                            {/* Level */}

                                            <div className="w-36 shrink-0">

                                                <span
                                                    className={`
                                                        inline-flex
                                                        items-center
                                                        gap-2
                                                        rounded-full
                                                        px-3
                                                        py-1
                                                        text-xs
                                                        font-bold
                                                        ${appearance.background}
                                                        ${appearance.color}
                                                    `}
                                                >

                                                    <Icon
                                                        size={15}
                                                    />

                                                    {
                                                        log.level
                                                    }

                                                </span>

                                            </div>

                                            {/* Source */}

                                            <span className="w-44 shrink-0 font-semibold text-cyan-400">

                                                {
                                                    log.source
                                                }

                                            </span>

                                            {/* Message */}

                                            <span className="min-w-0 flex-1 break-words font-mono text-sm text-slate-300">

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