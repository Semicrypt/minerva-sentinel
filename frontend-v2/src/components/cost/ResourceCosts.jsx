import {
    Server,
    Database,
    HardDrive,
    Globe,
    TrendingUp
} from "lucide-react";

const resources = [

    {
        icon: Server,
        name: "EC2 Production Cluster",
        owner: "Platform Team",
        environment: "Production",
        monthly: "$1,284",
        daily: "$42.80",
        color: "text-blue-400"
    },

    {
        icon: Database,
        name: "RDS PostgreSQL",
        owner: "Database Team",
        environment: "Production",
        monthly: "$812",
        daily: "$27.10",
        color: "text-cyan-400"
    },

    {
        icon: HardDrive,
        name: "EBS Storage",
        owner: "Infrastructure",
        environment: "Production",
        monthly: "$468",
        daily: "$15.60",
        color: "text-orange-400"
    },

    {
        icon: Globe,
        name: "S3 Media Bucket",
        owner: "Frontend Team",
        environment: "Production",
        monthly: "$397",
        daily: "$13.20",
        color: "text-emerald-400"
    }

];

export default function ResourceCosts() {

    return (

        <section className="rounded-3xl border border-slate-800 bg-[#111827] p-8">

            <div className="flex items-center justify-between">

                <div>

                    <h2 className="text-3xl font-bold text-white">

                        Top Cost Resources

                    </h2>

                    <p className="mt-2 text-slate-400">

                        Resources contributing the most to monthly cloud spending.

                    </p>

                </div>

                <span className="rounded-full bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-400">

                    High Spend

                </span>

            </div>

            <div className="mt-8 space-y-5">

                {

                    resources.map((resource) => {

                        const Icon = resource.icon;

                        return (

                            <div
                                key={resource.name}
                                className="
                                    rounded-2xl
                                    border
                                    border-slate-800
                                    bg-slate-900/40
                                    p-6
                                    transition
                                    hover:border-green-500/30
                                "
                            >

                                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

                                    <div className="flex items-center gap-5">

                                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-800">

                                            <Icon
                                                size={28}
                                                className={resource.color}
                                            />

                                        </div>

                                        <div>

                                            <h3 className="text-lg font-bold text-white">

                                                {resource.name}

                                            </h3>

                                            <p className="mt-2 text-slate-400">

                                                {resource.owner}

                                            </p>

                                        </div>

                                    </div>

                                    <div className="grid grid-cols-3 gap-8">

                                        <div>

                                            <p className="text-sm text-slate-500">

                                                Environment

                                            </p>

                                            <p className="mt-1 font-semibold text-white">

                                                {resource.environment}

                                            </p>

                                        </div>

                                        <div>

                                            <p className="text-sm text-slate-500">

                                                Daily Cost

                                            </p>

                                            <p className="mt-1 font-semibold text-white">

                                                {resource.daily}

                                            </p>

                                        </div>

                                        <div>

                                            <p className="text-sm text-slate-500">

                                                Monthly Cost

                                            </p>

                                            <p className="mt-1 text-xl font-bold text-emerald-400">

                                                {resource.monthly}

                                            </p>

                                        </div>

                                    </div>

                                </div>

                                <div className="mt-6 flex items-center justify-between rounded-2xl bg-slate-800 p-4">

                                    <div className="flex items-center gap-3">

                                        <TrendingUp
                                            size={18}
                                            className="text-red-400"
                                        />

                                        <span className="text-slate-300">

                                            Cost Trend

                                        </span>

                                    </div>

                                    <span className="font-semibold text-red-400">

                                        +8.3% This Month

                                    </span>

                                </div>

                            </div>

                        );

                    })

                }

            </div>

        </section>

    );

}