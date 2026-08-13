import {
    Link
} from "react-router-dom";

import {
    AlertTriangle,
    Cpu,
    HardDrive,
    LoaderCircle,
    MemoryStick,
    Server,
    WifiOff
} from "lucide-react";

import DashboardLayout from
    "../layouts/DashboardLayout";

import DashboardHeader from
    "../components/dashboard/DashboardHeader";

import StatCard from
    "../components/ui/StatCard";

import AlertsPanel from
    "../components/dashboard/widgets/AlertsPanel";

import useSystemMetrics from
    "../hooks/useSystemMetrics";

function metricStatus(value) {
    if (value >= 90) {
        return "critical";
    }

    if (value >= 75) {
        return "warning";
    }

    return "healthy";
}

function metricTrend(history) {
    if (
        !history ||
        history.length < 2
    ) {
        return {
            trend: "up",
            change: "0%"
        };
    }

    const previous =
        history[
            history.length - 2
        ];

    const current =
        history[
            history.length - 1
        ];

    const difference =
        current - previous;

    return {
        trend:
            difference >= 0
                ? "up"
                : "down",

        change:
            `${difference >= 0 ? "+" : ""}` +
            `${difference.toFixed(1)}%`
    };
}

function InfrastructureState({
    loading,
    error,
    hostCount
}) {
    if (loading) {
        return (
            <section className="rounded-3xl border border-slate-800 bg-[#111827] px-6 py-16 text-center">
                <LoaderCircle
                    size={38}
                    className="mx-auto animate-spin text-cyan-400"
                />

                <h2 className="mt-5 text-xl font-bold text-white">
                    Loading your infrastructure
                </h2>
            </section>
        );
    }

    if (error) {
        return (
            <section className="rounded-3xl border border-red-500/20 bg-red-500/5 px-6 py-16 text-center">
                <AlertTriangle
                    size={40}
                    className="mx-auto text-red-400"
                />

                <h2 className="mt-5 text-xl font-bold text-white">
                    Infrastructure unavailable
                </h2>

                <p className="mx-auto mt-3 max-w-xl text-slate-400">
                    {error}
                </p>
            </section>
        );
    }

    const hasRegisteredHosts =
        hostCount > 0;

    return (
        <section className="rounded-3xl border border-dashed border-slate-700 bg-[#111827] px-6 py-16 text-center">
            <WifiOff
                size={44}
                className="mx-auto text-amber-400"
            />

            <h2 className="mt-5 text-2xl font-bold text-white">
                {hasRegisteredHosts
                    ? "No hosts currently reporting"
                    : "No monitored hosts yet"}
            </h2>

            <p className="mx-auto mt-3 max-w-2xl leading-7 text-slate-400">
                {hasRegisteredHosts
                    ? "This account has registered hosts, but none are currently online. Start the monitoring agent to resume genuine host metrics."
                    : "This account has no connected monitoring hosts. Connect a host before CPU, memory, storage and uptime information can appear."}
            </p>

            <Link
                to="/infrastructure"
                className="mt-7 inline-flex rounded-xl bg-cyan-500 px-5 py-3 font-bold text-slate-950 transition hover:bg-cyan-400"
            >
                Open Infrastructure
            </Link>
        </section>
    );
}

export default function Dashboard() {
    const {
        metrics,
        history,
        connected,
        loading,
        error,
        hostCount,
        activeHostCount
    } = useSystemMetrics();

    const cpuUsage =
        Number(
            metrics?.cpu?.usage || 0
        );

    const memoryUsage =
        Number(
            metrics?.memory?.usage || 0
        );

    const diskUsage =
        Number(
            metrics?.disk?.usage || 0
        );

    const cpuTrend =
        metricTrend(
            history.cpu
        );

    const memoryTrend =
        metricTrend(
            history.memory
        );

    const diskTrend =
        metricTrend(
            history.disk
        );

    const showInfrastructure =
        !loading &&
        !error &&
        connected &&
        Boolean(metrics);

    return (
        <DashboardLayout>
            <DashboardHeader />

            {!showInfrastructure ? (
                <InfrastructureState
                    loading={loading}
                    error={error}
                    hostCount={hostCount}
                />
            ) : (
                <>
                    <section className="grid grid-cols-12 items-stretch gap-8">
                        <div className="col-span-12 h-full md:col-span-6 xl:col-span-3">
                            <StatCard
                                title="CPU Usage"
                                value={`${cpuUsage.toFixed(1)}%`}
                                subtitle="Account-owned active hosts"
                                icon={Cpu}
                                color="blue"
                                progress={cpuUsage}
                                status={
                                    metricStatus(
                                        cpuUsage
                                    )
                                }
                                change={cpuTrend.change}
                                trend={cpuTrend.trend}
                                sparklineData={
                                    history.cpu.length
                                        ? history.cpu
                                        : [cpuUsage]
                                }
                            />
                        </div>

                        <div className="col-span-12 h-full md:col-span-6 xl:col-span-3">
                            <StatCard
                                title="Memory"
                                value={`${memoryUsage.toFixed(1)}%`}
                                subtitle="Account-owned active hosts"
                                icon={MemoryStick}
                                color="emerald"
                                progress={memoryUsage}
                                status={
                                    metricStatus(
                                        memoryUsage
                                    )
                                }
                                change={memoryTrend.change}
                                trend={memoryTrend.trend}
                                sparklineData={
                                    history.memory.length
                                        ? history.memory
                                        : [memoryUsage]
                                }
                            />
                        </div>

                        <div className="col-span-12 h-full md:col-span-6 xl:col-span-3">
                            <StatCard
                                title="Storage"
                                value={`${diskUsage.toFixed(1)}%`}
                                subtitle="Account-owned active hosts"
                                icon={HardDrive}
                                color="purple"
                                progress={diskUsage}
                                status={
                                    metricStatus(
                                        diskUsage
                                    )
                                }
                                change={diskTrend.change}
                                trend={diskTrend.trend}
                                sparklineData={
                                    history.disk.length
                                        ? history.disk
                                        : [diskUsage]
                                }
                            />
                        </div>

                        <div className="col-span-12 h-full md:col-span-6 xl:col-span-3">
                            <StatCard
                                title="Active Hosts"
                                value={String(
                                    activeHostCount
                                )}
                                subtitle={`${activeHostCount} of ${hostCount} registered hosts reporting`}
                                icon={Server}
                                color="cyan"
                                progress={
                                    hostCount > 0
                                        ? (
                                            activeHostCount /
                                            hostCount
                                        ) * 100
                                        : 0
                                }
                                status="online"
                                change="Live"
                                trend="up"
                                sparklineData={[
                                    activeHostCount,
                                    activeHostCount
                                ]}
                            />
                        </div>
                    </section>

                    <div className="h-12" />

                    <section className="grid grid-cols-12 gap-8">
                        <div className="col-span-12 rounded-3xl border border-slate-800 bg-[#111827] p-8 xl:col-span-8">
                            <h2 className="text-2xl font-bold text-white">
                                Account-scoped host metrics
                            </h2>

                            <p className="mt-3 max-w-3xl leading-7 text-slate-400">
                                These current values come
                                only from active hosts owned
                                by this account. Historical
                                charts are temporarily hidden
                                until metric history is linked
                                securely to host ownership.
                            </p>
                        </div>

                        <div className="col-span-12 xl:col-span-4">
                            <AlertsPanel />
                        </div>
                    </section>
                </>
            )}
        </DashboardLayout>
    );
}