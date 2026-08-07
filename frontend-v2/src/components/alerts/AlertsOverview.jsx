import {
    Bell,
    ShieldAlert,
    TriangleAlert,
    CheckCircle2
} from "lucide-react";

const stats = [

    {
        title: "Active Alerts",
        value: "12",
        subtitle: "Currently Open",
        icon: Bell,
        color: "text-red-400 bg-red-500/10"
    },

    {
        title: "Critical Alerts",
        value: "3",
        subtitle: "Immediate Action",
        icon: ShieldAlert,
        color: "text-rose-400 bg-rose-500/10"
    },

    {
        title: "Warnings",
        value: "9",
        subtitle: "Needs Attention",
        icon: TriangleAlert,
        color: "text-amber-400 bg-amber-500/10"
    },

    {
        title: "Resolved Today",
        value: "27",
        subtitle: "Closed Incidents",
        icon: CheckCircle2,
        color: "text-emerald-400 bg-emerald-500/10"
    }

];

export default function AlertsOverview() {

    return (

        <section>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

                {

                    stats.map((item) => {

                        const Icon = item.icon;

                        return (

                            <div
                                key={item.title}
                                className="
                                    rounded-3xl
                                    border
                                    border-slate-800
                                    bg-[#111827]
                                    p-7
                                    transition
                                    duration-300
                                    hover:-translate-y-1
                                    hover:border-red-500/30
                                "
                            >

                                <div className="flex items-center justify-between">

                                    <div
                                        className={`flex h-14 w-14 items-center justify-center rounded-2xl ${item.color}`}
                                    >

                                        <Icon size={28} />

                                    </div>

                                    <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">

                                        Live

                                    </span>

                                </div>

                                <h3 className="mt-6 text-xl font-bold text-white">

                                    {item.title}

                                </h3>

                                <p className="mt-5 text-4xl font-black text-white">

                                    {item.value}

                                </p>

                                <p className="mt-2 text-slate-400">

                                    {item.subtitle}

                                </p>

                            </div>

                        );

                    })

                }

            </div>

        </section>

    );

}