import DashboardLayout from "../layouts/DashboardLayout";
import DashboardHeader from "../components/dashboard/DashboardHeader";

import StatCard from "../components/ui/StatCard";

import PerformanceChart from "../components/dashboard/widgets/PerformanceChart";
import AlertsPanel from "../components/dashboard/widgets/AlertsPanel";
import RunningServices from "../components/dashboard/widgets/RunningServices";
import SystemInformation from "../components/dashboard/widgets/SystemInformation";
import RecentActivity from "../components/dashboard/widgets/RecentActivity";

import useSystemMetrics from "../hooks/useSystemMetrics";

import {
    Cpu,
    MemoryStick,
    HardDrive,
    Server
} from "lucide-react";

/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

function metricStatus(value) {

    if (value >= 90) {
        return "critical";
    }

    if (value >= 75) {
        return "warning";
    }

    return "healthy";

}

function metricTrend(
    history
) {

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
            `${difference >= 0 ? "+" : ""}${difference.toFixed(1)}%`

    };

}

export default function Dashboard() {

    const {

        metrics,

        history,

        connected,

        loading

    } = useSystemMetrics();

    /*
    |--------------------------------------------------------------------------
    | Current Values
    |--------------------------------------------------------------------------
    */

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

    /*
    |--------------------------------------------------------------------------
    | Trends
    |--------------------------------------------------------------------------
    */

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

    /*
    |--------------------------------------------------------------------------
    | Display Values
    |--------------------------------------------------------------------------
    */

    const cpuValue =
        loading
            ? "0%"
            : `${cpuUsage.toFixed(1)}%`;

    const memoryValue =
        loading
            ? "0%"
            : `${memoryUsage.toFixed(1)}%`;

    const diskValue =
        loading
            ? "0%"
            : `${diskUsage.toFixed(1)}%`;

    return (

        <DashboardLayout>

            <DashboardHeader />

            {/* KPI Cards */}

            <section className="grid grid-cols-12 items-stretch gap-8">

                <div className="col-span-12 h-full md:col-span-6 xl:col-span-3">

                    <StatCard
                        title="CPU Usage"
                        value={cpuValue}
                        subtitle="Live processor utilization"
                        icon={Cpu}
                        color="blue"
                        progress={cpuUsage}
                        status={
                            metricStatus(
                                cpuUsage
                            )
                        }
                        change={
                            cpuTrend.change
                        }
                        trend={
                            cpuTrend.trend
                        }
                        sparklineData={
                            history.cpu.length
                                ? history.cpu
                                : [0]
                        }
                    />

                </div>

                <div className="col-span-12 h-full md:col-span-6 xl:col-span-3">

                    <StatCard
                        title="Memory"
                        value={memoryValue}
                        subtitle="Live RAM consumption"
                        icon={MemoryStick}
                        color="emerald"
                        progress={memoryUsage}
                        status={
                            metricStatus(
                                memoryUsage
                            )
                        }
                        change={
                            memoryTrend.change
                        }
                        trend={
                            memoryTrend.trend
                        }
                        sparklineData={
                            history.memory.length
                                ? history.memory
                                : [0]
                        }
                    />

                </div>

                <div className="col-span-12 h-full md:col-span-6 xl:col-span-3">

                    <StatCard
                        title="Storage"
                        value={diskValue}
                        subtitle="Live disk utilization"
                        icon={HardDrive}
                        color="purple"
                        progress={diskUsage}
                        status={
                            metricStatus(
                                diskUsage
                            )
                        }
                        change={
                            diskTrend.change
                        }
                        trend={
                            diskTrend.trend
                        }
                        sparklineData={
                            history.disk.length
                                ? history.disk
                                : [0]
                        }
                    />

                </div>

                <div className="col-span-12 h-full md:col-span-6 xl:col-span-3">

                    <StatCard
                        title="Active Hosts"
                        value={
                            metrics ? "1" : "0"
                        }
                        subtitle={
                            connected
                                ? `${metrics?.hostname || "Local host"} connected`
                                : "Waiting for monitoring connection"
                        }
                        icon={Server}
                        color="cyan"
                        progress={
                            connected
                                ? 100
                                : 0
                        }
                        status={
                            connected
                                ? "online"
                                : "offline"
                        }
                        change={
                            connected
                                ? "Live"
                                : "Offline"
                        }
                        trend={
                            connected
                                ? "up"
                                : "down"
                        }
                        sparklineData={
                            connected
                                ? [100, 100]
                                : [0, 0]
                        }
                    />

                </div>

            </section>

            {/* Large visible gap */}

            <div className="h-12"></div>

            {/* Analytics */}

            <section className="grid grid-cols-12 items-stretch gap-8">

                <div className="col-span-12 h-full xl:col-span-8">

                    <PerformanceChart
                        metrics={metrics}
                        history={history}
                        connected={connected}
                    />

                </div>

                <div className="col-span-12 h-full xl:col-span-4">

                    <AlertsPanel />

                </div>

            </section>

            {/* Large visible gap */}

            <div className="h-12"></div>

            {/* Infrastructure */}

            <section className="grid auto-rows-fr grid-cols-12 items-stretch gap-8">

                <div className="col-span-12 h-full lg:col-span-4">

                    <RunningServices />

                </div>

                <div className="col-span-12 h-full lg:col-span-4">

                    <SystemInformation />

                </div>

                <div className="col-span-12 h-full lg:col-span-4">

                    <RecentActivity />

                </div>

            </section>

        </DashboardLayout>

    );

}