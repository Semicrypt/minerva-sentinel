import {
    Wallet,
    Target,
    TrendingUp,
    CheckCircle2
} from "lucide-react";

const budgets = [

    {
        category: "Overall Cloud Budget",
        allocated: "$10,000",
        used: "$4,283",
        remaining: "$5,717",
        progress: 43
    },

    {
        category: "Compute Services",
        allocated: "$4,000",
        used: "$2,661",
        remaining: "$1,339",
        progress: 67
    },

    {
        category: "Storage Services",
        allocated: "$2,500",
        used: "$1,321",
        remaining: "$1,179",
        progress: 53
    }

];

export default function BudgetTracker() {

    return (

        <section className="rounded-3xl border border-slate-800 bg-[#111827] p-8">

            <div className="flex items-center justify-between">

                <div>

                    <h2 className="text-3xl font-bold text-white">

                        Budget Tracker

                    </h2>

                    <p className="mt-2 text-slate-400">

                        Monitor spending against allocated cloud budgets.

                    </p>

                </div>

                <span className="rounded-full bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-400">

                    On Budget

                </span>

            </div>

            <div className="mt-8 space-y-6">

                {

                    budgets.map((budget) => (

                        <div
                            key={budget.category}
                            className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6"
                        >

                            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                                <div>

                                    <div className="flex items-center gap-3">

                                        <Wallet
                                            size={22}
                                            className="text-green-400"
                                        />

                                        <h3 className="text-xl font-bold text-white">

                                            {budget.category}

                                        </h3>

                                    </div>

                                </div>

                                <div className="grid grid-cols-3 gap-8">

                                    <div>

                                        <p className="text-sm text-slate-500">

                                            Budget

                                        </p>

                                        <p className="font-semibold text-white">

                                            {budget.allocated}

                                        </p>

                                    </div>

                                    <div>

                                        <p className="text-sm text-slate-500">

                                            Used

                                        </p>

                                        <p className="font-semibold text-white">

                                            {budget.used}

                                        </p>

                                    </div>

                                    <div>

                                        <p className="text-sm text-slate-500">

                                            Remaining

                                        </p>

                                        <p className="font-semibold text-emerald-400">

                                            {budget.remaining}

                                        </p>

                                    </div>

                                </div>

                            </div>

                            <div className="mt-6">

                                <div className="mb-2 flex items-center justify-between">

                                    <span className="text-slate-400">

                                        Budget Utilization

                                    </span>

                                    <span className="font-semibold text-white">

                                        {budget.progress}%

                                    </span>

                                </div>

                                <div className="h-3 rounded-full bg-slate-800">

                                    <div
                                        className="h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-400"
                                        style={{ width: `${budget.progress}%` }}
                                    />

                                </div>

                            </div>

                        </div>

                    ))

                }

            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-2">

                <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">

                    <Target
                        size={30}
                        className="text-cyan-400"
                    />

                    <h3 className="mt-5 text-xl font-bold text-white">

                        Forecast Accuracy

                    </h3>

                    <p className="mt-3 text-4xl font-black text-cyan-400">

                        96%

                    </p>

                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">

                    <TrendingUp
                        size={30}
                        className="text-emerald-400"
                    />

                    <h3 className="mt-5 text-xl font-bold text-white">

                        Budget Status

                    </h3>

                    <div className="mt-3 flex items-center gap-2">

                        <CheckCircle2
                            size={22}
                            className="text-emerald-400"
                        />

                        <span className="text-2xl font-bold text-emerald-400">

                            Healthy

                        </span>

                    </div>

                </div>

            </div>

        </section>

    );

}