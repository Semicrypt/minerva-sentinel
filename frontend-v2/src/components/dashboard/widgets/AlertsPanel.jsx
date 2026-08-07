import {
    AlertTriangle,
    CheckCircle2,
    ShieldAlert,
    Clock3
} from "lucide-react";

const alerts = [
    {
        id: 1,
        level: "Critical",
        title: "CPU usage exceeded 90%",
        host: "web-server-01",
        time: "2 min ago",
        color: "red"
    },
    {
        id: 2,
        level: "Warning",
        title: "Memory usage is above threshold",
        host: "database-node",
        time: "8 min ago",
        color: "yellow"
    },
    {
        id: 3,
        level: "Healthy",
        title: "Docker service recovered",
        host: "docker-engine",
        time: "12 min ago",
        color: "green"
    }
];

const styles = {
    red: {
        badge: "bg-red-500/15 text-red-400",
        border: "border-red-500/20"
    },
    yellow: {
        badge: "bg-yellow-500/15 text-yellow-400",
        border: "border-yellow-500/20"
    },
    green: {
        badge: "bg-emerald-500/15 text-emerald-400",
        border: "border-emerald-500/20"
    }
};

function StatusIcon({ color }) {

    if (color === "red") {
        return <ShieldAlert size={20} className="text-red-400" />;
    }

    if (color === "yellow") {
        return <AlertTriangle size={20} className="text-yellow-400" />;
    }

    return <CheckCircle2 size={20} className="text-emerald-400" />;

}

export default function AlertsPanel() {

    return (

        <div className="flex h-full flex-col rounded-3xl border border-slate-800 bg-[#111827] p-8 shadow-xl shadow-black/20">

            {/* Header */}

            <div className="flex items-center justify-between">

                <div>

                    <h2 className="text-2xl font-semibold tracking-tight text-white">

                        Active Alerts

                    </h2>

                    <p className="mt-2 text-sm leading-6 text-slate-400">

                        Latest monitoring events requiring your attention.

                    </p>

                </div>

                <div className="rounded-full bg-red-500/15 px-4 py-2 text-sm font-semibold text-red-400">

                    {alerts.length} Active

                </div>

            </div>

            <div className="my-8 border-b border-slate-800"></div>

            {/* Alert List */}

            <div className="flex-1 space-y-5">

                {alerts.map((alert) => {

                    const theme = styles[alert.color];

                    return (

                        <div
                            key={alert.id}
                            className={`rounded-2xl border ${theme.border} bg-slate-900/50 p-5 transition-all duration-300 hover:border-slate-600 hover:-translate-y-1`}
                        >

                            <div className="flex items-start justify-between gap-4">

                                <div className="flex gap-4">

                                    <div className="mt-1 flex h-11 w-11 items-center justify-center rounded-xl bg-slate-800">

                                        <StatusIcon color={alert.color} />

                                    </div>

                                    <div>

                                        <h3 className="text-base font-semibold text-white">

                                            {alert.title}

                                        </h3>

                                        <p className="mt-2 text-sm text-slate-400">

                                            {alert.host}

                                        </p>

                                    </div>

                                </div>

                                <span
                                    className={`rounded-full px-3 py-1.5 text-sm font-semibold ${theme.badge}`}
                                >

                                    {alert.level}

                                </span>

                            </div>

                            <div className="mt-5 flex items-center gap-2 text-sm text-slate-500">

                                <Clock3 size={15} />

                                {alert.time}

                            </div>

                        </div>

                    );

                })}

            </div>

            {/* Footer */}

            <div className="mt-auto pt-8">

                <div className="border-t border-slate-800 mb-8"></div>

                <div className="rounded-2xl border border-blue-500/20 bg-blue-500/10 p-6">

                    <p className="text-base font-semibold text-blue-300">

                        Monitoring Status

                    </p>

                    <p className="mt-3 text-sm leading-6 text-slate-300">

                        All monitoring agents are connected and reporting successfully.

                    </p>

                </div>

            </div>

        </div>

    );

}