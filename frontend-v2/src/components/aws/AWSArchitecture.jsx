import {
    Globe,
    GitBranch,
    Server,
    Database,
    HardDrive,
    Activity,
    ShieldCheck,
    Zap
} from "lucide-react";

export default function AWSArchitecture() {

    return (

        <section className="rounded-3xl border border-slate-800 bg-[#111827] p-8">

            <div className="mb-10">

                <h2 className="text-3xl font-bold text-white">

                    AWS Architecture

                </h2>

                <p className="mt-2 text-slate-400">

                    High-level architecture of the Minerva Sentinel hybrid cloud environment.

                </p>

            </div>

            <div className="flex flex-col items-center space-y-6">

                <ArchitectureCard
                    icon={<Globe className="text-cyan-400" size={28} />}
                    title="Internet"
                    subtitle="External Traffic"
                />

                <Connector />

                <ArchitectureCard
                    icon={<GitBranch className="text-blue-400" size={28} />}
                    title="Route 53"
                    subtitle="DNS Routing"
                />

                <Connector />

                <ArchitectureCard
                    icon={<Server className="text-orange-400" size={28} />}
                    title="Application Load Balancer"
                    subtitle="Traffic Distribution"
                />

                <Connector />

                <div className="grid w-full max-w-5xl gap-6 lg:grid-cols-2">

                    <ArchitectureCard
                        icon={<Server className="text-emerald-400" size={28} />}
                        title="EC2 Web Server"
                        subtitle="React Frontend"
                    />

                    <ArchitectureCard
                        icon={<Server className="text-blue-400" size={28} />}
                        title="EC2 API Server"
                        subtitle="Express Backend"
                    />

                </div>

                <Connector />

                <ArchitectureCard
                    icon={<Database className="text-violet-400" size={28} />}
                    title="Amazon RDS"
                    subtitle="PostgreSQL Database"
                />

                <Connector />

                <ArchitectureCard
                    icon={<HardDrive className="text-amber-400" size={28} />}
                    title="Amazon S3"
                    subtitle="Reports & Backups"
                />

            </div>

            <div className="mt-16 grid gap-6 md:grid-cols-3">

                <SmallService
                    icon={<Activity className="text-cyan-400" size={20} />}
                    title="CloudWatch"
                    description="Monitoring & Metrics"
                />

                <SmallService
                    icon={<ShieldCheck className="text-emerald-400" size={20} />}
                    title="IAM"
                    description="Identity & Security"
                />

                <SmallService
                    icon={<Zap className="text-yellow-400" size={20} />}
                    title="Lambda"
                    description="Automation"
                />

            </div>

        </section>

    );

}

function Connector() {

    return (

        <div className="h-10 w-1 rounded-full bg-gradient-to-b from-cyan-500 via-blue-500 to-violet-500" />

    );

}

function ArchitectureCard({

    icon,
    title,
    subtitle

}) {

    return (

        <div
            className="
                w-full
                max-w-md
                rounded-3xl
                border
                border-slate-800
                bg-slate-900/50
                p-6
                text-center
                transition
                duration-300
                hover:border-blue-500/30
                hover:-translate-y-1
            "
        >

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-800">

                {icon}

            </div>

            <h3 className="mt-5 text-xl font-bold text-white">

                {title}

            </h3>

            <p className="mt-2 text-slate-400">

                {subtitle}

            </p>

        </div>

    );

}

function SmallService({

    icon,
    title,
    description

}) {

    return (

        <div
            className="
                rounded-2xl
                border
                border-slate-800
                bg-slate-900/40
                p-6
                transition
                duration-300
                hover:border-cyan-500/30
            "
        >

            <div className="mb-4">

                {icon}

            </div>

            <h3 className="font-bold text-white">

                {title}

            </h3>

            <p className="mt-2 text-sm text-slate-400">

                {description}

            </p>

        </div>

    );

}