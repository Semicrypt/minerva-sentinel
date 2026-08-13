import {
    Activity,
    AlertCircle,
    CheckCircle2,
    Globe,
    RefreshCw,
    Server
} from "lucide-react";

import {
    useCallback,
    useEffect,
    useState
} from "react";

import api from "../../services/api";

const policyStyles = {
    HOST_RESOURCES: {
        icon: Activity,
        color: "text-amber-400",
        background: "bg-amber-500/10",
        label: "Host Resources"
    },

    HOST_HEARTBEAT: {
        icon: Server,
        color: "text-cyan-400",
        background: "bg-cyan-500/10",
        label: "Host Heartbeat"
    },

    SERVICE_HEALTH: {
        icon: Globe,
        color: "text-violet-400",
        background: "bg-violet-500/10",
        label: "Service Health"
    }
};

const defaultStyle = {
    icon: AlertCircle,
    color: "text-slate-300",
    background: "bg-slate-700/50",
    label: "Monitoring Rule"
};

export default function AlertPolicies() {
    const [policies, setPolicies] =
        useState([]);
    const [enabledCount, setEnabledCount] =
        useState(0);
    const [loading, setLoading] =
        useState(true);
    const [refreshing, setRefreshing] =
        useState(false);
    const [error, setError] =
        useState("");

    const loadPolicies = useCallback(
        async (manualRefresh = false) => {
            if (manualRefresh) {
                setRefreshing(true);
            }

            try {
                setError("");

                const response = await api.get(
                    "/alert-policies"
                );

                const responseData =
                    response.data?.data;

                const receivedPolicies =
                    Array.isArray(
                        responseData?.policies
                    )
                        ? responseData.policies
                        : [];

                setPolicies(receivedPolicies);
                setEnabledCount(
                    Number(
                        responseData?.enabledCount
                    ) || 0
                );
            } catch (requestError) {
                console.error(
                    "Unable to load alert policies:",
                    requestError
                );

                setError(
                    requestError.response?.data
                        ?.message ||
                    "Unable to load alert policies."
                );
            } finally {
                setLoading(false);
                setRefreshing(false);
            }
        },
        []
    );

    useEffect(() => {
        loadPolicies();
    }, [loadPolicies]);

    return (
        <section className="rounded-3xl border border-slate-800 bg-[#111827] p-6 sm:p-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-white">
                        Alert Policies
                    </h2>

                    <p className="mt-2 text-slate-400">
                        Monitoring rules currently
                        enforced by the Minerva Sentinel
                        backend.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    {!loading && !error && (
                        <span className="rounded-full bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-400">
                            {enabledCount}{" "}
                            {enabledCount === 1
                                ? "Policy"
                                : "Policies"}{" "}
                            Enabled
                        </span>
                    )}

                    <button
                        type="button"
                        onClick={() =>
                            loadPolicies(true)
                        }
                        disabled={
                            loading || refreshing
                        }
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 font-semibold text-slate-200 transition hover:border-cyan-500/60 hover:text-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <RefreshCw
                            size={17}
                            className={
                                refreshing
                                    ? "animate-spin"
                                    : ""
                            }
                        />

                        {refreshing
                            ? "Refreshing..."
                            : "Refresh"}
                    </button>
                </div>
            </div>

            {loading && (
                <div className="mt-8 space-y-5">
                    {[1, 2, 3].map(item => (
                        <div
                            key={item}
                            className="h-32 animate-pulse rounded-2xl border border-slate-800 bg-slate-900/40"
                        />
                    ))}
                </div>
            )}

            {!loading && error && (
                <div className="mt-8 rounded-2xl border border-red-500/30 bg-red-500/10 p-6">
                    <div className="flex items-start gap-3">
                        <AlertCircle
                            size={22}
                            className="mt-0.5 shrink-0 text-red-400"
                        />

                        <div>
                            <h3 className="font-semibold text-red-300">
                                Policies unavailable
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
                policies.length === 0 && (
                    <div className="mt-8 rounded-2xl border border-dashed border-slate-700 bg-slate-900/30 px-6 py-12 text-center">
                        <AlertCircle
                            size={36}
                            className="mx-auto text-slate-500"
                        />

                        <h3 className="mt-4 text-lg font-semibold text-white">
                            No policies configured
                        </h3>

                        <p className="mt-2 text-slate-400">
                            No backend monitoring rules
                            were returned.
                        </p>
                    </div>
                )}

            {!loading &&
                !error &&
                policies.length > 0 && (
                    <div className="mt-8 space-y-5">
                        {policies.map(policy => {
                            const style =
                                policyStyles[
                                    policy.category
                                ] || defaultStyle;

                            const Icon = style.icon;

                            const isActive =
                                policy.status ===
                                "ACTIVE";

                            return (
                                <article
                                    key={policy.id}
                                    className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 transition hover:border-cyan-500/30"
                                >
                                    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                                        <div className="flex items-start gap-5">
                                            <div
                                                className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${style.background}`}
                                            >
                                                <Icon
                                                    size={
                                                        27
                                                    }
                                                    className={
                                                        style.color
                                                    }
                                                />
                                            </div>

                                            <div>
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <h3 className="text-lg font-bold text-white">
                                                        {
                                                            policy.name
                                                        }
                                                    </h3>

                                                    <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-400">
                                                        {
                                                            style.label
                                                        }
                                                    </span>
                                                </div>

                                                <p className="mt-3 leading-6 text-slate-400">
                                                    {
                                                        policy.condition
                                                    }
                                                </p>
                                            </div>
                                        </div>

                                        <div className="shrink-0">
                                            <p className="text-sm text-slate-500">
                                                Status
                                            </p>

                                            <div className="mt-2 flex items-center gap-2">
                                                {isActive ? (
                                                    <CheckCircle2
                                                        size={
                                                            18
                                                        }
                                                        className="text-emerald-400"
                                                    />
                                                ) : (
                                                    <AlertCircle
                                                        size={
                                                            18
                                                        }
                                                        className="text-slate-500"
                                                    />
                                                )}

                                                <span
                                                    className={
                                                        isActive
                                                            ? "font-semibold text-emerald-400"
                                                            : "font-semibold text-slate-400"
                                                    }
                                                >
                                                    {isActive
                                                        ? "Active"
                                                        : "Inactive"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}
        </section>
    );
}