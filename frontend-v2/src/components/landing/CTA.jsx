import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function CTA() {
    return (
        <section
            id="pricing"
            className="scroll-mt-32 px-6 py-32"
        >
            <div className="mx-auto max-w-6xl rounded-[40px] border border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 via-slate-900/80 to-blue-900/20 p-8 text-center backdrop-blur-3xl sm:p-16">
                <h2 className="font-['Sora'] text-4xl font-bold text-white sm:text-5xl">
                    Ready to monitor your infrastructure?
                </h2>

                <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-400">
                    Start with Minerva Sentinel and get clear, real-time
                    visibility into your infrastructure.
                </p>

                <div className="mt-12 flex justify-center">
                    <Link
                        to="/register"
                        className="flex items-center gap-3 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-10 py-4 text-lg font-semibold text-white shadow-xl shadow-cyan-500/30 transition hover:scale-105"
                    >
                        Get Started Free
                        <ArrowRight size={20} />
                    </Link>
                </div>
            </div>
        </section>
    );
}