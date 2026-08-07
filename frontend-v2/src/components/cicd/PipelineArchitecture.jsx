import {
    User,
    Github,
    GitBranch,
    FlaskConical,
    Hammer,
    Box,
    Cloud,
    Rocket,
    Activity
} from "lucide-react";

export default function PipelineArchitecture() {

    return (

        <section className="rounded-3xl border border-slate-800 bg-[#111827] p-8">

            <div className="mb-10">

                <h2 className="text-3xl font-bold text-white">

                    Pipeline Architecture

                </h2>

                <p className="mt-2 text-slate-400">

                    End-to-end DevOps workflow powering Minerva Sentinel.

                </p>

            </div>

            <div className="grid gap-6 md:grid-cols-3 xl:grid-cols-9">

                <Stage
                    icon={<User className="text-cyan-400" size={28} />}
                    title="Developer"
                    subtitle="Write Code"
                />

                <Stage
                    icon={<Github className="text-white" size={28} />}
                    title="GitHub"
                    subtitle="Push Repository"
                />

                <Stage
                    icon={<GitBranch className="text-violet-400" size={28} />}
                    title="GitHub Actions"
                    subtitle="Pipeline"
                />

                <Stage
                    icon={<FlaskConical className="text-emerald-400" size={28} />}
                    title="Testing"
                    subtitle="Quality Checks"
                />

                <Stage
                    icon={<Hammer className="text-amber-400" size={28} />}
                    title="Build"
                    subtitle="Compile"
                />

                <Stage
                    icon={<Box className="text-sky-400" size={28} />}
                    title="Docker"
                    subtitle="Containerize"
                />

                <Stage
                    icon={<Cloud className="text-blue-400" size={28} />}
                    title="Amazon ECR"
                    subtitle="Image Registry"
                />

                <Stage
                    icon={<Rocket className="text-red-400" size={28} />}
                    title="Amazon ECS"
                    subtitle="Deploy"
                />

                <Stage
                    icon={<Activity className="text-green-400" size={28} />}
                    title="CloudWatch"
                    subtitle="Monitoring"
                />

            </div>

        </section>

    );

}

function Stage({

    icon,
    title,
    subtitle

}) {

    return (

        <div className="relative">

            <div
                className="
                    rounded-3xl
                    border
                    border-slate-800
                    bg-slate-900/40
                    p-6
                    text-center
                    transition
                    duration-300
                    hover:-translate-y-1
                    hover:border-violet-500/30
                "
            >

                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-800">

                    {icon}

                </div>

                <h3 className="mt-5 text-lg font-bold text-white">

                    {title}

                </h3>

                <p className="mt-2 text-sm text-slate-400">

                    {subtitle}

                </p>

            </div>

        </div>

    );

}