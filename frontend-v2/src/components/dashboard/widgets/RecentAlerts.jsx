import { ShieldCheck } from "lucide-react";

export default function RecentAlerts() {

    return (

        <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 shadow-xl">

            <div className="mb-6 flex items-center gap-3">

                <ShieldCheck
                    size={28}
                    className="text-emerald-400"
                />

                <h2 className="text-2xl font-bold text-white">

                    Recent Alerts

                </h2>

            </div>

            <div className="rounded-xl bg-slate-800/40 p-6 text-center">

                <p className="text-emerald-400 text-lg font-semibold">

                    ✓ No active alerts

                </p>

                <p className="mt-2 text-slate-400">

                    Your infrastructure is healthy.

                </p>

            </div>

        </div>

    );

}