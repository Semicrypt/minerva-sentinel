import { motion } from "framer-motion";

const technologies = [
    "AWS",
    "Azure",
    "Google Cloud",
    "Docker",
    "Kubernetes",
    "GitHub",
    "PostgreSQL",
    "Node.js"
];

export default function TrustedSection() {

    return (

        <section
    id="technical-solutions"
    className="scroll-mt-32 px-6 py-28"
>

            <div className="mx-auto max-w-7xl">

                <motion.div

                    initial={{ opacity: 0, y: 40 }}

                    whileInView={{ opacity: 1, y: 0 }}

                    viewport={{ once: true }}

                    transition={{ duration: 0.8 }}

                    className="text-center"

                >

                    <p className="text-sm font-semibold uppercase tracking-[0.4em] text-cyan-400">

                        Built For Modern Infrastructure

                    </p>

                    <h2 className="mt-6 font-['Sora'] text-5xl font-bold text-white">

                        Integrates With Your Favorite Technologies

                    </h2>

                    <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-400">

                        Miverna Sentinel is designed to monitor modern cloud
                        infrastructure, APIs, containers, databases and
                        production environments from one dashboard.

                    </p>

                </motion.div>

                <div className="mt-16 grid grid-cols-2 gap-6 md:grid-cols-4">

                    {technologies.map((tech, index) => (

                        <motion.div

                            key={tech}

                            initial={{ opacity: 0, y: 30 }}

                            whileInView={{ opacity: 1, y: 0 }}

                            viewport={{ once: true }}

                            transition={{

                                delay: index * 0.08,

                                duration: 0.5

                            }}

                            className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:border-cyan-400/40 hover:bg-white/10"

                        >

                            <h3 className="font-['Sora'] text-xl font-semibold text-white">

                                {tech}

                            </h3>

                        </motion.div>

                    ))}

                </div>

            </div>

        </section>

    );

}