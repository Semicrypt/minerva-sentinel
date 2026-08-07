import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
    Filler
} from "chart.js";

import {
    Line
} from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
    Filler
);

export default function MetricsHistoryChart({
    history = [],
    hostname
}) {

    const labels =
        history.map(
            item =>
                new Date(
                    item.created_at
                ).toLocaleTimeString(
                    [],
                    {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit"
                    }
                )
        );

    const data = {

        labels,

        datasets: [

            {
                label: "CPU %",
                data:
                    history.map(
                        item =>
                            Number(
                                item.cpu_usage || 0
                            )
                    ),
                tension: 0.35
            },

            {
                label: "Memory %",
                data:
                    history.map(
                        item =>
                            Number(
                                item.memory_usage || 0
                            )
                    ),
                tension: 0.35
            },

            {
                label: "Disk %",
                data:
                    history.map(
                        item =>
                            Number(
                                item.disk_usage || 0
                            )
                    ),
                tension: 0.35
            }

        ]

    };

    const options = {

        responsive: true,

        maintainAspectRatio: false,

        interaction: {

            mode: "index",

            intersect: false

        },

        plugins: {

            legend: {

                labels: {

                    color: "#cbd5e1"

                }

            }

        },

        scales: {

            x: {

                ticks: {

                    color: "#64748b"

                },

                grid: {

                    color: "rgba(148,163,184,0.08)"

                }

            },

            y: {

                beginAtZero: true,

                max: 100,

                ticks: {

                    color: "#64748b",

                    callback:
                        value =>
                            `${value}%`

                },

                grid: {

                    color: "rgba(148,163,184,0.08)"

                }

            }

        }

    };

    return (

        <section className="rounded-3xl border border-slate-800 bg-[#111827] p-8">

            <div>

                <h2 className="text-3xl font-bold text-white">

                    Historical Metrics

                </h2>

                <p className="mt-2 text-slate-400">

                    CPU, memory and disk utilization history
                    {hostname ? ` for ${hostname}.` : "."}

                </p>

            </div>

            <div className="mt-8 h-[380px]">

                {
                    history.length > 0
                        ? (

                            <Line
                                data={data}
                                options={options}
                            />

                        )
                        : (

                            <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-slate-800 text-slate-500">

                                No historical metrics available.

                            </div>

                        )
                }

            </div>

        </section>

    );

}
