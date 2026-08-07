import {
    Network,
    HardDrive,
    Circle
} from "lucide-react";

/*
|--------------------------------------------------------------------------
| Helper: Format Date
|--------------------------------------------------------------------------
*/

function formatDate(value) {

    if (!value) {
        return "Unknown";
    }

    const date =
        new Date(value);

    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
        return "Unknown";
    }

    return date.toLocaleDateString();

}

/*
|--------------------------------------------------------------------------
| Helper: Network Status
|--------------------------------------------------------------------------
*/

function getNetworkStatus(network) {

    if (
        Number(
            network.containers || 0
        ) > 0
    ) {
        return "Active";
    }

    return "Available";

}

/*
|--------------------------------------------------------------------------
| Networks + Volumes
|--------------------------------------------------------------------------
*/

export default function NetworksVolumes({

    networks = [],

    volumes = [],

    loading = false

}) {

    return (

        <section className="grid gap-8 lg:grid-cols-2">

            {/* Networks */}

            <div className="rounded-3xl border border-slate-800 bg-[#111827] p-8">

                <div className="flex items-center justify-between">

                    <div className="flex items-center gap-3">

                        <Network
                            className="text-cyan-400"
                            size={24}
                        />

                        <h2 className="text-2xl font-bold text-white">

                            Docker Networks

                        </h2>

                    </div>

                    <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-sm font-semibold text-cyan-400">

                        {
                            loading
                                ? "Loading..."
                                : `${networks.length} Networks`
                        }

                    </span>

                </div>

                <div className="mt-8 space-y-4">

                    {

                        networks.map(
                            network => {

                                const status =
                                    getNetworkStatus(
                                        network
                                    );

                                const active =
                                    status === "Active";

                                return (

                                    <div
                                        key={network.id}
                                        className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/40 px-5 py-4"
                                    >

                                        <div>

                                            <p className="font-semibold text-white">

                                                {network.name}

                                            </p>

                                            <p className="mt-1 text-sm text-slate-500">

                                                {network.driver}
                                                {" · "}
                                                {network.scope}
                                                {" · "}
                                                {
                                                    Number(
                                                        network.containers ||
                                                        0
                                                    )
                                                }
                                                {" "}
                                                container
                                                {
                                                    Number(
                                                        network.containers ||
                                                        0
                                                    ) === 1
                                                        ? ""
                                                        : "s"
                                                }

                                            </p>

                                        </div>

                                        <span
                                            className={
                                                active
                                                    ? "inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-sm font-semibold text-emerald-400"
                                                    : "inline-flex items-center gap-2 rounded-full bg-slate-500/10 px-3 py-1 text-sm font-semibold text-slate-400"
                                            }
                                        >

                                            <Circle
                                                size={8}
                                                fill={
                                                    active
                                                        ? "#22c55e"
                                                        : "#64748b"
                                                }
                                            />

                                            {status}

                                        </span>

                                    </div>

                                );

                            }
                        )

                    }

                    {
                        !loading &&
                        networks.length === 0 && (

                            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 px-5 py-10 text-center text-slate-500">

                                No Docker networks were found.

                            </div>

                        )
                    }

                </div>

            </div>

            {/* Volumes */}

            <div className="rounded-3xl border border-slate-800 bg-[#111827] p-8">

                <div className="flex items-center justify-between">

                    <div className="flex items-center gap-3">

                        <HardDrive
                            className="text-amber-400"
                            size={24}
                        />

                        <h2 className="text-2xl font-bold text-white">

                            Docker Volumes

                        </h2>

                    </div>

                    <span className="rounded-full bg-amber-500/10 px-3 py-1 text-sm font-semibold text-amber-400">

                        {
                            loading
                                ? "Loading..."
                                : `${volumes.length} Volumes`
                        }

                    </span>

                </div>

                <div className="mt-8 space-y-4">

                    {

                        volumes.map(
                            volume => (

                                <div
                                    key={volume.name}
                                    className="rounded-2xl border border-slate-800 bg-slate-900/40 px-5 py-4"
                                >

                                    <div className="flex items-start justify-between gap-4">

                                        <div className="min-w-0">

                                            <p className="truncate font-semibold text-white">

                                                {volume.name}

                                            </p>

                                            <p className="mt-1 text-sm text-slate-500">

                                                {
                                                    volume.driver ||
                                                    "unknown"
                                                }
                                                {" · "}
                                                {
                                                    volume.scope ||
                                                    "unknown"
                                                }

                                            </p>

                                        </div>

                                        <span className="shrink-0 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-400">

                                            Persistent

                                        </span>

                                    </div>

                                    <div className="mt-4 border-t border-slate-800 pt-4">

                                        <p className="text-xs uppercase tracking-[0.16em] text-slate-600">

                                            Created

                                        </p>

                                        <p className="mt-1 text-sm text-slate-400">

                                            {
                                                formatDate(
                                                    volume.createdAt
                                                )
                                            }

                                        </p>

                                    </div>

                                </div>

                            )
                        )

                    }

                    {
                        !loading &&
                        volumes.length === 0 && (

                            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 px-5 py-10 text-center text-slate-500">

                                No Docker volumes were found.

                            </div>

                        )
                    }

                </div>

            </div>

        </section>

    );

}