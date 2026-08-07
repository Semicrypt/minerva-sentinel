import { motion } from "framer-motion";

import {

    Activity,
    Bell,
    BarChart3,
    Server,
    CheckCircle2,
    ArrowRight

} from "lucide-react";

const features = [

    {

        icon: Activity,

        title: "Real-Time Monitoring",

        description:

            "Monitor websites, APIs, servers, containers and databases with instant health checks, response time tracking and live availability monitoring.",

        bullets: [

            "Second-level health checks",

            "Live response monitoring",

            "Instant outage detection"

        ],

        color: "cyan"

    },

    {

        icon: Bell,

        title: "Intelligent Alerts",

        description:

            "Receive immediate notifications when services degrade or fail, helping your team respond before users are affected.",

        bullets: [

            "Email notifications",

            "Incident timeline",

            "Recovery alerts"

        ],

        color: "emerald"

    },

    {

        icon: BarChart3,

        title: "Advanced Analytics",

        description:

            "Understand long-term trends through response time analysis, uptime reports and infrastructure performance dashboards.",

        bullets: [

            "Historical reports",

            "Response trends",

            "Availability analytics"

        ],

        color: "violet"

    },

    {

        icon: Server,

        title: "Infrastructure Visibility",

        description:

            "Track cloud infrastructure, Linux servers, Docker containers and databases from one elegant dashboard.",

        bullets: [

            "Cloud resources",

            "Docker monitoring",

            "Database health"

        ],

        color: "blue"

    }

];

export default function Features() {

    return (

        <section

            id="features"

            className="relative px-6 pt-40 pb-40"

        >

            {/* Background */}

            <div className="absolute inset-0">

                <div className="absolute left-0 top-40 h-96 w-96 rounded-full bg-cyan-500/10 blur-[180px]" />

                <div className="absolute right-0 bottom-20 h-96 w-96 rounded-full bg-blue-600/10 blur-[180px]" />

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

                    <span className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-5 py-2 text-sm font-medium text-cyan-300">

                        <Activity size={16} />

                        Platform Capabilities

                    </span>

                    <h2 className="mt-8 text-5xl font-black leading-tight text-white md:text-6xl">

                        Everything You Need

                        <br />

                        To Monitor Your Infrastructure

                    </h2>

                    <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-slate-400">

                        Minerva Sentinel combines monitoring, alerting,

                        analytics and infrastructure visibility into one

                        intelligent platform designed for modern cloud

                        environments.

                    </p>

                </motion.div>

                {/* Features start here */}

                <div className="mt-28 space-y-40">
                                    {

                    features.map((feature, index) => {

                        const Icon = feature.icon;

                        const reverse = index % 2 === 1;

                        return (

                            <motion.div

                                key={feature.title}

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

                                    duration: .8

                                }}

                                className={

                                    `grid items-center gap-16 lg:grid-cols-2 ${

                                        reverse

                                            ? "lg:[&>*:first-child]:order-2"

                                            : ""

                                    }`

                                }

                            >

                                {/* LEFT CONTENT */}

                                <div>

                                    <div className="inline-flex rounded-2xl bg-cyan-500/10 p-4">

                                        <Icon

                                            size={34}

                                            className="text-cyan-400"

                                        />

                                    </div>

                                    <h3 className="mt-8 text-4xl font-bold text-white">

                                        {feature.title}

                                    </h3>

                                    <p className="mt-6 text-lg leading-8 text-slate-400">

                                        {feature.description}

                                    </p>

                                    <div className="mt-10 space-y-5">

                                        {

                                            feature.bullets.map((bullet) => (

                                                <div

                                                    key={bullet}

                                                    className="flex items-center gap-4"

                                                >

                                                    <CheckCircle2

                                                        size={22}

                                                        className="text-emerald-400"

                                                    />

                                                    <span className="text-slate-300">

                                                        {bullet}

                                                    </span>

                                                </div>

                                            ))

                                        }

                                    </div>

                                    <button

                                        className="mt-10 flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-900 px-6 py-4 font-semibold text-white transition-all hover:border-cyan-500 hover:bg-slate-800"

                                    >

                                        Learn More

                                        <ArrowRight size={18} />

                                    </button>

                                </div>

                                {/* RIGHT DEMO PANEL */}

                                <motion.div

                                    whileHover={{

                                        scale: 1.02,

                                        y: -8

                                    }}

                                    transition={{

                                        duration: .3

                                    }}

                                    className="relative overflow-hidden rounded-[30px] border border-slate-800 bg-[#0C1424]/80 p-8 shadow-[0_0_70px_rgba(37,99,235,.12)] backdrop-blur-3xl"

                                >

                                    <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-cyan-500/10 blur-3xl" />

                                    <div className="absolute bottom-0 left-0 h-52 w-52 rounded-full bg-blue-700/10 blur-3xl" />

                                    <div className="relative">

                                        <div className="flex items-center justify-between">

                                            <div>

                                                <p className="text-sm uppercase tracking-[0.25em] text-cyan-400">

                                                    Live Preview

                                                </p>

                                                <h4 className="mt-2 text-2xl font-bold text-white">

                                                    {feature.title}

                                                </h4>

                                            </div>

                                            <div className="flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-2">

                                                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />

                                                <span className="text-sm text-emerald-400">

                                                    Active

                                                </span>

                                            </div>

                                        </div>

                                        {/* Preview Metrics */}

                                        <div className="mt-10 grid grid-cols-2 gap-5">

                                            <MiniCard

                                                title="Availability"

                                                value="99.99%"

                                            />

                                            <MiniCard

                                                title="Latency"

                                                value="18 ms"

                                            />

                                            <MiniCard

                                                title="Services"

                                                value="42"

                                            />

                                            <MiniCard

                                                title="Alerts"

                                                value="3"

                                            />

                                        </div>

                                        {/* Fake Graph */}

                                        <div className="mt-10">

                                            <p className="mb-5 text-sm text-slate-400">

                                                Performance Trend

                                            </p>

                                            <div className="flex h-36 items-end gap-2">

                                                {

                                                    [

                                                        40,

                                                        65,

                                                        55,

                                                        80,

                                                        75,

                                                        92,

                                                        70,

                                                        100,

                                                        82,

                                                        90

                                                    ].map((height, i) => (

                                                        <motion.div

                                                            key={i}

                                                            initial={{

                                                                height: 0

                                                            }}

                                                            whileInView={{

                                                                height

                                                            }}

                                                            viewport={{

                                                                once: true

                                                            }}

                                                            transition={{

                                                                delay: i * .05

                                                            }}

                                                            className="flex-1 rounded-t-lg bg-gradient-to-t from-blue-600 to-cyan-400"

                                                        />

                                                    ))

                                                }

                                            </div>

                                        </div>

                                    </div>

                                </motion.div>

                            </motion.div>

                        );

                    })

                }
                            </div>

        </div>

        {/* Decorative Background */}

        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">

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

                className="absolute left-10 top-1/3 h-72 w-72 rounded-full bg-cyan-500/5 blur-[140px]"

            />

            <motion.div

                animate={{

                    x: [0, -25, 0],

                    y: [0, 35, 0]

                }}

                transition={{

                    duration: 12,

                    repeat: Infinity,

                    ease: "easeInOut"

                }}

                className="absolute right-0 bottom-20 h-96 w-96 rounded-full bg-blue-600/5 blur-[180px]"

            />

        </div>

    </section>

    );

}

/* ---------------------------------------------------------------- */

function MiniCard({

    title,

    value

}) {

    return (

        <motion.div

            whileHover={{

                y: -6,

                scale: 1.03

            }}

            transition={{

                duration: .25

            }}

            className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5"

        >

            <p className="text-sm text-slate-400">

                {title}

            </p>

            <h4 className="mt-3 text-3xl font-bold text-white">

                {value}

            </h4>

        </motion.div>

    );

}
                