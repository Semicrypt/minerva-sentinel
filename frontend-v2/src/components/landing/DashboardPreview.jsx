import { motion } from "framer-motion";

import {

    Activity,
    Server,
    Database,
    Globe,
    ShieldCheck,
    Cpu,
    HardDrive,
    Network,
    ArrowUpRight

} from "lucide-react";

export default function DashboardPreview() {

    const overview = [

        {

            icon: Globe,

            title: "Websites",

            value: "42",

            subtitle: "Monitored",

            color: "text-cyan-400"

        },

        {

            icon: Server,

            title: "Servers",

            value: "37",

            subtitle: "Healthy",

            color: "text-emerald-400"

        },

        {

            icon: Database,

            title: "Databases",

            value: "18",

            subtitle: "Connected",

            color: "text-violet-400"

        },

        {

            icon: Network,

            title: "APIs",

            value: "26",

            subtitle: "Online",

            color: "text-blue-400"

        }

    ];

    return (

        <section

            id="dashboard"

            className="relative overflow-hidden px-6 py-32"

        >

            {/* Background */}

            <div className="absolute inset-0">

                <div className="absolute left-0 top-0 h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-[180px]" />

                <div className="absolute right-0 bottom-0 h-[500px] w-[500px] rounded-full bg-blue-700/10 blur-[200px]" />

            </div>

            <div className="relative mx-auto max-w-7xl">

                {/* Heading */}

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

                        Live Platform Overview

                    </span>

                    <h2 className="mt-8 text-5xl font-black leading-tight text-white md:text-6xl">

                        Enterprise Monitoring

                        <br />

                        Control Center

                    </h2>

                    <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-slate-400">

                        View the health of your entire infrastructure from one

                        intelligent dashboard with real-time metrics,

                        instant alerts, response analytics and service

                        availability monitoring.

                    </p>

                </motion.div>

                {/* Window */}

                <motion.div

                    initial={{

                        opacity: 0,

                        y: 70

                    }}

                    whileInView={{

                        opacity: 1,

                        y: 0

                    }}

                    viewport={{

                        once: true

                    }}

                    transition={{

                        delay: .2,

                        duration: .8

                    }}

                    className="relative mt-20 overflow-hidden rounded-[34px] border border-slate-800 bg-[#0C1424]/90 shadow-[0_0_80px_rgba(37,99,235,.15)] backdrop-blur-3xl"

                >

                    {/* Browser Bar */}

                    <div className="flex items-center border-b border-slate-800 px-8 py-5">

                        <div className="flex gap-2">

                            <span className="h-3 w-3 rounded-full bg-red-400" />

                            <span className="h-3 w-3 rounded-full bg-yellow-400" />

                            <span className="h-3 w-3 rounded-full bg-emerald-400" />

                        </div>

                        <div className="mx-auto rounded-full bg-slate-800 px-6 py-2 text-xs text-slate-400">

                            app.minervasentinel.io

                        </div>

                    </div>

                    {/* Dashboard Header */}

                    <div className="flex flex-col gap-8 border-b border-slate-800 p-8 lg:flex-row lg:items-center lg:justify-between">

                        <div>

                            <h3 className="text-3xl font-bold text-white">

                                Infrastructure Dashboard

                            </h3>

                            <p className="mt-3 text-slate-400">

                                Everything happening across your cloud

                                infrastructure in one place.

                            </p>

                        </div>

                        <div className="flex items-center gap-3 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-5 py-3">

                            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />

                            <span className="font-medium text-emerald-400">

                                All Systems Operational

                            </span>

                        </div>

                    </div>

                    {/* Overview Cards */}

                    <div className="grid gap-6 p-8 md:grid-cols-2 xl:grid-cols-4">

                        {

                            overview.map((item) => {

                                const Icon = item.icon;

                                return (

                                    <div

                                        key={item.title}

                                        className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 transition-all duration-300 hover:-translate-y-2 hover:border-cyan-500/40"

                                    >

                                        <div className="flex items-center justify-between">

                                            <div className="rounded-xl bg-slate-800 p-3">

                                                <Icon

                                                    size={20}

                                                    className={item.color}

                                                />

                                            </div>

                                            <ArrowUpRight

                                                size={18}

                                                className="text-slate-500"

                                            />

                                        </div>

                                        <p className="mt-6 text-slate-400">

                                            {item.title}

                                        </p>

                                        <h3 className={`mt-2 text-4xl font-bold ${item.color}`}>

                                            {item.value}

                                        </h3>

                                        <p className="mt-2 text-sm text-slate-500">

                                            {item.subtitle}

                                        </p>

                                    </div>

                                );

                            })

                        }

                    </div>
                                        {/* Main Dashboard */}

                    <div className="grid gap-8 border-t border-slate-800 p-8 xl:grid-cols-3">

                        {/* Left Side */}

                        <div className="space-y-8 xl:col-span-2">

                            {/* Performance */}

                            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">

                                <div className="mb-6 flex items-center justify-between">

                                    <div>

                                        <h4 className="text-xl font-semibold text-white">

                                            Performance Metrics

                                        </h4>

                                        <p className="mt-1 text-sm text-slate-400">

                                            Live resource utilization

                                        </p>

                                    </div>

                                    <div className="rounded-full bg-cyan-500/10 px-4 py-2 text-xs font-medium text-cyan-300">

                                        LIVE

                                    </div>

                                </div>

                                <div className="grid gap-5 md:grid-cols-3">

                                    <MetricCard

                                        icon={<Cpu size={22} />}

                                        title="CPU Usage"

                                        value="34%"

                                        color="text-cyan-400"

                                    />

                                    <MetricCard

                                        icon={<Database size={22} />}

                                        title="Memory"

                                        value="68%"

                                        color="text-violet-400"

                                    />

                                    <MetricCard

                                        icon={<HardDrive size={22} />}

                                        title="Disk"

                                        value="42%"

                                        color="text-emerald-400"

                                    />

                                </div>

                            </div>

                            {/* Response Chart */}

                            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">

                                <div className="flex items-center justify-between">

                                    <div>

                                        <h4 className="text-xl font-semibold text-white">

                                            Response Time

                                        </h4>

                                        <p className="mt-1 text-sm text-slate-400">

                                            Last 30 minutes

                                        </p>

                                    </div>

                                    <span className="text-emerald-400">

                                        18 ms Avg

                                    </span>

                                </div>

                                <div className="mt-8 flex h-52 items-end justify-between gap-2">

                                    {

                                        [

                                            30,

                                            52,

                                            45,

                                            60,

                                            75,

                                            62,

                                            58,

                                            80,

                                            68,

                                            72,

                                            56,

                                            84

                                        ].map((height, index) => (

                                            <motion.div

                                                key={index}

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

                                                    delay: index * 0.05

                                                }}

                                                className="flex-1 rounded-t-xl bg-gradient-to-t from-blue-600 to-cyan-400"

                                            />

                                        ))

                                    }

                                </div>

                            </div>

                        </div>

                        {/* Right Side */}

                        <div className="space-y-8">

                            {/* Services */}

                            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">

                                <h4 className="text-xl font-semibold text-white">

                                    Service Status

                                </h4>

                                <div className="mt-6 space-y-4">

                                    <ServiceRow

                                        name="Google"

                                        status="Online"

                                        color="bg-emerald-400"

                                    />

                                    <ServiceRow

                                        name="AWS API"

                                        status="Online"

                                        color="bg-emerald-400"

                                    />

                                    <ServiceRow

                                        name="PostgreSQL"

                                        status="Healthy"

                                        color="bg-cyan-400"

                                    />

                                    <ServiceRow

                                        name="Mail Server"

                                        status="Warning"

                                        color="bg-yellow-400"

                                    />

                                </div>

                            </div>

                            {/* Incident Timeline */}

                            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">

                                <h4 className="text-xl font-semibold text-white">

                                    Recent Activity

                                </h4>

                                <div className="mt-6 space-y-5">

                                    <TimelineItem

                                        color="bg-emerald-400"

                                        title="Website Online"

                                        time="Just now"

                                    />

                                    <TimelineItem

                                        color="bg-cyan-400"

                                        title="Database Synced"

                                        time="3 mins ago"

                                    />

                                    <TimelineItem

                                        color="bg-yellow-400"

                                        title="Latency Spike"

                                        time="12 mins ago"

                                    />

                                    <TimelineItem

                                        color="bg-blue-400"

                                        title="Backup Completed"

                                        time="35 mins ago"

                                    />

                                </div>

                            </div>

                        </div>

                    </div>
                                        {/* Floating Widget */}

                    <motion.div

                        animate={{

                            y: [0, -12, 0]

                        }}

                        transition={{

                            duration: 4,

                            repeat: Infinity

                        }}

                        className="absolute -left-12 top-44 hidden rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-2xl backdrop-blur-xl xl:block"

                    >

                        <p className="text-sm text-slate-400">

                            Global Availability

                        </p>

                        <h3 className="mt-2 text-3xl font-bold text-emerald-400">

                            99.99%

                        </h3>

                    </motion.div>

                    {/* Floating Widget */}

                    <motion.div

                        animate={{

                            y: [0, 15, 0]

                        }}

                        transition={{

                            duration: 5,

                            repeat: Infinity

                        }}

                        className="absolute -right-10 bottom-28 hidden rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-2xl backdrop-blur-xl xl:block"

                    >

                        <p className="text-sm text-slate-400">

                            Active Checks

                        </p>

                        <h3 className="mt-2 text-3xl font-bold text-cyan-400">

                            2.6M+

                        </h3>

                    </motion.div>

                </motion.div>

            </div>

        </section>

    );

}

/* ---------------------------------------------------------------- */

function MetricCard({

    icon,

    title,

    value,

    color

}) {

    return (

        <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/30">

            <div className="flex items-center justify-between">

                <div className={color}>

                    {icon}

                </div>

                <span className="text-xs uppercase tracking-widest text-slate-500">

                    LIVE

                </span>

            </div>

            <p className="mt-5 text-sm text-slate-400">

                {title}

            </p>

            <h3 className={`mt-2 text-4xl font-bold ${color}`}>

                {value}

            </h3>

        </div>

    );

}

/* ---------------------------------------------------------------- */

function ServiceRow({

    name,

    status,

    color

}) {

    return (

        <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/50 px-4 py-4">

            <div className="flex items-center gap-3">

                <span

                    className={`h-3 w-3 rounded-full ${color}`}

                />

                <span className="font-medium text-white">

                    {name}

                </span>

            </div>

            <span className="text-sm text-slate-400">

                {status}

            </span>

        </div>

    );

}

/* ---------------------------------------------------------------- */

function TimelineItem({

    color,

    title,

    time

}) {

    return (

        <div className="flex items-center gap-4">

            <div

                className={`h-3 w-3 rounded-full ${color}`}

            />

            <div className="flex-1">

                <p className="font-medium text-white">

                    {title}

                </p>

                <p className="text-sm text-slate-500">

                    {time}

                </p>

            </div>

        </div>

    );

}