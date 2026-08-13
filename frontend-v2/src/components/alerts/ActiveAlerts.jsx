import {
    useCallback,
    useEffect,
    useState
} from "react";

import {
    AlertTriangle,
    CheckCircle2,
    CircleAlert,
    Clock3,
    Globe,
    LoaderCircle,
    RefreshCw,
    ShieldAlert
} from "lucide-react";

import {
    acknowledgeIncident,
    getIncidents,
    resolveIncident
} from "../../services/incident.service";

function normalizeStatus(status) {
    return String(
        status || "OPEN"
    ).toUpperCase();
}

function isActiveIncident(incident) {
    const status = normalizeStatus(
        incident?.status
    );

    return (
        status === "OPEN" ||
        status === "ACKNOWLEDGED"
    );
}

function formatDate(value) {
    if (!value) {
        return "Unknown time";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "Unknown time";
    }

    return date.toLocaleString();
}

function getIncidentSeverity(incident) {
    const text = `
        ${incident?.title || ""}
        ${incident?.description || ""}
    `.toLowerCase();

    if (
        text.includes("down") ||
        text.includes("unavailable") ||
        text.includes("failed") ||
        text.includes("critical")
    ) {
        return "Critical";
    }

    return "Warning";
}

function getStatusStyles(status) {
    if (status === "RESOLVED") {
        return {
            text: "text-emerald-400",
            badge:
                "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
        };
    }

    if (status === "ACKNOWLEDGED") {
        return {
            text: "text-amber-400",
            badge:
                "border-amber-500/20 bg-amber-500/10 text-amber-300"
        };
    }

    return {
        text: "text-red-400",
        badge:
            "border-red-500/20 bg-red-500/10 text-red-300"
    };
}

export default function ActiveAlerts() {
    const [incidents, setIncidents] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [refreshing, setRefreshing] =
        useState(false);

    const [processingId, setProcessingId] =
        useState(null);

    const [
        processingAction,
        setProcessingAction
    ] = useState(null);

    const [error, setError] =
        useState(null);

    const [message, setMessage] =
        useState(null);

    const loadIncidents =
        useCallback(async ({
            showRefreshState = false,
            showRefreshMessage = false
        } = {}) => {
            if (showRefreshState) {
                setRefreshing(true);
            }

            setError(null);

            try {
                const data =
                    await getIncidents();

                setIncidents(
                    data.filter(
                        isActiveIncident
                    )
                );

                if (showRefreshMessage) {
                    setMessage(
                        "Incident list refreshed."
                    );
                }

                return true;
            } catch (requestError) {
                console.error(
                    "Unable to load active incidents:",
                    requestError
                );

                setError(
                    requestError.response?.data
                        ?.message ||
                    "Unable to load active incidents."
                );

                return false;
            } finally {
                setLoading(false);
                setRefreshing(false);
            }
        }, []);

    useEffect(() => {
        loadIncidents();

        const interval =
            window.setInterval(
                () => loadIncidents(),
                30000
            );

        function handleIncidentUpdate() {
            loadIncidents();
        }

        window.addEventListener(
            "minerva:incidents-updated",
            handleIncidentUpdate
        );

        return () => {
            window.clearInterval(interval);

            window.removeEventListener(
                "minerva:incidents-updated",
                handleIncidentUpdate
            );
        };
    }, [loadIncidents]);

    /*
     * Remove success messages automatically
     * after two seconds.
     */
    useEffect(() => {
        if (!message) {
            return undefined;
        }

        const timeout =
            window.setTimeout(
                () => setMessage(null),
                2000
            );

        return () =>
            window.clearTimeout(timeout);
    }, [message]);

    async function handleRefresh() {
        if (refreshing) {
            return;
        }

        setMessage(null);

        await loadIncidents({
            showRefreshState: true,
            showRefreshMessage: true
        });
    }

    async function runIncidentAction(
        incident,
        action
    ) {
        if (processingId !== null) {
            return;
        }

        setProcessingId(incident.id);
        setProcessingAction(action);
        setError(null);
        setMessage(null);

        try {
            if (action === "acknowledge") {
                const result =
                    await acknowledgeIncident(
                        incident.id
                    );

                setIncidents(
                    currentIncidents =>
                        currentIncidents.map(
                            currentIncident =>
                                currentIncident.id ===
                                incident.id
                                    ? {
                                          ...currentIncident,
                                          ...result.data,
                                          status:
                                              "ACKNOWLEDGED"
                                      }
                                    : currentIncident
                        )
                );

                setMessage(
                    `"${incident.title}" was acknowledged.`
                );

                window.dispatchEvent(
                    new Event(
                        "minerva:incidents-updated"
                    )
                );
            } else {
                const result =
                    await resolveIncident(
                        incident.id
                    );

                /*
                 * Keep the resolved card visible
                 * for two seconds.
                 */
                setIncidents(
                    currentIncidents =>
                        currentIncidents.map(
                            currentIncident =>
                                currentIncident.id ===
                                incident.id
                                    ? {
                                          ...currentIncident,
                                          ...result.data,
                                          status:
                                              "RESOLVED"
                                      }
                                    : currentIncident
                        )
                );

                setMessage(
                    `"${incident.title}" was resolved.`
                );

                window.setTimeout(
                    async () => {
                        await loadIncidents();

                        window.dispatchEvent(
                            new Event(
                                "minerva:incidents-updated"
                            )
                        );
                    },
                    2000
                );
            }
        } catch (requestError) {
            console.error(
                `Unable to ${action} incident:`,
                requestError
            );

            setError(
                requestError.response?.data
                    ?.message ||
                `Unable to ${action} incident.`
            );
        } finally {
            setProcessingId(null);
            setProcessingAction(null);
        }
    }

    const activeCount =
        incidents.filter(
            incident =>
                normalizeStatus(
                    incident.status
                ) !== "RESOLVED"
        ).length;

    return (
        <section className="rounded-3xl border border-slate-800 bg-[#111827] p-5 sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white sm:text-3xl">
                        Active Alerts
                    </h2>

                    <p className="mt-2 text-slate-400">
                        Current incidents requiring
                        investigation or action.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <span className="rounded-full bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-400">
                        {loading
                            ? "Loading..."
                            : `${activeCount} Active Incident${
                                  activeCount === 1
                                      ? ""
                                      : "s"
                              }`}
                    </span>

                    <button
                        type="button"
                        onClick={handleRefresh}
                        disabled={
                            refreshing ||
                            loading
                        }
                        aria-label="Refresh incidents"
                        title="Refresh incidents"
                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-700 text-slate-400 transition hover:border-cyan-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
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

            {message && (
                <div
                    role="status"
                    className="mt-6 flex items-start gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300"
                >
                    <CheckCircle2
                        size={18}
                        className="mt-0.5 shrink-0"
                    />

                    <span>{message}</span>
                </div>
            )}

            {error && (
                <div
                    role="alert"
                    className="mt-6 flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300"
                >
                    <CircleAlert
                        size={18}
                        className="mt-0.5 shrink-0"
                    />

                    <span>{error}</span>
                </div>
            )}

            {loading ? (
                <div className="mt-8 flex min-h-48 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/40 text-slate-400">
                    <LoaderCircle
                        size={22}
                        className="mr-3 animate-spin"
                    />

                    Loading active incidents...
                </div>
            ) : incidents.length === 0 ? (
                <div className="mt-8 flex min-h-52 flex-col items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/5 px-6 text-center">
                    <CheckCircle2
                        size={38}
                        className="text-emerald-400"
                    />

                    <h3 className="mt-4 text-xl font-semibold text-white">
                        No active incidents
                    </h3>

                    <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
                        All monitored services belonging
                        to this account are currently free
                        from unresolved incidents.
                    </p>
                </div>
            ) : (
                <div className="mt-8 space-y-5">
                    {incidents.map(
                        incident => {
                            const status =
                                normalizeStatus(
                                    incident.status
                                );

                            const severity =
                                getIncidentSeverity(
                                    incident
                                );

                            const styles =
                                getStatusStyles(
                                    status
                                );

                            const isProcessing =
                                processingId ===
                                incident.id;

                            return (
                                <article
                                    key={
                                        incident.id
                                    }
                                    className={`
                                        rounded-2xl
                                        border
                                        bg-slate-900/40
                                        p-5
                                        transition
                                        sm:p-6
                                        ${
                                            status ===
                                            "RESOLVED"
                                                ? "border-emerald-500/30"
                                                : "border-slate-800 hover:border-red-500/30"
                                        }
                                    `}
                                >
                                    <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                                        <div className="flex min-w-0 items-start gap-4 sm:gap-5">
                                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-800 sm:h-14 sm:w-14">
                                                {status ===
                                                "RESOLVED" ? (
                                                    <CheckCircle2
                                                        size={
                                                            26
                                                        }
                                                        className="text-emerald-400"
                                                    />
                                                ) : severity ===
                                                  "Critical" ? (
                                                    <ShieldAlert
                                                        size={
                                                            26
                                                        }
                                                        className="text-red-400"
                                                    />
                                                ) : (
                                                    <AlertTriangle
                                                        size={
                                                            26
                                                        }
                                                        className="text-amber-400"
                                                    />
                                                )}
                                            </div>

                                            <div className="min-w-0">
                                                <h3 className="break-words text-lg font-bold text-white sm:text-xl">
                                                    {
                                                        incident.title
                                                    }
                                                </h3>

                                                <p className="mt-2 text-slate-400">
                                                    {incident.name ||
                                                        "Monitored service"}
                                                </p>

                                                {incident.description && (
                                                    <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-500">
                                                        {
                                                            incident.description
                                                        }
                                                    </p>
                                                )}

                                                <div className="mt-4 flex flex-wrap gap-3">
                                                    <span
                                                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                                            severity ===
                                                            "Critical"
                                                                ? "bg-red-500/10 text-red-400"
                                                                : "bg-amber-500/10 text-amber-400"
                                                        }`}
                                                    >
                                                        {
                                                            severity
                                                        }
                                                    </span>

                                                    <span
                                                        className={`rounded-full border px-3 py-1 text-xs font-semibold ${styles.badge}`}
                                                    >
                                                        {
                                                            status
                                                        }
                                                    </span>

                                                    <span className="inline-flex items-center gap-2 rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">
                                                        <Clock3
                                                            size={
                                                                13
                                                            }
                                                        />

                                                        {formatDate(
                                                            incident.created_at
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="shrink-0 lg:text-right">
                                            <p className="text-sm text-slate-500">
                                                Incident
                                            </p>

                                            <p className="mt-2 font-semibold text-white">
                                                #
                                                {
                                                    incident.id
                                                }
                                            </p>

                                            <p className="mt-4 text-sm text-slate-500">
                                                Service
                                            </p>

                                            <div className="mt-2 flex items-center gap-2 lg:justify-end">
                                                <Globe
                                                    size={
                                                        15
                                                    }
                                                    className="text-cyan-400"
                                                />

                                                <span className="font-semibold text-white">
                                                    {incident.name ||
                                                        "Unknown"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-6 flex flex-wrap gap-3">
                                        {status ===
                                        "RESOLVED" ? (
                                            <div className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-5 py-3 font-semibold text-emerald-400">
                                                <CheckCircle2
                                                    size={
                                                        18
                                                    }
                                                />

                                                Resolved
                                            </div>
                                        ) : (
                                            <>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        runIncidentAction(
                                                            incident,
                                                            "acknowledge"
                                                        )
                                                    }
                                                    disabled={
                                                        isProcessing ||
                                                        status !==
                                                            "OPEN"
                                                    }
                                                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
                                                >
                                                    {isProcessing &&
                                                    processingAction ===
                                                        "acknowledge" ? (
                                                        <LoaderCircle
                                                            size={
                                                                18
                                                            }
                                                            className="animate-spin"
                                                        />
                                                    ) : (
                                                        <ShieldAlert
                                                            size={
                                                                18
                                                            }
                                                        />
                                                    )}

                                                    {status ===
                                                    "ACKNOWLEDGED"
                                                        ? "Acknowledged"
                                                        : "Acknowledge"}
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        runIncidentAction(
                                                            incident,
                                                            "resolve"
                                                        )
                                                    }
                                                    disabled={
                                                        isProcessing
                                                    }
                                                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-5 py-3 font-semibold text-emerald-400 transition hover:bg-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                                                >
                                                    {isProcessing &&
                                                    processingAction ===
                                                        "resolve" ? (
                                                        <LoaderCircle
                                                            size={
                                                                18
                                                            }
                                                            className="animate-spin"
                                                        />
                                                    ) : (
                                                        <CheckCircle2
                                                            size={
                                                                18
                                                            }
                                                        />
                                                    )}

                                                    Resolve
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </article>
                            );
                        }
                    )}
                </div>
            )}
        </section>
    );
}