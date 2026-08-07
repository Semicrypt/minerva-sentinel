import StatCard from "../../ui/StatCard";

import {

    Cpu,

    MemoryStick,

    HardDrive,

    Monitor

} from "lucide-react";

export default function MetricCards({ hosts }) {

    if (!hosts.length) return null;

    const host = hosts[0];

    return (

        <div
            className="
                grid
                gap-6

                grid-cols-1

                sm:grid-cols-2

                2xl:grid-cols-4
            "
        >

            <StatCard

                title="CPU Usage"

                value={`${host.latest_cpu}%`}

                icon={<Cpu size={30} />}

            />

            <StatCard

                title="Memory Usage"

                value={`${host.latest_memory}%`}

                icon={<MemoryStick size={30} />}

                color="text-cyan-400"

            />

            <StatCard

                title="Disk Usage"

                value={`${host.latest_disk}%`}

                icon={<HardDrive size={30} />}

                color="text-violet-400"

            />

            <StatCard

                title="Connected Hosts"

                value={hosts.length}

                icon={<Monitor size={30} />}

                color="text-emerald-400"

            />

        </div>

    );

}