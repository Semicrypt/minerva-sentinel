import {
    AlertCircle,
    Bell,
    CheckCircle2,
    FileSearch,
    RefreshCw,
    UserCheck,
    Wrench
} from "lucide-react";

import {
    useCallback,
    useEffect,
    useState
} from "react";

import api from "../../services/api";

const eventStyles = {
    DETECTED: {
        title: "Incident Detected",
        icon: Bell,
        iconColor: "text-red-400",
        iconBackground: "bg-red-500/10",
        lineColor: "bg-red-500/40"
    },

    ACKNOWLEDGED: {
        title: "Incident Acknowledged",
        icon: UserCheck,
        iconColor: "text-cyan-400",
        iconBackground: "bg-cyan-500/10",
        lineColor: "bg-cyan-500/40"
    },

    RESOLVED: {
        title: "Incident Resolved",
        icon: CheckCircle2,
        iconColor: "text-emerald-400",
        iconBackground: "bg-emerald-500/10",
        lineColor: "bg-emerald-500/40"
    },

    ROOT_CAUSE_ADDED: {
        title: "Root Cause Recorded",
        icon: FileSearch,
        iconColor: "text-violet-400",
        iconBackground: "bg-violet-500/10",
        lineColor: "bg-violet-500/40"
    },

    REMEDIATION_ADDED: {
        title: "Remediation Recorded",
        icon: Wrench,
        iconColor: "text-amber-400",
        iconBackground: "bg-amber-500/10",
        lineColor: "bg-amber-500/40"
    }
};

const defaultEventStyle = {
    title: "Incident Activity",
    icon: AlertCircle,
    iconColor: "text-slate-300",
    iconBackground: "bg-slate-700/50",
    lineColor: "bg-slate-700"
};

function wait(milliseconds) {
    return new Promise(resolve => {
        window.setTimeout(resolve, milliseconds);
    });
}

function getEventDescription(event) {
    if (event.details) {
        return event.details;
    }

    switch (event.eventType) {
        case "DETECTED":
            return (
                event.incidentDescription ||
                "No additional detection details were recorded."
            );

        case "ACKNOWLEDGED":
            return "The incident was acknowledged.";

        case "RESOLVED":
            return "The incident was marked as resolved.";

        case "ROOT_CAUSE_ADDED":
            return "No additional root-cause details were recorded.";

        case "REMEDIATION_ADDED":
            return "No additional remediation details were recorded.";

        default:
            return "No additional activity details were recorded.";
    }
}

function getValidDate(value) {
    const date = new Date(value);

    return Number.isNaN(date.getTime())
        ? null
        : date;
}

function formatEventDate(value) {
    const date = getValidDate(value);

    if (!date) {
        return "Date unavailable";
    }

    return new Intl.DateTimeFormat(
        undefined,
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    ).format(date);
}

function formatEventTime(value) {
    const date = getValidDate(value);

    if (!date) {
        return "Time unavailable";
    }

    return new Intl.DateTimeFormat(
        undefined,
        {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        }
    ).format(date);
}

function formatRefreshTime(value) {
    if (!value) {
        return "";
    }

    return new Intl.DateTimeFormat(
        undefined,
        {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        }
    ).format(value);
}

export default function AlertTimeline() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] =
        useState(false);
    const [error, setError] = useState("");
    const [lastUpdated, setLastUpdated] =
        useState(null);

    const loadTimeline = useCallback(
        async (manualRefresh = false) => {
            const refreshStartedAt = Date.now();

            if (manualRefresh) {
                setRefreshing(true);
            }

            try {
                setError("");

                const response = await api.get(
                    "/incidents/timeline"
                );

                const timelineEvents =
                    Array.isArray(response.data?.data)
                        ? response.data.data
                        : [];

                setEvents(timelineEvents);
                setLastUpdated(new Date());
            } catch (requestError) {
                console.error(
                    "Unable to load incident timeline:",
                    requestError
                );

                setError(
                    requestError.response?.data?.message ||
                    "Unable to load the incident timeline."
                );
            } finally {
                if (manualRefresh) {
                    const elapsed =
                        Date.now() - refreshStartedAt;

                    const remaining =
                        Math.max(0, 600 - elapsed);

                    if (remaining > 0) {
                        await wait(remaining);
                    }
                }

                setLoading(false);
                setRefreshing(false);
            }
        },
        []
    );

    useEffect(() => {
        loadTimeline();

        const handleIncidentUpdate = () => {
            loadTimeline();
        };

        window.addEventListener(
            "minerva:incidents-updated",
            handleIncidentUpdate
        );

        return () => {
            window.removeEventListener(
                "minerva:incidents-updated",
                handleIncidentUpdate
            );
        };
    }, [loadTimeline]);

    return (
        <section className="rounded-3xl border border-slate-800 bg-[#111827] p-6 sm:p-8">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-white">
                        Incident Timeline
                    </h2>

                    <p className="mt-2 text-slate-400">
                        Persisted detection,
                        acknowledgement, resolution,
                        root-cause and remediation activity.
                    </p>

                    {!loading && !error && (
                        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500">
                            <span>
                                {events.length} recorded{" "}
                                {events.length === 1
                                    ? "event"
                                    : "events"}
                            </span>

                            {lastUpdated && (
                                <span>
                                    Last refreshed at{" "}
                                    {formatRefreshTime(
                                        lastUpdated
                                    )}
                                </span>
                            )}
                        </div>
                    )}
                </div>

                <button
                    type="button"
                    onClick={() => loadTimeline(true)}
                    disabled={loading || refreshing}
                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 font-semibold text-slate-200 transition hover:border-cyan-500/60 hover:text-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    <RefreshCw
                        size={18}
                        className={
                            refreshing
                                ? "animate-spin"
                                : ""
                        }
                    />

                    {refreshing
                        ? "Refreshing..."
                        : "Refresh Timeline"}
                </button>
            </div>

            {loading && (
                <div className="space-y-4">
                    {[1, 2, 3].map(item => (
                        <div
                            key={item}
                            className="h-28 animate-pulse rounded-2xl border border-slate-800 bg-slate-900/50"
                        />
                    ))}
                </div>
            )}

            {!loading && error && (
                <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6">
                    <div className="flex items-start gap-3">
                        <AlertCircle
                            size={22}
                            className="mt-0.5 shrink-0 text-red-400"
                        />

                        <div>
                            <h3 className="font-semibold text-red-300">
                                Timeline unavailable
                            </h3>

                            <p className="mt-1 text-sm text-red-200/80">
                                {error}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {!loading &&
                !error &&
                events.length === 0 && (
                    <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/30 px-6 py-12 text-center">
                        <Bell
                            size={36}
                            className="mx-auto text-slate-500"
                        />

                        <h3 className="mt-4 text-lg font-semibold text-white">
                            No incident activity yet
                        </h3>

                        <p className="mt-2 text-slate-400">
                            Genuine incident events will
                            appear here when they are
                            recorded.
                        </p>
                    </div>
                )}

            {!loading &&
                !error &&
                events.length > 0 && (
                    <div className="max-h-[650px] overflow-y-auto overscroll-contain rounded-2xl border border-slate-800 bg-slate-950/20 p-4 pr-3 sm:p-6 sm:pr-4">
                        <div className="space-y-0">
                            {events.map(
                                (event, index) => {
                                    const style =
                                        eventStyles[
                                            event.eventType
                                        ] ||
                                        defaultEventStyle;

                                    const Icon =
                                        style.icon;

                                    return (
                                        <article
                                            key={event.id}
                                            className="flex gap-4 sm:gap-6"
                                        >
                                            <div className="flex flex-col items-center">
                                                <div
                                                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-slate-700 ${style.iconBackground}`}
                                                >
                                                    <Icon
                                                        size={
                                                            22
                                                        }
                                                        className={
                                                            style.iconColor
                                                        }
                                                    />
                                                </div>

                                                {index !==
                                                    events.length -
                                                        1 && (
                                                    <div
                                                        className={`min-h-8 w-px flex-1 ${style.lineColor}`}
                                                    />
                                                )}
                                            </div>

                                            <div className="mb-6 min-w-0 flex-1 rounded-2xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6">
                                                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                                                    <div className="min-w-0">
                                                        <div className="flex flex-wrap items-center gap-2">
                                                            <h3 className="text-lg font-bold text-white sm:text-xl">
                                                                {
                                                                    style.title
                                                                }
                                                            </h3>

                                                            <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-300">
                                                                Incident
                                                                #
                                                                {
                                                                    event.incidentId
                                                                }
                                                            </span>
                                                        </div>

                                                        <p className="mt-2 font-medium text-slate-200">
                                                            {
                                                                event.incidentTitle
                                                            }
                                                        </p>

                                                        {event.serviceName && (
                                                            <p className="mt-1 text-sm text-cyan-400">
                                                                Service:{" "}
                                                                {
                                                                    event.serviceName
                                                                }
                                                            </p>
                                                        )}

                                                        <p className="mt-3 leading-7 text-slate-400">
                                                            {getEventDescription(
                                                                event
                                                            )}
                                                        </p>

                                                        {event.actorUserId && (
                                                            <p className="mt-3 text-xs text-slate-500">
                                                                Recorded
                                                                by user
                                                                #
                                                                {
                                                                    event.actorUserId
                                                                }
                                                            </p>
                                                        )}
                                                    </div>

                                                    <time
                                                        dateTime={
                                                            event.createdAt
                                                        }
                                                        className="shrink-0 rounded-xl bg-slate-800 px-4 py-2 text-sm"
                                                    >
                                                        <span className="block font-semibold text-cyan-400">
                                                            {formatEventTime(
                                                                event.createdAt
                                                            )}
                                                        </span>

                                                        <span className="mt-0.5 block text-xs text-slate-400">
                                                            {formatEventDate(
                                                                event.createdAt
                                                            )}
                                                        </span>
                                                    </time>
                                                </div>
                                            </div>
                                        </article>
                                    );
                                }
                            )}
                        </div>
                    </div>
                )}
        </section>
    );
}