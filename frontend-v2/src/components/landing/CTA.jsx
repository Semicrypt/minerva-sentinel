import { ArrowRight } from "lucide-react";

export default function CTA() {

    return (

        <section className="px-6 py-32">

            <div className="mx-auto max-w-6xl rounded-[40px] border border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 via-slate-900/80 to-blue-900/20 p-16 text-center backdrop-blur-3xl">

                <h2 className="font-['Sora'] text-5xl font-bold text-white">

                    Ready to monitor your infrastructure?

                </h2>

                <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-400">

                    Join teams that rely on Miverna Sentinel for
                    real-time monitoring, instant alerts and powerful
                    infrastructure insights.

                </p>

                <div className="mt-12 flex justify-center">

                    <button className="flex items-center gap-3 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-10 py-4 text-lg font-semibold text-white shadow-xl shadow-cyan-500/30 transition hover:scale-105">

                        Get Started Free

                        <ArrowRight size={20} />

                    </button>

                </div>

            </div>

        </section>

    );

}