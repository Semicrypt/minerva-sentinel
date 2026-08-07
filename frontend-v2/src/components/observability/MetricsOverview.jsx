import {
    Cpu,
    MemoryStick,
    HardDrive,
    Activity
} from "lucide-react";

export default function MetricsOverview({
    metrics,
    loading = false
}) {

    const cpu =
        Number(
            metrics?.cpu?.usage || 0
        );

    const memory =
        Number(
            metrics?.memory?.usage || 0
        );

    const disk =
        Number(
            metrics?.disk?.usage || 0
        );

    const network =
        Number(
            metrics?.network?.rxPerSecond || 0
        ) +
        Number(
            metrics?.network?.txPerSecond || 0
        );

    const networkMbps =
        (
            network /
            1024 /
            1024
        ).toFixed(2);

    const items = [

        {
            title: "CPU Usage",
            value:
                loading
                    ? "..."
                    : `${cpu.toFixed(2)}%`,
            subtitle: "Current Utilization",
            icon: Cpu,
            color:
                "text-blue-400 bg-blue-500/10"
        },

        {
            title: "Memory",
            value:
                loading
                    ? "..."
                    : `${memory.toFixed(2)}%`,
            subtitle: "RAM Usage",
            icon: MemoryStick,
            color:
                "text-emerald-400 bg-emerald-500/10"
        },

        {
            title: "Disk Usage",
            value:
                loading
                    ? "..."
                    : `${disk.toFixed(2)}%`,
            subtitle: "Storage Consumption",
            icon: HardDrive,
            color:
                "text-violet-400 bg-violet-500/10"
        },

        {
            title: "Network",
            value:
                loading
                    ? "..."
                    : `${networkMbps} MB/s`,
            subtitle: "Combined Traffic",
            icon: Activity,
            color:
                "text-cyan-400 bg-cyan-500/10"
        }

    ];

    return (

        <section>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

                {
                    items.map(
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
                                        transition
                                        duration-300
                                        hover:-translate-y-1
                                        hover:border-cyan-500/30
                                    "
                                >

                                    <div className="flex items-center justify-between">

                                        <div
                                            className={`flex h-14 w-14 items-center justify-center rounded-2xl ${item.color}`}
                                        >

                                            <Icon
                                                size={28}
                                            />

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

                        }
                    )
                }

            </div>

        </section>

    );

}