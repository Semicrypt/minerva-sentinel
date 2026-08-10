import {
    Boxes,
    Server,
    Database,
    FileText,
    Monitor,
    CheckCircle2
} from "lucide-react";

const architecture = [

    {
        icon: Boxes,
        title: "Docker Containers",
        subtitle: "Application Services"
    },

    {
        icon: Server,
        title: "Node.js API",
        subtitle: "Backend Logs"
    },

    {
        icon: Database,
        title: "PostgreSQL",
        subtitle: "Database Events"
    },

    {
        icon: FileText,
        title: "Log Collector",
        subtitle: "Central Processing"
    },

    {
        icon: Monitor,
        title: "Minerva Sentinel",
        subtitle: "Live Dashboard"
    }

];

export default function LogsArchitecture() {

    return (

        <section className="rounded-3xl border border-slate-800 bg-[#111827] p-8">

            <div className="mb-10">

                <h2 className="text-3xl font-bold text-white">

                    Logging Architecture

                </h2>

                <p className="mt-2 text-slate-400">

                    Centralized log collection pipeline across infrastructure, applications and databases.

                </p>

            </div>

            <div className="grid gap-6 lg:grid-cols-5">

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
                                        hover:border-indigo-500/30
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
                                            bg-indigo-500/10
                                        "
                                    >

                                        <Icon
                                            size={30}
                                            className="text-indigo-400"
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
                                                left-full
                                                top-1/2
                                                hidden
                                                h-1
                                                w-6
                                                -translate-y-1/2
                                                bg-gradient-to-r
                                                from-indigo-500
                                                to-purple-500
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

            <div
                className="
                    mt-10
                    rounded-2xl
                    border
                    border-indigo-500/20
                    bg-indigo-500/5
                    p-6
                "
            >

                <h3 className="text-xl font-bold text-white">

                    Log Processing Workflow

                </h3>

                <p className="mt-4 leading-8 text-slate-300">

                    Logs generated by Docker containers, backend APIs and PostgreSQL
                    are collected by a centralized logging service. The collector
                    normalizes events, categorizes them by severity, stores them
                    for historical analysis, and streams critical events to the
                    Minerva Sentinel dashboard for real-time monitoring and
                    troubleshooting.

                </p>

            </div>

        </section>

    );

}