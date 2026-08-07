import {
    Server,
    Activity,
    Database,
    Zap,
    HardDrive,
    ShieldCheck
} from "lucide-react";

const resources = [

    {
        title: "EC2 Instances",
        value: "2",
        status: "Running",
        icon: Server,
        color: "emerald"
    },

    {
        title: "CloudWatch",
        value: "Healthy",
        status: "Monitoring",
        icon: Activity,
        color: "cyan"
    },

    {
        title: "RDS",
        value: "1",
        status: "Available",
        icon: Database,
        color: "blue"
    },

    {
        title: "Lambda",
        value: "4",
        status: "Functions",
        icon: Zap,
        color: "amber"
    },

    {
        title: "S3 Buckets",
        value: "3",
        status: "Active",
        icon: HardDrive,
        color: "purple"
    },

    {
        title: "IAM",
        value: "Secure",
        status: "Policies",
        icon: ShieldCheck,
        color: "green"
    }

];

const colors = {

    emerald: "text-emerald-400 bg-emerald-500/10",

    cyan: "text-cyan-400 bg-cyan-500/10",

    blue: "text-blue-400 bg-blue-500/10",

    amber: "text-amber-400 bg-amber-500/10",

    purple: "text-violet-400 bg-violet-500/10",

    green: "text-green-400 bg-green-500/10"

};

export default function AWSOverview() {

    return (

        <section>

            <div className="mb-8">

                <h2 className="text-3xl font-bold text-white">

                    AWS Service Overview

                </h2>

                <p className="mt-2 text-slate-400">

                    Current status of your cloud infrastructure.

                </p>

            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

                {

                    resources.map((resource) => {

                        const Icon = resource.icon;

                        return (

                            <div
                                key={resource.title}
                                className="
                                    rounded-3xl
                                    border
                                    border-slate-800
                                    bg-[#111827]
                                    p-7
                                    transition-all
                                    duration-300
                                    hover:-translate-y-1
                                    hover:border-blue-500/30
                                "
                            >

                                <div className="flex items-center justify-between">

                                    <div
                                        className={`
                                            flex
                                            h-14
                                            w-14
                                            items-center
                                            justify-center
                                            rounded-2xl
                                            ${colors[resource.color]}
                                        `}
                                    >

                                        <Icon size={26} />

                                    </div>

                                    <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">

                                        Online

                                    </span>

                                </div>

                                <h3 className="mt-6 text-xl font-bold text-white">

                                    {resource.title}

                                </h3>

                                <p className="mt-5 text-4xl font-black text-white">

                                    {resource.value}

                                </p>

                                <p className="mt-2 text-slate-400">

                                    {resource.status}

                                </p>

                            </div>

                        );

                    })

                }

            </div>

        </section>

    );

}