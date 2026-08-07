import {
    Shield,
    Lock,
    KeyRound,
    TriangleAlert
} from "lucide-react";

const securityStats = [

    {
        title: "Security Score",
        value: "98%",
        subtitle: "Excellent",
        icon: Shield,
        color: "text-emerald-400 bg-emerald-500/10"
    },

    {
        title: "IAM Policies",
        value: "42",
        subtitle: "Active Policies",
        icon: Lock,
        color: "text-blue-400 bg-blue-500/10"
    },

    {
        title: "Secrets",
        value: "18",
        subtitle: "Stored Securely",
        icon: KeyRound,
        color: "text-violet-400 bg-violet-500/10"
    },

    {
        title: "Threats",
        value: "2",
        subtitle: "Low Risk",
        icon: TriangleAlert,
        color: "text-amber-400 bg-amber-500/10"
    }

];

export default function SecurityOverview() {

    return (

        <section>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

                {

                    securityStats.map((item) => {

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
                                    transition-all
                                    duration-300
                                    hover:-translate-y-1
                                    hover:border-emerald-500/30
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