import { motion } from "framer-motion";

import {
    ArrowRight,
    Play,
    Activity,
    Server,
    Database,
    Globe,
    ShieldCheck,
    Zap
} from "lucide-react";

import { Link } from "react-router-dom";

export default function Hero() {

    const stats = [

        {

            value: "99.99%",

            label: "Platform Availability"

        },

        {

            value: "2.6M+",

            label: "Health Checks"

        },

        {

            value: "24/7",

            label: "Continuous Monitoring"

        }

    ];

    const services = [

        {

            icon: Globe,

            title: "API Gateway",

            status: "Operational",

            metric: "18 ms",

            color: "emerald"

        },

        {

            icon: Server,

            title: "Linux Server",

            status: "Healthy",

            metric: "CPU 34%",

            color: "blue"

        },

        {

            icon: Database,

            title: "PostgreSQL",

            status: "Connected",

            metric: "12 Queries/s",

            color: "violet"

        },

        {

            icon: ShieldCheck,

            title: "Firewall",

            status: "Protected",

            metric: "0 Threats",

            color: "cyan"

        }

    ];

    return (

        <section

            className="relative overflow-hidden bg-[#050B16]"

        >

            {/* Background */}

            <div className="absolute inset-0">

                <div className="absolute left-0 top-0 h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-[180px]" />

                <div className="absolute right-0 bottom-0 h-[550px] w-[550px] rounded-full bg-blue-700/10 blur-[220px]" />

                <div

                    className="absolute inset-0 opacity-[0.05]"

                    style={{

                        backgroundImage:

                            "linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px)",

                        backgroundSize: "60px 60px"

                    }}

                />

            </div>

            <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-6 pt-40 pb-24 lg:flex-row lg:items-center lg:gap-20">

                {/* LEFT COLUMN */}

                <motion.div

                    initial={{

                        opacity: 0,

                        y: 40

                    }}

                    animate={{

                        opacity: 1,

                        y: 0

                    }}

                    transition={{

                        duration: 0.8

                    }}

                    className="max-w-3xl"

                >

                    {/* Badge */}

                    <div className="inline-flex items-center gap-3 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-5 py-3 backdrop-blur-xl">

                        <Activity

                            size={18}

                            className="text-cyan-400"

                        />

                        <span className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-300">

                            Enterprise Cloud Observability

                        </span>

                    </div>

                    {/* Heading */}

                    <h1 className="mt-10 text-6xl font-black leading-[0.95] tracking-tight text-white md:text-7xl xl:text-8xl">

                        Monitor

                        <br />

                        Everything.

                        <br />

                        <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400 bg-clip-text text-transparent">

                            Instantly.

                        </span>

                    </h1>

                    {/* Description */}

                    <p className="mt-10 max-w-2xl text-xl leading-9 text-slate-300">

                        Minerva Sentinel gives DevOps teams a single

                        platform to monitor APIs, websites, servers,

                        containers, databases and cloud infrastructure

                        with live metrics, intelligent alerts and

                        beautiful analytics.

                    </p>

                    {/* CTA */}

                    <div className="mt-12 flex flex-wrap gap-5">

                        <Link

                            to="/register"

                            className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 px-8 py-4 font-semibold text-white shadow-xl shadow-cyan-600/20 transition-all duration-300 hover:-translate-y-1"

                        >

                            Start Monitoring

                            <ArrowRight size={18} />

                        </Link>

                        <Link

                            to="/login"

                            className="flex items-center gap-3 rounded-2xl border border-slate-700 bg-slate-900/60 px-8 py-4 font-semibold text-white transition hover:border-cyan-400"

                        >

                            <Play size={18} />

                            Live Demo

                        </Link>

                    </div>

                    {/* Trusted */}

                    <div className="mt-14 flex flex-wrap items-center gap-6">

                        <div className="flex items-center gap-2">

                            <Zap

                                size={18}

                                className="text-yellow-400"

                            />

                            <span className="text-slate-300">

                                Real-time Monitoring

                            </span>

                        </div>

                        <div className="flex items-center gap-2">

                            <ShieldCheck

                                size={18}

                                className="text-emerald-400"

                            />

                            <span className="text-slate-300">

                                Secure Infrastructure

                            </span>

                        </div>

                        <div className="flex items-center gap-2">

                            <Activity

                                size={18}

                                className="text-cyan-400"

                            />

                            <span className="text-slate-300">

                                Instant Alerts

                            </span>

                        </div>

                    </div>
                                        {/* Statistics */}

                    <div className="mt-16 grid grid-cols-3 gap-6">

                        {

                            stats.map((item) => (

                                <div

                                    key={item.label}

                                    className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-xl"

                                >

                                    <h2 className="text-3xl font-bold text-white">

                                        {item.value}

                                    </h2>

                                    <p className="mt-2 text-sm text-slate-400">

                                        {item.label}

                                    </p>

                                </div>

                            ))

                        }

                    </div>

                </motion.div>

                {/* RIGHT COLUMN */}

                <motion.div

                    initial={{

                        opacity: 0,

                        x: 60

                    }}

                    animate={{

                        opacity: 1,

                        x: 0

                    }}

                    transition={{

                        delay: 0.3,

                        duration: 0.9

                    }}

                    className="relative mt-20 flex-1 lg:mt-0"

                >

                    {/* Dashboard Background */}

                    <div className="relative overflow-hidden rounded-[32px] border border-slate-800 bg-[#0C1424]/90 p-8 shadow-[0_0_80px_rgba(37,99,235,.15)] backdrop-blur-3xl">

                        {/* Header */}

                        <div className="flex items-center justify-between">

                            <div>

                                <p className="text-xs uppercase tracking-[0.3em] text-cyan-400">

                                    Live Monitoring

                                </p>

                                <h2 className="mt-2 text-2xl font-bold text-white">

                                    Infrastructure Overview

                                </h2>

                            </div>

                            <div className="flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-2">

                                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />

                                <span className="text-sm font-semibold text-emerald-400">

                                    LIVE

                                </span>

                            </div>

                        </div>

                        {/* Monitoring Cards */}

                        <div className="mt-8 grid gap-5 sm:grid-cols-2">

                            {

                                services.map((service, index) => (

                                    <motion.div

                                        key={service.title}

                                        initial={{

                                            opacity: 0,

                                            y: 30

                                        }}

                                        animate={{

                                            opacity: 1,

                                            y: 0

                                        }}

                                        transition={{

                                            delay: 0.5 + index * 0.15

                                        }}

                                        whileHover={{

                                            y: -8,

                                            scale: 1.02

                                        }}

                                        className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 backdrop-blur-xl transition"

                                    >

                                        <div className="flex items-center justify-between">

                                            <div className="flex items-center gap-3">

                                                <div className="rounded-xl bg-slate-800 p-3">

                                                    <service.icon

                                                        size={20}

                                                        className="text-cyan-400"

                                                    />

                                                </div>

                                                <div>

                                                    <h3 className="font-semibold text-white">

                                                        {service.title}

                                                    </h3>

                                                    <p className="text-sm text-slate-400">

                                                        {service.metric}

                                                    </p>

                                                </div>

                                            </div>

                                            <div className="flex items-center gap-2">

                                                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />

                                                <span className="text-sm font-medium text-emerald-400">

                                                    {service.status}

                                                </span>

                                            </div>

                                        </div>

                                    </motion.div>

                                ))

                            }

                        </div>

                        {/* Bottom Metrics */}

                        <div className="mt-8 grid grid-cols-3 gap-5">

                            <div className="rounded-2xl bg-slate-900 p-5">

                                <p className="text-sm text-slate-400">

                                    CPU

                                </p>

                                <h3 className="mt-2 text-3xl font-bold text-cyan-400">

                                    34%

                                </h3>

                            </div>

                            <div className="rounded-2xl bg-slate-900 p-5">

                                <p className="text-sm text-slate-400">

                                    Memory

                                </p>

                                <h3 className="mt-2 text-3xl font-bold text-violet-400">

                                    68%

                                </h3>

                            </div>

                            <div className="rounded-2xl bg-slate-900 p-5">

                                <p className="text-sm text-slate-400">

                                    Response

                                </p>

                                <h3 className="mt-2 text-3xl font-bold text-emerald-400">

                                    18ms

                                </h3>

                            </div>

                        </div>

                    </div>

                    {/* Floating Card 1 */}

                    <motion.div

                        animate={{

                            y: [0, -12, 0]

                        }}

                        transition={{

                            duration: 4,

                            repeat: Infinity

                        }}

                        className="absolute -left-12 top-16 hidden rounded-2xl border border-slate-700 bg-slate-900/90 p-5 shadow-2xl backdrop-blur-xl xl:block"

                    >

                        <p className="text-sm text-slate-400">

                            Uptime

                        </p>

                        <h3 className="mt-2 text-3xl font-bold text-emerald-400">

                            99.99%

                        </h3>

                    </motion.div>

                    {/* Floating Card 2 */}

                    <motion.div

                        animate={{

                            y: [0, 14, 0]

                        }}

                        transition={{

                            duration: 5,

                            repeat: Infinity

                        }}

                        className="absolute -right-10 bottom-16 hidden rounded-2xl border border-slate-700 bg-slate-900/90 p-5 shadow-2xl backdrop-blur-xl xl:block"

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
                        {/* Decorative Glow */}

            <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[900px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/5 blur-[220px]" />

            {/* Floating Gradient Orb */}

            <motion.div

                animate={{

                    y: [0, -30, 0],

                    x: [0, 15, 0]

                }}

                transition={{

                    duration: 10,

                    repeat: Infinity,

                    ease: "easeInOut"

                }}

                className="absolute right-20 top-40 hidden h-32 w-32 rounded-full bg-cyan-400/10 blur-3xl xl:block"

            />

            <motion.div

                animate={{

                    y: [0, 25, 0],

                    x: [0, -15, 0]

                }}

                transition={{

                    duration: 12,

                    repeat: Infinity,

                    ease: "easeInOut"

                }}

                className="absolute left-20 bottom-32 hidden h-44 w-44 rounded-full bg-blue-600/10 blur-3xl xl:block"

            />

            {/* Bottom Fade */}

            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-[#050B16]" />

        </section>

    );

}