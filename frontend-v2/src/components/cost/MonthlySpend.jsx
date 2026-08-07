import {
    TrendingUp,
    TrendingDown
} from "lucide-react";

const monthlyCosts = [

    {
        month: "January",
        cost: "$3,482",
        change: "+6.4%",
        trend: "up"
    },

    {
        month: "February",
        cost: "$3,718",
        change: "+6.8%",
        trend: "up"
    },

    {
        month: "March",
        cost: "$3,965",
        change: "+6.6%",
        trend: "up"
    },

    {
        month: "April",
        cost: "$4,126",
        change: "+4.1%",
        trend: "up"
    },

    {
        month: "May",
        cost: "$4,051",
        change: "-1.8%",
        trend: "down"
    },

    {
        month: "June",
        cost: "$4,283",
        change: "+5.7%",
        trend: "up"
    }

];

export default function MonthlySpend() {

    return (

        <section className="rounded-3xl border border-slate-800 bg-[#111827] p-8">

            <div className="flex items-center justify-between">

                <div>

                    <h2 className="text-3xl font-bold text-white">

                        Monthly Spending Trend

                    </h2>

                    <p className="mt-2 text-slate-400">

                        Cloud expenditure over the last six months.

                    </p>

                </div>

                <span className="rounded-full bg-green-500/10 px-4 py-2 text-sm font-semibold text-green-400">

                    Updated Today

                </span>

            </div>

            <div className="mt-8 space-y-4">

                {

                    monthlyCosts.map((item) => (

                        <div
                            key={item.month}
                            className="
                                flex
                                flex-col
                                gap-5
                                rounded-2xl
                                border
                                border-slate-800
                                bg-slate-900/40
                                p-5
                                transition
                                hover:border-green-500/30
                                lg:flex-row
                                lg:items-center
                                lg:justify-between
                            "
                        >

                            <div>

                                <h3 className="text-lg font-bold text-white">

                                    {item.month}

                                </h3>

                                <p className="mt-1 text-slate-400">

                                    Cloud Infrastructure Costs

                                </p>

                            </div>

                            <div className="flex items-center gap-8">

                                <div className="text-right">

                                    <p className="text-3xl font-black text-white">

                                        {item.cost}

                                    </p>

                                </div>

                                {

                                    item.trend === "up"

                                        ? (

                                            <div className="inline-flex items-center gap-2 rounded-full bg-red-500/10 px-3 py-1 text-sm font-semibold text-red-400">

                                                <TrendingUp size={16} />

                                                {item.change}

                                            </div>

                                        )

                                        : (

                                            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-sm font-semibold text-emerald-400">

                                                <TrendingDown size={16} />

                                                {item.change}

                                            </div>

                                        )

                                }

                            </div>

                        </div>

                    ))

                }

            </div>

        </section>

    );

}