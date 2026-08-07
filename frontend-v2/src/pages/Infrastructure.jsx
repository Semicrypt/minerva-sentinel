import {
    useEffect,
    useMemo,
    useState
} from "react";

import DashboardLayout from "../layouts/DashboardLayout";

import InfrastructureToolbar from "../components/infrastructure/InfrastructureToolbar";
import HostGrid from "../components/infrastructure/HostGrid";
import AddHostModal from "../components/infrastructure/AddHostModal";

import StatCard from "../components/ui/StatCard";

import {
    Server,
    CheckCircle2,
    AlertTriangle,
    XCircle
} from "lucide-react";

import {
    getHosts
} from "../services/host.service";

/*
|--------------------------------------------------------------------------
| Helper: Format Uptime
|--------------------------------------------------------------------------
*/

function formatUptime(seconds) {

    const totalSeconds =
        Number(seconds || 0);

    if (!Number.isFinite(totalSeconds)) {

        return "--";

    }

    const days =
        Math.floor(
            totalSeconds / 86400
        );

    const hours =
        Math.floor(
            (totalSeconds % 86400) / 3600
        );

    const minutes =
        Math.floor(
            (totalSeconds % 3600) / 60
        );

    if (days > 0) {

        return `${days}d ${hours}h`;

    }

    if (hours > 0) {

        return `${hours}h ${minutes}m`;

    }

    return `${minutes}m`;

}

/*
|--------------------------------------------------------------------------
| Helper: Normalize Backend Status
|--------------------------------------------------------------------------
*/

function normalizeStatus(status) {

    const value =
        String(
            status || ""
        ).toUpperCase();

    switch (value) {

        case "ONLINE":

            return "Online";

        case "WARNING":

            return "Warning";

        case "OFFLINE":

            return "Offline";

        default:

            return "Offline";

    }

}

/*
|--------------------------------------------------------------------------
| Helper: Status Color
|--------------------------------------------------------------------------
*/

function getStatusColor(status) {

    switch (status) {

        case "Online":

            return "emerald";

        case "Warning":

            return "orange";

        case "Offline":

            return "red";

        default:

            return "blue";

    }

}

/*
|--------------------------------------------------------------------------
| Helper: Normalize Backend Host
|--------------------------------------------------------------------------
*/

function normalizeHost(host) {

    const status =
        normalizeStatus(
            host.status
        );

    const platform =
        host.platform
            ? String(
                host.platform
            )
                .charAt(0)
                .toUpperCase() +
              String(
                  host.platform
              )
                  .slice(1)
                  .toLowerCase()
            : "Unknown";

    return {

        id:
            host.id,

        name:
            host.hostname,

        os:
            `${platform} • ${host.architecture || "Unknown architecture"}`,

        platform,

        status,

        cpu:
            Number(
                host.latest_cpu || 0
            ),

        memory:
            Number(
                host.latest_memory || 0
            ),

        disk:
            Number(
                host.latest_disk || 0
            ),

        uptime:
            formatUptime(
                host.latest_uptime
            ),

        lastSeen:
            host.last_seen,

        color:
            getStatusColor(
                status
            )

    };

}

/*
|--------------------------------------------------------------------------
| Infrastructure Page
|--------------------------------------------------------------------------
*/

export default function Infrastructure() {

    const [hosts, setHosts] =
        useState([]);

    const [searchQuery, setSearchQuery] =
        useState("");

    const [statusFilter, setStatusFilter] =
        useState("All");

    const [platformFilter, setPlatformFilter] =
        useState("All");

    const [isAddHostOpen, setIsAddHostOpen] =
        useState(false);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState(null);

    /*
    |--------------------------------------------------------------------------
    | Load Hosts
    |--------------------------------------------------------------------------
    */

    async function loadHosts() {

        try {

            setError(null);

            const data =
                await getHosts();

            const normalized =
                Array.isArray(data)
                    ? data.map(
                        normalizeHost
                    )
                    : [];

            setHosts(
                normalized
            );

        }

        catch (requestError) {

            console.error(
                "Unable to load infrastructure hosts:",
                requestError
            );

            setError(
                "Unable to load infrastructure hosts."
            );

        }

        finally {

            setLoading(false);

        }

    }

    /*
    |--------------------------------------------------------------------------
    | Initial Load + Refresh
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        loadHosts();

        const interval =
            setInterval(
                loadHosts,
                5000
            );

        return () =>
            clearInterval(
                interval
            );

    }, []);

    /*
    |--------------------------------------------------------------------------
    | Filtered Hosts
    |--------------------------------------------------------------------------
    */

    const filteredHosts =
        useMemo(
            () => {

                return hosts.filter(
                    host => {

                        const search =
                            searchQuery
                                .toLowerCase();

                        const matchesSearch =

                            host.name
                                .toLowerCase()
                                .includes(
                                    search
                                ) ||

                            host.os
                                .toLowerCase()
                                .includes(
                                    search
                                );

                        const matchesStatus =

                            statusFilter === "All" ||

                            host.status ===
                                statusFilter;

                        const matchesPlatform =

                            platformFilter === "All" ||

                            host.platform ===
                                platformFilter;

                        return (
                            matchesSearch &&
                            matchesStatus &&
                            matchesPlatform
                        );

                    }
                );

            },
            [
                hosts,
                searchQuery,
                statusFilter,
                platformFilter
            ]
        );

    /*
    |--------------------------------------------------------------------------
    | Counts
    |--------------------------------------------------------------------------
    */

    const totalHosts =
        hosts.length;

    const onlineHosts =
        hosts.filter(
            host =>
                host.status ===
                "Online"
        ).length;

    const warningHosts =
        hosts.filter(
            host =>
                host.status ===
                "Warning"
        ).length;

    const offlineHosts =
        hosts.filter(
            host =>
                host.status ===
                "Offline"
        ).length;

    /*
    |--------------------------------------------------------------------------
    | Page
    |--------------------------------------------------------------------------
    */

    return (

        <DashboardLayout>

            <section className="mt-8 mb-12 grid grid-cols-12 gap-6">

                <div className="col-span-12 md:col-span-6 xl:col-span-3">

                    <StatCard
                        title="Total Hosts"
                        value={
                            loading
                                ? 0
                                : totalHosts
                        }
                        subtitle="Registered infrastructure"
                        icon={Server}
                        color="blue"
                        progress={
                            totalHosts > 0
                                ? 100
                                : 0
                        }
                        status="healthy"
                        change="Live"
                        trend="up"
                    />

                </div>

                <div className="col-span-12 md:col-span-6 xl:col-span-3">

                    <StatCard
                        title="Online"
                        value={
                            loading
                                ? 0
                                : onlineHosts
                        }
                        subtitle="Healthy hosts"
                        icon={CheckCircle2}
                        color="emerald"
                        progress={
                            totalHosts > 0
                                ? Math.round(
                                    (
                                        onlineHosts /
                                        totalHosts
                                    ) * 100
                                )
                                : 0
                        }
                        status="healthy"
                        change="Live"
                        trend="up"
                    />

                </div>

                <div className="col-span-12 md:col-span-6 xl:col-span-3">

                    <StatCard
                        title="Warning"
                        value={
                            loading
                                ? 0
                                : warningHosts
                        }
                        subtitle="Require attention"
                        icon={AlertTriangle}
                        color="orange"
                        progress={
                            totalHosts > 0
                                ? Math.round(
                                    (
                                        warningHosts /
                                        totalHosts
                                    ) * 100
                                )
                                : 0
                        }
                        status={
                            warningHosts > 0
                                ? "warning"
                                : "healthy"
                        }
                        change="Live"
                        trend="down"
                    />

                </div>

                <div className="col-span-12 md:col-span-6 xl:col-span-3">

                    <StatCard
                        title="Offline"
                        value={
                            loading
                                ? 0
                                : offlineHosts
                        }
                        subtitle="Unavailable hosts"
                        icon={XCircle}
                        color="red"
                        progress={
                            totalHosts > 0
                                ? Math.round(
                                    (
                                        offlineHosts /
                                        totalHosts
                                    ) * 100
                                )
                                : 0
                        }
                        status={
                            offlineHosts > 0
                                ? "critical"
                                : "healthy"
                        }
                        change="Live"
                        trend="down"
                    />

                </div>

            </section>

            {
                error && (

                    <div className="mb-8 rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-red-300">

                        {error}

                    </div>

                )
            }

            <section className="mb-10">

                <InfrastructureToolbar
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    statusFilter={statusFilter}
                    setStatusFilter={setStatusFilter}
                    platformFilter={platformFilter}
                    setPlatformFilter={setPlatformFilter}
                    onAddHostClick={
                        () =>
                            setIsAddHostOpen(
                                true
                            )
                    }
                />

            </section>

            <section className="pb-8">

                {
                    loading
                        ? (

                            <div className="rounded-3xl border border-slate-800 bg-[#111827] py-24 text-center text-slate-400">

                                Loading infrastructure...

                            </div>

                        )
                        : (

                            <HostGrid
                                hosts={
                                    filteredHosts
                                }
                            />

                        )
                }

            </section>

            <AddHostModal
                open={
                    isAddHostOpen
                }
                onClose={
                    () =>
                        setIsAddHostOpen(
                            false
                        )
                }
            />

        </DashboardLayout>

    );

}