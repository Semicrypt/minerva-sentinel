import {
    Cpu,
    Activity,
    Network,
    HardDrive
} from "lucide-react";

const metrics = [

    {

        title: "CPU Utilization",

        value: "28%",

        change: "+2.1%",

        icon: Cpu,

        color: "text-blue-400"

    },

    {

        title: "Memory Usage",

        value: "64%",

        change: "-3.8%",

        icon: Activity,

        color: "text-emerald-400"

    },

    {

        title: "Network Traffic",

        value: "186 MB/s",

        change: "+14%",

        icon: Network,

        color: "text-cyan-400"

    },

    {

        title: "Disk I/O",

        value: "82 MB/s",

        change: "-1.4%",

        icon: HardDrive,

        color: "text-violet-400"

    }

];

export default function CloudWatchMetrics() {

    return (

        <section className="rounded-3xl border border-slate-800 bg-[#111827] p-8">

            <div className="flex items-center justify-between">

                <div>

                    <h2 className="text-3xl font-bold text-white">

                        CloudWatch Metrics

                    </h2>

                    <p className="mt-2 text-slate-400">

                        Live monitoring metrics collected from AWS CloudWatch.

                    </p>

                </div>

                <span className="rounded-full bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-400">

                    Live

                </span>

            </div>

            <div className="mt-10 grid gap-6 lg:grid-cols-2">

                {

                    metrics.map((metric) => {

                        const Icon = metric.icon;

                        return (

                            <div
                                key={metric.title}
                                className="
                                    rounded-2xl
                                    border
                                    border-slate-800
                                    bg-slate-900/40
                                    p-6
                                "
                            >

                                <div className="flex items-center justify-between">

                                    <div className="flex items-center gap-4">

                                        <div className="rounded-2xl bg-slate-800 p-4">

                                            <Icon
                                                size={24}
                                                className={metric.color}
                                            />

                                        </div>

                                        <div>

                                            <h3 className="font-semibold text-white">

                                                {metric.title}

                                            </h3>

                                            <p className="text-sm text-slate-500">

                                                AWS CloudWatch

                                            </p>

                                        </div>

                                    </div>

                                    <span className="text-sm font-semibold text-emerald-400">

                                        {metric.change}

                                    </span>

                                </div>

                                <div className="mt-8">

                                    <p className="text-4xl font-black text-white">

                                        {metric.value}

                                    </p>

                                </div>

                                {/* Progress Bar */}

                                <div className="mt-6 h-2 overflow-hidden rounded-full bg-slate-800">

                                    <div
                                        className="h-full rounded-full bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400"
                                        style={{

                                            width:

                                                metric.title === "CPU Utilization"

                                                    ? "28%"

                                                    : metric.title === "Memory Usage"

                                                    ? "64%"

                                                    : metric.title === "Network Traffic"

                                                    ? "80%"

                                                    : "52%"

                                        }}

                                    />

                                </div>

                            </div>

                        );

                    })

                }

            </div>

        </section>

    );

}