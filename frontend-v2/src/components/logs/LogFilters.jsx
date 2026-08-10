import {
    Search,
    Filter,
    Clock3,
    Download,
    RefreshCw
} from "lucide-react";

export default function LogFilters({

    searchQuery,
    setSearchQuery,

    levelFilter,
    setLevelFilter,

    timeRange,
    setTimeRange,

    onRefresh,
    refreshing,

    onExport

}) {

    return (

        <section className="rounded-3xl border border-slate-800 bg-[#111827] p-8">

            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

                <div>

                    <h2 className="text-3xl font-bold text-white">

                        Log Filters

                    </h2>

                    <p className="mt-2 text-slate-400">

                        Search, filter and export real Minerva Sentinel logs.

                    </p>

                </div>

                <button
                    type="button"
                    onClick={
                        onRefresh
                    }
                    disabled={
                        refreshing
                    }
                    className="
                        flex
                        items-center
                        gap-3
                        rounded-2xl
                        bg-gradient-to-r
                        from-indigo-600
                        to-purple-600
                        px-6
                        py-3
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
                            : "Refresh"
                    }

                </button>

            </div>

            <div className="mt-8 grid gap-5 lg:grid-cols-5">

                <div className="lg:col-span-2">

                    <label className="mb-2 block text-sm font-medium text-slate-400">

                        Search Logs

                    </label>

                    <div className="flex items-center rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3">

                        <Search
                            size={18}
                            className="text-slate-500"
                        />

                        <input
                            type="text"
                            value={
                                searchQuery
                            }
                            onChange={
                                event =>
                                    setSearchQuery(
                                        event.target.value
                                    )
                            }
                            placeholder="Search log messages or sources..."
                            className="
                                ml-3
                                w-full
                                bg-transparent
                                text-white
                                outline-none
                                placeholder:text-slate-500
                            "
                        />

                    </div>

                </div>

                <div>

                    <label className="mb-2 block text-sm font-medium text-slate-400">

                        Severity

                    </label>

                    <div className="flex items-center rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3">

                        <Filter
                            size={18}
                            className="text-slate-500"
                        />

                        <select
                            value={
                                levelFilter
                            }
                            onChange={
                                event =>
                                    setLevelFilter(
                                        event.target.value
                                    )
                            }
                            className="
                                ml-3
                                w-full
                                bg-transparent
                                text-white
                                outline-none
                            "
                        >

                            <option
                                value="All"
                                className="bg-slate-900"
                            >
                                All Levels
                            </option>

                            <option
                                value="INFO"
                                className="bg-slate-900"
                            >
                                INFO
                            </option>

                            <option
                                value="WARNING"
                                className="bg-slate-900"
                            >
                                WARNING
                            </option>

                            <option
                                value="ERROR"
                                className="bg-slate-900"
                            >
                                ERROR
                            </option>

                            <option
                                value="CRITICAL"
                                className="bg-slate-900"
                            >
                                CRITICAL
                            </option>

                        </select>

                    </div>

                </div>

                <div>

                    <label className="mb-2 block text-sm font-medium text-slate-400">

                        Time Range

                    </label>

                    <div className="flex items-center rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3">

                        <Clock3
                            size={18}
                            className="text-slate-500"
                        />

                        <select
                            value={
                                timeRange
                            }
                            onChange={
                                event =>
                                    setTimeRange(
                                        event.target.value
                                    )
                            }
                            className="
                                ml-3
                                w-full
                                bg-transparent
                                text-white
                                outline-none
                            "
                        >

                            <option
                                value="1h"
                                className="bg-slate-900"
                            >
                                Last Hour
                            </option>

                            <option
                                value="6h"
                                className="bg-slate-900"
                            >
                                Last 6 Hours
                            </option>

                            <option
                                value="24h"
                                className="bg-slate-900"
                            >
                                Last 24 Hours
                            </option>

                            <option
                                value="7d"
                                className="bg-slate-900"
                            >
                                Last 7 Days
                            </option>

                            <option
                                value="all"
                                className="bg-slate-900"
                            >
                                All Loaded
                            </option>

                        </select>

                    </div>

                </div>

                <div>

                    <label className="mb-2 block text-sm font-medium text-slate-400">

                        Export

                    </label>

                    <button
                        type="button"
                        onClick={
                            onExport
                        }
                        className="
                            flex
                            w-full
                            items-center
                            justify-center
                            gap-2
                            rounded-2xl
                            border
                            border-indigo-500/30
                            bg-indigo-500/10
                            px-4
                            py-3
                            font-semibold
                            text-indigo-400
                            transition
                            hover:bg-indigo-500/20
                        "
                    >

                        <Download
                            size={18}
                        />

                        Export CSV

                    </button>

                </div>

            </div>

        </section>

    );

}