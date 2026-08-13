import {
    AlertTriangle,
    CheckCircle2,
    Clock3,
    Info,
    RefreshCw,
    ShieldAlert
} from "lucide-react";

import {
    useCallback,
    useEffect,
    useMemo,
    useState
} from "react";

import { getIncidents } from "../../../services/incident.service";

const styles = {
    critical: {
        badge: "bg-red-500/15 text-red-400",
        border: "border-red-500/20",
        icon: "red"
    },
    warning: {
        badge: "bg-yellow-500/15 text-yellow-400",
        border: "border-yellow-500/20",
        icon: "yellow"
    },
    info: {
        badge: "bg-blue-500/15 text-blue-400",
        border: "border-blue-500/20",
        icon: "blue"
    }
};

function formatRelativeTime(value) {
    if (!value) return "Time unavailable";

    const timestamp = new Date(value).getTime();

    if (Number.isNaN(timestamp)) {
        return "Time unavailable";
    }

    const seconds = Math.max(
        0,
        Math.floor((Date.now() - timestamp) / 1000)
    );

    if (seconds < 60) return "Just now";

    const minutes = Math.floor(seconds / 60);

    if (minutes < 60) {
        return `${minutes} min ago`;
    }

    const hours = Math.floor(minutes / 60);

    if (hours < 24) {
        return `${hours} hr ago`;
    }

    const days = Math.floor(hours / 24);

    return `${days} day${days === 1 ? "" : "s"} ago`;
}

function getSeverity(incident) {
    const value = String(
        incident?.severity ||
        incident?.level ||
        "Critical"
    ).toLowerCase();

    if (value.includes("warn")) return "warning";
    if (value.includes("info")) return "info";

    return "critical";
}

function getIncidentTitle(incident) {
    return incident?.title || "Service incident detected";
}

function getIncidentHost(incident) {
    return (
        incident?.name ||
        incident?.service_name ||
        incident?.service ||
        "Unknown monitored service"
    );
}

function getIncidentMessage(incident) {
    return (
        incident?.description ||
        "The monitored service requires investigation."
    );
}

function StatusIcon({ type }) {
    if (type === "yellow") {
        return (
            <AlertTriangle
                size={20}
                className="text-yellow-400"
            />
        );
    }

    if (type === "blue") {
        return (
            <Info
                size={20}
                className="text-blue-400"
            />
        );
    }

    return (
        <ShieldAlert
            size={20}
            className="text-red-400"
        />
    );
}

export default function AlertsPanel() {
    const [incidents, setIncidents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");

    const loadIncidents = useCallback(
        async (showRefreshState = false) => {
            try {
                if (showRefreshState) {
                    setRefreshing(true);
                }

                setError("");

                const data = await getIncidents();

                const openIncidents = data.filter(
                    (incident) =>
                        String(
                            incident?.status || "OPEN"
                        ).toUpperCase() === "OPEN"
                );

                setIncidents(openIncidents);
            } catch (requestError) {
                console.error(
                    "Unable to load incidents:",
                    requestError
                );

                setError(
                    "Unable to load active incidents."
                );
            } finally {
                setLoading(false);
                setRefreshing(false);
            }
        },
        []
    );

    useEffect(() => {
        loadIncidents();

        const interval = window.setInterval(
            () => loadIncidents(),
            30000
        );

        return () => {
            window.clearInterval(interval);
        };
    }, [loadIncidents]);

    const activeCount = incidents.length;

    const monitoringMessage = useMemo(() => {
        if (loading) {
            return "Checking monitored services for active incidents...";
        }

        if (error) {
            return error;
        }

        if (activeCount === 0) {
            return "No open service incidents are currently recorded.";
        }

        return `${activeCount} open incident${
            activeCount === 1 ? "" : "s"
        } require${
            activeCount === 1 ? "s" : ""
        } investigation.`;
    }, [activeCount, error, loading]);

    return (
        <div className="flex h-full flex-col rounded-3xl border border-slate-800 bg-[#111827] p-8 shadow-xl shadow-black/20">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-semibold tracking-tight text-white">
                        Active Alerts
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-slate-400">
                        Live incidents requiring your attention.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <div
                        className={`rounded-full px-4 py-2 text-sm font-semibold ${
                            activeCount > 0
                                ? "bg-red-500/15 text-red-400"
                                : "bg-emerald-500/15 text-emerald-400"
                        }`}
                    >
                        {activeCount} Active
                    </div>

                    <button
                        type="button"
                        aria-label="Refresh active alerts"
                        onClick={() => loadIncidents(true)}
                        disabled={refreshing}
                        className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <RefreshCw
                            size={17}
                            className={
                                refreshing
                                    ? "animate-spin"
                                    : ""
                            }
                        />
                    </button>
                </div>
            </div>

            <div className="my-8 border-b border-slate-800" />

            <div className="flex-1 space-y-5">
                {loading ? (
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 text-sm text-slate-400">
                        Loading active incidents...
                    </div>
                ) : incidents.length === 0 ? (
                    <div className="flex min-h-40 flex-col items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 text-center">
                        <CheckCircle2
                            size={30}
                            className="text-emerald-400"
                        />

                        <p className="mt-3 font-semibold text-white">
                            No active incidents
                        </p>

                        <p className="mt-2 text-sm text-slate-400">
                            All recorded services are currently clear.
                        </p>
                    </div>
                ) : (
                    incidents.map((incident) => {
                        const severity = getSeverity(incident);
                        const theme = styles[severity];

                        return (
                            <div
                                key={
                                    incident.id ||
                                    `${incident.service_id}-${incident.created_at}`
                                }
                                className={`rounded-2xl border ${theme.border} bg-slate-900/50 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-slate-600`}
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex min-w-0 gap-4">
                                        <div className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-800">
                                            <StatusIcon
                                                type={theme.icon}
                                            />
                                        </div>

                                        <div className="min-w-0">
                                            <h3 className="break-words text-base font-semibold text-white">
                                                {getIncidentTitle(incident)}
                                            </h3>

                                            <p className="mt-2 text-sm text-slate-400">
                                                {getIncidentHost(incident)}
                                            </p>

                                            <p className="mt-2 break-words text-sm leading-6 text-slate-500">
                                                {getIncidentMessage(incident)}
                                            </p>
                                        </div>
                                    </div>

                                    <span
                                        className={`shrink-0 rounded-full px-3 py-1.5 text-sm font-semibold ${theme.badge}`}
                                    >
                                        {severity === "warning"
                                            ? "Warning"
                                            : severity === "info"
                                            ? "Info"
                                            : "Critical"}
                                    </span>
                                </div>

                                <div className="mt-5 flex items-center gap-2 text-sm text-slate-500">
                                    <Clock3 size={15} />
                                    {formatRelativeTime(
                                        incident.created_at
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            <div className="mt-auto pt-8">
                <div className="mb-8 border-t border-slate-800" />

                <div className="rounded-2xl border border-blue-500/20 bg-blue-500/10 p-6">
                    <p className="text-base font-semibold text-blue-300">
                        Monitoring Status
                    </p>

                    <p className="mt-3 text-sm leading-6 text-slate-300">
                        {monitoringMessage}
                    </p>
                </div>
            </div>
        </div>
    );
}