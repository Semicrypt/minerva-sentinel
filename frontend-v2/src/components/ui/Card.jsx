export default function Card({
    children,
    className = "",
    hover = true,
    glow = "blue"
}) {

    const glows = {
        blue: "from-blue-500/15",
        emerald: "from-emerald-500/15",
        cyan: "from-cyan-500/15",
        purple: "from-purple-500/15",
        orange: "from-orange-500/15",
        red: "from-red-500/15",
        none: "from-transparent"
    };

    return (

        <div
            className={`
                group
                relative
                overflow-hidden
                rounded-[28px]
                border
                border-slate-800/80
                bg-[#111827]
                shadow-xl
                shadow-black/20
                transition-all
                duration-300
                ${
                    hover
                        ? "hover:-translate-y-1 hover:border-blue-500/40 hover:shadow-2xl hover:shadow-blue-900/10"
                        : ""
                }
                ${className}
            `}
        >

            {/* Glow */}

            <div
                className={`
                    absolute
                    inset-0
                    bg-gradient-to-br
                    ${glows[glow]}
                    via-transparent
                    to-transparent
                    opacity-80
                    pointer-events-none
                `}
            />

            {/* Top highlight */}

            <div
                className="
                    absolute
                    inset-x-0
                    top-0
                    h-px
                    bg-gradient-to-r
                    from-transparent
                    via-white/20
                    to-transparent
                "
            />

            {/* Corner glow */}

            <div
                className="
                    absolute
                    -right-20
                    -top-20
                    h-40
                    w-40
                    rounded-full
                    bg-white/5
                    blur-3xl
                    pointer-events-none
                "
            />

            {/* Content */}

            <div className="relative z-10">

                {children}

            </div>

        </div>

    );

}