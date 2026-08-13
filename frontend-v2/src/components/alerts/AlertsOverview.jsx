import {
    useCallback,
    useEffect,
    useMemo,
    useState
} from "react";

import {
    Bell,
    ShieldAlert,
    TriangleAlert,
    CheckCircle2
} from "lucide-react";

import {
    getIncidents
} from "../../services/incident.service";

const ACTIVE_STATUSES =
    new Set([
        "OPEN",
        "ACKNOWLEDGED"
    ]);

function normalizeStatus(status) {
    return String(status || "")
        .trim()
        .toUpperCase();
}

function getIncidentSeverity(incident) {
    const storedSeverity =
        String(incident?.severity || "")
            .trim()
            .toUpperCase();

    if (
        storedSeverity === "CRITICAL" ||
        storedSeverity === "WARNING"
    ) {
        return storedSeverity;
    }

    const incidentText = [
        incident?.title,
        incident?.description,
        incident?.name
    ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

    const criticalPattern =
        /\b(down|failed|failure|critical|unavailable|outage|offline|error)\b/;

    return criticalPattern.test(incidentText)
        ? "CRITICAL"
        : "WARNING";
}

function wasResolvedToday(incident) {
    if (
        normalizeStatus(incident?.status) !==
        "RESOLVED"
    ) {
        return false;
    }

    if (!incident?.resolved_at) {
        return false;
    }

    const resolvedDate =
        new Date(incident.resolved_at);

    if (
        Number.isNaN(
            resolvedDate.getTime()
        )
    ) {
        return false;
    }

    const today =
        new Date();

    return (
        resolvedDate.getFullYear() ===
            today.getFullYear() &&
        resolvedDate.getMonth() ===
            today.getMonth() &&
        resolvedDate.getDate() ===
            today.getDate()
    );
}

export default function AlertsOverview() {
    const [
        incidents,
        setIncidents
    ] = useState([]);

    const [
        loading,
        setLoading
    ] = useState(true);

    const [
        error,
        setError
    ] = useState("");

    const loadIncidents =
        useCallback(
            async ({
                silent = false
            } = {}) => {
                if (!silent) {
                    setLoading(true);
                }

                try {
                    const incidentData =
                        await getIncidents();

                    setIncidents(
                        Array.isArray(incidentData)
                            ? incidentData
                            : []
                    );

                    setError("");
                } catch (requestError) {
                    console.error(
                        "Unable to load alert statistics:",
                        requestError
                    );

                    setError(
                        "Unable to load live alert statistics."
                    );
                } finally {
                    if (!silent) {
                        setLoading(false);
                    }
                }
            },
            []
        );

    useEffect(() => {
        loadIncidents();

        const handleIncidentUpdate = () => {
            loadIncidents({
                silent: true
            });
        };

        window.addEventListener(
            "minerva:incidents-updated",
            handleIncidentUpdate
        );

        const refreshInterval =
            window.setInterval(
                () => {
                    loadIncidents({
                        silent: true
                    });
                },
                30000
            );

        return () => {
            window.removeEventListener(
                "minerva:incidents-updated",
                handleIncidentUpdate
            );

            window.clearInterval(
                refreshInterval
            );
        };
    }, [loadIncidents]);

    const statistics =
        useMemo(
            () => {
                const activeIncidents =
                    incidents.filter(
                        incident =>
                            ACTIVE_STATUSES.has(
                                normalizeStatus(
                                    incident.status
                                )
                            )
                    );

                const criticalIncidents =
                    activeIncidents.filter(
                        incident =>
                            getIncidentSeverity(
                                incident
                            ) ===
                            "CRITICAL"
                    );

                const warningIncidents =
                    activeIncidents.filter(
                        incident =>
                            getIncidentSeverity(
                                incident
                            ) ===
                            "WARNING"
                    );

                const resolvedToday =
                    incidents.filter(
                        wasResolvedToday
                    );

                return [
                    {
                        title: "Active Alerts",
                        value:
                            activeIncidents.length,
                        subtitle:
                            "Currently Open",
                        icon: Bell,
                        color:
                            "text-red-400 bg-red-500/10"
                    },
                    {
                        title:
                            "Critical Alerts",
                        value:
                            criticalIncidents.length,
                        subtitle:
                            "Immediate Action",
                        icon: ShieldAlert,
                        color:
                            "text-rose-400 bg-rose-500/10"
                    },
                    {
                        title: "Warnings",
                        value:
                            warningIncidents.length,
                        subtitle:
                            "Needs Attention",
                        icon: TriangleAlert,
                        color:
                            "text-amber-400 bg-amber-500/10"
                    },
                    {
                        title:
                            "Resolved Today",
                        value:
                            resolvedToday.length,
                        subtitle:
                            "Closed Incidents",
                        icon: CheckCircle2,
                        color:
                            "text-emerald-400 bg-emerald-500/10"
                    }
                ];
            },
            [incidents]
        );

    return (
        <section aria-live="polite">
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                {statistics.map((item) => {
                    const Icon =
                        item.icon;

                    return (
                        <div
                            key={item.title}
                            className="
                                rounded-3xl
                                border
                                border-slate-800
                                bg-[#111827]
                                p-7
                                transition
                                duration-300
                                hover:-translate-y-1
                                hover:border-red-500/30
                            "
                        >
                            <div className="flex items-center justify-between">
                                <div
                                    className={`flex h-14 w-14 items-center justify-center rounded-2xl ${item.color}`}
                                >
                                    <Icon size={28} />
                                </div>

                                <span
                                    className={`
                                        rounded-full
                                        px-3
                                        py-1
                                        text-xs
                                        font-semibold
                                        ${
                                            error
                                                ? "bg-red-500/10 text-red-400"
                                                : "bg-emerald-500/10 text-emerald-400"
                                        }
                                    `}
                                >
                                    {error
                                        ? "Unavailable"
                                        : "Live"}
                                </span>
                            </div>

                            <h3 className="mt-6 text-xl font-bold text-white">
                                {item.title}
                            </h3>

                            <p className="mt-5 text-4xl font-black text-white">
                                {loading
                                    ? "..."
                                    : item.value}
                            </p>

                            <p className="mt-2 text-slate-400">
                                {item.subtitle}
                            </p>
                        </div>
                    );
                })}
            </div>

            {error && (
                <div className="mt-4 rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm text-red-300">
                    {error}
                </div>
            )}
        </section>
    );
}