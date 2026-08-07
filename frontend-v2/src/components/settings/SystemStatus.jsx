import {
    Server,
    Database,
    Boxes,
    Activity,
    Wifi,
    CheckCircle2,
    Info
} from "lucide-react";

const services = [

    {
        icon: Server,
        name: "Backend API",
        status: "Online",
        version: "v2.0.0",
        color: "text-emerald-400"
    },

    {
        icon: Database,
        name: "PostgreSQL",
        status: "Connected",
        version: "17",
        color: "text-cyan-400"
    },

    {
        icon: Boxes,
        name: "Docker Engine",
        status: "Running",
        version: "28.3",
        color: "text-blue-400"
    },

    {
        icon: Activity,
        name: "Monitoring Service",
        status: "Healthy",
        version: "v2.1",
        color: "text-violet-400"
    },

    {
        icon: Wifi,
        name: "WebSocket",
        status: "Connected",
        version: "Socket.IO",
        color: "text-amber-400"
    }

];

export default function SystemStatus() {

    return (

        <section className="rounded-3xl border border-slate-800 bg-[#111827] p-8">

            <div className="flex items-center justify-between">

                <div>

                    <h2 className="text-3xl font-bold text-white">

                        System Status

                    </h2>

                    <p className="mt-2 text-slate-400">

                        Current health and connectivity of Minerva Sentinel services.

                    </p>

                </div>

                <span className="rounded-full bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-400">

                    All Systems Operational

                </span>

            </div>

            <div className="mt-8 space-y-5">

                {

                    services.map((service) => {

                        const Icon = service.icon;

                        return (

                            <div
                                key={service.name}
                                className="
                                    rounded-2xl
                                    border
                                    border-slate-800
                                    bg-slate-900/40
                                    p-6
                                    transition
                                    hover:border-sky-500/30
                                "
                            >

                                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

                                    <div className="flex items-center gap-5">

                                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-800">

                                            <Icon
                                                size={28}
                                                className={service.color}
                                            />

                                        </div>

                                        <div>

                                            <h3 className="text-lg font-bold text-white">

                                                {service.name}

                                            </h3>

                                            <p className="mt-2 text-slate-400">

                                                Version {service.version}

                                            </p>

                                        </div>

                                    </div>

                                    <div className="flex items-center gap-3 rounded-full bg-emerald-500/10 px-4 py-2">

                                        <CheckCircle2
                                            size={18}
                                            className="text-emerald-400"
                                        />

                                        <span className="font-semibold text-emerald-400">

                                            {service.status}

                                        </span>

                                    </div>

                                </div>

                            </div>

                        );

                    })

                }

            </div>

            <div className="mt-10 rounded-2xl border border-sky-500/20 bg-sky-500/5 p-6">

                <div className="flex items-center gap-3">

                    <Info
                        size={24}
                        className="text-sky-400"
                    />

                    <h3 className="text-xl font-bold text-white">

                        Platform Information

                    </h3>

                </div>

                <div className="mt-6 grid gap-6 md:grid-cols-3">

                    <div>

                        <p className="text-sm text-slate-500">

                            Platform

                        </p>

                        <p className="mt-2 text-lg font-bold text-white">

                            Minerva Sentinel

                        </p>

                    </div>

                    <div>

                        <p className="text-sm text-slate-500">

                            Release

                        </p>

                        <p className="mt-2 text-lg font-bold text-white">

                            Version 2.0.0

                        </p>

                    </div>

                    <div>

                        <p className="text-sm text-slate-500">

                            Environment

                        </p>

                        <p className="mt-2 text-lg font-bold text-emerald-400">

                            Production
                        </p>

                    </div>

                </div>

            </div>

        </section>

    );

}