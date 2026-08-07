import {
    Server,
    Activity,
    DollarSign,
    Wallet,
    Lightbulb,
    PiggyBank,
    CheckCircle2
} from "lucide-react";

const architecture = [

    {
        icon: Server,
        title: "AWS Resources",
        subtitle: "EC2 • S3 • RDS"
    },

    {
        icon: Activity,
        title: "Usage Metrics",
        subtitle: "CPU • Storage • Network"
    },

    {
        icon: DollarSign,
        title: "Billing Engine",
        subtitle: "Cost Collection"
    },

    {
        icon: Wallet,
        title: "Cost Explorer",
        subtitle: "Analysis Dashboard"
    },

    {
        icon: Lightbulb,
        title: "Optimization",
        subtitle: "Savings Recommendations"
    },

    {
        icon: PiggyBank,
        title: "Budgets",
        subtitle: "Forecast & Alerts"
    }

];

export default function CostArchitecture() {

    return (

        <section className="rounded-3xl border border-slate-800 bg-[#111827] p-8">

            <div className="mb-10">

                <h2 className="text-3xl font-bold text-white">

                    Cost Management Architecture

                </h2>

                <p className="mt-2 text-slate-400">

                    End-to-end workflow for collecting, analyzing and optimizing cloud expenditure.

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
                                        hover:border-green-500/30
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
                                            bg-green-500/10
                                        "
                                    >

                                        <Icon
                                            size={30}
                                            className="text-green-400"
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
                                                from-green-500
                                                to-emerald-400
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

            <div className="mt-10 rounded-2xl border border-green-500/20 bg-green-500/5 p-6">

                <h3 className="text-xl font-bold text-white">

                    Cost Optimization Workflow

                </h3>

                <p className="mt-4 leading-8 text-slate-300">

                    Usage metrics are collected from AWS resources including EC2,
                    S3, RDS, networking and monitoring services. Billing data is
                    aggregated and analyzed to identify spending trends,
                    generate forecasts, track budgets, and recommend cost
                    optimization opportunities. These insights help engineering
                    teams control cloud costs while maintaining application
                    performance and reliability.

                </p>

            </div>

        </section>

    );

}