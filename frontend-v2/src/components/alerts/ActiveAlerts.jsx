import {
    Cpu,
    HardDrive,
    Database,
    Globe,
    ShieldAlert,
    CheckCircle2,
    User
} from "lucide-react";

const alerts = [

    {
        icon: Cpu,
        title: "High CPU Utilization",
        service: "Production API Server",
        severity: "Critical",
        detected: "2 min ago",
        engineer: "DevOps Team",
        status: "Open",
        color: "text-red-400"
    },

    {
        icon: HardDrive,
        title: "Disk Usage Threshold Exceeded",
        service: "Database Storage",
        severity: "Warning",
        detected: "8 min ago",
        engineer: "Infrastructure",
        status: "Investigating",
        color: "text-amber-400"
    },

    {
        icon: Database,
        title: "PostgreSQL Connection Latency",
        service: "Primary Database",
        severity: "Critical",
        detected: "14 min ago",
        engineer: "Database Team",
        status: "Open",
        color: "text-red-400"
    },

    {
        icon: Globe,
        title: "API Response Time Increased",
        service: "Gateway Service",
        severity: "Warning",
        detected: "23 min ago",
        engineer: "Backend Team",
        status: "Monitoring",
        color: "text-orange-400"
    }

];

export default function ActiveAlerts() {

    return (

        <section className="rounded-3xl border border-slate-800 bg-[#111827] p-8">

            <div className="flex items-center justify-between">

                <div>

                    <h2 className="text-3xl font-bold text-white">

                        Active Alerts

                    </h2>

                    <p className="mt-2 text-slate-400">

                        Current incidents requiring investigation or action.

                    </p>

                </div>

                <span className="rounded-full bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-400">

                    4 Active Incidents

                </span>

            </div>

            <div className="mt-8 space-y-5">

                {

                    alerts.map((alert) => {

                        const Icon = alert.icon;

                        return (

                            <div
                                key={alert.title}
                                className="
                                    rounded-2xl
                                    border
                                    border-slate-800
                                    bg-slate-900/40
                                    p-6
                                    transition
                                    hover:border-red-500/30
                                "
                            >

                                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

                                    <div className="flex items-start gap-5">

                                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-800">

                                            <Icon
                                                size={28}
                                                className={alert.color}
                                            />

                                        </div>

                                        <div>

                                            <h3 className="text-xl font-bold text-white">

                                                {alert.title}

                                            </h3>

                                            <p className="mt-2 text-slate-400">

                                                {alert.service}

                                            </p>

                                            <div className="mt-4 flex flex-wrap gap-3">

                                                <span
                                                    className={`
                                                        rounded-full
                                                        px-3
                                                        py-1
                                                        text-sm
                                                        font-semibold
                                                        ${
                                                            alert.severity === "Critical"
                                                                ? "bg-red-500/10 text-red-400"
                                                                : "bg-amber-500/10 text-amber-400"
                                                        }
                                                    `}
                                                >
                                                    {alert.severity}
                                                </span>

                                                <span className="rounded-full bg-slate-800 px-3 py-1 text-sm text-slate-300">

                                                    {alert.detected}

                                                </span>

                                            </div>

                                        </div>

                                    </div>

                                    <div className="grid gap-5 text-right">

                                        <div>

                                            <p className="text-sm text-slate-500">

                                                Assigned Team

                                            </p>

                                            <div className="mt-2 flex items-center justify-end gap-2">

                                                <User
                                                    size={16}
                                                    className="text-cyan-400"
                                                />

                                                <span className="font-semibold text-white">

                                                    {alert.engineer}

                                                </span>

                                            </div>

                                        </div>

                                        <div>

                                            <p className="text-sm text-slate-500">

                                                Status

                                            </p>

                                            <p className={`mt-2 font-bold ${alert.color}`}>

                                                {alert.status}

                                            </p>

                                        </div>

                                    </div>

                                </div>

                                <div className="mt-6 flex flex-wrap gap-4">

                                    <button
                                        className="
                                            rounded-xl
                                            bg-red-600
                                            px-5
                                            py-3
                                            font-semibold
                                            text-white
                                            transition
                                            hover:bg-red-500
                                        "
                                    >

                                        <ShieldAlert
                                            size={18}
                                            className="mr-2 inline"
                                        />

                                        Acknowledge

                                    </button>

                                    <button
                                        className="
                                            rounded-xl
                                            border
                                            border-emerald-500/30
                                            bg-emerald-500/10
                                            px-5
                                            py-3
                                            font-semibold
                                            text-emerald-400
                                            transition
                                            hover:bg-emerald-500/20
                                        "
                                    >

                                        <CheckCircle2
                                            size={18}
                                            className="mr-2 inline"
                                        />

                                        Resolve

                                    </button>

                                </div>

                            </div>

                        );

                    })

                }

            </div>

        </section>

    );

}