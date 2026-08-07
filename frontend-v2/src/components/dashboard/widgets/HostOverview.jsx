import {
    Monitor,
    Cpu,
    MemoryStick,
    HardDrive,
    Clock
} from "lucide-react";

export default function HostOverview({ hosts }) {

    if (!hosts.length) return null;

    const host = hosts[0];

    return (

        <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 shadow-xl">

            <div className="mb-6 flex items-center gap-3">

                <Monitor className="text-blue-400" size={28} />

                <h2 className="text-2xl font-bold text-white">

                    Host Overview

                </h2>

            </div>

            <div className="space-y-5">

                <InfoRow
                    icon={<Monitor size={20} />}
                    label="Hostname"
                    value={host.hostname}
                />

                <InfoRow
                    icon={<Cpu size={20} />}
                    label="Platform"
                    value={host.platform}
                />

                <InfoRow
                    icon={<MemoryStick size={20} />}
                    label="Architecture"
                    value={host.architecture}
                />

                <InfoRow
                    icon={<HardDrive size={20} />}
                    label="Status"
                    value={host.status}
                    valueColor="text-emerald-400"
                />

                <InfoRow
                    icon={<Clock size={20} />}
                    label="Last Seen"
                    value={new Date(host.last_seen).toLocaleTimeString()}
                />

            </div>

        </div>

    );

}

function InfoRow({

    icon,

    label,

    value,

    valueColor = "text-white"

}) {

    return (

        <div className="flex items-center justify-between rounded-xl bg-slate-800/40 p-4">

            <div className="flex items-center gap-3 text-slate-300">

                {icon}

                <span>{label}</span>

            </div>

            <span className={`font-semibold ${valueColor}`}>

                {value}

            </span>

        </div>

    );

}