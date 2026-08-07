import {
    Activity,
    TriangleAlert,
    Bell,
    Mail,
    ClipboardList,
    Monitor,
    CheckCircle2
} from "lucide-react";

const architecture = [

    {
        icon: Activity,
        title: "Monitoring Engine",
        subtitle: "Collect Metrics"
    },

    {
        icon: TriangleAlert,
        title: "Threshold Detection",
        subtitle: "Evaluate Rules"
    },

    {
        icon: Bell,
        title: "Alert Engine",
        subtitle: "Generate Alerts"
    },

    {
        icon: Mail,
        title: "Notification Service",
        subtitle: "Email • Slack • SMS"
    },

    {
        icon: ClipboardList,
        title: "Incident Manager",
        subtitle: "Track & Assign"
    },

    {
        icon: Monitor,
        title: "Dashboard",
        subtitle: "Real-Time Visibility"
    }

];

export default function AlertsArchitecture() {

    return (

        <section className="rounded-3xl border border-slate-800 bg-[#111827] p-8">

            <div className="mb-10">

                <h2 className="text-3xl font-bold text-white">

                    Alert Processing Architecture

                </h2>

                <p className="mt-2 text-slate-400">

                    End-to-end workflow showing how monitoring events become alerts,
                    notifications and managed incidents.

                </p>

            </div>

            <div className="grid gap-6 lg:grid-cols-6">

                {

                    architecture.map((step, index) => {

                        const Icon = step.icon;

                        return (

                            <div
                                key={step.title}
                                className="relative"
                            >

                                <div
                                    className="
                                        rounded-3xl
                                        border
                                        border-slate-800
                                        bg-slate-900/40
                                        p-6
                                        text-center
                                        transition-all
                                        duration-300
                                        hover:-translate-y-1
                                        hover:border-red-500/30
                                    "
                                >

                                    <div
                                        className="
                                            mx-auto
                                            flex
                                            h-16
                                            w-16
                                            items-center
                                            justify-center
                                            rounded-2xl
                                            bg-red-500/10
                                        "
                                    >

                                        <Icon
                                            size={30}
                                            className="text-red-400"
                                        />

                                    </div>

                                    <h3 className="mt-5 text-lg font-bold text-white">

                                        {step.title}

                                    </h3>

                                    <p className="mt-2 text-sm text-slate-400">

                                        {step.subtitle}

                                    </p>

                                    <div
                                        className="
                                            mt-5
                                            inline-flex
                                            items-center
                                            gap-2
                                            rounded-full
                                            bg-emerald-500/10
                                            px-3
                                            py-1
                                            text-sm
                                            font-semibold
                                            text-emerald-400
                                        "
                                    >

                                        <CheckCircle2 size={16} />

                                        Active

                                    </div>

                                </div>

                                {

                                    index !== architecture.length - 1 && (

                                        <div
                                            className="
                                                absolute
                                                left-full
                                                top-1/2
                                                hidden
                                                h-1
                                                w-6
                                                -translate-y-1/2
                                                bg-gradient-to-r
                                                from-red-500
                                                to-orange-500
                                                lg:block
                                            "
                                        />

                                    )

                                }

                            </div>

                        );

                    })

                }

            </div>

            <div
                className="
                    mt-10
                    rounded-2xl
                    border
                    border-red-500/20
                    bg-red-500/5
                    p-6
                "
            >

                <h3 className="text-xl font-bold text-white">

                    Alert Lifecycle

                </h3>

                <p className="mt-4 leading-8 text-slate-300">

                    The monitoring engine continuously collects infrastructure,
                    application and container metrics. When predefined thresholds
                    are exceeded, the alert engine creates an incident, sends
                    notifications through integrated channels such as Email,
                    Slack and Microsoft Teams, assigns ownership to the
                    appropriate engineering team, and streams live updates to
                    the Minerva Sentinel dashboard until the incident is fully
                    resolved.

                </p>

            </div>

        </section>

    );

}