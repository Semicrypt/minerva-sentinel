import clsx from "clsx";

export default function Button({

    children,

    variant = "primary",

    size = "lg",

    className = "",

    ...props

}) {

    const base = `
        inline-flex
        items-center
        justify-center
        rounded-full
        font-semibold
        transition-all
        duration-300
        hover:-translate-y-1
        active:scale-95
    `;

    const variants = {

        primary: `
            bg-gradient-to-r
            from-blue-600
            via-cyan-500
            to-blue-500
            text-white
            shadow-xl
            shadow-cyan-500/20
            hover:shadow-cyan-500/40
        `,

        secondary: `
            border
            border-white/10
            bg-white/5
            text-white
            backdrop-blur-xl
            hover:bg-white/10
        `,

        ghost: `
            text-slate-300
            hover:text-white
            hover:bg-white/5
        `

    };

    const sizes = {

        sm: "px-5 py-2 text-sm",

        md: "px-7 py-3 text-base",

        lg: "px-10 py-4 text-lg"

    };

    return (

        <button

            className={clsx(

                base,

                variants[variant],

                sizes[size],

                className

            )}

            {...props}

        >

            {children}

        </button>

    );

}