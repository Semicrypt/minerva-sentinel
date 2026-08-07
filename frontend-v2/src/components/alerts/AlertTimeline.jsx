import {
    Bell,
    Mail,
    UserCheck,
    Wrench,
    CheckCircle2
} from "lucide-react";

const timeline = [

    {
        time: "18:21",
        title: "Alert Triggered",
        description: "CPU usage exceeded 95% on Production API Server.",
        icon: Bell,
        color: "text-red-400"
    },

    {
        time: "18:22",
        title: "Notifications Sent",
        description: "Email and Slack notifications delivered successfully.",
        icon: Mail,
        color: "text-amber-400"
    },

    {
        time: "18:23",
        title: "Engineer Assigned",
        description: "Incident assigned to the DevOps engineering team.",
        icon: UserCheck,
        color: "text-cyan-400"
    },

    {
        time: "18:26",
        title: "Investigation Started",
        description: "Infrastructure diagnostics and container inspection initiated.",
        icon: Wrench,
        color: "text-violet-400"
    },

    {
        time: "18:34",
        title: "Incident Resolved",
        description: "CPU utilization returned to normal operating levels.",
        icon: CheckCircle2,
        color: "text-emerald-400"
    }

];

export default function AlertTimeline() {

    return (

        <section className="rounded-3xl border border-slate-800 bg-[#111827] p-8">

            <div className="mb-8">

                <h2 className="text-3xl font-bold text-white">

                    Incident Timeline

                </h2>

                <p className="mt-2 text-slate-400">

                    Timeline of alert detection, notifications and incident resolution.

                </p>

            </div>

            <div className="space-y-6">

                {

                    timeline.map((event, index) => {

                        const Icon = event.icon;

                        return (

                            <div
                                key={event.title}
                                className="flex gap-6"
                            >

                                <div className="flex flex-col items-center">

                                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-800">

                                        <Icon
                                            size={24}
                                            className={event.color}
                                        />

                                    </div>

                                    {

                                        index !== timeline.length - 1 && (

                                            <div className="mt-2 h-16 w-1 rounded-full bg-gradient-to-b from-red-500 via-orange-400 to-emerald-400" />

                                        )

                                    }

                                </div>

                                <div className="flex-1 rounded-2xl border border-slate-800 bg-slate-900/40 p-6">

                                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                                        <div>

                                            <h3 className="text-xl font-bold text-white">

                                                {event.title}

                                            </h3>

                                            <p className="mt-3 leading-7 text-slate-400">

                                                {event.description}

                                            </p>

                                        </div>

                                        <div className="rounded-full bg-slate-800 px-4 py-2">

                                            <span className="font-semibold text-cyan-400">

                                                {event.time}

                                            </span>

                                        </div>

                                    </div>

                                </div>

                            </div>

                        );

                    })

                }

            </div>

        </section>

    );

}