import {
    Monitor,
    Cpu,
    MemoryStick,
    HardDrive,
    Clock3,
    Server
} from "lucide-react";

const system = [
    {
        icon: Server,
        label: "Hostname",
        value: "minerva-prod-01"
    },
    {
        icon: Monitor,
        label: "Operating System",
        value: "Ubuntu 24.04 LTS"
    },
    {
        icon: Cpu,
        label: "Processor",
        value: "AMD Ryzen 7 5800X"
    },
    {
        icon: MemoryStick,
        label: "Memory",
        value: "32 GB DDR4"
    },
    {
        icon: HardDrive,
        label: "Storage",
        value: "1 TB NVMe SSD"
    },
    {
        icon: Clock3,
        label: "Uptime",
        value: "12 Days 07:18:52"
    }
];

export default function SystemInformation() {

    return (

        <div className="flex h-full flex-col rounded-3xl border border-slate-800 bg-[#111827] p-8 shadow-xl shadow-black/20">

            {/* Header */}

            <div className="flex items-center justify-between">

                <div>

                    <h2 className="text-2xl font-semibold tracking-tight text-white">
                        System Information
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-slate-400">
                        Live infrastructure details and hardware information.
                    </p>

                </div>

                <div className="rounded-xl bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-400">

                    Online

                </div>

            </div>

            <div className="my-8 border-b border-slate-800"></div>

            {/* System Information */}

            <div className="flex-1 space-y-5">

                {system.map((item) => {

                    const Icon = item.icon;

                    return (

                        <div
                            key={item.label}
                            className="
                                flex
                                items-center
                                rounded-2xl
                                border
                                border-slate-800
                                bg-slate-900/40
                                px-5
                                py-5
                                transition-all
                                duration-300
                                hover:border-blue-500/30
                            "
                        >

                            <div className="flex items-center gap-5">

                                <div
                                    className="
                                        flex
                                        h-14
                                        w-14
                                        items-center
                                        justify-center
                                        rounded-2xl
                                        bg-blue-500/10
                                    "
                                >

                                    <Icon
                                        size={24}
                                        className="text-blue-400"
                                    />

                                </div>

                                <div>

                                    <p className="text-sm font-medium text-slate-400">
                                        {item.label}
                                    </p>

                                    <p className="mt-1 text-base font-semibold text-white">
                                        {item.value}
                                    </p>

                                </div>

                            </div>

                        </div>

                    );

                })}

            </div>

            {/* Footer */}

            <div className="mt-auto pt-8">

                <div className="border-t border-slate-800 mb-8"></div>

                <div
                    className="
                        rounded-2xl
                        border
                        border-emerald-500/20
                        bg-emerald-500/10
                        p-6
                    "
                >

                    <p className="text-base font-semibold text-emerald-400">

                        System Health

                    </p>

                    <div className="mt-5 h-2.5 overflow-hidden rounded-full bg-slate-800">

                        <div
                            className="h-full rounded-full bg-emerald-500"
                            style={{ width: "96%" }}
                        />

                    </div>

                    <div className="mt-5 flex items-center justify-between">

                        <span className="text-sm text-slate-400">

                            Overall Health

                        </span>

                        <span className="text-lg font-bold text-white">

                            96%

                        </span>

                    </div>

                </div>

            </div>

        </div>

    );

}