import {
    useCallback,
    useEffect,
    useState
} from "react";

import {
    Server,
    Globe2,
    Database,
    Boxes,
    Activity,
    CheckCircle2,
    TriangleAlert
} from "lucide-react";

import {
    getLogSources,
    getLogs
} from "../../services/log.service";

import socket
    from "../../services/socketService";

/*
|--------------------------------------------------------------------------
| Source Icon
|--------------------------------------------------------------------------
*/

function getSourceIcon(
    source
) {

    const normalized =
        String(
            source || ""
        ).toLowerCase();

    if (
        normalized.includes(
            "docker"
        )
    ) {

        return Boxes;

    }

    if (
        normalized.includes(
            "postgres"
        ) ||
        normalized.includes(
            "database"
        )
    ) {

        return Database;

    }

    if (
        normalized.includes(
            "http"
        ) ||
        normalized.includes(
            "api"
        )
    ) {

        return Globe2;

    }

    if (
        normalized.includes(
            "monitor"
        )
    ) {

        return Activity;

    }

    return Server;

}

/*
|--------------------------------------------------------------------------
| Source Color
|--------------------------------------------------------------------------
*/

function getSourceColor(
    source
) {

    const normalized =
        String(
            source || ""
        ).toLowerCase();

    if (
        normalized.includes(
            "docker"
        )
    ) {

        return "text-cyan-400";

    }

    if (
        normalized.includes(
            "http"
        ) ||
        normalized.includes(
            "api"
        )
    ) {

        return "text-blue-400";

    }

    if (
        normalized.includes(
            "database"
        ) ||
        normalized.includes(
            "postgres"
        )
    ) {

        return "text-orange-400";

    }

    if (
        normalized.includes(
            "monitor"
        )
    ) {

        return "text-indigo-400";

    }

    return "text-emerald-400";

}

/*
|--------------------------------------------------------------------------
| Determine Primary Level
|--------------------------------------------------------------------------
*/

function determinePrimaryLevel(
    logs
) {

    if (
        !Array.isArray(logs) ||
        logs.length === 0
    ) {

        return "NONE";

    }

    const counts =
        {

            INFO:
                0,

            WARNING:
                0,

            ERROR:
                0,

            CRITICAL:
                0

        };

    logs.forEach(
        log => {

            const level =
                String(
                    log.level || ""
                ).toUpperCase();

            if (
                Object.prototype.hasOwnProperty.call(
                    counts,
                    level
                )
            ) {

                counts[
                    level
                ] += 1;

            }

        }
    );

    return Object.entries(
        counts
    )
        .sort(
            (
                a,
                b
            ) =>
                b[1] -
                a[1]
        )[0][0];

}

/*
|--------------------------------------------------------------------------
| Health From Recent Logs
|--------------------------------------------------------------------------
*/

function determineSourceHealth(
    logs
) {

    if (
        !Array.isArray(logs) ||
        logs.length === 0
    ) {

        return {

            status:
                "No Data",

            color:
                "text-slate-400",

            icon:
                TriangleAlert

        };

    }

    const hasCritical =
        logs.some(
            log =>
                String(
                    log.level
                ).toUpperCase() ===
                "CRITICAL"
        );

    if (
        hasCritical
    ) {

        return {

            status:
                "Critical",

            color:
                "text-red-500",

            icon:
                TriangleAlert

        };

    }

    const hasError =
        logs.some(
            log =>
                String(
                    log.level
                ).toUpperCase() ===
                "ERROR"
        );

    if (
        hasError
    ) {

        return {

            status:
                "Attention",

            color:
                "text-red-400",

            icon:
                TriangleAlert

        };

    }

    const hasWarning =
        logs.some(
            log =>
                String(
                    log.level
                ).toUpperCase() ===
                "WARNING"
        );

    if (
        hasWarning
    ) {

        return {

            status:
                "Monitoring",

            color:
                "text-amber-400",

            icon:
                TriangleAlert

        };

    }

    return {

        status:
            "Healthy",

        color:
            "text-emerald-400",

        icon:
            CheckCircle2

    };

}

/*
|--------------------------------------------------------------------------
| Format Last Seen
|--------------------------------------------------------------------------
*/

function formatLastSeen(
    value
) {

    if (
        !value
    ) {

        return "--";

    }

    const raw =
        String(
            value
        );

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

        return "--";

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
| Service Logs
|--------------------------------------------------------------------------
*/

export default function ServiceLogs() {

    const [
        sources,
        setSources
    ] =
        useState([]);

    const [
        loading,
        setLoading
    ] =
        useState(true);

    const [
        error,
        setError
    ] =
        useState(null);

    /*
    |--------------------------------------------------------------------------
    | Load Sources
    |--------------------------------------------------------------------------
    */

    const loadSources =
        useCallback(
            async () => {

                try {

                    setError(
                        null
                    );

                    const sourceData =
                        await getLogSources();

                    if (
                        !Array.isArray(
                            sourceData
                        )
                    ) {

                        setSources(
                            []
                        );

                        return;

                    }

                    /*
                    |--------------------------------------------------------------------------
                    | Enrich Each Source With Recent Logs
                    |--------------------------------------------------------------------------
                    */

                    const enriched =
                        await Promise.all(

                            sourceData.map(
                                async source => {

                                    try {

                                        const recentLogs =
                                            await getLogs(
                                                {

                                                    source:
                                                        source.source,

                                                    limit:
                                                        100

                                                }
                                            );

                                        const logs =
                                            Array.isArray(
                                                recentLogs
                                            )
                                                ? recentLogs
                                                : [];

                                        const latest =
                                            logs.length >
                                            0
                                                ? logs[0]
                                                : null;

                                        return {

                                            source:
                                                source.source,

                                            count:
                                                Number(
                                                    source.count ||
                                                    0
                                                ),

                                            primaryLevel:
                                                determinePrimaryLevel(
                                                    logs
                                                ),

                                            health:
                                                determineSourceHealth(
                                                    logs
                                                ),

                                            lastSeen:
                                                latest
                                                    ? latest.created_at
                                                    : null

                                        };

                                    }

                                    catch (
                                        sourceError
                                    ) {

                                        console.error(
                                            `Unable to load source ${source.source}:`,
                                            sourceError
                                        );

                                        return {

                                            source:
                                                source.source,

                                            count:
                                                Number(
                                                    source.count ||
                                                    0
                                                ),

                                            primaryLevel:
                                                "UNKNOWN",

                                            health:
                                                {

                                                    status:
                                                        "Unknown",

                                                    color:
                                                        "text-slate-400",

                                                    icon:
                                                        TriangleAlert

                                                },

                                            lastSeen:
                                                null

                                        };

                                    }

                                }
                            )

                        );

                    setSources(
                        enriched
                    );

                }

                catch (
                    requestError
                ) {

                    console.error(
                        "Unable to load log sources:",
                        requestError
                    );

                    setError(
                        "Unable to load log sources."
                    );

                }

                finally {

                    setLoading(
                        false
                    );

                }

            },
            []
        );

    /*
    |--------------------------------------------------------------------------
    | Initial Load
    |--------------------------------------------------------------------------
    */

    useEffect(
        () => {

            loadSources();

        },
        [
            loadSources
        ]
    );

    /*
    |--------------------------------------------------------------------------
    | Live Refresh
    |--------------------------------------------------------------------------
    |
    | A new log may introduce a new source or change its health/count.
    |--------------------------------------------------------------------------
    */

    useEffect(
        () => {

            let refreshTimer =
                null;

            function handleLogEvent() {

                if (
                    refreshTimer
                ) {

                    clearTimeout(
                        refreshTimer
                    );

                }

                refreshTimer =
                    setTimeout(
                        () => {

                            loadSources();

                        },
                        500
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

                if (
                    refreshTimer
                ) {

                    clearTimeout(
                        refreshTimer
                    );

                }

            };

        },
        [
            loadSources
        ]
    );

    /*
    |--------------------------------------------------------------------------
    | Page
    |--------------------------------------------------------------------------
    */

    return (

        <section className="rounded-3xl border border-slate-800 bg-[#111827] p-8">

            {/* Header */}

            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                <div>

                    <h2 className="text-3xl font-bold text-white">

                        Service Log Sources

                    </h2>

                    <p className="mt-2 text-slate-400">

                        Real log volume and health across active Minerva Sentinel sources.

                    </p>

                </div>

                <span className="rounded-full bg-indigo-500/10 px-4 py-2 text-sm font-semibold text-indigo-400">

                    {
                        loading
                            ? "Loading..."
                            : `${sources.length} Sources`
                    }

                </span>

            </div>

            {/* Error */}

            {
                error && (

                    <div className="mt-6 rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-red-300">

                        {error}

                    </div>

                )
            }

            {/* Loading */}

            {
                loading && (

                    <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/40 py-16 text-center text-slate-500">

                        Loading log sources...

                    </div>

                )
            }

            {/* Empty */}

            {
                !loading &&
                sources.length ===
                    0 && (

                    <div className="mt-8 rounded-2xl border border-dashed border-slate-800 py-16 text-center text-slate-500">

                        No log sources have reported events yet.

                    </div>

                )
            }

            {/* Sources */}

            {
                !loading &&
                sources.length >
                    0 && (

                    <div className="mt-8 space-y-5">

                        {
                            sources.map(
                                source => {

                                    const Icon =
                                        getSourceIcon(
                                            source.source
                                        );

                                    const sourceColor =
                                        getSourceColor(
                                            source.source
                                        );

                                    const HealthIcon =
                                        source.health.icon;

                                    return (

                                        <div
                                            key={
                                                source.source
                                            }
                                            className="
                                                rounded-2xl
                                                border
                                                border-slate-800
                                                bg-slate-900/40
                                                p-6
                                                transition
                                                hover:border-indigo-500/30
                                            "
                                        >

                                            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

                                                {/* Source */}

                                                <div className="flex items-center gap-5">

                                                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-800">

                                                        <Icon
                                                            size={28}
                                                            className={
                                                                sourceColor
                                                            }
                                                        />

                                                    </div>

                                                    <div>

                                                        <h3 className="text-lg font-bold text-white">

                                                            {
                                                                source.source
                                                            }

                                                        </h3>

                                                        <p className="mt-2 text-sm text-slate-400">

                                                            Last event:{" "}

                                                            {
                                                                formatLastSeen(
                                                                    source.lastSeen
                                                                )
                                                            }

                                                        </p>

                                                    </div>

                                                </div>

                                                {/* Metrics */}

                                                <div className="grid grid-cols-3 gap-8">

                                                    <div>

                                                        <p className="text-sm text-slate-500">

                                                            Log Entries

                                                        </p>

                                                        <p className="mt-1 font-semibold text-white">

                                                            {
                                                                source.count.toLocaleString()
                                                            }

                                                        </p>

                                                    </div>

                                                    <div>

                                                        <p className="text-sm text-slate-500">

                                                            Primary Level

                                                        </p>

                                                        <p className={`mt-1 font-semibold ${sourceColor}`}>

                                                            {
                                                                source.primaryLevel
                                                            }

                                                        </p>

                                                    </div>

                                                    <div>

                                                        <p className="text-sm text-slate-500">

                                                            Status

                                                        </p>

                                                        <div className="mt-1 flex items-center gap-2">

                                                            <HealthIcon
                                                                size={18}
                                                                className={
                                                                    source.health.color
                                                                }
                                                            />

                                                            <span
                                                                className={`font-semibold ${source.health.color}`}
                                                            >

                                                                {
                                                                    source.health.status
                                                                }

                                                            </span>

                                                        </div>

                                                    </div>

                                                </div>

                                            </div>

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