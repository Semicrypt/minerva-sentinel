import { ArrowRight, Sparkles } from "lucide-react";

export default function ComingSoonPage({

    icon,
    title,
    description

}) {

    return (

        <div className="flex min-h-[calc(100vh-120px)] items-center justify-center px-6">

            <div className="w-full max-w-4xl rounded-[36px] border border-slate-800 bg-[#111827] p-12 text-center shadow-2xl">

                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-600 to-cyan-500 text-5xl shadow-lg shadow-cyan-500/30">

                    {icon}

                </div>

                <h1 className="mt-10 text-5xl font-black text-white">

                    {title}

                </h1>

                <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-400">

                    {description}

                </p>

                <div className="mt-12 inline-flex items-center gap-3 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-6 py-3 text-cyan-300">

                    <Sparkles size={18} />

                    Currently under development

                </div>

                <div className="mt-16 grid gap-6 md:grid-cols-3">

                    <Feature
                        title="Enterprise Ready"
                    />

                    <Feature
                        title="Real-Time Monitoring"
                    />

                    <Feature
                        title="AWS Integration"
                    />

                </div>

                <button
                    className="
                        mt-14
                        rounded-2xl
                        bg-gradient-to-r
                        from-blue-600
                        to-cyan-500
                        px-8
                        py-4
                        font-semibold
                        text-white
                        transition
                        hover:scale-105
                    "
                >

                    Coming Soon

                    <ArrowRight
                        className="ml-2 inline"
                        size={18}
                    />

                </button>

            </div>

        </div>

    );

}

function Feature({

    title

}) {

    return (

        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">

            <p className="font-semibold text-white">

                {title}

            </p>

        </div>

    );

}