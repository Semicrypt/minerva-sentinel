import {
    DollarSign,
    TrendingUp,
    PiggyBank,
    BadgeDollarSign
} from "lucide-react";

const stats = [

    {
        title: "Current Spend",
        value: "$4,283",
        subtitle: "This Month",
        icon: DollarSign,
        color: "text-green-400 bg-green-500/10"
    },

    {
        title: "Forecast",
        value: "$4,970",
        subtitle: "End of Month",
        icon: TrendingUp,
        color: "text-cyan-400 bg-cyan-500/10"
    },

    {
        title: "Budget Left",
        value: "$5,030",
        subtitle: "Remaining",
        icon: PiggyBank,
        color: "text-violet-400 bg-violet-500/10"
    },

    {
        title: "Potential Savings",
        value: "$612",
        subtitle: "Optimization",
        icon: BadgeDollarSign,
        color: "text-amber-400 bg-amber-500/10"
    }

];

export default function CostOverview() {

    return (

        <section>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

                {

                    stats.map((item) => {

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
                                    hover:border-green-500/30
                                "
                            >

                                <div className="flex items-center justify-between">

                                    <div
                                        className={`flex h-14 w-14 items-center justify-center rounded-2xl ${item.color}`}
                                    >

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