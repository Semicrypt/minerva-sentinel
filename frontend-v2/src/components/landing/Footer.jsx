import { Mail } from "lucide-react";

const links = [
    ["Technical Solutions", "#technical-solutions"],
    ["Features", "#features"],
    ["Architecture", "#architecture"],
    ["Dashboard", "#dashboard"]
];

export default function Footer() {
    return (
        <footer
            id="about"
            className="scroll-mt-32 border-t border-white/10 px-6 py-14"
        >
            <div className="mx-auto max-w-7xl">
                <div className="grid gap-10 border-b border-white/10 pb-12 md:grid-cols-[1.4fr_1fr_1.2fr]">
                    <div>
                        <h3 className="font-['Sora'] text-2xl font-bold text-white">
                            Minerva Sentinel
                        </h3>

                        <p className="mt-3 max-w-md leading-7 text-slate-400">
                            Modern cloud infrastructure monitoring for teams
                            that want clear signals, faster response, and
                            reliable services.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">
                            Explore
                        </h4>

                        <nav className="mt-4 grid gap-3">
                            {links.map(([label, href]) => (
                                <a
                                    key={href}
                                    href={href}
                                    className="text-sm text-slate-400 transition hover:text-white"
                                >
                                    {label}
                                </a>
                            ))}
                        </nav>
                    </div>

                    <div
                        id="docs"
                        className="scroll-mt-32"
                    >
                        <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">
                            Docs & Contact
                        </h4>

                        <p className="mt-4 text-sm leading-6 text-slate-400">
                            Learn how Minerva works through the Technical
                            Solutions and Architecture sections, or contact us
                            for help.
                        </p>

                        <a
                            href="mailto:admin@minervasentinel.com"
                            className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-cyan-300 transition hover:text-cyan-200"
                        >
                            <Mail size={16} />
                            admin@minervasentinel.com
                        </a>
                    </div>
                </div>

                <div className="pt-10 text-center md:text-left">
                    <h4 className="text-lg font-semibold text-white">
                        About this project
                    </h4>

                    <p className="mx-auto mt-3 max-w-4xl text-sm leading-7 text-slate-400 md:mx-0">
                        Minerva Sentinel is an experimental project built by Nwachukwu Ifeanyi Divine purely out of passion for cloud infra to
                        explore practical cloud monitoring, observability, and
                        DevOps workflows. It is continuously evolving, so your
                        feedback, questions, and enquiries are welcome.
                    </p>

                    <a
                        href="mailto:ifeanyidivine1999@gmail.com"
                        className="mt-3 inline-block text-sm font-semibold text-cyan-300 transition hover:text-cyan-200"
                    >
                        Contact the developer:
                        {" "}
                        ifeanyidivine1999@gmail.com
                    </a>
                </div>

                <div className="mt-10 flex flex-col gap-3 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
                    <span>
                        © 2026 Minerva Sentinel. All rights reserved.
                    </span>

                    <span>
                        Experimental project · Built for learning and feedback
                    </span>
                </div>
            </div>
        </footer>
    );
}