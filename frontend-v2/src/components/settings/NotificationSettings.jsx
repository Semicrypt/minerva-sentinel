import {
    Mail,
    Smartphone,
    Bell,
    MessageSquare,
    ShieldAlert,
    CheckCircle2
} from "lucide-react";

const notifications = [

    {
        icon: Mail,
        title: "Email Alerts",
        description: "Receive monitoring and incident notifications by email.",
        enabled: true
    },

    {
        icon: Smartphone,
        title: "SMS Notifications",
        description: "Receive critical alerts via SMS.",
        enabled: false
    },

    {
        icon: MessageSquare,
        title: "Slack Integration",
        description: "Send alerts directly to your Slack workspace.",
        enabled: true
    },

    {
        icon: Bell,
        title: "Microsoft Teams",
        description: "Deliver incidents to Microsoft Teams channels.",
        enabled: false
    },

    {
        icon: ShieldAlert,
        title: "Critical Incident Alerts",
        description: "Immediately notify administrators of critical events.",
        enabled: true
    }

];

export default function NotificationSettings() {

    return (

        <section className="rounded-3xl border border-slate-800 bg-[#111827] p-8">

            <div className="flex items-center justify-between">

                <div>

                    <h2 className="text-3xl font-bold text-white">

                        Notification Settings

                    </h2>

                    <p className="mt-2 text-slate-400">

                        Configure how Minerva Sentinel delivers alerts and operational notifications.

                    </p>

                </div>

                <span className="rounded-full bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-400">

                    3 Active

                </span>

            </div>

            <div className="mt-8 space-y-5">

                {

                    notifications.map((item) => {

                        const Icon = item.icon;

                        return (

                            <div
                                key={item.title}
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

                                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-500/10">

                                            <Icon
                                                size={28}
                                                className="text-sky-400"
                                            />

                                        </div>

                                        <div>

                                            <h3 className="text-xl font-bold text-white">

                                                {item.title}

                                            </h3>

                                            <p className="mt-2 max-w-2xl text-slate-400">

                                                {item.description}

                                            </p>

                                        </div>

                                    </div>

                                    <div>

                                        {

                                            item.enabled ? (

                                                <div className="flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-2">

                                                    <CheckCircle2
                                                        size={18}
                                                        className="text-emerald-400"
                                                    />

                                                    <span className="font-semibold text-emerald-400">

                                                        Enabled

                                                    </span>

                                                </div>

                                            ) : (

                                                <div className="rounded-full bg-slate-800 px-4 py-2">

                                                    <span className="font-semibold text-slate-400">

                                                        Disabled

                                                    </span>

                                                </div>

                                            )

                                        }

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