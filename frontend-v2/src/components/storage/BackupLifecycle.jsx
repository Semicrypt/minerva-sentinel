import {
    Archive,
    RefreshCw,
    Clock3,
    Shield,
    CheckCircle2,
    Database
} from "lucide-react";

const backups = [

    {
        title: "Daily Snapshots",
        schedule: "Every 24 Hours",
        retention: "30 Days",
        status: "Healthy",
        icon: Archive
    },

    {
        title: "S3 Lifecycle",
        schedule: "Automatic",
        retention: "365 Days",
        status: "Active",
        icon: RefreshCw
    },

    {
        title: "Glacier Archive",
        schedule: "Monthly",
        retention: "7 Years",
        status: "Enabled",
        icon: Database
    },

    {
        title: "Cross Region Backup",
        schedule: "Real-Time",
        retention: "Continuous",
        status: "Protected",
        icon: Shield
    }

];

export default function BackupLifecycle() {

    return (

        <section className="rounded-3xl border border-slate-800 bg-[#111827] p-8">

            <div className="flex items-center justify-between">

                <div>

                    <h2 className="text-3xl font-bold text-white">

                        Backup & Lifecycle

                    </h2>

                    <p className="mt-2 text-slate-400">

                        Snapshot management, lifecycle policies and disaster recovery.

                    </p>

                </div>

                <span className="rounded-full bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-400">

                    Fully Protected

                </span>

            </div>

            <div className="mt-8 grid gap-6 md:grid-cols-2">

                {

                    backups.map((item) => {

                        const Icon = item.icon;

                        return (

                            <div
                                key={item.title}
                                className="
                                    rounded-3xl
                                    border
                                    border-slate-800
                                    bg-slate-900/40
                                    p-6
                                    transition
                                    hover:border-emerald-500/30
                                "
                            >

                                <div className="flex items-center justify-between">

                                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10">

                                        <Icon
                                            size={28}
                                            className="text-emerald-400"
                                        />

                                    </div>

                                    <CheckCircle2
                                        size={20}
                                        className="text-emerald-400"
                                    />

                                </div>

                                <h3 className="mt-6 text-xl font-bold text-white">

                                    {item.title}

                                </h3>

                                <div className="mt-6 space-y-3">

                                    <div className="flex items-center justify-between">

                                        <span className="text-slate-400">

                                            Schedule

                                        </span>

                                        <span className="font-semibold text-white">

                                            {item.schedule}

                                        </span>

                                    </div>

                                    <div className="flex items-center justify-between">

                                        <span className="text-slate-400">

                                            Retention

                                        </span>

                                        <span className="font-semibold text-white">

                                            {item.retention}

                                        </span>

                                    </div>

                                    <div className="flex items-center justify-between">

                                        <span className="text-slate-400">

                                            Status

                                        </span>

                                        <span className="font-semibold text-emerald-400">

                                            {item.status}

                                        </span>

                                    </div>

                                </div>

                            </div>

                        );

                    })

                }

            </div>

            <div className="mt-10 rounded-2xl border border-slate-800 bg-slate-900/40 p-6">

                <div className="flex items-center gap-3">

                    <Clock3
                        size={22}
                        className="text-cyan-400"
                    />

                    <h3 className="text-xl font-bold text-white">

                        Next Scheduled Backup

                    </h3>

                </div>

                <div className="mt-6 grid gap-6 md:grid-cols-4">

                    <div>

                        <p className="text-sm text-slate-500">

                            Time

                        </p>

                        <p className="mt-2 text-2xl font-black text-white">

                            02:00 UTC

                        </p>

                    </div>

                    <div>

                        <p className="text-sm text-slate-500">

                            Storage

                        </p>

                        <p className="mt-2 text-2xl font-black text-white">

                            Amazon S3

                        </p>

                    </div>

                    <div>

                        <p className="text-sm text-slate-500">

                            Destination

                        </p>

                        <p className="mt-2 text-2xl font-black text-white">

                            Glacier

                        </p>

                    </div>

                    <div>

                        <p className="text-sm text-slate-500">

                            Estimated Size

                        </p>

                        <p className="mt-2 text-2xl font-black text-emerald-400">

                            184 GB

                        </p>

                    </div>

                </div>

            </div>

        </section>

    );

}