import {
    useCallback,
    useEffect,
    useState
} from "react";

import {
    Bell,
    TriangleAlert,
    CheckCheck,
    LoaderCircle,
    CircleCheck,
    CircleAlert
} from "lucide-react";

import {
    acknowledgeAllIncidents,
    getIncidents
} from "../../services/incident.service";

function isUnresolvedIncident(incident) {
    const status = String(
        incident?.status || "OPEN"
    ).toUpperCase();

    return (
        status === "OPEN" ||
        status === "ACKNOWLEDGED"
    );
}

function isUnacknowledgedIncident(incident) {
    return (
        String(
            incident?.status || "OPEN"
        ).toUpperCase() === "OPEN"
    );
}

export default function AlertsHeader() {
    const [activeCount, setActiveCount] =
        useState(0);

    const [
        unacknowledgedCount,
        setUnacknowledgedCount
    ] = useState(0);

    const [loading, setLoading] =
        useState(true);

    const [acknowledging, setAcknowledging] =
        useState(false);

    const [feedback, setFeedback] =
        useState(null);

    const loadIncidentCounts =
        useCallback(async () => {
            try {
                const incidents =
                    await getIncidents();

                setActiveCount(
                    incidents.filter(
                        isUnresolvedIncident
                    ).length
                );

                setUnacknowledgedCount(
                    incidents.filter(
                        isUnacknowledgedIncident
                    ).length
                );
            } catch (error) {
                console.error(
                    "Unable to load incident counts:",
                    error
                );

                setFeedback({
                    type: "error",
                    message:
                        "Unable to load incidents."
                });
            } finally {
                setLoading(false);
            }
        }, []);

    useEffect(() => {
        loadIncidentCounts();

        const interval =
            window.setInterval(
                loadIncidentCounts,
                30000
            );

        return () =>
            window.clearInterval(interval);
    }, [loadIncidentCounts]);

    async function handleAcknowledgeAll() {
        if (
            acknowledging ||
            unacknowledgedCount === 0
        ) {
            return;
        }

        setAcknowledging(true);
        setFeedback(null);

        try {
            const result =
                await acknowledgeAllIncidents();

            const acknowledgedCount =
                Number(
                    result?.data
                        ?.acknowledgedCount || 0
                );

            setUnacknowledgedCount(0);

            setFeedback({
                type: "success",
                message:
                    acknowledgedCount > 0
                        ? `${acknowledgedCount} incident(s) acknowledged successfully.`
                        : "There were no open incidents to acknowledge."
            });

            window.dispatchEvent(
                new Event(
                    "minerva:incidents-updated"
                )
            );

            await loadIncidentCounts();
        } catch (error) {
            console.error(
                "Unable to acknowledge incidents:",
                error
            );

            setFeedback({
                type: "error",
                message:
                    error.response?.data
                        ?.message ||
                    "Unable to acknowledge incidents."
            });
        } finally {
            setAcknowledging(false);
        }
    }

    return (
        <section className="rounded-[32px] border border-slate-800 bg-[#111827] p-6 shadow-xl shadow-black/20 sm:p-8">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-red-500/10 sm:h-16 sm:w-16">
                            <Bell
                                size={30}
                                className="text-red-400"
                            />
                        </div>

                        <div>
                            <p className="text-xs uppercase tracking-[0.24em] text-slate-500 sm:text-sm sm:tracking-[0.28em]">
                                Incident Management Center
                            </p>

                            <h1 className="mt-1 text-3xl font-black text-white sm:text-4xl">
                                Alerts Dashboard
                            </h1>
                        </div>
                    </div>

                    <p className="mt-6 max-w-3xl text-base leading-7 text-slate-400 sm:text-lg sm:leading-8">
                        Monitor active incidents,
                        system alerts, threshold
                        breaches, service outages and
                        operational events across your
                        hybrid cloud infrastructure.
                    </p>
                </div>

                <div className="grid gap-4 lg:min-w-72">
                    <div className="flex items-center justify-between gap-6 rounded-2xl border border-slate-800 bg-slate-900/50 px-5 py-4">
                        <div className="flex items-center gap-3">
                            <TriangleAlert
                                size={18}
                                className="shrink-0 text-red-400"
                            />

                            <span className="text-slate-300">
                                Active Incidents
                            </span>
                        </div>

                        <span className="font-bold text-red-400">
                            {loading
                                ? "..."
                                : activeCount}
                        </span>
                    </div>

                    <button
                        type="button"
                        onClick={
                            handleAcknowledgeAll
                        }
                        disabled={
                            loading ||
                            acknowledging ||
                            unacknowledgedCount === 0
                        }
                        className="
                            flex
                            items-center
                            justify-center
                            gap-3
                            rounded-2xl
                            bg-gradient-to-r
                            from-red-600
                            to-orange-600
                            px-6
                            py-4
                            font-semibold
                            text-white
                            transition
                            hover:scale-[1.02]
                            disabled:cursor-not-allowed
                            disabled:opacity-50
                            disabled:hover:scale-100
                        "
                    >
                        {acknowledging ? (
                            <LoaderCircle
                                size={18}
                                className="animate-spin"
                            />
                        ) : (
                            <CheckCheck size={18} />
                        )}

                        {acknowledging
                            ? "Acknowledging..."
                            : unacknowledgedCount > 0
                              ? `Acknowledge All (${unacknowledgedCount})`
                              : "All Acknowledged"}
                    </button>

                    {feedback && (
                        <div
                            role="status"
                            className={`
                                flex
                                items-start
                                gap-3
                                rounded-xl
                                border
                                px-4
                                py-3
                                text-sm
                                ${
                                    feedback.type ===
                                    "success"
                                        ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
                                        : "border-red-500/20 bg-red-500/10 text-red-300"
                                }
                            `}
                        >
                            {feedback.type ===
                            "success" ? (
                                <CircleCheck
                                    size={18}
                                    className="mt-0.5 shrink-0"
                                />
                            ) : (
                                <CircleAlert
                                    size={18}
                                    className="mt-0.5 shrink-0"
                                />
                            )}

                            <span>
                                {feedback.message}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}