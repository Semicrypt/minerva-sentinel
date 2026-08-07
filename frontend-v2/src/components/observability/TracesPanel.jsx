import {
    Globe,
    ShieldCheck,
    Server,
    Database,
    CheckCircle2
} from "lucide-react";

const traces = [

    {
        icon: Globe,
        service: "API Gateway",
        latency: "18 ms"
    },

    {
        icon: ShieldCheck,
        service: "Authentication",
        latency: "12 ms"
    },

    {
        icon: Server,
        service: "Backend API",
        latency: "36 ms"
    },

    {
        icon: Database,
        service: "PostgreSQL",
        latency: "24 ms"
    }

];

export default function TracesPanel() {

    return (

        <section className="rounded-3xl border border-slate-800 bg-[#111827] p-8">

            <div className="flex items-center justify-between">

                <div>

                    <h2 className="text-3xl font-bold text-white">

                        Distributed Trace

                    </h2>

                    <p className="mt-2 text-slate-400">

                        Request path across application services.

                    </p>

                </div>

                <span className="rounded-full bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-400">

                    Trace #3A8F29

                </span>

            </div>

            <div className="mt-10 space-y-5">

                {

                    traces.map((trace, index) => {

                        const Icon = trace.icon;

                        return (

                            <div key={trace.service}>

                                <div
                                    className="
                                        flex
                                        items-center
                                        justify-between
                                        rounded-2xl
                                        border
                                        border-slate-800
                                        bg-slate-900/40
                                        p-5
                                        transition
                                        hover:border-cyan-500/30
                                    "
                                >

                                    <div className="flex items-center gap-5">

                                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/10">

                                            <Icon
                                                size={26}
                                                className="text-cyan-400"
                                            />

                                        </div>

                                        <div>

                                            <h3 className="text-lg font-semibold text-white">

                                                {trace.service}

                                            </h3>

                                            <p className="text-slate-400">

                                                Processing Request

                                            </p>

                                        </div>

                                    </div>

                                    <div className="flex items-center gap-5">

                                        <span className="text-lg font-bold text-white">

                                            {trace.latency}

                                        </span>

                                        <CheckCircle2
                                            size={20}
                                            className="text-emerald-400"
                                        />

                                    </div>

                                </div>

                                {

                                    index !== traces.length - 1 && (

                                        <div className="ml-7 h-8 border-l-2 border-dashed border-slate-700"></div>

                                    )

                                }

                            </div>

                        );

                    })

                }

            </div>

        </section>

    );

}