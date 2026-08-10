import { motion } from "framer-motion";

import {
  Activity,
  ArrowRight,
  Database,
  Globe,
  Play,
  Server,
  ShieldCheck,
  Zap,
} from "lucide-react";

import { Link } from "react-router-dom";

export default function Hero() {
  const stats = [
    {
      value: "99.99%",
      label: "Platform Availability",
    },
    {
      value: "2.6M+",
      label: "Health Checks",
    },
    {
      value: "24/7",
      label: "Continuous Monitoring",
    },
  ];

  const services = [
    {
      icon: Globe,
      title: "API Gateway",
      status: "Operational",
      metric: "18 ms",
      color: "text-cyan-400",
    },
    {
      icon: Server,
      title: "Linux Server",
      status: "Healthy",
      metric: "CPU 34%",
      color: "text-blue-400",
    },
    {
      icon: Database,
      title: "PostgreSQL",
      status: "Connected",
      metric: "12 Queries/s",
      color: "text-violet-400",
    },
    {
      icon: ShieldCheck,
      title: "Firewall",
      status: "Protected",
      metric: "0 Threats",
      color: "text-emerald-400",
    },
  ];

  return (
    <section className="relative isolate overflow-hidden bg-[#050B16]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute left-[-12rem] top-[-10rem] h-[30rem] w-[30rem] rounded-full bg-cyan-500/10 blur-[150px]" />

        <div className="absolute bottom-[-14rem] right-[-10rem] h-[34rem] w-[34rem] rounded-full bg-blue-700/10 blur-[180px]" />

        <div
          className="absolute inset-0 opacity-[0.045]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="absolute left-1/2 top-1/2 hidden h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/5 blur-[180px] lg:block" />
      </div>

      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-5rem)] w-full max-w-[1200px] items-center gap-14 px-4 py-16 sm:px-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-16 lg:px-8 lg:py-24">
        <motion.div
          initial={{
            opacity: 0,
            y: 24,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.7,
          }}
          className="min-w-0 max-w-xl"
        >
          <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 backdrop-blur-xl">
            <Activity
              size={16}
              className="shrink-0 text-cyan-400"
            />

            <span className="truncate text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-cyan-300 sm:text-xs">
              Enterprise Cloud Observability
            </span>
          </div>

          <h1 className="mt-7 text-5xl font-black leading-[0.98] tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl">
            Monitor
            <br />
            Everything.
            <br />
            <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400 bg-clip-text text-transparent">
              Instantly.
            </span>
          </h1>

          <p className="mt-7 max-w-xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
            Minerva Sentinel gives DevOps teams one platform to monitor APIs,
            websites, servers, containers, databases, and cloud infrastructure
            with live metrics, intelligent alerts, and clear analytics.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-cyan-600/20 transition duration-300 hover:-translate-y-0.5 hover:shadow-cyan-500/30"
            >
              Start Monitoring
              <ArrowRight size={17} />
            </Link>

            <Link
              to="/login"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/70 px-6 py-3.5 text-sm font-semibold text-white transition duration-300 hover:border-cyan-400 hover:bg-slate-800"
            >
              <Play size={16} />
              Live Demo
            </Link>
          </div>

          <div className="mt-9 flex flex-wrap gap-x-5 gap-y-3 text-sm">
            <div className="flex items-center gap-2 text-slate-300">
              <Zap
                size={16}
                className="text-yellow-400"
              />
              <span>Real-time Monitoring</span>
            </div>

            <div className="flex items-center gap-2 text-slate-300">
              <ShieldCheck
                size={16}
                className="text-emerald-400"
              />
              <span>Secure Infrastructure</span>
            </div>

            <div className="flex items-center gap-2 text-slate-300">
              <Activity
                size={16}
                className="text-cyan-400"
              />
              <span>Instant Alerts</span>
            </div>
          </div>

          <div className="mt-11 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {stats.map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-slate-800/90 bg-slate-900/60 p-4 backdrop-blur-xl"
              >
                <h2 className="text-2xl font-bold text-white">
                  {item.value}
                </h2>

                <p className="mt-1 text-xs leading-5 text-slate-400">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{
            opacity: 0,
            x: 36,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          transition={{
            delay: 0.15,
            duration: 0.8,
          }}
          className="relative mx-auto w-full max-w-[560px] lg:max-w-none"
        >
          <div className="rounded-[26px] border border-slate-800 bg-[#0C1424]/90 p-5 shadow-[0_0_70px_rgba(37,99,235,.14)] backdrop-blur-3xl sm:p-6">
            <div className="flex flex-col gap-4 border-b border-slate-800 pb-5 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-[0.68rem] uppercase tracking-[0.28em] text-cyan-400">
                  Live Monitoring
                </p>

                <h2 className="mt-2 text-xl font-bold text-white sm:text-2xl">
                  Infrastructure Overview
                </h2>
              </div>

              <div className="inline-flex w-fit items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-2">
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />

                <span className="text-xs font-semibold text-emerald-400">
                  LIVE
                </span>
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {services.map((service, index) => {
                const Icon = service.icon;

                return (
                  <motion.div
                    key={service.title}
                    initial={{
                      opacity: 0,
                      y: 18,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      delay: 0.35 + index * 0.1,
                    }}
                    whileHover={{
                      y: -3,
                    }}
                    className="min-w-0 rounded-2xl border border-slate-800 bg-slate-900/70 p-4 backdrop-blur-xl transition"
                  >
                    <div className="flex min-w-0 items-center justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="shrink-0 rounded-xl bg-slate-800 p-2.5">
                          <Icon
                            size={18}
                            className={service.color}
                          />
                        </div>

                        <div className="min-w-0">
                          <h3 className="truncate text-sm font-semibold text-white">
                            {service.title}
                          </h3>

                          <p className="mt-1 text-xs text-slate-400">
                            {service.metric}
                          </p>
                        </div>
                      </div>

                      <span className="shrink-0 text-[0.68rem] font-medium text-emerald-400">
                        {service.status}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-slate-900 p-4">
                <p className="text-xs text-slate-400">CPU</p>

                <h3 className="mt-1 text-2xl font-bold text-cyan-400">
                  34%
                </h3>
              </div>

              <div className="rounded-2xl bg-slate-900 p-4">
                <p className="text-xs text-slate-400">Memory</p>

                <h3 className="mt-1 text-2xl font-bold text-violet-400">
                  68%
                </h3>
              </div>

              <div className="rounded-2xl bg-slate-900 p-4">
                <p className="text-xs text-slate-400">Response</p>

                <h3 className="mt-1 text-2xl font-bold text-emerald-400">
                  18ms
                </h3>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-10 h-24 bg-gradient-to-b from-transparent to-[#050B16]" />
    </section>
  );
}