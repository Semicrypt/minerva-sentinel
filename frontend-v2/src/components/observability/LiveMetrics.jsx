import {
    Activity,
    Cpu,
    MemoryStick,
    HardDrive,
    Wifi
} from "lucide-react";

function getUsageStatus(
    value
) {

    const number =
        Number(
            value || 0
        );

    if (
        number >= 95
    ) {

        return "Critical";

    }

    if (
        number >= 80
    ) {

        return "Warning";

    }

    return "Healthy";

}

function formatBytesPerSecond(
    bytes
) {

    const value =
        Number(
            bytes || 0
        );

    if (
        value >= 1024 * 1024 * 1024
    ) {

        return `${(
            value /
            1024 /
            1024 /
            1024
        ).toFixed(2)} GB/s`;

    }

    if (
        value >= 1024 * 1024
    ) {

        return `${(
            value /
            1024 /
            1024
        ).toFixed(2)} MB/s`;

    }

    if (
        value >= 1024
    ) {

        return `${(
            value /
            1024
        ).toFixed(2)} KB/s`;

    }

    return `${Math.round(value)} B/s`;

}

export default function LiveMetrics({
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

    const rx =
        Number(
            metrics?.network?.rxPerSecond || 0
        );

    const tx =
        Number(
            metrics?.network?.txPerSecond || 0
        );

    const items = [

        {
            icon: Cpu,
            title: "CPU Load",
            value:
                loading
                    ? "..."
                    : `${cpu.toFixed(2)}%`,
            status:
                getUsageStatus(
                    cpu
                ),
            color:
                "text-blue-400"
        },

        {
            icon: MemoryStick,
            title: "Memory Usage",
            value:
                loading
                    ? "..."
                    : `${memory.toFixed(2)}%`,
            status:
                getUsageStatus(
                    memory
                ),
            color:
                "text-emerald-400"
        },

        {
            icon: HardDrive,
            title: "Disk Usage",
            value:
                loading
                    ? "..."
                    : `${disk.toFixed(2)}%`,
            status:
                getUsageStatus(
                    disk
                ),
            color:
                "text-violet-400"
        },

        {
            icon: Wifi,
            title: "Network Receive",
            value:
                loading
                    ? "..."
                    : formatBytesPerSecond(
                        rx
                    ),
            status:
                "Live",
            color:
                "text-cyan-400"
        },

        {
            icon: Activity,
            title: "Network Transmit",
            value:
                loading
                    ? "..."
                    : formatBytesPerSecond(
                        tx
                    ),
            status:
                "Live",
            color:
                "text-amber-400"
        }

    ];

    return (

        <section className="rounded-3xl border border-slate-800 bg-[#111827] p-8">

            <div className="flex items-center justify-between">

                <div>

                    <h2 className="text-3xl font-bold text-white">

                        Live Metrics

                    </h2>

                    <p className="mt-2 text-slate-400">

                        Real-time infrastructure performance monitoring.

                    </p>

                </div>

                <span className="rounded-full bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-400">

                    ● LIVE

                </span>

            </div>

            <div className="mt-8 space-y-5">

                {
                    items.map(
                        item => {

                            const Icon =
                                item.icon;

                            return (

                                <div
                                    key={item.title}
                                    className="
                                        flex
                                        items-center
                                        justify-between
                                        rounded-2xl
                                        border
                                        border-slate-800
                                        bg-slate-900/40
                                        p-5
                                        transition
                                        hover:border-cyan-500/30
                                    "
                                >

                                    <div className="flex items-center gap-5">

                                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-800">

                                            <Icon
                                                size={26}
                                                className={item.color}
                                            />

                                        </div>

                                        <div>

                                            <h3 className="text-lg font-semibold text-white">

                                                {item.title}

                                            </h3>

                                            <p className="text-slate-400">

                                                {item.status}

                                            </p>

                                        </div>

                                    </div>

                                    <div className="text-right">

                                        <p className="text-3xl font-black text-white">

                                            {item.value}

                                        </p>

                                    </div>

                                </div>

                            );

                        }
                    )
                }

            </div>

        </section>

    );

}