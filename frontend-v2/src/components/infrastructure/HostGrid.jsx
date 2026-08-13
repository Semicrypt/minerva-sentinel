import {
    Activity,
    CalendarClock,
    ChevronRight,
    Clock3,
    Cpu,
    HardDrive,
    MemoryStick,
    Monitor,
    Server,
    X
} from "lucide-react";

import {
    useEffect,
    useState
} from "react";

const colors = {
    emerald: {
        badge:
            "bg-emerald-500/15 text-emerald-400",
        icon:
            "text-emerald-400",
        background:
            "bg-emerald-500/10"
    },

    orange: {
        badge:
            "bg-orange-500/15 text-orange-400",
        icon:
            "text-orange-400",
        background:
            "bg-orange-500/10"
    },

    blue: {
        badge:
            "bg-blue-500/15 text-blue-400",
        icon:
            "text-blue-400",
        background:
            "bg-blue-500/10"
    },

    red: {
        badge:
            "bg-red-500/15 text-red-400",
        icon:
            "text-red-400",
        background:
            "bg-red-500/10"
    }
};

function formatMetric(value) {
    const number = Number(value);

    if (!Number.isFinite(number)) {
        return "0";
    }

    return new Intl.NumberFormat(
        undefined,
        {
            maximumFractionDigits: 2
        }
    ).format(number);
}

function formatDate(value) {
    if (!value) {
        return "Not recorded";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "Not recorded";
    }

    return date.toLocaleString();
}

function MetricBox({
    icon: Icon,
    label,
    value,
    color
}) {
    return (
        <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
            <div className="flex items-center gap-2 text-sm text-slate-500">
                <Icon
                    size={16}
                    className={color}
                />

                {label}
            </div>

            <p className="mt-3 text-2xl font-bold text-white">
                {formatMetric(value)}%
            </p>
        </div>
    );
}

export default function HostGrid({
    hosts = []
}) {
    const [
        selectedHost,
        setSelectedHost
    ] = useState(null);

    useEffect(() => {
        if (!selectedHost) {
            return undefined;
        }

        function handleKeyDown(event) {
            if (event.key === "Escape") {
                setSelectedHost(null);
            }
        }

        const previousOverflow =
            document.body.style.overflow;

        document.body.style.overflow =
            "hidden";

        window.addEventListener(
            "keydown",
            handleKeyDown
        );

        return () => {
            document.body.style.overflow =
                previousOverflow;

            window.removeEventListener(
                "keydown",
                handleKeyDown
            );
        };
    }, [selectedHost]);

    if (hosts.length === 0) {
        return (
            <div className="rounded-3xl border border-slate-800 bg-[#111827] py-24 text-center">
                <Server
                    size={42}
                    className="mx-auto text-slate-600"
                />

                <h3 className="mt-5 text-2xl font-semibold text-white">
                    No hosts found
                </h3>

                <p className="mt-3 text-slate-400">
                    No hosts match the current
                    search or filters.
                </p>
            </div>
        );
    }

    const selectedTheme =
        selectedHost
            ? colors[selectedHost.color] ||
              colors.blue
            : colors.blue;

    return (
        <>
            <div className="grid grid-cols-12 gap-8">
                {hosts.map(host => {
                    const Icon =
                        host.icon || Server;

                    const theme =
                        colors[host.color] ||
                        colors.blue;

                    return (
                        <article
                            key={host.id}
                            className="col-span-12 rounded-3xl border border-slate-800 bg-[#111827] px-6 py-5 shadow-xl shadow-black/20 transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/40 lg:col-span-6"
                        >
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex min-w-0 items-center gap-4">
                                    <div
                                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${theme.background}`}
                                    >
                                        <Icon
                                            size={22}
                                            className={
                                                theme.icon
                                            }
                                        />
                                    </div>

                                    <div className="min-w-0">
                                        <h3 className="truncate text-lg font-semibold text-white">
                                            {host.name}
                                        </h3>

                                        <p className="mt-0.5 truncate text-sm text-slate-400">
                                            {host.os}
                                        </p>
                                    </div>
                                </div>

                                <span
                                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${theme.badge}`}
                                >
                                    {host.status}
                                </span>
                            </div>

                            <div className="mt-7 grid grid-cols-3 gap-4 sm:gap-8">
                                <div>
                                    <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-wide text-slate-500">
                                        <Cpu size={14} />
                                        CPU
                                    </div>

                                    <p className="text-xl font-bold text-white sm:text-2xl">
                                        {formatMetric(
                                            host.cpu
                                        )}
                                        %
                                    </p>
                                </div>

                                <div>
                                    <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-wide text-slate-500">
                                        <MemoryStick
                                            size={14}
                                        />
                                        RAM
                                    </div>

                                    <p className="text-xl font-bold text-white sm:text-2xl">
                                        {formatMetric(
                                            host.memory
                                        )}
                                        %
                                    </p>
                                </div>

                                <div>
                                    <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-wide text-slate-500">
                                        <HardDrive
                                            size={14}
                                        />
                                        Disk
                                    </div>

                                    <p className="text-xl font-bold text-white sm:text-2xl">
                                        {formatMetric(
                                            host.disk
                                        )}
                                        %
                                    </p>
                                </div>
                            </div>

                            <div className="mt-7 flex items-center justify-between border-t border-slate-800 pt-4">
                                <span className="text-sm text-slate-400">
                                    Uptime •{" "}

                                    <span className="font-medium text-white">
                                        {host.uptime}
                                    </span>
                                </span>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setSelectedHost(
                                            host
                                        )
                                    }
                                    aria-label={`View details for ${host.name}`}
                                    className="flex items-center gap-1 text-sm font-medium text-blue-400 transition hover:text-blue-300"
                                >
                                    Details

                                    <ChevronRight
                                        size={15}
                                    />
                                </button>
                            </div>
                        </article>
                    );
                })}
            </div>

            {selectedHost && (
                <div
                    role="presentation"
                    onMouseDown={event => {
                        if (
                            event.target ===
                            event.currentTarget
                        ) {
                            setSelectedHost(
                                null
                            );
                        }
                    }}
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm"
                >
                    <section
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="host-details-title"
                        className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-slate-700 bg-[#111827] shadow-2xl shadow-black/50"
                    >
                        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-slate-800 bg-[#111827] px-5 py-5 sm:px-7">
                            <div className="flex min-w-0 items-center gap-4">
                                <div
                                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${selectedTheme.background}`}
                                >
                                    <Server
                                        size={23}
                                        className={
                                            selectedTheme.icon
                                        }
                                    />
                                </div>

                                <div className="min-w-0">
                                    <p className="text-sm font-semibold text-blue-400">
                                        Host #
                                        {selectedHost.id}
                                    </p>

                                    <h2
                                        id="host-details-title"
                                        className="mt-1 truncate text-2xl font-bold text-white"
                                    >
                                        {
                                            selectedHost.name
                                        }
                                    </h2>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setSelectedHost(
                                        null
                                    )
                                }
                                aria-label="Close host details"
                                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-700 text-slate-400 transition hover:border-red-500/50 hover:text-red-400"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-5 sm:p-7">
                            <div className="flex flex-wrap items-center justify-between gap-4">
                                <div>
                                    <p className="text-sm text-slate-500">
                                        Current status
                                    </p>

                                    <div className="mt-2 flex items-center gap-2">
                                        <Activity
                                            size={18}
                                            className={
                                                selectedTheme.icon
                                            }
                                        />

                                        <span
                                            className={`rounded-full px-3 py-1 text-sm font-semibold ${selectedTheme.badge}`}
                                        >
                                            {
                                                selectedHost.status
                                            }
                                        </span>
                                    </div>
                                </div>

                                <div className="text-left sm:text-right">
                                    <p className="text-sm text-slate-500">
                                        Uptime
                                    </p>

                                    <p className="mt-2 font-semibold text-white">
                                        {
                                            selectedHost.uptime
                                        }
                                    </p>
                                </div>
                            </div>

                            <div className="mt-7 grid gap-4 sm:grid-cols-3">
                                <MetricBox
                                    icon={Cpu}
                                    label="CPU usage"
                                    value={
                                        selectedHost.cpu
                                    }
                                    color="text-cyan-400"
                                />

                                <MetricBox
                                    icon={
                                        MemoryStick
                                    }
                                    label="Memory usage"
                                    value={
                                        selectedHost.memory
                                    }
                                    color="text-violet-400"
                                />

                                <MetricBox
                                    icon={HardDrive}
                                    label="Disk usage"
                                    value={
                                        selectedHost.disk
                                    }
                                    color="text-amber-400"
                                />
                            </div>

                            <div className="mt-7 rounded-2xl border border-slate-800 bg-slate-950/30">
                                <div className="flex items-start gap-3 border-b border-slate-800 p-5">
                                    <Monitor
                                        size={19}
                                        className="mt-0.5 shrink-0 text-blue-400"
                                    />

                                    <div>
                                        <p className="text-sm text-slate-500">
                                            Platform and
                                            architecture
                                        </p>

                                        <p className="mt-1 font-semibold text-white">
                                            {
                                                selectedHost.os
                                            }
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 border-b border-slate-800 p-5">
                                    <Clock3
                                        size={19}
                                        className="mt-0.5 shrink-0 text-emerald-400"
                                    />

                                    <div>
                                        <p className="text-sm text-slate-500">
                                            Reported uptime
                                        </p>

                                        <p className="mt-1 font-semibold text-white">
                                            {
                                                selectedHost.uptime
                                            }
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 p-5">
                                    <CalendarClock
                                        size={19}
                                        className="mt-0.5 shrink-0 text-amber-400"
                                    />

                                    <div>
                                        <p className="text-sm text-slate-500">
                                            Last metric received
                                        </p>

                                        <p className="mt-1 font-semibold text-white">
                                            {formatDate(
                                                selectedHost.lastSeen
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <p className="mt-5 text-sm leading-6 text-slate-500">
                                These values are the latest
                                genuine metrics stored for
                                this host.
                            </p>
                        </div>
                    </section>
                </div>
            )}
        </>
    );
}