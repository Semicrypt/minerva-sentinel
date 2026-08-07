import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip
} from "chart.js";

import { Line } from "react-chartjs-2";

import Card from "../../ui/Card";
import SectionHeader from "../../ui/SectionHeader";
import StatusBadge from "../../ui/StatusBadge";

import {
    Activity,
    Cpu,
    MemoryStick,
    Wifi
} from "lucide-react";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip
);

/*
|--------------------------------------------------------------------------
| Chart Configuration
|--------------------------------------------------------------------------
*/

const options = {

    responsive: true,

    maintainAspectRatio: false,

    animation: {

        duration: 350

    },

    plugins: {

        legend: {

            display: false

        },

        tooltip: {

            backgroundColor: "#111827",

            borderColor: "#334155",

            borderWidth: 1,

            padding: 14,

            titleColor: "#fff",

            bodyColor: "#CBD5E1"

        }

    },

    scales: {

        x: {

            grid: {

                color:
                    "rgba(255,255,255,.04)"

            },

            ticks: {

                color: "#64748B",

                padding: 10

            }

        },

        y: {

            beginAtZero: true,

            max: 100,

            grid: {

                color:
                    "rgba(255,255,255,.04)"

            },

            ticks: {

                color: "#64748B",

                padding: 12,

                callback:
                    value =>
                        value + "%"

            }

        }

    }

};

/*
|--------------------------------------------------------------------------
| Format Network Rate
|--------------------------------------------------------------------------
*/

function formatNetworkRate(
    bytesPerSecond
) {

    const value =
        Number(
            bytesPerSecond
        ) || 0;

    if (value < 1024) {

        return `${value.toFixed(0)} B/s`;

    }

    if (
        value <
        1024 * 1024
    ) {

        return `${(
            value / 1024
        ).toFixed(1)} KB/s`;

    }

    return `${(
        value /
        1024 /
        1024
    ).toFixed(1)} MB/s`;

}

export default function PerformanceChart({

    metrics,

    history,

    connected

}) {

    const cpu =
        Number(
            metrics?.cpu?.usage || 0
        );

    const memory =
        Number(
            metrics?.memory?.usage || 0
        );

    const network =
        (
            Number(
                metrics?.network?.rxPerSecond
            ) || 0
        ) +
        (
            Number(
                metrics?.network?.txPerSecond
            ) || 0
        );

    /*
    |--------------------------------------------------------------------------
    | Dynamic Labels
    |--------------------------------------------------------------------------
    */

    const pointCount =
        Math.max(
            history?.cpu?.length || 0,
            1
        );

    const labels =
        Array.from(
            {
                length: pointCount
            },
            (_, index) => {

                const secondsAgo =
                    (
                        pointCount -
                        index -
                        1
                    ) * 5;

                if (
                    secondsAgo === 0
                ) {

                    return "Now";

                }

                return `-${secondsAgo}s`;

            }
        );

    /*
    |--------------------------------------------------------------------------
    | Live Chart Data
    |--------------------------------------------------------------------------
    */

    const data = {

        labels,

        datasets: [

            {

                label: "CPU",

                data:
                    history?.cpu?.length
                        ? history.cpu
                        : [cpu],

                borderColor:
                    "#3B82F6",

                backgroundColor:
                    "rgba(59,130,246,.15)",

                fill: true,

                tension: 0.45,

                borderWidth: 3,

                pointRadius: 0

            },

            {

                label: "Memory",

                data:
                    history?.memory?.length
                        ? history.memory
                        : [memory],

                borderColor:
                    "#10B981",

                backgroundColor:
                    "rgba(16,185,129,.10)",

                fill: true,

                tension: 0.45,

                borderWidth: 3,

                pointRadius: 0

            }

        ]

    };

    return (

        <Card
            glow="blue"
            className="rounded-3xl p-8"
        >

            <SectionHeader
                title="Performance Overview"
                subtitle="Live CPU, memory and network utilization from Minerva Sentinel."
                icon={Activity}
                color="text-blue-400"
            >

                <StatusBadge
                    status={
                        connected
                            ? "online"
                            : "offline"
                    }
                    label={
                        connected
                            ? "LIVE"
                            : "OFFLINE"
                    }
                />

            </SectionHeader>

            <div className="my-8 border-b border-slate-800"></div>

            {/* Top Stats */}

            <div className="mb-10 grid grid-cols-3 gap-6">

                <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">

                    <div className="flex items-center gap-3">

                        <Cpu
                            size={20}
                            className="text-blue-400"
                        />

                        <span className="text-base font-medium text-slate-400">

                            CPU Usage

                        </span>

                    </div>

                    <h3 className="mt-4 text-4xl font-bold tracking-tight text-white">

                        {cpu.toFixed(1)}%

                    </h3>

                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">

                    <div className="flex items-center gap-3">

                        <MemoryStick
                            size={20}
                            className="text-emerald-400"
                        />

                        <span className="text-base font-medium text-slate-400">

                            Memory

                        </span>

                    </div>

                    <h3 className="mt-4 text-4xl font-bold tracking-tight text-white">

                        {memory.toFixed(1)}%

                    </h3>

                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">

                    <div className="flex items-center gap-3">

                        <Wifi
                            size={20}
                            className="text-cyan-400"
                        />

                        <span className="text-base font-medium text-slate-400">

                            Network

                        </span>

                    </div>

                    <h3 className="mt-4 text-3xl font-bold tracking-tight text-white">

                        {
                            formatNetworkRate(
                                network
                            )
                        }

                    </h3>

                </div>

            </div>

            <div className="mb-8 flex items-center justify-between">

                <div className="flex gap-3">

                    <button className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white">

                        LIVE

                    </button>

                </div>

                <div className="flex items-center gap-8 text-base">

                    <div className="flex items-center gap-3">

                        <span className="h-3.5 w-3.5 rounded-full bg-blue-500"></span>

                        <span className="font-medium text-slate-300">

                            CPU

                        </span>

                    </div>

                    <div className="flex items-center gap-3">

                        <span className="h-3.5 w-3.5 rounded-full bg-emerald-500"></span>

                        <span className="font-medium text-slate-300">

                            Memory

                        </span>

                    </div>

                </div>

            </div>

            <div className="h-[430px] pt-2">

                <Line
                    data={data}
                    options={options}
                />

            </div>

        </Card>

    );

}