import {
    AlertCircle,
    CheckCircle2,
    CircleAlert,
    ClipboardList,
    Clock3,
    FileSearch,
    LoaderCircle,
    RefreshCw,
    Server,
    Wrench
} from "lucide-react";

import {
    useCallback,
    useEffect,
    useMemo,
    useState
} from "react";

import {
    getIncidents,
    recordIncidentRemediation,
    recordIncidentRootCause
} from "../../services/incident.service";

function normalizeStatus(status) {
    return String(
        status || "OPEN"
    ).toUpperCase();
}

function formatDate(value) {
    if (!value) {
        return "Not recorded";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "Not recorded";
    }

    return date.toLocaleString();
}

function getStatusStyle(status) {
    switch (normalizeStatus(status)) {
        case "RESOLVED":
            return {
                label: "Resolved",
                badge:
                    "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
                dot: "bg-emerald-400"
            };

        case "ACKNOWLEDGED":
            return {
                label: "Acknowledged",
                badge:
                    "border-amber-500/20 bg-amber-500/10 text-amber-300",
                dot: "bg-amber-400"
            };

        default:
            return {
                label: "Open",
                badge:
                    "border-red-500/20 bg-red-500/10 text-red-300",
                dot: "bg-red-400"
            };
    }
}

export default function IncidentManagement() {
    const [incidents, setIncidents] =
        useState([]);

    const [
        selectedIncidentId,
        setSelectedIncidentId
    ] = useState(null);

    const [activityType, setActivityType] =
        useState("ROOT_CAUSE");

    const [details, setDetails] =
        useState("");

    const [loading, setLoading] =
        useState(true);

    const [refreshing, setRefreshing] =
        useState(false);

    const [saving, setSaving] =
        useState(false);

    const [error, setError] =
        useState("");

    const [message, setMessage] =
        useState("");

    const loadIncidents = useCallback(
        async (manualRefresh = false) => {
            if (manualRefresh) {
                setRefreshing(true);
            }

            try {
                setError("");

                const data =
                    await getIncidents();

                const receivedIncidents =
                    Array.isArray(data)
                        ? data
                        : [];

                setIncidents(
                    receivedIncidents
                );

                setSelectedIncidentId(
                    currentId => {
                        const stillExists =
                            receivedIncidents.some(
                                incident =>
                                    Number(
                                        incident.id
                                    ) ===
                                    Number(currentId)
                            );

                        if (stillExists) {
                            return currentId;
                        }

                        return (
                            receivedIncidents[0]
                                ?.id || null
                        );
                    }
                );

                if (manualRefresh) {
                    setMessage(
                        "Incident records refreshed."
                    );
                }
            } catch (requestError) {
                console.error(
                    "Unable to load incident management records:",
                    requestError
                );

                setError(
                    requestError.response?.data
                        ?.message ||
                    "Unable to load incident records."
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

        function handleIncidentUpdate() {
            loadIncidents();
        }

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
    }, [loadIncidents]);

    useEffect(() => {
        if (!message) {
            return undefined;
        }

        const timeout =
            window.setTimeout(
                () => setMessage(""),
                2000
            );

        return () =>
            window.clearTimeout(timeout);
    }, [message]);

    const selectedIncident = useMemo(
        () =>
            incidents.find(
                incident =>
                    Number(incident.id) ===
                    Number(selectedIncidentId)
            ) || null,
        [
            incidents,
            selectedIncidentId
        ]
    );

    const counts = useMemo(() => {
        return incidents.reduce(
            (totals, incident) => {
                const status =
                    normalizeStatus(
                        incident.status
                    );

                totals.total += 1;

                if (status === "OPEN") {
                    totals.open += 1;
                }

                if (
                    status ===
                    "ACKNOWLEDGED"
                ) {
                    totals.acknowledged += 1;
                }

                if (status === "RESOLVED") {
                    totals.resolved += 1;
                }

                return totals;
            },
            {
                total: 0,
                open: 0,
                acknowledged: 0,
                resolved: 0
            }
        );
    }, [incidents]);

    async function handleSubmit(event) {
        event.preventDefault();

        const trimmedDetails =
            details.trim();

        if (!selectedIncident) {
            setError(
                "Select an incident first."
            );

            return;
        }

        if (!trimmedDetails) {
            setError(
                "Enter the activity details."
            );

            return;
        }

        setSaving(true);
        setError("");
        setMessage("");

        try {
            if (
                activityType ===
                "ROOT_CAUSE"
            ) {
                await recordIncidentRootCause(
                    selectedIncident.id,
                    trimmedDetails
                );

                setMessage(
                    "Root cause recorded."
                );
            } else {
                await recordIncidentRemediation(
                    selectedIncident.id,
                    trimmedDetails
                );

                setMessage(
                    "Remediation recorded."
                );
            }

            setDetails("");

            window.dispatchEvent(
                new Event(
                    "minerva:incidents-updated"
                )
            );
        } catch (requestError) {
            console.error(
                "Unable to record incident activity:",
                requestError
            );

            setError(
                requestError.response?.data
                    ?.message ||
                "Unable to record incident activity."
            );
        } finally {
            setSaving(false);
        }
    }

    return (
        <section className="rounded-3xl border border-slate-800 bg-[#111827] p-5 sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white sm:text-3xl">
                        Incident Management
                    </h2>

                    <p className="mt-2 text-slate-400">
                        Review real incidents and record
                        root-cause or remediation activity.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() =>
                        loadIncidents(true)
                    }
                    disabled={
                        loading || refreshing
                    }
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
                        : "Refresh Incidents"}
                </button>
            </div>

            {!loading && !error && (
                <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
                        <p className="text-sm text-slate-500">
                            Total
                        </p>

                        <p className="mt-1 text-2xl font-bold text-white">
                            {counts.total}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-4">
                        <p className="text-sm text-red-300">
                            Open
                        </p>

                        <p className="mt-1 text-2xl font-bold text-red-400">
                            {counts.open}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4">
                        <p className="text-sm text-amber-300">
                            Acknowledged
                        </p>

                        <p className="mt-1 text-2xl font-bold text-amber-400">
                            {counts.acknowledged}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                        <p className="text-sm text-emerald-300">
                            Resolved
                        </p>

                        <p className="mt-1 text-2xl font-bold text-emerald-400">
                            {counts.resolved}
                        </p>
                    </div>
                </div>
            )}

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

            {loading && (
                <div className="mt-8 flex min-h-64 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/40">
                    <LoaderCircle
                        size={26}
                        className="animate-spin text-cyan-400"
                    />

                    <span className="ml-3 text-slate-400">
                        Loading incidents...
                    </span>
                </div>
            )}

            {!loading &&
                incidents.length === 0 && (
                    <div className="mt-8 rounded-2xl border border-dashed border-slate-700 bg-slate-900/30 px-6 py-12 text-center">
                        <ClipboardList
                            size={38}
                            className="mx-auto text-slate-500"
                        />

                        <h3 className="mt-4 text-lg font-semibold text-white">
                            No incidents recorded
                        </h3>

                        <p className="mt-2 text-slate-400">
                            Incident management activity
                            will become available after an
                            incident is detected.
                        </p>
                    </div>
                )}

            {!loading &&
                incidents.length > 0 && (
                    <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(360px,0.85fr)]">
                        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/20">
                            <div className="border-b border-slate-800 px-5 py-4">
                                <h3 className="font-semibold text-white">
                                    Recorded Incidents
                                </h3>

                                <p className="mt-1 text-sm text-slate-500">
                                    Select an incident to
                                    manage its activity.
                                </p>
                            </div>

                            <div className="max-h-[560px] space-y-3 overflow-y-auto overscroll-contain p-4">
                                {incidents.map(
                                    incident => {
                                        const status =
                                            getStatusStyle(
                                                incident.status
                                            );

                                        const selected =
                                            Number(
                                                incident.id
                                            ) ===
                                            Number(
                                                selectedIncidentId
                                            );

                                        return (
                                            <button
                                                key={
                                                    incident.id
                                                }
                                                type="button"
                                                onClick={() =>
                                                    setSelectedIncidentId(
                                                        incident.id
                                                    )
                                                }
                                                className={`w-full rounded-xl border p-4 text-left transition ${
                                                    selected
                                                        ? "border-cyan-500/60 bg-cyan-500/10"
                                                        : "border-slate-800 bg-slate-900/50 hover:border-slate-700"
                                                }`}
                                            >
                                                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                                    <div className="min-w-0">
                                                        <div className="flex items-center gap-2 text-sm font-semibold text-cyan-400">
                                                            <ClipboardList
                                                                size={
                                                                    16
                                                                }
                                                            />

                                                            Incident
                                                            #
                                                            {
                                                                incident.id
                                                            }
                                                        </div>

                                                        <p className="mt-2 font-semibold text-white">
                                                            {
                                                                incident.title
                                                            }
                                                        </p>

                                                        <div className="mt-2 flex items-center gap-2 text-sm text-slate-400">
                                                            <Server
                                                                size={
                                                                    15
                                                                }
                                                            />

                                                            {incident.name ||
                                                                `Service #${incident.service_id}`}
                                                        </div>
                                                    </div>

                                                    <span
                                                        className={`inline-flex items-center gap-2 self-start rounded-full border px-3 py-1 text-xs font-semibold ${status.badge}`}
                                                    >
                                                        <span
                                                            className={`h-2 w-2 rounded-full ${status.dot}`}
                                                        />

                                                        {
                                                            status.label
                                                        }
                                                    </span>
                                                </div>

                                                <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                                                    <Clock3
                                                        size={
                                                            14
                                                        }
                                                    />

                                                    Detected{" "}
                                                    {formatDate(
                                                        incident.created_at
                                                    )}
                                                </div>
                                            </button>
                                        );
                                    }
                                )}
                            </div>
                        </div>

                        {selectedIncident && (
                            <div className="self-start rounded-2xl border border-slate-800 bg-slate-900/40 p-5 sm:p-6">
                                <div className="flex flex-wrap items-start justify-between gap-3">
                                    <div>
                                        <p className="text-sm font-semibold text-cyan-400">
                                            Incident #
                                            {
                                                selectedIncident.id
                                            }
                                        </p>

                                        <h3 className="mt-2 text-xl font-bold text-white">
                                            {
                                                selectedIncident.title
                                            }
                                        </h3>
                                    </div>

                                    {(() => {
                                        const status =
                                            getStatusStyle(
                                                selectedIncident.status
                                            );

                                        return (
                                            <span
                                                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${status.badge}`}
                                            >
                                                <span
                                                    className={`h-2 w-2 rounded-full ${status.dot}`}
                                                />

                                                {
                                                    status.label
                                                }
                                            </span>
                                        );
                                    })()}
                                </div>

                                <p className="mt-4 leading-7 text-slate-400">
                                    {selectedIncident.description ||
                                        "No incident description was recorded."}
                                </p>

                                <dl className="mt-5 space-y-3 border-y border-slate-800 py-4 text-sm">
                                    <div className="flex justify-between gap-4">
                                        <dt className="text-slate-500">
                                            Service
                                        </dt>

                                        <dd className="text-right font-medium text-slate-200">
                                            {selectedIncident.name ||
                                                `Service #${selectedIncident.service_id}`}
                                        </dd>
                                    </div>

                                    <div className="flex justify-between gap-4">
                                        <dt className="text-slate-500">
                                            Detected
                                        </dt>

                                        <dd className="text-right font-medium text-slate-200">
                                            {formatDate(
                                                selectedIncident.created_at
                                            )}
                                        </dd>
                                    </div>

                                    <div className="flex justify-between gap-4">
                                        <dt className="text-slate-500">
                                            Resolved
                                        </dt>

                                        <dd className="text-right font-medium text-slate-200">
                                            {formatDate(
                                                selectedIncident.resolved_at
                                            )}
                                        </dd>
                                    </div>
                                </dl>

                                <form
                                    onSubmit={
                                        handleSubmit
                                    }
                                    className="mt-6"
                                >
                                    <p className="text-sm font-semibold text-slate-300">
                                        Activity type
                                    </p>

                                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setActivityType(
                                                    "ROOT_CAUSE"
                                                )
                                            }
                                            className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                                                activityType ===
                                                "ROOT_CAUSE"
                                                    ? "border-violet-500/60 bg-violet-500/10 text-violet-300"
                                                    : "border-slate-700 bg-slate-950/30 text-slate-400 hover:text-white"
                                            }`}
                                        >
                                            <FileSearch
                                                size={
                                                    18
                                                }
                                            />

                                            Root Cause
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setActivityType(
                                                    "REMEDIATION"
                                                )
                                            }
                                            className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                                                activityType ===
                                                "REMEDIATION"
                                                    ? "border-amber-500/60 bg-amber-500/10 text-amber-300"
                                                    : "border-slate-700 bg-slate-950/30 text-slate-400 hover:text-white"
                                            }`}
                                        >
                                            <Wrench
                                                size={
                                                    18
                                                }
                                            />

                                            Remediation
                                        </button>
                                    </div>

                                    <label
                                        htmlFor="incident-activity-details"
                                        className="mt-5 block text-sm font-semibold text-slate-300"
                                    >
                                        Details
                                    </label>

                                    <textarea
                                        id="incident-activity-details"
                                        value={details}
                                        onChange={event =>
                                            setDetails(
                                                event.target.value
                                            )
                                        }
                                        maxLength={5000}
                                        rows={6}
                                        placeholder={
                                            activityType ===
                                            "ROOT_CAUSE"
                                                ? "Describe the verified root cause..."
                                                : "Describe the remediation that was performed..."
                                        }
                                        className="mt-3 w-full resize-y rounded-xl border border-slate-700 bg-slate-950/50 px-4 py-3 text-slate-200 outline-none transition placeholder:text-slate-600 focus:border-cyan-500"
                                    />

                                    <div className="mt-2 flex justify-between text-xs text-slate-500">
                                        <span>
                                            Record only
                                            verified incident
                                            activity.
                                        </span>

                                        <span>
                                            {
                                                details.length
                                            }
                                            /5000
                                        </span>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={
                                            saving ||
                                            !details.trim()
                                        }
                                        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 px-5 py-3 font-bold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {saving ? (
                                            <LoaderCircle
                                                size={
                                                    19
                                                }
                                                className="animate-spin"
                                            />
                                        ) : activityType ===
                                          "ROOT_CAUSE" ? (
                                            <FileSearch
                                                size={
                                                    19
                                                }
                                            />
                                        ) : (
                                            <Wrench
                                                size={
                                                    19
                                                }
                                            />
                                        )}

                                        {saving
                                            ? "Saving..."
                                            : activityType ===
                                              "ROOT_CAUSE"
                                            ? "Record Root Cause"
                                            : "Record Remediation"}
                                    </button>
                                </form>

                                <div className="mt-5 flex items-start gap-2 rounded-xl border border-slate-800 bg-slate-950/30 p-3 text-xs leading-5 text-slate-500">
                                    <AlertCircle
                                        size={16}
                                        className="mt-0.5 shrink-0"
                                    />

                                    Saved activity is
                                    permanently added to the
                                    genuine Incident Timeline.
                                </div>
                            </div>
                        )}
                    </div>
                )}
        </section>
    );
}