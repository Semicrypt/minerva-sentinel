import {
    User,
    Users,
    Shield,
    Lock
} from "lucide-react";

const iamResources = [

    {
        icon: User,
        title: "IAM Users",
        value: "12",
        subtitle: "Registered Users",
        color: "text-blue-400"
    },

    {
        icon: Users,
        title: "Groups",
        value: "4",
        subtitle: "Access Groups",
        color: "text-cyan-400"
    },

    {
        icon: Shield,
        title: "Roles",
        value: "18",
        subtitle: "IAM Roles",
        color: "text-emerald-400"
    },

    {
        icon: Lock,
        title: "Policies",
        value: "42",
        subtitle: "Attached Policies",
        color: "text-violet-400"
    }

];

export default function IAMPanel() {

    return (

        <section className="rounded-3xl border border-slate-800 bg-[#111827] p-8">

            <div className="flex items-center justify-between">

                <div>

                    <h2 className="text-3xl font-bold text-white">

                        IAM Management

                    </h2>

                    <p className="mt-2 text-slate-400">

                        Identity and Access Management overview.

                    </p>

                </div>

                <span className="rounded-full bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-400">

                    Secure

                </span>

            </div>

            <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">

                {

                    iamResources.map((item) => {

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
                                    hover:border-blue-500/30
                                "
                            >

                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-800">

                                    <Icon
                                        size={28}
                                        className={item.color}
                                    />

                                </div>

                                <h3 className="mt-6 text-xl font-bold text-white">

                                    {item.title}

                                </h3>

                                <p className="mt-4 text-4xl font-black text-white">

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

            <div className="mt-10 rounded-2xl border border-slate-800 bg-slate-900/40 p-6">

                <div className="flex items-center justify-between">

                    <span className="text-slate-400">

                        MFA Enabled

                    </span>

                    <span className="font-bold text-emerald-400">

                        100%

                    </span>

                </div>

                <div className="mt-4 h-2 rounded-full bg-slate-800">

                    <div className="h-full w-full rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400"></div>

                </div>

            </div>

        </section>

    );

}