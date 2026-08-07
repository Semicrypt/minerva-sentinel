import {
    Server,
    Database,
    Activity,
    Zap,
    Globe,
    HardDrive
} from "lucide-react";

const services = [

    {
        icon: Server,
        name: "Amazon EC2",
        monthly: "$1,845",
        percentage: "43%",
        color: "text-blue-400"
    },

    {
        icon: Database,
        name: "Amazon S3",
        monthly: "$924",
        percentage: "22%",
        color: "text-orange-400"
    },

    {
        icon: HardDrive,
        name: "Amazon RDS",
        monthly: "$716",
        percentage: "17%",
        color: "text-cyan-400"
    },

    {
        icon: Activity,
        name: "CloudWatch",
        monthly: "$286",
        percentage: "7%",
        color: "text-violet-400"
    },

    {
        icon: Zap,
        name: "AWS Lambda",
        monthly: "$198",
        percentage: "5%",
        color: "text-amber-400"
    },

    {
        icon: Globe,
        name: "Data Transfer",
        monthly: "$314",
        percentage: "6%",
        color: "text-emerald-400"
    }

];

export default function ServiceBreakdown() {

    return (

        <section className="rounded-3xl border border-slate-800 bg-[#111827] p-8">

            <div className="flex items-center justify-between">

                <div>

                    <h2 className="text-3xl font-bold text-white">

                        AWS Service Breakdown

                    </h2>

                    <p className="mt-2 text-slate-400">

                        Monthly spending categorized by AWS services.

                    </p>

                </div>

                <span className="rounded-full bg-green-500/10 px-4 py-2 text-sm font-semibold text-green-400">

                    6 Services

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
                                    hover:border-green-500/30
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

                                            <p className="mt-1 text-slate-400">

                                                Monthly Usage Cost

                                            </p>

                                        </div>

                                    </div>

                                    <div className="grid grid-cols-2 gap-10">

                                        <div>

                                            <p className="text-sm text-slate-500">

                                                Monthly Cost

                                            </p>

                                            <p className="mt-1 text-2xl font-bold text-white">

                                                {service.monthly}

                                            </p>

                                        </div>

                                        <div>

                                            <p className="text-sm text-slate-500">

                                                Total Spend

                                            </p>

                                            <p className="mt-1 text-2xl font-bold text-emerald-400">

                                                {service.percentage}

                                            </p>

                                        </div>

                                    </div>

                                </div>

                                <div className="mt-5 h-2 rounded-full bg-slate-800">

                                    <div
                                        className="h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-400"
                                        style={{ width: service.percentage }}
                                    />

                                </div>

                            </div>

                        );

                    })

                }

            </div>

        </section>

    );

}