import {
    Database,
    Lock,
    CheckCircle2,
    Globe
} from "lucide-react";

const buckets = [

    {
        name: "minerva-assets",
        region: "eu-west-1",
        storage: "4.2 TB",
        objects: "2.3 M",
        versioning: "Enabled"
    },

    {
        name: "minerva-backups",
        region: "us-east-1",
        storage: "12.8 TB",
        objects: "580 K",
        versioning: "Enabled"
    },

    {
        name: "application-logs",
        region: "eu-central-1",
        storage: "6.4 TB",
        objects: "4.8 M",
        versioning: "Enabled"
    },

    {
        name: "media-storage",
        region: "ap-southeast-1",
        storage: "5.0 TB",
        objects: "1.9 M",
        versioning: "Enabled"
    }

];

export default function S3Buckets() {

    return (

        <section className="rounded-3xl border border-slate-800 bg-[#111827] p-8">

            <div className="flex items-center justify-between">

                <div>

                    <h2 className="text-3xl font-bold text-white">

                        Amazon S3 Buckets

                    </h2>

                    <p className="mt-2 text-slate-400">

                        Object storage, versioning and encryption status.

                    </p>

                </div>

                <span className="rounded-full bg-orange-500/10 px-4 py-2 text-sm font-semibold text-orange-400">

                    16 Buckets

                </span>

            </div>

            <div className="mt-8 space-y-5">

                {

                    buckets.map((bucket) => (

                        <div
                            key={bucket.name}
                            className="
                                rounded-2xl
                                border
                                border-slate-800
                                bg-slate-900/40
                                p-6
                                transition
                                hover:border-orange-500/30
                            "
                        >

                            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

                                <div className="flex items-center gap-5">

                                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500/10">

                                        <Database
                                            size={28}
                                            className="text-orange-400"
                                        />

                                    </div>

                                    <div>

                                        <h3 className="text-lg font-bold text-white">

                                            {bucket.name}

                                        </h3>

                                        <div className="mt-2 flex items-center gap-2 text-slate-400">

                                            <Globe size={15} />

                                            {bucket.region}

                                        </div>

                                    </div>

                                </div>

                                <div className="grid grid-cols-3 gap-8">

                                    <div>

                                        <p className="text-sm text-slate-500">

                                            Storage

                                        </p>

                                        <p className="mt-1 font-semibold text-white">

                                            {bucket.storage}

                                        </p>

                                    </div>

                                    <div>

                                        <p className="text-sm text-slate-500">

                                            Objects

                                        </p>

                                        <p className="mt-1 font-semibold text-white">

                                            {bucket.objects}

                                        </p>

                                    </div>

                                    <div>

                                        <p className="text-sm text-slate-500">

                                            Versioning

                                        </p>

                                        <p className="mt-1 font-semibold text-emerald-400">

                                            {bucket.versioning}

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

                                        Server Side Encryption

                                    </span>

                                </div>

                                <div className="flex items-center gap-2 text-emerald-400">

                                    <CheckCircle2 size={18} />

                                    AES-256 Enabled

                                </div>

                            </div>

                        </div>

                    ))

                }

            </div>

        </section>

    );

}