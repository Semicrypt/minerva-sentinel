import {
    Globe,
    Database,
    Server,
    Box,
    CheckCircle2,
    AlertTriangle,
    XCircle,
    MoreHorizontal
} from "lucide-react";

const services = [
    {
        id: 1,
        name: "Frontend Website",
        type: "Web Service",
        icon: Globe,
        status: "Online",
        uptime: "99.99%",
        response: "82 ms",
        color: "emerald"
    },
    {
        id: 2,
        name: "Backend API",
        type: "REST API",
        icon: Server,
        status: "Online",
        uptime: "99.95%",
        response: "115 ms",
        color: "emerald"
    },
    {
        id: 3,
        name: "PostgreSQL",
        type: "Database",
        icon: Database,
        status: "Warning",
        uptime: "98.40%",
        response: "320 ms",
        color: "yellow"
    },
    {
        id: 4,
        name: "Docker Engine",
        type: "Container",
        icon: Box,
        status: "Offline",
        uptime: "94.60%",
        response: "--",
        color: "red"
    }
];

const theme = {
    emerald: {
        icon: "text-emerald-400",
        bg: "bg-emerald-500/10",
        badge: "bg-emerald-500/15 text-emerald-400"
    },
    yellow: {
        icon: "text-yellow-400",
        bg: "bg-yellow-500/10",
        badge: "bg-yellow-500/15 text-yellow-400"
    },
    red: {
        icon: "text-red-400",
        bg: "bg-red-500/10",
        badge: "bg-red-500/15 text-red-400"
    }
};

function StatusIcon({ status }) {
    switch (status) {
        case "Online":
            return (
                <CheckCircle2
                    size={18}
                    className="text-emerald-400"
                />
            );

        case "Warning":
            return (
                <AlertTriangle
                    size={18}
                    className="text-yellow-400"
                />
            );

        default:
            return (
                <XCircle
                    size={18}
                    className="text-red-400"
                />
            );
    }
}

export default function RunningServices() {
    return (
        <div className="rounded-3xl border border-slate-800 bg-[#111827] p-8 shadow-xl shadow-black/20">

            {/* Header */}

            <div className="flex items-center justify-between">

                <div>

                    <h2 className="text-2xl font-semibold tracking-tight text-white">
                        Running Services
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-slate-400">
                        Live monitored endpoints across your infrastructure.
                    </p>

                </div>

                <button className="rounded-xl border border-slate-700 p-2.5 text-slate-400 transition hover:border-slate-500 hover:text-white">
                    <MoreHorizontal size={18} />
                </button>

            </div>

            <div className="my-8 border-b border-slate-800"></div>

            {/* Services */}

            <div className="space-y-5">

                {services.map((service) => {

                    const Icon = service.icon;
                    const style = theme[service.color];

                    return (

                        <div
                            key={service.id}
                            className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 transition-all duration-300 hover:border-blue-500/30 hover:-translate-y-1"
                        >

                            <div className="flex items-start justify-between">

                                <div className="flex gap-5">

                                    <div
                                        className={`flex h-14 w-14 items-center justify-center rounded-2xl ${style.bg}`}
                                    >

                                        <Icon
                                            size={24}
                                            className={style.icon}
                                        />

                                    </div>

                                    <div>

                                        <h3 className="text-lg font-semibold text-white">
                                            {service.name}
                                        </h3>

                                        <p className="mt-1 text-sm text-slate-400">
                                            {service.type}
                                        </p>

                                    </div>

                                </div>

                                <span
                                    className={`rounded-full px-3.5 py-1.5 text-sm font-semibold ${style.badge}`}
                                >
                                    {service.status}
                                </span>

                            </div>

                            <div className="mt-6 grid grid-cols-2 gap-6">

                                <div>

                                    <p className="text-sm text-slate-500">
                                        Uptime
                                    </p>

                                    <p className="mt-2 text-lg font-semibold text-white">
                                        {service.uptime}
                                    </p>

                                </div>

                                <div>

                                    <p className="text-sm text-slate-500">
                                        Response
                                    </p>

                                    <p className="mt-2 text-lg font-semibold text-white">
                                        {service.response}
                                    </p>

                                </div>

                            </div>

                            <div className="mt-6 flex items-center gap-3 border-t border-slate-800 pt-5">

                                <StatusIcon status={service.status} />

                                <span className="text-sm leading-6 text-slate-300">

                                    {service.status === "Online"
                                        ? "Service responding normally."
                                        : service.status === "Warning"
                                        ? "Higher response latency detected."
                                        : "Service is currently unreachable."}

                                </span>

                            </div>

                        </div>

                    );

                })}

            </div>

        </div>
    );
}