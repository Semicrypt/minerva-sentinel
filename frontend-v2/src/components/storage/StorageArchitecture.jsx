import {
    Server,
    Database,
    HardDrive,
    FolderOpen,
    Archive,
    Shield,
    CheckCircle2
} from "lucide-react";

const architecture = [

    {
        icon: Server,
        title: "Applications",
        subtitle: "Cloud Services"
    },

    {
        icon: Database,
        title: "Amazon S3",
        subtitle: "Object Storage"
    },

    {
        icon: HardDrive,
        title: "Amazon EBS",
        subtitle: "Block Storage"
    },

    {
        icon: FolderOpen,
        title: "Amazon EFS",
        subtitle: "Shared File System"
    },

    {
        icon: Archive,
        title: "Backups",
        subtitle: "Snapshots & Lifecycle"
    },

    {
        icon: Shield,
        title: "Disaster Recovery",
        subtitle: "Cross Region"
    }

];

export default function StorageArchitecture() {

    return (

        <section className="rounded-3xl border border-slate-800 bg-[#111827] p-8">

            <div className="mb-10">

                <h2 className="text-3xl font-bold text-white">

                    Storage Architecture

                </h2>

                <p className="mt-2 text-slate-400">

                    End-to-end cloud storage architecture for the Minerva Sentinel platform.

                </p>

            </div>

            <div className="grid gap-6 lg:grid-cols-6">

                {

                    architecture.map((item, index) => {

                        const Icon = item.icon;

                        return (

                            <div
                                key={item.title}
                                className="relative"
                            >

                                <div
                                    className="
                                        rounded-3xl
                                        border
                                        border-slate-800
                                        bg-slate-900/40
                                        p-6
                                        text-center
                                        transition-all
                                        duration-300
                                        hover:-translate-y-1
                                        hover:border-orange-500/30
                                    "
                                >

                                    <div
                                        className="
                                            mx-auto
                                            flex
                                            h-16
                                            w-16
                                            items-center
                                            justify-center
                                            rounded-2xl
                                            bg-orange-500/10
                                        "
                                    >

                                        <Icon
                                            size={30}
                                            className="text-orange-400"
                                        />

                                    </div>

                                    <h3 className="mt-5 text-lg font-bold text-white">

                                        {item.title}

                                    </h3>

                                    <p className="mt-2 text-sm text-slate-400">

                                        {item.subtitle}

                                    </p>

                                    <div
                                        className="
                                            mt-5
                                            inline-flex
                                            items-center
                                            gap-2
                                            rounded-full
                                            bg-emerald-500/10
                                            px-3
                                            py-1
                                            text-sm
                                            font-semibold
                                            text-emerald-400
                                        "
                                    >

                                        <CheckCircle2 size={16} />

                                        Active

                                    </div>

                                </div>

                                {

                                    index !== architecture.length - 1 && (

                                        <div
                                            className="
                                                absolute
                                                top-1/2
                                                left-full
                                                hidden
                                                h-1
                                                w-6
                                                -translate-y-1/2
                                                bg-gradient-to-r
                                                from-orange-500
                                                to-amber-500
                                                lg:block
                                            "
                                        />

                                    )

                                }

                            </div>

                        );

                    })

                }

            </div>

            <div className="mt-10 rounded-2xl border border-orange-500/20 bg-orange-500/5 p-6">

                <h3 className="text-xl font-bold text-white">

                    Storage Workflow

                </h3>

                <p className="mt-4 leading-8 text-slate-300">

                    Application data is stored in Amazon S3 for object storage,
                    Amazon EBS provides persistent block storage for compute
                    instances, and Amazon EFS delivers shared file systems across
                    multiple Availability Zones. Automated snapshots, lifecycle
                    policies, and cross-region disaster recovery ensure durability,
                    resilience, and business continuity throughout the storage
                    platform.

                </p>

            </div>

        </section>

    );

}