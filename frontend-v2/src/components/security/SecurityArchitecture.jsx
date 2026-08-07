import {
    Shield,
    Globe,
    Ban,
    Activity,
    CheckCircle2
} from "lucide-react";

const protections = [

    {
        title: "AWS WAF",
        description: "Web Application Firewall",
        status: "Protected",
        blocked: "2,413 Requests",
        icon: Shield,
        color: "text-emerald-400"
    },

    {
        title: "AWS Shield",
        description: "DDoS Protection",
        status: "Active",
        blocked: "0 Attacks",
        icon: Globe,
        color: "text-cyan-400"
    },

    {
        title: "IP Blocking",
        description: "Malicious Addresses",
        status: "Enabled",
        blocked: "156 IPs",
        icon: Ban,
        color: "text-red-400"
    },

    {
        title: "Threat Detection",
        description: "Real-time Analysis",
        status: "Monitoring",
        blocked: "Normal",
        icon: Activity,
        color: "text-violet-400"
    }

];

export default function WAFShield() {

    return (

        <section className="rounded-3xl border border-slate-800 bg-[#111827] p-8">

            <div className="flex items-center justify-between">

                <div>

                    <h2 className="text-3xl font-bold text-white">

                        AWS WAF & Shield

                    </h2>

                    <p className="mt-2 text-slate-400">

                        Firewall protection, DDoS mitigation and real-time threat monitoring.

                    </p>

                </div>

                <span className="rounded-full bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-400">

                    Fully Protected

                </span>

            </div>

            <div className="mt-8 grid gap-6 md:grid-cols-2">

                {

                    protections.map((item) => {

                        const Icon = item.icon;

                        return (

                            <div
                                key={item.title}
                                className="
                                    rounded-3xl
                                    border
                                    border-slate-800
                                    bg-slate-900/40
                                    p-6
                                    transition
                                    hover:border-emerald-500/30
                                "
                            >

                                <div className="flex items-center justify-between">

                                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-800">

                                        <Icon
                                            size={28}
                                            className={item.color}
                                        />

                                    </div>

                                    <CheckCircle2
                                        size={20}
                                        className="text-emerald-400"
                                    />

                                </div>

                                <h3 className="mt-6 text-xl font-bold text-white">

                                    {item.title}

                                </h3>

                                <p className="mt-2 text-slate-400">

                                    {item.description}

                                </p>

                                <div className="mt-6 rounded-2xl bg-slate-800 p-4">

                                    <div className="flex items-center justify-between">

                                        <span className="text-slate-400">

                                            Status

                                        </span>

                                        <span className="font-semibold text-emerald-400">

                                            {item.status}

                                        </span>

                                    </div>

                                    <div className="mt-3 flex items-center justify-between">

                                        <span className="text-slate-400">

                                            Statistics

                                        </span>

                                        <span className="font-semibold text-white">

                                            {item.blocked}

                                        </span>

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