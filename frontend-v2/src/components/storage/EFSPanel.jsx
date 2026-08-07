import {
    FolderOpen,
    Server,
    CheckCircle2,
    Activity,
    HardDrive
} from "lucide-react";

const fileSystems = [

    {
        name: "efs-production",
        performance: "General Purpose",
        throughput: "Elastic",
        storage: "8.4 TB",
        instances: "12 EC2"
    },

    {
        name: "efs-monitoring",
        performance: "Max I/O",
        throughput: "Provisioned",
        storage: "2.1 TB",
        instances: "6 EC2"
    },

    {
        name: "efs-backups",
        performance: "General Purpose",
        throughput: "Bursting",
        storage: "14.8 TB",
        instances: "4 EC2"
    }

];

export default function EFSPanel() {

    return (

        <section className="rounded-3xl border border-slate-800 bg-[#111827] p-8">

            <div className="flex items-center justify-between">

                <div>

                    <h2 className="text-3xl font-bold text-white">

                        Amazon Elastic File System

                    </h2>

                    <p className="mt-2 text-slate-400">

                        Shared network file systems available across multiple Availability Zones.

                    </p>

                </div>

                <span className="rounded-full bg-violet-500/10 px-4 py-2 text-sm font-semibold text-violet-400">

                    3 File Systems

                </span>

            </div>

            <div className="mt-8 space-y-5">

                {

                    fileSystems.map((efs) => (

                        <div
                            key={efs.name}
                            className="
                                rounded-2xl
                                border
                                border-slate-800
                                bg-slate-900/40
                                p-6
                                transition
                                hover:border-violet-500/30
                            "
                        >

                            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

                                <div className="flex items-center gap-5">

                                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/10">

                                        <FolderOpen
                                            size={28}
                                            className="text-violet-400"
                                        />

                                    </div>

                                    <div>

                                        <h3 className="text-lg font-bold text-white">

                                            {efs.name}

                                        </h3>

                                        <div className="mt-2 flex items-center gap-2 text-slate-400">

                                            <Server size={15} />

                                            {efs.instances}

                                        </div>

                                    </div>

                                </div>

                                <div className="grid grid-cols-3 gap-8">

                                    <div>

                                        <p className="text-sm text-slate-500">

                                            Performance

                                        </p>

                                        <p className="mt-1 font-semibold text-white">

                                            {efs.performance}

                                        </p>

                                    </div>

                                    <div>

                                        <p className="text-sm text-slate-500">

                                            Throughput

                                        </p>

                                        <p className="mt-1 font-semibold text-white">

                                            {efs.throughput}

                                        </p>

                                    </div>

                                    <div>

                                        <p className="text-sm text-slate-500">

                                            Storage

                                        </p>

                                        <p className="mt-1 font-semibold text-white">

                                            {efs.storage}

                                        </p>

                                    </div>

                                </div>

                            </div>

                            <div className="mt-6 grid gap-4 md:grid-cols-2">

                                <div className="flex items-center justify-between rounded-xl bg-slate-800 p-4">

                                    <div className="flex items-center gap-3">

                                        <Activity
                                            size={18}
                                            className="text-cyan-400"
                                        />

                                        <span className="text-slate-300">

                                            Throughput Mode

                                        </span>

                                    </div>

                                    <span className="font-semibold text-white">

                                        {efs.throughput}

                                    </span>

                                </div>

                                <div className="flex items-center justify-between rounded-xl bg-slate-800 p-4">

                                    <div className="flex items-center gap-3">

                                        <HardDrive
                                            size={18}
                                            className="text-emerald-400"
                                        />

                                        <span className="text-slate-300">

                                            Availability

                                        </span>

                                    </div>

                                    <div className="flex items-center gap-2 text-emerald-400">

                                        <CheckCircle2 size={18} />

                                        Multi-AZ

                                    </div>

                                </div>

                            </div>

                        </div>

                    ))

                }

            </div>

        </section>

    );

}