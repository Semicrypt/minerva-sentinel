import {
    Box,
    Server,
    Database,
    Globe,
    HardDrive
} from "lucide-react";

export default function ContainerArchitecture() {

    return (

        <section className="rounded-3xl border border-slate-800 bg-[#111827] p-8">

            <div className="mb-10">

                <h2 className="text-3xl font-bold text-white">

                    Container Architecture

                </h2>

                <p className="mt-2 text-slate-400">

                    Deployment topology of the Minerva Sentinel container platform.

                </p>

            </div>

            <div className="flex flex-col items-center space-y-6">

                <ArchitectureCard
                    icon={<Box className="text-sky-400" size={28} />}
                    title="Docker Engine"
                    subtitle="Container Runtime"
                />

                <Connector />

                <div className="grid w-full max-w-5xl gap-6 lg:grid-cols-3">

                    <ArchitectureCard
                        icon={<Globe className="text-cyan-400" size={28} />}
                        title="React Frontend"
                        subtitle="Vite + React"
                    />

                    <ArchitectureCard
                        icon={<Server className="text-emerald-400" size={28} />}
                        title="Node API"
                        subtitle="Express Backend"
                    />

                    <ArchitectureCard
                        icon={<Database className="text-violet-400" size={28} />}
                        title="PostgreSQL"
                        subtitle="Persistent Database"
                    />

                </div>

                <Connector />

                <ArchitectureCard
                    icon={<HardDrive className="text-amber-400" size={28} />}
                    title="Docker Volumes"
                    subtitle="Persistent Storage"
                />

            </div>

        </section>

    );

}

function Connector() {

    return (

        <div className="h-10 w-1 rounded-full bg-gradient-to-b from-sky-500 via-cyan-500 to-emerald-500" />

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
                max-w-sm
                rounded-3xl
                border
                border-slate-800
                bg-slate-900/50
                p-6
                text-center
                transition
                duration-300
                hover:-translate-y-1
                hover:border-sky-500/30
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