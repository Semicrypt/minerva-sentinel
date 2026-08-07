import {
    Box,
    Circle
} from "lucide-react";

/*
|--------------------------------------------------------------------------
| Format Ports
|--------------------------------------------------------------------------
*/

function formatPorts(
    ports
) {

    if (
        !Array.isArray(ports) ||
        ports.length === 0
    ) {

        return "—";

    }

    const formatted =
        ports
            .map(
                port => {

                    if (
                        port.PublicPort
                    ) {

                        return `${port.PublicPort}:${port.PrivatePort}`;

                    }

                    return String(
                        port.PrivatePort
                    );

                }
            );

    return [
        ...new Set(
            formatted
        )
    ].join(", ");

}

/*
|--------------------------------------------------------------------------
| Format Memory
|--------------------------------------------------------------------------
*/

function formatMemory(
    memory
) {

    const used =
        Number(
            memory?.usedMB || 0
        );

    if (
        used >= 1024
    ) {

        return `${(
            used / 1024
        ).toFixed(2)} GB`;

    }

    return `${used.toFixed(2)} MB`;

}

export default function RunningContainers({

    containers = [],

    loading = false

}) {

    /*
    |--------------------------------------------------------------------------
    | Only Running Containers
    |--------------------------------------------------------------------------
    */

    const runningContainers =
        containers.filter(
            container =>
                container.state ===
                "running"
        );

    return (

        <section className="rounded-3xl border border-slate-800 bg-[#111827] p-8">

            <div className="flex items-center justify-between">

                <div>

                    <h2 className="text-3xl font-bold text-white">

                        Running Containers

                    </h2>

                    <p className="mt-2 text-slate-400">

                        Active Docker containers currently running on the host.

                    </p>

                </div>

                <span className="rounded-full bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-400">

                    {
                        loading
                            ? "Loading..."
                            : `${runningContainers.length} Active`
                    }

                </span>

            </div>

            <div className="mt-8 overflow-x-auto">

                <table className="min-w-full">

                    <thead>

                        <tr className="border-b border-slate-800">

                            <th className="pb-4 text-left text-sm text-slate-400">

                                Container

                            </th>

                            <th className="pb-4 text-left text-sm text-slate-400">

                                Image

                            </th>

                            <th className="pb-4 text-left text-sm text-slate-400">

                                CPU

                            </th>

                            <th className="pb-4 text-left text-sm text-slate-400">

                                Memory

                            </th>

                            <th className="pb-4 text-left text-sm text-slate-400">

                                Ports

                            </th>

                            <th className="pb-4 text-left text-sm text-slate-400">

                                Uptime

                            </th>

                            <th className="pb-4 text-left text-sm text-slate-400">

                                Status

                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            runningContainers.map(
                                container => (

                                    <tr
                                        key={container.id}
                                        className="border-b border-slate-800/60 transition hover:bg-slate-900/40"
                                    >

                                        <td className="py-5">

                                            <div className="flex items-center gap-4">

                                                <div className="rounded-xl bg-sky-500/10 p-3">

                                                    <Box
                                                        size={18}
                                                        className="text-sky-400"
                                                    />

                                                </div>

                                                <div>

                                                    <span className="font-semibold text-white">

                                                        {container.name}

                                                    </span>

                                                    <p className="mt-1 font-mono text-xs text-slate-600">

                                                        {container.shortId}

                                                    </p>

                                                </div>

                                            </div>

                                        </td>

                                        <td className="py-5 font-mono text-sm text-slate-400">

                                            {container.image}

                                        </td>

                                        <td className="py-5 font-semibold text-cyan-400">

                                            {
                                                Number(
                                                    container.cpuPercent || 0
                                                ).toFixed(2)
                                            }%

                                        </td>

                                        <td className="py-5 text-white">

                                            {
                                                formatMemory(
                                                    container.memory
                                                )
                                            }

                                        </td>

                                        <td className="py-5 text-slate-300">

                                            {
                                                formatPorts(
                                                    container.ports
                                                )
                                            }

                                        </td>

                                        <td className="py-5 text-slate-300">

                                            {
                                                container.status ||
                                                "Running"
                                            }

                                        </td>

                                        <td className="py-5">

                                            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-sm font-semibold text-emerald-400">

                                                <Circle
                                                    size={8}
                                                    fill="#22c55e"
                                                />

                                                Running

                                            </span>

                                        </td>

                                    </tr>

                                )
                            )

                        }

                        {
                            !loading &&
                            runningContainers.length === 0 && (

                                <tr>

                                    <td
                                        colSpan="7"
                                        className="py-12 text-center text-slate-500"
                                    >

                                        No running Docker containers were found.

                                    </td>

                                </tr>

                            )
                        }

                    </tbody>

                </table>

            </div>

        </section>

    );

}