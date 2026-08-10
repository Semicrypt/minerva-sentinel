import {
    FileText,
    TriangleAlert,
    CircleX,
    ShieldAlert
} from "lucide-react";

export default function LogsOverview({

    stats,
    loading

}) {

    const cards =
        [

            {

                title:
                    "Total Logs",

                value:
                    stats?.total ??
                    0,

                subtitle:
                    "Stored Events",

                icon:
                    FileText,

                color:
                    "text-indigo-400 bg-indigo-500/10"

            },

            {

                title:
                    "Warnings",

                value:
                    stats?.warnings ??
                    0,

                subtitle:
                    "Potential Issues",

                icon:
                    TriangleAlert,

                color:
                    "text-amber-400 bg-amber-500/10"

            },

            {

                title:
                    "Errors",

                value:
                    stats?.errors ??
                    0,

                subtitle:
                    "Failed Operations",

                icon:
                    CircleX,

                color:
                    "text-red-400 bg-red-500/10"

            },

            {

                title:
                    "Critical",

                value:
                    stats?.critical ??
                    0,

                subtitle:
                    "Immediate Attention",

                icon:
                    ShieldAlert,

                color:
                    "text-purple-400 bg-purple-500/10"

            }

        ];

    return (

        <section>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

                {
                    cards.map(
                        item => {

                            const Icon =
                                item.icon;

                            return (

                                <div
                                    key={
                                        item.title
                                    }
                                    className="
                                        rounded-3xl
                                        border
                                        border-slate-800
                                        bg-[#111827]
                                        p-7
                                        transition
                                        duration-300
                                        hover:-translate-y-1
                                        hover:border-indigo-500/30
                                    "
                                >

                                    <div className="flex items-center justify-between">

                                        <div
                                            className={`flex h-14 w-14 items-center justify-center rounded-2xl ${item.color}`}
                                        >

                                            <Icon
                                                size={28}
                                            />

                                        </div>

                                        <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">

                                            Live

                                        </span>

                                    </div>

                                    <h3 className="mt-6 text-xl font-bold text-white">

                                        {
                                            item.title
                                        }

                                    </h3>

                                    <p className="mt-5 text-4xl font-black text-white">

                                        {
                                            loading
                                                ? "--"
                                                : Number(
                                                    item.value
                                                ).toLocaleString()
                                        }

                                    </p>

                                    <p className="mt-2 text-slate-400">

                                        {
                                            item.subtitle
                                        }

                                    </p>

                                </div>

                            );

                        }
                    )
                }

            </div>

        </section>

    );

}