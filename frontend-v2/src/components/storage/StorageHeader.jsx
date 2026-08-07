import {
    HardDrive,
    Database,
    RefreshCw
} from "lucide-react";

export default function StorageHeader() {

    return (

        <section className="rounded-[32px] border border-slate-800 bg-[#111827] p-8 shadow-xl shadow-black/20">

            <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

                <div>

                    <div className="flex items-center gap-4">

                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-500/10">

                            <HardDrive
                                size={30}
                                className="text-orange-400"
                            />

                        </div>

                        <div>

                            <p className="text-sm uppercase tracking-[0.28em] text-slate-500">

                                Cloud Storage Center

                            </p>

                            <h1 className="mt-1 text-4xl font-black text-white">

                                Storage Dashboard

                            </h1>

                        </div>

                    </div>

                    <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-400">

                        Monitor Amazon S3, EBS, EFS, snapshots, backups and
                        storage utilization across your hybrid cloud
                        infrastructure.

                    </p>

                </div>

                <div className="grid gap-4">

                    <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/50 px-5 py-4">

                        <div className="flex items-center gap-3">

                            <Database
                                size={18}
                                className="text-orange-400"
                            />

                            <span className="text-slate-300">

                                Total Storage

                            </span>

                        </div>

                        <span className="font-bold text-orange-400">

                            28.4 TB

                        </span>

                    </div>

                    <button
                        className="
                            flex
                            items-center
                            justify-center
                            gap-3
                            rounded-2xl
                            bg-gradient-to-r
                            from-orange-500
                            to-amber-500
                            px-6
                            py-4
                            font-semibold
                            text-white
                            transition
                            hover:scale-[1.02]
                        "
                    >

                        <RefreshCw size={18} />

                        Refresh Storage

                    </button>

                </div>

            </div>

        </section>

    );

}