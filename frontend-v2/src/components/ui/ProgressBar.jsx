export default function ProgressBar({
    value = 0,
    color = "blue",
    showValue = false,
    animated = true
}) {
    const colors = {
        blue: {
            bar: "from-blue-500 to-cyan-400",
            glow: "shadow-blue-500/30"
        },
        emerald: {
            bar: "from-emerald-500 to-green-400",
            glow: "shadow-emerald-500/30"
        },
        cyan: {
            bar: "from-cyan-500 to-sky-400",
            glow: "shadow-cyan-500/30"
        },
        purple: {
            bar: "from-violet-500 to-purple-400",
            glow: "shadow-purple-500/30"
        },
        orange: {
            bar: "from-orange-500 to-amber-400",
            glow: "shadow-orange-500/30"
        },
        red: {
            bar: "from-red-500 to-rose-400",
            glow: "shadow-red-500/30"
        }
    };

    const theme = colors[color] || colors.blue;

    const percentage = Math.max(
        0,
        Math.min(100, Number(value))
    );

    return (
        <div className="w-full">

            {showValue && (

                <div className="mb-2 flex justify-between">

                    <span className="text-sm text-slate-400">
                        Utilization
                    </span>

                    <span className="font-semibold text-white">
                        {percentage}%
                    </span>

                </div>

            )}

            {/* Track */}

            <div className="relative h-3 overflow-hidden rounded-full bg-slate-800">

                {/* Fill */}

                <div
                    className={`
                        h-full
                        rounded-full
                        bg-gradient-to-r
                        ${theme.bar}
                        ${animated ? "transition-all duration-700 ease-out" : ""}
                        shadow-lg
                        ${theme.glow}
                    `}
                    style={{
                        width: `${percentage}%`
                    }}
                />

                {/* Glow */}

                <div
                    className={`
                        absolute
                        top-1/2
                        h-4
                        w-4
                        -translate-y-1/2
                        rounded-full
                        bg-white
                        shadow-lg
                        ${theme.glow}
                        ${animated ? "transition-all duration-700 ease-out" : ""}
                    `}
                    style={{
                        left: `calc(${percentage}% - 8px)`
                    }}
                />

            </div>

        </div>
    );
}