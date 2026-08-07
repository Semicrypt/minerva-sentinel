import { useEffect, useState } from "react";

import DashboardLayout from "../layouts/DashboardLayout";
import StatCard from "../components/ui/StatCard";

import { getDashboardSummary } from "../services/dashboard.service";

import {
    Server,
    CheckCircle2,
    XCircle,
    Activity
} from "lucide-react";

export default function Dashboard() {

    const [summary, setSummary] = useState({

        totalServices: 0,

        onlineServices: 0,

        offlineServices: 0,

        averageResponse: 0

    });

    const [loading, setLoading] = useState(true);

    async function loadSummary() {

        try {

            setLoading(true);

            const token = localStorage.getItem("token");

            const result = await getDashboardSummary(token);

            if (result.success) {

                setSummary(result.data);

            }

        }

        catch (error) {

            console.error("Dashboard Error:", error);

        }

        finally {

            setLoading(false);

        }

    }

    useEffect(() => {

        loadSummary();

        const interval = setInterval(() => {

            loadSummary();

        }, 30000);

        return () => clearInterval(interval);

    }, []);

    return (

        <DashboardLayout>

            <div className="space-y-8">

                <div>

                    <h1 className="text-4xl font-bold">

                        Good Afternoon 👋

                    </h1>

                    <p className="mt-2 text-slate-400">

                        Welcome back to Miverna Sentinel.

                    </p>

                </div>

                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

                    <StatCard
                        title="Total Services"
                        value={loading ? "..." : summary.totalServices}
                        icon={<Server size={38} />}
                    />

                    <StatCard
                        title="Healthy"
                        value={loading ? "..." : summary.onlineServices}
                        icon={<CheckCircle2 size={38} />}
                        color="text-emerald-400"
                    />

                    <StatCard
                        title="Offline"
                        value={loading ? "..." : summary.offlineServices}
                        icon={<XCircle size={38} />}
                        color="text-red-400"
                    />

                    <StatCard
                        title="Avg Response"
                        value={
                            loading
                                ? "..."
                                : `${summary.averageResponse} ms`
                        }
                        icon={<Activity size={38} />}
                        color="text-cyan-400"
                    />

                </div>

            </div>

        </DashboardLayout>

    );

}