import {
    Lightbulb,
    Server,
    HardDrive,
    Database,
    Zap,
    CheckCircle2
} from "lucide-react";

const recommendations = [

    {
        icon: Server,
        title: "Resize EC2 Instances",
        description: "Several EC2 instances are underutilized (<20% CPU utilization).",
        savings: "$184 / month",
        priority: "High"
    },

    {
        icon: HardDrive,
        title: "Delete Unattached EBS Volumes",
        description: "Unused EBS volumes are still incurring storage charges.",
        savings: "$92 / month",
        priority: "Medium"
    },

    {
        icon: Database,
        title: "Enable S3 Lifecycle Rules",
        description: "Move infrequently accessed objects to Glacier storage.",
        savings: "$156 / month",
        priority: "High"
    },

    {
        icon: Zap,
        title: "Purchase Savings Plans",
        description: "Commit to predictable workloads for long-term discounts.",
        savings: "$180 / month",
        priority: "Medium"
    }

];

export default function OptimizationTips() {

    return (

        <section className="rounded-3xl border border-slate-800 bg-[#111827] p-8">

            <div className="flex items-center justify-between">

                <div>

                    <h2 className="text-3xl font-bold text-white">

                        Cost Optimization Recommendations

                    </h2>

                    <p className="mt-2 text-slate-400">

                        Intelligent recommendations to reduce cloud spending.

                    </p>

                </div>

                <span className="rounded-full bg-amber-500/10 px-4 py-2 text-sm font-semibold text-amber-400">

                    4 Recommendations

                </span>

            </div>

            <div className="mt-8 space-y-5">

                {

                    recommendations.map((item) => {

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
                                    hover:border-amber-500/30
                                "
                            >

                                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

                                    <div className="flex items-start gap-5">

                                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10">

                                            <Icon
                                                size={28}
                                                className="text-amber-400"
                                            />

                                        </div>

                                        <div>

                                            <h3 className="text-xl font-bold text-white">

                                                {item.title}

                                            </h3>

                                            <p className="mt-2 max-w-2xl leading-7 text-slate-400">

                                                {item.description}

                                            </p>

                                        </div>

                                    </div>

                                    <div className="text-right">

                                        <p className="text-sm text-slate-500">

                                            Estimated Savings

                                        </p>

                                        <p className="mt-1 text-3xl font-black text-emerald-400">

                                            {item.savings}

                                        </p>

                                        <span
                                            className={`
                                                mt-4 inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold
                                                ${
                                                    item.priority === "High"
                                                        ? "bg-red-500/10 text-red-400"
                                                        : "bg-amber-500/10 text-amber-400"
                                                }
                                            `}
                                        >
                                            {item.priority} Priority
                                        </span>

                                    </div>

                                </div>

                            </div>

                        );

                    })

                }

            </div>

            <div className="mt-10 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6">

                <div className="flex items-center gap-3">

                    <Lightbulb
                        size={24}
                        className="text-emerald-400"
                    />

                    <h3 className="text-xl font-bold text-white">

                        Total Potential Savings

                    </h3>

                </div>

                <p className="mt-6 text-5xl font-black text-emerald-400">

                    $612 / month
                </p>

                <p className="mt-3 text-slate-300">

                    Applying all recommendations could reduce your estimated
                    annual cloud expenditure by approximately
                    <span className="font-semibold text-white"> $7,344</span>.

                </p>

            </div>

        </section>

    );

}