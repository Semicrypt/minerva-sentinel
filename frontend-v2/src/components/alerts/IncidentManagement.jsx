import {
    User,
    ShieldAlert,
    Clock3,
    CheckCircle2,
    Wrench,
    ClipboardList
} from "lucide-react";

const incidents = [

    {
        id: "INC-2026-001",
        title: "Production API CPU Spike",
        owner: "DevOps Team",
        priority: "Critical",
        status: "Investigating",
        sla: "18 min remaining",
        resolution: "42%",
        color: "text-red-400"
    },

    {
        id: "INC-2026-002",
        title: "PostgreSQL High Latency",
        owner: "Database Team",
        priority: "High",
        status: "Monitoring",
        sla: "42 min remaining",
        resolution: "68%",
        color: "text-orange-400"
    },

    {
        id: "INC-2026-003",
        title: "Docker Container Restart Loop",
        owner: "Infrastructure",
        priority: "Medium",
        status: "Resolved",
        sla: "Completed",
        resolution: "100%",
        color: "text-emerald-400"
    }

];

export default function IncidentManagement() {

    return (

        <section className="rounded-3xl border border-slate-800 bg-[#111827] p-8">

            <div className="flex items-center justify-between">

                <div>

                    <h2 className="text-3xl font-bold text-white">

                        Incident Management

                    </h2>

                    <p className="mt-2 text-slate-400">

                        Track incident ownership, priority, SLA compliance and
                        resolution progress.

                    </p>

                </div>

                <span className="rounded-full bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-400">

                    3 Open Incidents

                </span>

            </div>

            <div className="mt-8 space-y-6">

                {

                    incidents.map((incident) => (

                        <div
                            key={incident.id}
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

                                <div>

                                    <div className="flex items-center gap-3">

                                        <ClipboardList
                                            size={20}
                                            className="text-cyan-400"
                                        />

                                        <span className="text-sm font-semibold text-cyan-400">

                                            {incident.id}

                                        </span>

                                    </div>

                                    <h3 className="mt-3 text-xl font-bold text-white">

                                        {incident.title}

                                    </h3>

                                </div>

                                <span className={`rounded-full px-4 py-2 text-sm font-semibold ${
                                    incident.priority === "Critical"
                                        ? "bg-red-500/10 text-red-400"
                                        : incident.priority === "High"
                                        ? "bg-orange-500/10 text-orange-400"
                                        : "bg-emerald-500/10 text-emerald-400"
                                }`}>

                                    {incident.priority}

                                </span>

                            </div>

                            <div className="mt-8 grid gap-6 md:grid-cols-4">

                                <div>

                                    <div className="flex items-center gap-2">

                                        <User
                                            size={18}
                                            className="text-cyan-400"
                                        />

                                        <span className="text-slate-400">

                                            Owner

                                        </span>

                                    </div>

                                    <p className="mt-2 font-semibold text-white">

                                        {incident.owner}

                                    </p>

                                </div>

                                <div>

                                    <div className="flex items-center gap-2">

                                        <ShieldAlert
                                            size={18}
                                            className="text-red-400"
                                        />

                                        <span className="text-slate-400">

                                            Status

                                        </span>

                                    </div>

                                    <p className={`mt-2 font-semibold ${incident.color}`}>

                                        {incident.status}

                                    </p>

                                </div>

                                <div>

                                    <div className="flex items-center gap-2">

                                        <Clock3
                                            size={18}
                                            className="text-amber-400"
                                        />

                                        <span className="text-slate-400">

                                            SLA

                                        </span>

                                    </div>

                                    <p className="mt-2 font-semibold text-white">

                                        {incident.sla}

                                    </p>

                                </div>

                                <div>

                                    <div className="flex items-center gap-2">

                                        <Wrench
                                            size={18}
                                            className="text-emerald-400"
                                        />

                                        <span className="text-slate-400">

                                            Resolution

                                        </span>

                                    </div>

                                    <p className="mt-2 font-semibold text-white">

                                        {incident.resolution}

                                    </p>

                                </div>

                            </div>

                            <div className="mt-6">

                                <div className="mb-2 flex justify-between">

                                    <span className="text-slate-400">

                                        Progress

                                    </span>

                                    <span className="font-semibold text-white">

                                        {incident.resolution}

                                    </span>

                                </div>

                                <div className="h-3 rounded-full bg-slate-800">

                                    <div
                                        className="h-full rounded-full bg-gradient-to-r from-red-500 via-orange-400 to-emerald-400"
                                        style={{ width: incident.resolution }}
                                    />

                                </div>

                            </div>

                        </div>

                    ))

                }

            </div>

        </section>

    );

}