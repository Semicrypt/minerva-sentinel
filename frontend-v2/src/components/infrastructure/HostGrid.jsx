import {
    Cpu,
    MemoryStick,
    HardDrive,
    ChevronRight,
    Server
} from "lucide-react";

const colors = {
    emerald: {
        badge: "bg-emerald-500/15 text-emerald-400",
        icon: "text-emerald-400",
        bg: "bg-emerald-500/10"
    },
    orange: {
        badge: "bg-orange-500/15 text-orange-400",
        icon: "text-orange-400",
        bg: "bg-orange-500/10"
    },
    blue: {
        badge: "bg-blue-500/15 text-blue-400",
        icon: "text-blue-400",
        bg: "bg-blue-500/10"
    },
    red: {
        badge: "bg-red-500/15 text-red-400",
        icon: "text-red-400",
        bg: "bg-red-500/10"
    }
};

export default function HostGrid({ hosts = [] }) {

    if (hosts.length === 0) {

        return (

            <div className="rounded-3xl border border-slate-800 bg-[#111827] py-24 text-center">

                <h3 className="text-2xl font-semibold text-white">

                    No hosts found

                </h3>

                <p className="mt-3 text-slate-400">

                    Try changing your search or filters.

                </p>

            </div>

        );

    }

    return (

        <div className="grid grid-cols-12 gap-8">

            {hosts.map((host) => {

                const Icon = host.icon || Server;

                const theme = colors[host.color] || colors.blue;

                return (

                    <div
                        key={host.id}
                        className="
                            col-span-12
                            lg:col-span-6
                            rounded-3xl
                            border
                            border-slate-800
                            bg-[#111827]
                            px-6
                            py-5
                            shadow-xl
                            shadow-black/20
                            transition-all
                            duration-300
                            hover:-translate-y-1
                            hover:border-blue-500/40
                        "
                    >

                        {/* Header */}

                        <div className="flex items-center justify-between">

                            <div className="flex items-center gap-4">

                                <div
                                    className={`flex h-12 w-12 items-center justify-center rounded-2xl ${theme.bg}`}
                                >

                                    <Icon
                                        size={22}
                                        className={theme.icon}
                                    />

                                </div>

                                <div>

                                    <h3 className="text-lg font-semibold text-white">

                                        {host.name}

                                    </h3>

                                    <p className="mt-0.5 text-sm text-slate-400">

                                        {host.os}

                                    </p>

                                </div>

                            </div>

                            <span
                                className={`rounded-full px-3 py-1 text-xs font-semibold ${theme.badge}`}
                            >

                                {host.status}

                            </span>

                        </div>

                        {/* Metrics */}

                        <div className="mt-7 grid grid-cols-3 gap-8">

                            <div>

                                <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-wide text-slate-500">

                                    <Cpu size={14} />

                                    CPU

                                </div>

                                <p className="text-2xl font-bold text-white">

                                    {host.cpu}%

                                </p>

                            </div>

                            <div>

                                <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-wide text-slate-500">

                                    <MemoryStick size={14} />

                                    RAM

                                </div>

                                <p className="text-2xl font-bold text-white">

                                    {host.memory}%

                                </p>

                            </div>

                            <div>

                                <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-wide text-slate-500">

                                    <HardDrive size={14} />

                                    Disk

                                </div>

                                <p className="text-2xl font-bold text-white">

                                    {host.disk}%

                                </p>

                            </div>

                        </div>

                        {/* Footer */}

                        <div className="mt-7 flex items-center justify-between border-t border-slate-800 pt-4">

                            <span className="text-sm text-slate-400">

                                Uptime •{" "}

                                <span className="font-medium text-white">

                                    {host.uptime}

                                </span>

                            </span>

                            <button
                                className="
                                    flex
                                    items-center
                                    gap-1
                                    text-sm
                                    font-medium
                                    text-blue-400
                                    transition
                                    hover:text-blue-300
                                "
                            >

                                Details

                                <ChevronRight size={15} />

                            </button>

                        </div>

                    </div>

                );

            })}

        </div>

    );

}