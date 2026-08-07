import {
    Box,
    Package,
    Server,
    CircleStop,
    Cpu,
    Microchip
} from "lucide-react";

export default function DockerOverview({

    dockerInfo,

    containers,

    loading

}) {

    /*
    |--------------------------------------------------------------------------
    | Aggregate Container CPU
    |--------------------------------------------------------------------------
    */

    const totalContainerCpu =
        containers
            .filter(
                container =>
                    container.state ===
                    "running"
            )
            .reduce(
                (
                    total,
                    container
                ) =>
                    total +
                    (
                        Number(
                            container.cpuPercent
                        ) || 0
                    ),
                0
            );

    /*
    |--------------------------------------------------------------------------
    | Overview
    |--------------------------------------------------------------------------
    */

    const overview = [

        {

            title:
                "Running Containers",

            value:
                loading
                    ? "..."
                    : String(
                        dockerInfo?.running ?? 0
                    ),

            subtitle:
                "Currently Active",

            icon:
                Box,

            color:
                "text-sky-400 bg-sky-500/10"

        },

        {

            title:
                "Docker Images",

            value:
                loading
                    ? "..."
                    : String(
                        dockerInfo?.images ?? 0
                    ),

            subtitle:
                "Available Images",

            icon:
                Package,

            color:
                "text-violet-400 bg-violet-500/10"

        },

        {

            title:
                "Total Containers",

            value:
                loading
                    ? "..."
                    : String(
                        dockerInfo?.containers ?? 0
                    ),

            subtitle:
                "Running + Stopped",

            icon:
                Server,

            color:
                "text-cyan-400 bg-cyan-500/10"

        },

        {

            title:
                "Stopped Containers",

            value:
                loading
                    ? "..."
                    : String(
                        dockerInfo?.stopped ?? 0
                    ),

            subtitle:
                "Currently Inactive",

            icon:
                CircleStop,

            color:
                "text-amber-400 bg-amber-500/10"

        },

        {

            title:
                "Container CPU",

            value:
                loading
                    ? "..."
                    : `${totalContainerCpu.toFixed(2)}%`,

            subtitle:
                "Running Containers",

            icon:
                Cpu,

            color:
                "text-emerald-400 bg-emerald-500/10"

        },

        {

            title:
                "Engine CPUs",

            value:
                loading
                    ? "..."
                    : String(
                        dockerInfo?.cpus ?? 0
                    ),

            subtitle:
                "Available to Docker",

            icon:
                Microchip,

            color:
                "text-blue-400 bg-blue-500/10"

        }

    ];

    return (

        <section>

            <div className="mb-8">

                <h2 className="text-3xl font-bold text-white">

                    Docker Overview

                </h2>

                <p className="mt-2 text-slate-400">

                    High-level health and utilization of your Docker environment.

                </p>

            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

                {

                    overview.map(
                        item => {

                            const Icon =
                                item.icon;

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
                                        hover:border-sky-500/30
                                    "
                                >

                                    <div className="flex items-center justify-between">

                                        <div
                                            className={`flex h-14 w-14 items-center justify-center rounded-2xl ${item.color}`}
                                        >

                                            <Icon
                                                size={26}
                                            />

                                        </div>

                                        <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">

                                            LIVE

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

                        }
                    )

                }

            </div>

        </section>

    );

}