import {
    GitBranch,
    FlaskConical,
    Hammer,
    Box,
    Rocket,
    CheckCircle2
} from "lucide-react";

const stages = [
    {
        icon: GitBranch,
        title: "Git Repository",
        subtitle: "Source Control"
    },
    {
        icon: FlaskConical,
        title: "Run Tests",
        subtitle: "Unit & Integration"
    },
    {
        icon: Hammer,
        title: "Build",
        subtitle: "Compile Application"
    },
    {
        icon: Box,
        title: "Docker Image",
        subtitle: "Container Build"
    },
    {
        icon: Rocket,
        title: "Deploy",
        subtitle: "Production Release"
    }
];

export default function WorkflowStages() {

    return (

        <section className="rounded-3xl border border-slate-800 bg-[#111827] p-8">

            <div className="mb-8">

                <h2 className="text-3xl font-bold text-white">

                    Deployment Pipeline

                </h2>

                <p className="mt-2 text-slate-400">

                    Automated workflow from code commit to production deployment.

                </p>

            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-5">

                {stages.map((stage) => {

                    const Icon = stage.icon;

                    return (

                        <div
                            key={stage.title}
                            className="
                                rounded-3xl
                                border
                                border-slate-800
                                bg-slate-900/40
                                p-6
                                transition-all
                                duration-300
                                hover:-translate-y-1
                                hover:border-violet-500/30
                            "
                        >

                            <div className="flex items-center justify-between">

                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/10">

                                    <Icon
                                        size={28}
                                        className="text-violet-400"
                                    />

                                </div>

                                <CheckCircle2
                                    size={20}
                                    className="text-emerald-400"
                                />

                            </div>

                            <h3 className="mt-6 text-lg font-bold text-white">

                                {stage.title}

                            </h3>

                            <p className="mt-2 text-sm text-slate-400">

                                {stage.subtitle}

                            </p>

                            <div className="mt-6 rounded-xl bg-emerald-500/10 px-3 py-2 text-center text-sm font-semibold text-emerald-400">

                                Completed

                            </div>

                        </div>

                    );

                })}

            </div>

        </section>

    );

}