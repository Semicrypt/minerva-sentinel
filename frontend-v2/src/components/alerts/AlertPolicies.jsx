import {
    Cpu,
    MemoryStick,
    HardDrive,
    Network,
    Boxes,
    Globe,
    CheckCircle2
} from "lucide-react";

const policies = [

    {
        icon: Cpu,
        name: "CPU Utilization",
        threshold: "> 85%",
        severity: "Critical",
        status: "Active",
        color: "text-red-400"
    },

    {
        icon: MemoryStick,
        name: "Memory Usage",
        threshold: "> 80%",
        severity: "Warning",
        status: "Active",
        color: "text-amber-400"
    },

    {
        icon: HardDrive,
        name: "Disk Usage",
        threshold: "> 90%",
        severity: "Critical",
        status: "Active",
        color: "text-orange-400"
    },

    {
        icon: Network,
        name: "Network Latency",
        threshold: "> 250 ms",
        severity: "Warning",
        status: "Active",
        color: "text-cyan-400"
    },

    {
        icon: Boxes,
        name: "Docker Container Health",
        threshold: "Container Stopped",
        severity: "Critical",
        status: "Active",
        color: "text-blue-400"
    },

    {
        icon: Globe,
        name: "Service Availability",
        threshold: "HTTP 5xx",
        severity: "Critical",
        status: "Active",
        color: "text-violet-400"
    }

];

export default function AlertPolicies() {

    return (

        <section className="rounded-3xl border border-slate-800 bg-[#111827] p-8">

            <div className="flex items-center justify-between">

                <div>

                    <h2 className="text-3xl font-bold text-white">

                        Alert Policies

                    </h2>

                    <p className="mt-2 text-slate-400">

                        Configured monitoring rules that automatically generate alerts and incidents.

                    </p>

                </div>

                <span className="rounded-full bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-400">

                    6 Policies Enabled

                </span>

            </div>

            <div className="mt-8 space-y-5">

                {

                    policies.map((policy) => {

                        const Icon = policy.icon;

                        return (

                            <div
                                key={policy.name}
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

                                    <div className="flex items-center gap-5">

                                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-800">

                                            <Icon
                                                size={28}
                                                className={policy.color}
                                            />

                                        </div>

                                        <div>

                                            <h3 className="text-lg font-bold text-white">

                                                {policy.name}

                                            </h3>

                                            <p className="mt-2 text-slate-400">

                                                Threshold: {policy.threshold}

                                            </p>

                                        </div>

                                    </div>

                                    <div className="grid grid-cols-2 gap-8">

                                        <div>

                                            <p className="text-sm text-slate-500">

                                                Severity

                                            </p>

                                            <p className={`mt-2 font-bold ${policy.color}`}>

                                                {policy.severity}

                                            </p>

                                        </div>

                                        <div>

                                            <p className="text-sm text-slate-500">

                                                Status

                                            </p>

                                            <div className="mt-2 flex items-center gap-2">

                                                <CheckCircle2
                                                    size={18}
                                                    className="text-emerald-400"
                                                />

                                                <span className="font-semibold text-emerald-400">

                                                    {policy.status}

                                                </span>

                                            </div>

                                        </div>

                                    </div>

                                </div>

                            </div>

                        );

                    })

                }

            </div>

        </section>

    );

}