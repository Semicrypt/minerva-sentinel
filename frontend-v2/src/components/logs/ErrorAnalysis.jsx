import {
    useCallback,
    useEffect,
    useMemo,
    useState
} from "react";

import {
    CircleX,
    TriangleAlert,
    ShieldAlert,
    CheckCircle2,
    TrendingUp
} from "lucide-react";

import {
    getLogs
} from "../../services/log.service";

import socket
    from "../../services/socketService";

/*
|--------------------------------------------------------------------------
| Level Appearance
|--------------------------------------------------------------------------
*/

function getLevelAppearance(
    level
) {

    const normalized =
        String(
            level || ""
        ).toUpperCase();

    if (
        normalized ===
        "CRITICAL"
    ) {

        return {

            icon:
                ShieldAlert,

            color:
                "text-red-500",

            background:
                "bg-red-500/10",

            label:
                "Critical"

        };

    }

    if (
        normalized ===
        "ERROR"
    ) {

        return {

            icon:
                CircleX,

            color:
                "text-red-400",

            background:
                "bg-red-500/10",

            label:
                "Error"

        };

    }

    return {

        icon:
            TriangleAlert,

        color:
            "text-amber-400",

        background:
            "bg-amber-500/10",

        label:
            "Warning"

    };

}

/*
|--------------------------------------------------------------------------
| Normalize Message For Grouping
|--------------------------------------------------------------------------
|
| Response durations change on every request, so:
|
| GET /api/example -> 401 (1.2 ms)
| GET /api/example -> 401 (2.5 ms)
|
| should count as the same recurring issue.
|--------------------------------------------------------------------------
*/

function normalizeMessage(
    message
) {

    return String(
        message || "Unknown event"
    )
        .replace(
            /\(\d+(\.\d+)?\s*ms\)/gi,
            "(response time)"
        )
        .trim();

}

/*
|--------------------------------------------------------------------------
| Format Relative Time
|--------------------------------------------------------------------------
*/

function formatRelativeTime(
    value
) {

    if (
        !value
    ) {

        return "Unknown";

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

        return "Unknown";

    }

    const differenceSeconds =
        Math.max(
            0,
            Math.floor(
                (
                    Date.now() -
                    date.getTime()
                ) /
                1000
            )
        );

    if (
        differenceSeconds <
        60
    ) {

        return `${differenceSeconds}s ago`;

    }

    const minutes =
        Math.floor(
            differenceSeconds /
            60
        );

    if (
        minutes <
        60
    ) {

        return `${minutes} min ago`;

    }

    const hours =
        Math.floor(
            minutes /
            60
        );

    if (
        hours <
        24
    ) {

        return `${hours} hr ago`;

    }

    const days =
        Math.floor(
            hours /
            24
        );

    return `${days} day${days === 1 ? "" : "s"} ago`;

}

/*
|--------------------------------------------------------------------------
| Error Analysis
|--------------------------------------------------------------------------
*/

export default function ErrorAnalysis() {

    const [events, setEvents] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState(null);

    /*
    |--------------------------------------------------------------------------
    | Load Real Problem Events
    |--------------------------------------------------------------------------
    */

    const loadEvents =
        useCallback(
            async () => {

                try {

                    setError(
                        null
                    );

                    const [
                        warningLogs,
                        errorLogs,
                        criticalLogs
                    ] =
                        await Promise.all(
                            [

                                getLogs(
                                    {
                                        level:
                                            "WARNING",

                                        timeRange:
                                            "24h",

                                        limit:
                                            500
                                    }
                                ),

                                getLogs(
                                    {
                                        level:
                                            "ERROR",

                                        timeRange:
                                            "24h",

                                        limit:
                                            500
                                    }
                                ),

                                getLogs(
                                    {
                                        level:
                                            "CRITICAL",

                                        timeRange:
                                            "24h",

                                        limit:
                                            500
                                    }
                                )

                            ]
                        );

                    const combined =
                        [
                            ...(
                                Array.isArray(
                                    warningLogs
                                )
                                    ? warningLogs
                                    : []
                            ),

                            ...(
                                Array.isArray(
                                    errorLogs
                                )
                                    ? errorLogs
                                    : []
                            ),

                            ...(
                                Array.isArray(
                                    criticalLogs
                                )
                                    ? criticalLogs
                                    : []
                            )
                        ];

                    combined.sort(
                        (
                            a,
                            b
                        ) =>
                            Number(
                                b.id || 0
                            ) -
                            Number(
                                a.id || 0
                            )
                    );

                    setEvents(
                        combined
                    );

                }

                catch (
                    requestError
                ) {

                    console.error(
                        "Unable to load error analysis:",
                        requestError
                    );

                    setError(
                        "Unable to load error analysis."
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

            loadEvents();

        },
        [
            loadEvents
        ]
    );

    /*
    |--------------------------------------------------------------------------
    | Live Problem Events
    |--------------------------------------------------------------------------
    */

    useEffect(
        () => {

            function handleLogEvent(
                log
            ) {

                const level =
                    String(
                        log.level || ""
                    ).toUpperCase();

                if (
                    ![
                        "WARNING",
                        "ERROR",
                        "CRITICAL"
                    ].includes(
                        level
                    )
                ) {

                    return;

                }

                setEvents(
                    currentEvents => {

                        if (
                            currentEvents.some(
                                item =>
                                    item.id ===
                                    log.id
                            )
                        ) {

                            return currentEvents;

                        }

                        return [
                            log,
                            ...currentEvents
                        ].slice(
                            0,
                            1500
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
    | Group Recurring Problems
    |--------------------------------------------------------------------------
    */

    const groupedEvents =
        useMemo(
            () => {

                const groups =
                    new Map();

                events.forEach(
                    event => {

                        const normalizedMessage =
                            normalizeMessage(
                                event.message
                            );

                        const key =
                            [
                                event.level,
                                event.source,
                                normalizedMessage
                            ].join(
                                "::"
                            );

                        if (
                            !groups.has(
                                key
                            )
                        ) {

                            groups.set(
                                key,
                                {

                                    key,

                                    level:
                                        event.level,

                                    source:
                                        event.source,

                                    message:
                                        normalizedMessage,

                                    occurrences:
                                        0,

                                    lastSeen:
                                        event.created_at,

                                    latestId:
                                        event.id

                                }
                            );

                        }

                        const group =
                            groups.get(
                                key
                            );

                        group.occurrences +=
                            1;

                        if (
                            Number(
                                event.id
                            ) >
                            Number(
                                group.latestId
                            )
                        ) {

                            group.latestId =
                                event.id;

                            group.lastSeen =
                                event.created_at;

                        }

                    }
                );

                return Array.from(
                    groups.values()
                )
                    .sort(
                        (
                            a,
                            b
                        ) =>
                            Number(
                                b.latestId
                            ) -
                            Number(
                                a.latestId
                            )
                    )
                    .slice(
                        0,
                        10
                    );

            },
            [
                events
            ]
        );

    /*
    |--------------------------------------------------------------------------
    | Event Totals
    |--------------------------------------------------------------------------
    */

    const totals =
        useMemo(
            () => {

                return events.reduce(
                    (
                        accumulator,
                        event
                    ) => {

                        const level =
                            String(
                                event.level || ""
                            ).toUpperCase();

                        accumulator.total +=
                            1;

                        if (
                            level ===
                            "WARNING"
                        ) {

                            accumulator.warnings +=
                                1;

                        }

                        if (
                            level ===
                            "ERROR"
                        ) {

                            accumulator.errors +=
                                1;

                        }

                        if (
                            level ===
                            "CRITICAL"
                        ) {

                            accumulator.critical +=
                                1;

                        }

                        return accumulator;

                    },
                    {

                        total:
                            0,

                        warnings:
                            0,

                        errors:
                            0,

                        critical:
                            0

                    }
                );

            },
            [
                events
            ]
        );

    return (

        <section className="rounded-3xl border border-slate-800 bg-[#111827] p-8">

            {/* Header */}

            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                <div>

                    <h2 className="text-3xl font-bold text-white">

                        Error Analysis

                    </h2>

                    <p className="mt-2 text-slate-400">

                        Real warnings, errors and critical events detected during the last 24 hours.

                    </p>

                </div>

                <span
                    className={`
                        rounded-full
                        px-4
                        py-2
                        text-sm
                        font-semibold
                        ${
                            totals.total > 0
                                ? "bg-red-500/10 text-red-400"
                                : "bg-emerald-500/10 text-emerald-400"
                        }
                    `}
                >

                    {
                        loading
                            ? "Loading..."
                            : `${totals.total} Problem Events`
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

                        Loading real error data...

                    </div>

                )
            }

            {/* Healthy State */}

            {
                !loading &&
                groupedEvents.length ===
                    0 && (

                    <div className="mt-8 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-8">

                        <div className="flex items-center gap-4">

                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10">

                                <CheckCircle2
                                    size={28}
                                    className="text-emerald-400"
                                />

                            </div>

                            <div>

                                <h3 className="text-lg font-bold text-white">

                                    No Problems Detected

                                </h3>

                                <p className="mt-1 text-slate-400">

                                    No warning, error or critical events were recorded during the selected analysis period.

                                </p>

                            </div>

                        </div>

                    </div>

                )
            }

            {/* Grouped Problems */}

            {
                !loading &&
                groupedEvents.length >
                    0 && (

                    <div className="mt-8 space-y-5">

                        {
                            groupedEvents.map(
                                event => {

                                    const appearance =
                                        getLevelAppearance(
                                            event.level
                                        );

                                    const Icon =
                                        appearance.icon;

                                    return (

                                        <div
                                            key={
                                                event.key
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

                                                <div className="flex min-w-0 items-start gap-5">

                                                    <div
                                                        className={`
                                                            flex
                                                            h-14
                                                            w-14
                                                            shrink-0
                                                            items-center
                                                            justify-center
                                                            rounded-2xl
                                                            ${appearance.background}
                                                        `}
                                                    >

                                                        <Icon
                                                            size={28}
                                                            className={
                                                                appearance.color
                                                            }
                                                        />

                                                    </div>

                                                    <div className="min-w-0">

                                                        <div className="flex flex-wrap items-center gap-3">

                                                            <h3 className="font-bold text-white">

                                                                {
                                                                    event.source
                                                                }

                                                            </h3>

                                                            <span
                                                                className={`
                                                                    rounded-full
                                                                    px-3
                                                                    py-1
                                                                    text-xs
                                                                    font-bold
                                                                    ${appearance.background}
                                                                    ${appearance.color}
                                                                `}
                                                            >

                                                                {
                                                                    String(
                                                                        event.level
                                                                    ).toUpperCase()
                                                                }

                                                            </span>

                                                        </div>

                                                        <p className="mt-3 break-words text-slate-300">

                                                            {
                                                                event.message
                                                            }

                                                        </p>

                                                        <p className="mt-2 text-sm text-slate-500">

                                                            Last seen{" "}

                                                            {
                                                                formatRelativeTime(
                                                                    event.lastSeen
                                                                )
                                                            }

                                                        </p>

                                                    </div>

                                                </div>

                                                <div className="grid shrink-0 grid-cols-2 gap-8">

                                                    <div>

                                                        <p className="text-sm text-slate-500">

                                                            Occurrences

                                                        </p>

                                                        <p className="mt-1 text-xl font-bold text-white">

                                                            {
                                                                event.occurrences
                                                            }

                                                        </p>

                                                    </div>

                                                    <div>

                                                        <p className="text-sm text-slate-500">

                                                            Severity

                                                        </p>

                                                        <p
                                                            className={`mt-1 font-bold ${appearance.color}`}
                                                        >

                                                            {
                                                                appearance.label
                                                            }

                                                        </p>

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

            {/* Real Event Summary */}

            <div className="mt-10 rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-6">

                <div className="flex items-center gap-3">

                    <TrendingUp
                        size={24}
                        className="text-indigo-400"
                    />

                    <h3 className="text-xl font-bold text-white">

                        24-Hour Event Summary

                    </h3>

                </div>

                <div className="mt-6 grid gap-6 md:grid-cols-4">

                    <div>

                        <p className="text-sm text-slate-500">

                            Problem Events

                        </p>

                        <p className="mt-2 text-3xl font-black text-white">

                            {
                                totals.total
                            }

                        </p>

                    </div>

                    <div>

                        <p className="text-sm text-slate-500">

                            Warnings

                        </p>

                        <p className="mt-2 text-3xl font-black text-amber-400">

                            {
                                totals.warnings
                            }

                        </p>

                    </div>

                    <div>

                        <p className="text-sm text-slate-500">

                            Errors

                        </p>

                        <p className="mt-2 text-3xl font-black text-red-400">

                            {
                                totals.errors
                            }

                        </p>

                    </div>

                    <div>

                        <p className="text-sm text-slate-500">

                            Critical

                        </p>

                        <p className="mt-2 text-3xl font-black text-red-500">

                            {
                                totals.critical
                            }

                        </p>

                    </div>

                </div>

            </div>

        </section>

    );

}