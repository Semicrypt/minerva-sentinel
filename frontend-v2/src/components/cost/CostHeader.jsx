import {
    Wallet,
    DollarSign,
    RefreshCw
} from "lucide-react";

export default function CostHeader() {

    return (

        <section className="rounded-[32px] border border-slate-800 bg-[#111827] p-8 shadow-xl shadow-black/20">

            <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

                <div>

                    <div className="flex items-center gap-4">

                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green-500/10">

                            <Wallet
                                size={30}
                                className="text-green-400"
                            />

                        </div>

                        <div>

                            <p className="text-sm uppercase tracking-[0.28em] text-slate-500">

                                Cloud Cost Management

                            </p>

                            <h1 className="mt-1 text-4xl font-black text-white">

                                Cost Explorer

                            </h1>

                        </div>

                    </div>

                    <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-400">

                        Analyze cloud spending, budgets, forecasts and optimization
                        opportunities across your hybrid cloud infrastructure.

                    </p>

                </div>

                <div className="grid gap-4">

                    <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/50 px-5 py-4">

                        <div className="flex items-center gap-3">

                            <DollarSign
                                size={18}
                                className="text-green-400"
                            />

                            <span className="text-slate-300">

                                Monthly Spend

                            </span>

                        </div>

                        <span className="font-bold text-green-400">

                            $4,283

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
                            from-green-600
                            to-emerald-600
                            px-6
                            py-4
                            font-semibold
                            text-white
                            transition
                            hover:scale-[1.02]
                        "
                    >

                        <RefreshCw size={18} />

                        Refresh Costs

                    </button>

                </div>

            </div>

        </section>

    );

}