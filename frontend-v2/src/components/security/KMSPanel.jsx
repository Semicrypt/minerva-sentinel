import {
    KeyRound,
    Lock,
    RefreshCw,
    ShieldCheck,
    Database
} from "lucide-react";

const keys = [

    {
        name: "Production CMK",
        algorithm: "AES-256",
        usage: "Database Encryption",
        status: "Active"
    },

    {
        name: "Storage CMK",
        algorithm: "AES-256",
        usage: "S3 Bucket Encryption",
        status: "Active"
    },

    {
        name: "Backup CMK",
        algorithm: "AES-256",
        usage: "Snapshot Encryption",
        status: "Active"
    },

    {
        name: "Development CMK",
        algorithm: "AES-256",
        usage: "Development Environment",
        status: "Rotating"
    }

];

export default function KMSPanel() {

    return (

        <section className="rounded-3xl border border-slate-800 bg-[#111827] p-8">

            <div className="flex items-center justify-between">

                <div>

                    <h2 className="text-3xl font-bold text-white">

                        AWS Key Management Service

                    </h2>

                    <p className="mt-2 text-slate-400">

                        Encryption keys protecting cloud resources and application data.

                    </p>

                </div>

                <span className="rounded-full bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-400">

                    4 Keys

                </span>

            </div>

            <div className="mt-8 space-y-5">

                {

                    keys.map((key) => (

                        <div
                            key={key.name}
                            className="
                                flex
                                flex-col
                                gap-5
                                rounded-2xl
                                border
                                border-slate-800
                                bg-slate-900/40
                                p-6
                                transition
                                hover:border-cyan-500/30
                                lg:flex-row
                                lg:items-center
                                lg:justify-between
                            "
                        >

                            <div className="flex items-center gap-5">

                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/10">

                                    <KeyRound
                                        size={28}
                                        className="text-cyan-400"
                                    />

                                </div>

                                <div>

                                    <h3 className="text-lg font-bold text-white">

                                        {key.name}

                                    </h3>

                                    <p className="mt-1 text-slate-400">

                                        {key.usage}

                                    </p>

                                </div>

                            </div>

                            <div className="flex items-center gap-8">

                                <div>

                                    <p className="text-sm text-slate-500">

                                        Algorithm

                                    </p>

                                    <div className="flex items-center gap-2">

                                        <Lock
                                            size={16}
                                            className="text-cyan-400"
                                        />

                                        <span className="font-semibold text-white">

                                            {key.algorithm}

                                        </span>

                                    </div>

                                </div>

                                {

                                    key.status === "Active"

                                        ? (

                                            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-sm font-semibold text-emerald-400">

                                                <ShieldCheck size={16} />

                                                Active

                                            </div>

                                        )

                                        : (

                                            <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 px-3 py-1 text-sm font-semibold text-amber-400">

                                                <RefreshCw size={16} />

                                                Rotating

                                            </div>

                                        )

                                }

                            </div>

                        </div>

                    ))

                }

            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-3">

                <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">

                    <Database
                        size={28}
                        className="text-cyan-400"
                    />

                    <h3 className="mt-5 text-lg font-bold text-white">

                        Encrypted Databases

                    </h3>

                    <p className="mt-3 text-3xl font-black text-white">

                        12

                    </p>

                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">

                    <Lock
                        size={28}
                        className="text-emerald-400"
                    />

                    <h3 className="mt-5 text-lg font-bold text-white">

                        Protected Storage

                    </h3>

                    <p className="mt-3 text-3xl font-black text-white">

                        28 TB

                    </p>

                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">

                    <ShieldCheck
                        size={28}
                        className="text-violet-400"
                    />

                    <h3 className="mt-5 text-lg font-bold text-white">

                        Encryption Status

                    </h3>

                    <p className="mt-3 text-3xl font-black text-emerald-400">

                        100%

                    </p>

                </div>

            </div>

        </section>

    );

}