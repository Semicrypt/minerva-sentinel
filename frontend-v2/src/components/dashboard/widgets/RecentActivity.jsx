import {
    Activity,
    AlertTriangle,
    CheckCircle2,
    Cpu,
    Database,
    Globe,
    Server,
    Clock3
} from "lucide-react";

const activities = [
    {
        id: 1,
        icon: Cpu,
        color: "text-blue-400",
        bg: "bg-blue-500/10",
        title: "CPU usage reached 87%",
        description: "web-server-01 exceeded the configured threshold.",
        time: "2 minutes ago"
    },
    {
        id: 2,
        icon: Database,
        color: "text-yellow-400",
        bg: "bg-yellow-500/10",
        title: "Database latency increased",
        description: "PostgreSQL response time reached 320 ms.",
        time: "8 minutes ago"
    },
    {
        id: 3,
        icon: CheckCircle2,
        color: "text-emerald-400",
        bg: "bg-emerald-500/10",
        title: "Docker recovered",
        description: "Container engine is responding normally again.",
        time: "13 minutes ago"
    },
    {
        id: 4,
        icon: Globe,
        color: "text-cyan-400",
        bg: "bg-cyan-500/10",
        title: "Website health check passed",
        description: "Frontend endpoint returned HTTP 200.",
        time: "20 minutes ago"
    },
    {
        id: 5,
        icon: AlertTriangle,
        color: "text-red-400",
        bg: "bg-red-500/10",
        title: "Memory threshold exceeded",
        description: "Application memory usage exceeded 80%.",
        time: "35 minutes ago"
    },
    {
        id: 6,
        icon: Server,
        color: "text-purple-400",
        bg: "bg-purple-500/10",
        title: "Monitoring agent synchronized",
        description: "Latest metrics successfully uploaded.",
        time: "1 hour ago"
    }
];

export default function RecentActivity() {

    return (

        <div className="flex h-full flex-col rounded-3xl border border-slate-800 bg-[#111827] p-8 shadow-xl shadow-black/20">

            {/* Header */}

            <div className="flex items-center justify-between">

                <div>

                    <h2 className="flex items-center gap-3 text-2xl font-semibold tracking-tight text-white">

                        <Activity
                            size={24}
                            className="text-blue-400"
                        />

                        Recent Activity

                    </h2>

                    <p className="mt-2 text-sm leading-6 text-slate-400">

                        Latest monitoring events detected by Minerva Sentinel.

                    </p>

                </div>

                <div className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-medium text-slate-400">

                    Live Feed

                </div>

            </div>

            <div className="my-8 border-b border-slate-800"></div>

            {/* Timeline */}

            <div className="flex-1 space-y-5">

                {activities.map((item) => {

                    const Icon = item.icon;

                    return (

                        <div
                            key={item.id}
                            className="
                                flex
                                gap-5
                                rounded-2xl
                                border
                                border-slate-800
                                bg-slate-900/40
                                p-5
                                transition-all
                                duration-300
                                hover:border-blue-500/30
                                hover:-translate-y-1
                            "
                        >

                            <div
                                className={`
                                    flex
                                    h-14
                                    w-14
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-2xl
                                    ${item.bg}
                                `}
                            >

                                <Icon
                                    size={24}
                                    className={item.color}
                                />

                            </div>

                            <div className="min-w-0 flex-1">

                                <div className="flex items-start justify-between gap-4">

                                    <h3 className="text-base font-semibold leading-7 text-white">

                                        {item.title}

                                    </h3>

                                    <div className="flex shrink-0 items-center gap-2 text-sm text-slate-500">

                                        <Clock3 size={15} />

                                        {item.time}

                                    </div>

                                </div>

                                <p className="mt-2 text-sm leading-7 text-slate-400">

                                    {item.description}

                                </p>

                            </div>

                        </div>

                    );

                })}

            </div>

        </div>

    );

}