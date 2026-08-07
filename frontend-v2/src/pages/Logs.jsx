import {
    useCallback,
    useEffect,
    useState
} from "react";

import DashboardLayout from "../layouts/DashboardLayout";

import LogsHeader from "../components/logs/LogsHeader";
import LogsOverview from "../components/logs/LogsOverview";
import LogFilters from "../components/logs/LogFilters";
import LiveLogStream from "../components/logs/LiveLogStream";
import ErrorAnalysis from "../components/logs/ErrorAnalysis";
import ServiceLogs from "../components/logs/ServiceLogs";
import LogsArchitecture from "../components/logs/LogsArchitecture";

import {
    getLogs,
    getLogStats
} from "../services/log.service";

import socket from "../services/socketService";

export default function Logs() {

    const [logs, setLogs] =
        useState([]);

    const [stats, setStats] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [refreshing, setRefreshing] =
        useState(false);

    const [error, setError] =
        useState(null);

    const [searchQuery, setSearchQuery] =
        useState("");

    const [levelFilter, setLevelFilter] =
        useState("All");

    const [timeRange, setTimeRange] =
        useState("1h");

    /*
    |--------------------------------------------------------------------------
    | Load Logs
    |--------------------------------------------------------------------------
    */

    const loadLogs =
        useCallback(
            async (
                showRefreshState = false
            ) => {

                try {

                    if (
                        showRefreshState
                    ) {

                        setRefreshing(
                            true
                        );

                    }

                    setError(
                        null
                    );

                    const [
                        logData,
                        statsData
                    ] =
                        await Promise.all(
                            [

                                getLogs(
                                    {

                                        search:
                                            searchQuery ||
                                            undefined,

                                        level:
                                            levelFilter !== "All"
                                                ? levelFilter
                                                : undefined,

                                        timeRange:
                                            timeRange,

                                        limit:
                                            200

                                    }
                                ),

                                getLogStats()

                            ]
                        );

                    setLogs(
                        Array.isArray(
                            logData
                        )
                            ? logData
                            : []
                    );

                    setStats(
                        statsData
                    );

                }

                catch (
                    requestError
                ) {

                    console.error(
                        "Unable to load logs:",
                        requestError
                    );

                    setError(
                        "Unable to load logs."
                    );

                }

                finally {

                    setLoading(
                        false
                    );

                    setRefreshing(
                        false
                    );

                }

            },
            [
                searchQuery,
                levelFilter,
                timeRange
            ]
        );

    /*
    |--------------------------------------------------------------------------
    | Initial Load + Filter Changes
    |--------------------------------------------------------------------------
    */

    useEffect(
        () => {

            const timeout =
                setTimeout(
                    () => {

                        loadLogs();

                    },
                    250
                );

            return () =>
                clearTimeout(
                    timeout
                );

        },
        [
            loadLogs
        ]
    );

    /*
    |--------------------------------------------------------------------------
    | Real-time Log Events
    |--------------------------------------------------------------------------
    */

    useEffect(
        () => {

            function handleLogEvent(
                log
            ) {

                const level =
                    String(
                        log.level ||
                        ""
                    ).toUpperCase();

                const matchesLevel =

                    levelFilter ===
                        "All" ||

                    level ===
                        levelFilter.toUpperCase();

                const search =
                    searchQuery
                        .trim()
                        .toLowerCase();

                const matchesSearch =

                    !search ||

                    String(
                        log.message ||
                        ""
                    )
                        .toLowerCase()
                        .includes(
                            search
                        ) ||

                    String(
                        log.source ||
                        ""
                    )
                        .toLowerCase()
                        .includes(
                            search
                        );

                if (
                    matchesLevel &&
                    matchesSearch
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
                                200
                            );

                        }
                    );

                }

                setStats(
                    currentStats => {

                        if (
                            !currentStats
                        ) {

                            return currentStats;

                        }

                        const next =
                            {
                                ...currentStats,

                                total:
                                    Number(
                                        currentStats.total ||
                                        0
                                    ) + 1,

                                last_hour:
                                    Number(
                                        currentStats.last_hour ||
                                        0
                                    ) + 1,

                                last_minute:
                                    Number(
                                        currentStats.last_minute ||
                                        0
                                    ) + 1
                            };

                        if (
                            level ===
                            "INFO"
                        ) {

                            next.info =
                                Number(
                                    currentStats.info ||
                                    0
                                ) + 1;

                        }

                        if (
                            level ===
                            "WARNING"
                        ) {

                            next.warnings =
                                Number(
                                    currentStats.warnings ||
                                    0
                                ) + 1;

                        }

                        if (
                            level ===
                            "ERROR"
                        ) {

                            next.errors =
                                Number(
                                    currentStats.errors ||
                                    0
                                ) + 1;

                        }

                        if (
                            level ===
                            "CRITICAL"
                        ) {

                            next.critical =
                                Number(
                                    currentStats.critical ||
                                    0
                                ) + 1;

                        }

                        return next;

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
        [
            searchQuery,
            levelFilter
        ]
    );

    /*
    |--------------------------------------------------------------------------
    | Backend Already Filters Time Range
    |--------------------------------------------------------------------------
    */

    const filteredLogs =
        logs;

    /*
    |--------------------------------------------------------------------------
    | Export Logs
    |--------------------------------------------------------------------------
    */

    function handleExport() {

        if (
            filteredLogs.length ===
            0
        ) {

            alert(
                "There are no logs to export."
            );

            return;

        }

        const header =
            [
                "Time",
                "Level",
                "Source",
                "Message"
            ];

        const rows =
            filteredLogs.map(
                log => [

                    log.created_at,

                    log.level,

                    log.source,

                    log.message

                ]
            );

        const escapeCsv =
            value => {

                const text =
                    String(
                        value ??
                        ""
                    );

                return `"${text.replace(
                    /"/g,
                    '""'
                )}"`;

            };

        const csv =
            [
                header,
                ...rows
            ]
                .map(
                    row =>
                        row
                            .map(
                                escapeCsv
                            )
                            .join(
                                ","
                            )
                )
                .join(
                    "\n"
                );

        const blob =
            new Blob(
                [
                    csv
                ],
                {
                    type:
                        "text/csv;charset=utf-8"
                }
            );

        const url =
            URL.createObjectURL(
                blob
            );

        const link =
            document.createElement(
                "a"
            );

        link.href =
            url;

        link.download =
            `minerva-logs-${new Date()
                .toISOString()
                .replace(
                    /[:.]/g,
                    "-"
                )}.csv`;

        document.body.appendChild(
            link
        );

        link.click();

        link.remove();

        URL.revokeObjectURL(
            url
        );

    }

    /*
    |--------------------------------------------------------------------------
    | Page
    |--------------------------------------------------------------------------
    */

    return (

        <DashboardLayout>

            <div className="space-y-8">

                <LogsHeader />

                <LogsOverview
                    stats={
                        stats
                    }
                    loading={
                        loading
                    }
                />

                <LogFilters
                    searchQuery={
                        searchQuery
                    }
                    setSearchQuery={
                        setSearchQuery
                    }
                    levelFilter={
                        levelFilter
                    }
                    setLevelFilter={
                        setLevelFilter
                    }
                    timeRange={
                        timeRange
                    }
                    setTimeRange={
                        setTimeRange
                    }
                    onRefresh={
                        () =>
                            loadLogs(
                                true
                            )
                    }
                    refreshing={
                        refreshing
                    }
                    onExport={
                        handleExport
                    }
                />

                {
                    error && (

                        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-6 py-4 text-red-300">

                            {error}

                        </div>

                    )
                }

                <LiveLogStream
                    logs={
                        filteredLogs
                    }
                    loading={
                        loading
                    }
                />

                <ErrorAnalysis />

                <ServiceLogs />

                <LogsArchitecture />

            </div>

        </DashboardLayout>

    );

}