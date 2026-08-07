import { motion } from "framer-motion";

export default function AnimatedBackground() {

    return (

        <div className="fixed inset-0 overflow-hidden -z-50">

            {/* Aurora 1 */}

            <motion.div

                animate={{

                    x: [0, 120, -80, 0],

                    y: [0, 80, -50, 0],

                    scale: [1, 1.15, 0.95, 1]

                }}

                transition={{

                    duration: 40,

                    repeat: Infinity,

                    ease: "linear"

                }}

                className="absolute left-[-10%] top-[-10%] h-[700px] w-[700px] rounded-full bg-blue-500/20 blur-[140px]"

            />

            {/* Aurora 2 */}

            <motion.div

                animate={{

                    x: [0, -140, 90, 0],

                    y: [0, -70, 80, 0],

                    scale: [1, .9, 1.1, 1]

                }}

                transition={{

                    duration: 48,

                    repeat: Infinity,

                    ease: "linear"

                }}

                className="absolute right-[-10%] top-[10%] h-[650px] w-[650px] rounded-full bg-cyan-400/20 blur-[150px]"

            />

            {/* Aurora 3 */}

            <motion.div

                animate={{

                    x: [0, 80, -60, 0],

                    y: [0, -120, 60, 0],

                    scale: [1, 1.2, .95, 1]

                }}

                transition={{

                    duration: 60,

                    repeat: Infinity,

                    ease: "linear"

                }}

                className="absolute bottom-[-15%] left-[25%] h-[800px] w-[800px] rounded-full bg-violet-500/15 blur-[170px]"

            />

            {/* Grid */}

            <div

                className="absolute inset-0 opacity-[0.04]"

                style={{

                    backgroundImage: `

                    linear-gradient(rgba(255,255,255,.25) 1px, transparent 1px),

                    linear-gradient(90deg, rgba(255,255,255,.25) 1px, transparent 1px)

                    `,

                    backgroundSize: "70px 70px"

                }}

            />

            {/* Vignette */}

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_35%,rgba(5,8,22,.9)_100%)]"/>

        </div>

    );

}