import {
    Cpu,
    MemoryStick,
    HardDrive,
    Network,
    Clock3,
    ShieldCheck
} from "lucide-react";

const monitoring = [

    {
        icon: Cpu,
        title: "CPU Alert Threshold",
        value: "85%",
        description: "Generate alerts when CPU usage exceeds this value.",
        color: "text-cyan-400"
    },

    {
        icon: MemoryStick,
        title: "Memory Alert Threshold",
        value: "80%",
        description: "Notify administrators when memory usage is high.",
        color: "text-violet-400"
    },

    {
        icon: HardDrive,
        title: "Disk Usage Threshold",
        value: "90%",
        description: "Create incidents for critically low storage space.",
        color: "text-amber-400"
    },

    {
        icon: Network,
        title: "Network Utilization",
        value: "75%",
        description: "Monitor abnormal inbound and outbound traffic.",
        color: "text-emerald-400"
    }

];

export default function MonitoringSettings() {

    return (

        <section className="rounded-3xl border border-slate-800 bg-[#111827] p-8">

            <div className="flex items-center justify-between">

                <div>

                    <h2 className="text-3xl font-bold text-white">

                        Monitoring Configuration

                    </h2>

                    <p className="mt-2 text-slate-400">

                        Configure monitoring intervals, alert thresholds and automated incident creation.

                    </p>

                </div>

                <span className="rounded-full bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-400">

                    Active Monitoring

                </span>

            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-2">

                {

                    monitoring.map((item) => {

                        const Icon = item.icon;

                        return (

                            <div
                                key={item.title}
                                className="
                                    rounded-2xl
                                    border
                                    border-slate-800
                                    bg-slate-900/40
                                    p-6
                                    transition
                                    hover:border-cyan-500/30
                                "
                            >

                                <div className="flex items-start justify-between">

                                    <div className="flex items-center gap-4">

                                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-800">

                                            <Icon
                                                size={28}
                                                className={item.color}
                                            />

                                        </div>

                                        <div>

                                            <h3 className="text-lg font-bold text-white">

                                                {item.title}

                                            </h3>

                                            <p className="mt-2 text-slate-400">

                                                {item.description}

                                            </p>

                                        </div>

                                    </div>

                                    <span className="text-2xl font-black text-white">

                                        {item.value}

                                    </span>

                                </div>

                            </div>

                        );

                    })

                }

            </div>

            <div className="mt-8 grid gap-6 md:grid-cols-2">

                <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">

                    <div className="flex items-center gap-3">

                        <Clock3
                            size={22}
                            className="text-sky-400"
                        />

                        <h3 className="text-xl font-bold text-white">

                            Monitoring Interval

                        </h3>

                    </div>

                    <select
                        className="
                            mt-6
                            w-full
                            rounded-xl
                            border
                            border-slate-700
                            bg-slate-800
                            px-4
                            py-3
                            text-white
                            outline-none
                        "
                    >

                        <option>5 Seconds</option>
                        <option>10 Seconds</option>
                        <option>30 Seconds</option>
                        <option>1 Minute</option>
                        <option>5 Minutes</option>

                    </select>

                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">

                    <div className="flex items-center gap-3">

                        <ShieldCheck
                            size={22}
                            className="text-emerald-400"
                        />

                        <h3 className="text-xl font-bold text-white">

                            Automatic Incident Creation

                        </h3>

                    </div>

                    <div className="mt-6 flex items-center justify-between rounded-xl bg-slate-800 p-4">

                        <span className="text-slate-300">

                            Enabled

                        </span>

                        <div className="h-7 w-12 rounded-full bg-emerald-500 p-1">

                            <div className="ml-auto h-5 w-5 rounded-full bg-white"></div>

                        </div>

                    </div>

                </div>

            </div>

        </section>

    );

}