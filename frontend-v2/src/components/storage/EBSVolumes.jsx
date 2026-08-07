import {
    HardDrive,
    Server,
    Lock,
    CheckCircle2
} from "lucide-react";

const volumes = [

    {
        name: "vol-01a2bc34",
        type: "gp3",
        size: "500 GB",
        iops: "3000",
        throughput: "125 MB/s",
        instance: "minerva-api-01"
    },

    {
        name: "vol-98de76fa",
        type: "io2",
        size: "2 TB",
        iops: "10000",
        throughput: "500 MB/s",
        instance: "postgres-db-01"
    },

    {
        name: "vol-77aa55cc",
        type: "gp3",
        size: "1 TB",
        iops: "6000",
        throughput: "250 MB/s",
        instance: "monitor-node-01"
    },

    {
        name: "vol-44bb88dd",
        type: "gp3",
        size: "250 GB",
        iops: "3000",
        throughput: "125 MB/s",
        instance: "grafana-01"
    }

];

export default function EBSVolumes() {

    return (

        <section className="rounded-3xl border border-slate-800 bg-[#111827] p-8">

            <div className="flex items-center justify-between">

                <div>

                    <h2 className="text-3xl font-bold text-white">

                        Amazon EBS Volumes

                    </h2>

                    <p className="mt-2 text-slate-400">

                        Elastic Block Store volumes attached to compute instances.

                    </p>

                </div>

                <span className="rounded-full bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-400">

                    32 Volumes

                </span>

            </div>

            <div className="mt-8 space-y-5">

                {

                    volumes.map((volume) => (

                        <div
                            key={volume.name}
                            className="
                                rounded-2xl
                                border
                                border-slate-800
                                bg-slate-900/40
                                p-6
                                transition
                                hover:border-blue-500/30
                            "
                        >

                            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

                                <div className="flex items-center gap-5">

                                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10">

                                        <HardDrive
                                            size={28}
                                            className="text-blue-400"
                                        />

                                    </div>

                                    <div>

                                        <h3 className="text-lg font-bold text-white">

                                            {volume.name}

                                        </h3>

                                        <div className="mt-2 flex items-center gap-2 text-slate-400">

                                            <Server size={15} />

                                            {volume.instance}

                                        </div>

                                    </div>

                                </div>

                                <div className="grid grid-cols-4 gap-8">

                                    <div>

                                        <p className="text-sm text-slate-500">

                                            Type

                                        </p>

                                        <p className="mt-1 font-semibold text-white">

                                            {volume.type}

                                        </p>

                                    </div>

                                    <div>

                                        <p className="text-sm text-slate-500">

                                            Size

                                        </p>

                                        <p className="mt-1 font-semibold text-white">

                                            {volume.size}

                                        </p>

                                    </div>

                                    <div>

                                        <p className="text-sm text-slate-500">

                                            IOPS

                                        </p>

                                        <p className="mt-1 font-semibold text-white">

                                            {volume.iops}

                                        </p>

                                    </div>

                                    <div>

                                        <p className="text-sm text-slate-500">

                                            Throughput

                                        </p>

                                        <p className="mt-1 font-semibold text-white">

                                            {volume.throughput}

                                        </p>

                                    </div>

                                </div>

                            </div>

                            <div className="mt-6 flex items-center justify-between rounded-2xl bg-slate-800 p-4">

                                <div className="flex items-center gap-3">

                                    <Lock
                                        size={18}
                                        className="text-cyan-400"
                                    />

                                    <span className="text-slate-300">

                                        Encryption

                                    </span>

                                </div>

                                <div className="flex items-center gap-2 text-emerald-400">

                                    <CheckCircle2 size={18} />

                                    Enabled

                                </div>

                            </div>

                        </div>

                    ))

                }

            </div>

        </section>

    );

}