import {
    CheckCircle2,
    XCircle,
    Rocket,
    Timer,
    Gauge,
    Tag
} from "lucide-react";

const metrics = [

    {
        title: "Successful Builds",
        value: "128",
        subtitle: "Completed",
        icon: CheckCircle2,
        color: "text-emerald-400 bg-emerald-500/10"
    },

    {
        title: "Failed Builds",
        value: "5",
        subtitle: "Require Attention",
        icon: XCircle,
        color: "text-red-400 bg-red-500/10"
    },

    {
        title: "Deployments",
        value: "62",
        subtitle: "Production Releases",
        icon: Rocket,
        color: "text-cyan-400 bg-cyan-500/10"
    },

    {
        title: "Success Rate",
        value: "97%",
        subtitle: "Pipeline Reliability",
        icon: Gauge,
        color: "text-violet-400 bg-violet-500/10"
    },

    {
        title: "Average Build Time",
        value: "3m 18s",
        subtitle: "Per Workflow",
        icon: Timer,
        color: "text-amber-400 bg-amber-500/10"
    },

    {
        title: "Latest Release",
        value: "v2.1.0",
        subtitle: "Current Version",
        icon: Tag,
        color: "text-blue-400 bg-blue-500/10"
    }

];

export default function PipelineOverview() {

    return (

        <section>

            <div className="mb-8">

                <h2 className="text-3xl font-bold text-white">

                    Pipeline Overview

                </h2>

                <p className="mt-2 text-slate-400">

                    Current build performance and deployment metrics.

                </p>

            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

                {

                    metrics.map((item) => {

                        const Icon = item.icon;

                        return (

                            <div
                                key={item.title}
                                className="
                                    rounded-3xl
                                    border
                                    border-slate-800
                                    bg-[#111827]
                                    p-7
                                    transition-all
                                    duration-300
                                    hover:-translate-y-1
                                    hover:border-violet-500/30
                                "
                            >

                                <div className="flex items-center justify-between">

                                    <div
                                        className={`flex h-14 w-14 items-center justify-center rounded-2xl ${item.color}`}
                                    >

                                        <Icon size={26} />

                                    </div>

                                    <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">

                                        Live

                                    </span>

                                </div>

                                <h3 className="mt-6 text-xl font-bold text-white">

                                    {item.title}

                                </h3>

                                <p className="mt-5 text-4xl font-black text-white">

                                    {item.value}

                                </p>

                                <p className="mt-2 text-slate-400">

                                    {item.subtitle}

                                </p>

                            </div>

                        );

                    })

                }

            </div>

        </section>

    );

}