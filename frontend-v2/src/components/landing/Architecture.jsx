import { motion } from "framer-motion";

import {

    Globe,
    Server,
    Database,
    Cpu,
    Bell,
    BarChart3,
    ArrowDown

} from "lucide-react";

const pipeline = [

    {

        icon: Globe,

        title: "Cloud Services",

        subtitle: "Websites • APIs • Docker • Servers",

        description:

            "Minerva continuously monitors websites, APIs, Docker containers, Linux servers and cloud infrastructure."

    },

    {

        icon: Cpu,

        title: "Monitoring Engine",

        subtitle: "Health Checks • SSL • Response Time",

        description:

            "Our monitoring engine performs continuous health checks, latency measurements and availability verification."

    },

    {

        icon: Database,

        title: "PostgreSQL Storage",

        subtitle: "Metrics • Checks • Incidents",

        description:

            "Every monitoring result is securely stored for historical reporting, analytics and incident tracking."

    },

    {

        icon: BarChart3,

        title: "Analytics Engine",

        subtitle: "Charts • SLA • Reports",

        description:

            "Historical data is transformed into dashboards, uptime reports and performance analytics."

    },

    {

        icon: Bell,

        title: "Alert Engine",

        subtitle: "Notifications • Recovery",

        description:

            "When incidents occur, Minerva instantly generates alerts and tracks service recovery."

    },

    {

        icon: Server,

        title: "Minerva Dashboard",

        subtitle: "Real-Time Visibility",

        description:

            "Everything is presented through a unified dashboard that gives complete infrastructure visibility."

    }

];

export default function Architecture() {

    return (

        <section

            id="architecture"

            className="relative overflow-hidden px-6 py-40"

        >

            {/* Background */}

            <div className="absolute inset-0">

                <div className="absolute left-0 top-20 h-[420px] w-[420px] rounded-full bg-blue-600/10 blur-[170px]" />

                <div className="absolute right-0 bottom-20 h-[420px] w-[420px] rounded-full bg-cyan-500/10 blur-[170px]" />

            </div>

            <div className="relative mx-auto max-w-7xl">

                <motion.div

                    initial={{

                        opacity: 0,

                        y: 40

                    }}

                    whileInView={{

                        opacity: 1,

                        y: 0

                    }}

                    viewport={{

                        once: true

                    }}

                    transition={{

                        duration: .8

                    }}

                    className="mx-auto max-w-4xl text-center"

                >

                    <span className="inline-flex rounded-full border border-cyan-500/20 bg-cyan-500/10 px-5 py-2 text-sm font-medium text-cyan-300">

                        How Minerva Works

                    </span>

                    <h2 className="mt-8 text-5xl font-black text-white md:text-6xl">

                        From Monitoring

                        <br />

                        To Intelligent Insights

                    </h2>

                    <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-slate-400">

                        Every second, Minerva collects infrastructure data,

                        processes it through intelligent monitoring engines,

                        stores historical metrics and transforms them into

                        actionable insights for your team.

                    </p>

                </motion.div>

                <div className="relative mt-28 flex flex-col items-center">
                    {

    pipeline.map((step, index) => {

        const Icon = step.icon;

        const last = index === pipeline.length - 1;

        return (

            <motion.div

                key={step.title}

                initial={{

                    opacity: 0,

                    y: 60

                }}

                whileInView={{

                    opacity: 1,

                    y: 0

                }}

                viewport={{

                    once: true

                }}

                transition={{

                    duration: .7,

                    delay: index * .15

                }}

                className="relative flex w-full max-w-5xl flex-col items-center"

            >

                {/* Card */}

                <motion.div

                    whileHover={{

                        y: -8,

                        scale: 1.02

                    }}

                    transition={{

                        duration: .25

                    }}

                    className="w-full overflow-hidden rounded-[30px] border border-slate-800 bg-[#0C1424]/80 shadow-[0_0_60px_rgba(37,99,235,.12)] backdrop-blur-3xl"

                >

                    <div className="grid gap-10 p-10 lg:grid-cols-[110px_1fr_auto] lg:items-center">

                        {/* Number */}

                        <div className="flex justify-center">

                            <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-cyan-500 to-blue-600 text-3xl font-black text-white shadow-xl shadow-cyan-600/30">

                                {String(index + 1).padStart(2, "0")}

                            </div>

                        </div>

                        {/* Content */}

                        <div>

                            <div className="flex items-center gap-4">

                                <div className="rounded-2xl bg-slate-800 p-4">

                                    <Icon

                                        size={28}

                                        className="text-cyan-400"

                                    />

                                </div>

                                <div>

                                    <h3 className="text-3xl font-bold text-white">

                                        {step.title}

                                    </h3>

                                    <p className="mt-1 text-cyan-400">

                                        {step.subtitle}

                                    </p>

                                </div>

                            </div>

                            <p className="mt-8 max-w-3xl text-lg leading-8 text-slate-400">

                                {step.description}

                            </p>

                        </div>

                        {/* Status */}

                        <div className="flex justify-center">

                            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-8 py-5">

                                <div className="flex items-center gap-3">

                                    <span className="h-3 w-3 animate-pulse rounded-full bg-emerald-400" />

                                    <span className="font-semibold text-emerald-400">

                                        Active

                                    </span>

                                </div>

                            </div>

                        </div>

                    </div>

                </motion.div>

                {/* Connector */}

                {

                    !last && (

                        <motion.div

                            animate={{

                                y: [0, 10, 0]

                            }}

                            transition={{

                                repeat: Infinity,

                                duration: 2.5

                            }}

                            className="my-8 flex flex-col items-center"

                        >

                            <div className="h-20 w-[3px] rounded-full bg-gradient-to-b from-cyan-400 to-blue-600" />

                            <ArrowDown

                                size={34}

                                className="mt-3 text-cyan-400"

                            />

                        </motion.div>

                    )

                }

            </motion.div>

        );

    })

}
                </div>

            </div>

            {/* Floating Decorative Elements */}

            <motion.div

                animate={{

                    x: [0, 30, 0],

                    y: [0, -25, 0]

                }}

                transition={{

                    duration: 10,

                    repeat: Infinity,

                    ease: "easeInOut"

                }}

                className="pointer-events-none absolute left-10 top-60 hidden h-44 w-44 rounded-full bg-cyan-500/10 blur-3xl lg:block"

            />

            <motion.div

                animate={{

                    x: [0, -30, 0],

                    y: [0, 25, 0]

                }}

                transition={{

                    duration: 12,

                    repeat: Infinity,

                    ease: "easeInOut"

                }}

                className="pointer-events-none absolute right-10 bottom-40 hidden h-56 w-56 rounded-full bg-blue-600/10 blur-3xl lg:block"

            />

            {/* Bottom Summary */}

            <motion.div

                initial={{

                    opacity: 0,

                    y: 50

                }}

                whileInView={{

                    opacity: 1,

                    y: 0

                }}

                viewport={{

                    once: true

                }}

                transition={{

                    duration: .8,

                    delay: .3

                }}

                className="mx-auto mt-32 max-w-5xl rounded-[34px] border border-slate-800 bg-gradient-to-r from-slate-900/80 to-[#0C1424]/80 p-10 backdrop-blur-3xl"

            >

                <div className="grid gap-10 lg:grid-cols-3">

                    <div>

                        <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">

                            Detection

                        </p>

                        <h3 className="mt-4 text-4xl font-black text-white">

                            &lt;20 ms

                        </h3>

                        <p className="mt-3 text-slate-400">

                            Average latency detection across monitored services.

                        </p>

                    </div>

                    <div>

                        <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">

                            Reliability

                        </p>

                        <h3 className="mt-4 text-4xl font-black text-white">

                            99.99%

                        </h3>

                        <p className="mt-3 text-slate-400">

                            Continuous uptime monitoring and intelligent incident tracking.

                        </p>

                    </div>

                    <div>

                        <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">

                            Visibility

                        </p>

                        <h3 className="mt-4 text-4xl font-black text-white">

                            One Platform

                        </h3>

                        <p className="mt-3 text-slate-400">

                            Infrastructure, analytics, alerts and reporting from a single dashboard.

                        </p>

                    </div>

                </div>

            </motion.div>

        </section>

    );

}