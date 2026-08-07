import {
    Server,
    Activity,
    Database,
    BarChart3,
    CheckCircle2
} from "lucide-react";

const architecture = [
    {
        icon: Server,
        title: "Applications",
        subtitle: "Servers • Containers • APIs"
    },
    {
        icon: Activity,
        title: "Metrics / Logs",
        subtitle: "Telemetry Collection"
    },
    {
        icon: Database,
        title: "Storage",
        subtitle: "CloudWatch • PostgreSQL"
    },
    {
        icon: BarChart3,
        title: "Minerva Sentinel",
        subtitle: "Dashboard & Analytics"
    }
];

export default function ArchitectureDiagram() {

    return (

        <section className="rounded-3xl border border-slate-800 bg-[#111827] p-8">

            <div className="mb-10">

                <h2 className="text-3xl font-bold text-white">

                    Observability Architecture

                </h2>

                <p className="mt-2 text-slate-400">

                    End-to-end monitoring data flow across the Minerva Sentinel platform.

                </p>

            </div>

            <div className="grid gap-6 lg:grid-cols-4">

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
                                        hover:border-cyan-500/30
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
                                            bg-cyan-500/10
                                        "
                                    >

                                        <Icon
                                            size={30}
                                            className="text-cyan-400"
                                        />

                                    </div>

                                    <h3 className="mt-6 text-xl font-bold text-white">

                                        {item.title}

                                    </h3>

                                    <p className="mt-2 text-sm text-slate-400">

                                        {item.subtitle}

                                    </p>

                                    <div
                                        className="
                                            mt-6
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
                                                from-cyan-500
                                                to-blue-500
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

            <div className="mt-10 rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-6">

                <h3 className="text-xl font-bold text-white">

                    Monitoring Flow

                </h3>

                <p className="mt-4 leading-8 text-slate-300">

                    Infrastructure and application metrics are collected from
                    monitored servers and containers. Telemetry data is stored,
                    analyzed, and visualized through Minerva Sentinel, providing
                    real-time dashboards, alerting, logging, and performance
                    analytics for hybrid cloud environments.

                </p>

            </div>

        </section>

    );

}