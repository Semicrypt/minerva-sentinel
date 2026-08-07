import {
    HardDrive,
    Database,
    FolderOpen,
    Archive
} from "lucide-react";

const storage = [

    {
        title: "Total Storage",
        value: "28.4 TB",
        subtitle: "Across all services",
        icon: HardDrive,
        color: "text-orange-400 bg-orange-500/10"
    },

    {
        title: "S3 Buckets",
        value: "16",
        subtitle: "Object Storage",
        icon: Database,
        color: "text-cyan-400 bg-cyan-500/10"
    },

    {
        title: "EBS Volumes",
        value: "32",
        subtitle: "Block Storage",
        icon: FolderOpen,
        color: "text-violet-400 bg-violet-500/10"
    },

    {
        title: "Snapshots",
        value: "118",
        subtitle: "Daily Backups",
        icon: Archive,
        color: "text-emerald-400 bg-emerald-500/10"
    }

];

export default function StorageOverview() {

    return (

        <section>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

                {

                    storage.map((item) => {

                        const Icon = item.icon;

                        return (

                            <div
                                key={item.title}
                                className="
                                    rounded-3xl
                                    border
                                    border-slate-800
                                    bg-[#111827]
                                    p-7
                                    transition
                                    hover:-translate-y-1
                                    hover:border-orange-500/30
                                "
                            >

                                <div className="flex items-center justify-between">

                                    <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${item.color}`}>

                                        <Icon size={28} />

                                    </div>

                                    <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">

                                        Live

                                    </span>

                                </div>

                                <h3 className="mt-6 text-xl font-bold text-white">

                                    {item.title}

                                </h3>

                                <p className="mt-5 text-4xl font-black text-white">

                                    {item.value}

                                </p>

                                <p className="mt-2 text-slate-400">

                                    {item.subtitle}

                                </p>

                            </div>

                        );

                    })

                }

            </div>

        </section>

    );

}