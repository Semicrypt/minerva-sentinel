import { MoreHorizontal, ChevronRight } from "lucide-react";

export default function SectionHeader({
    title,
    subtitle,
    icon: Icon,
    color = "text-blue-400",
    action = true,
    actionLabel = "View all",
    onAction,
    children
}) {
    return (
        <div className="mb-6 flex items-start justify-between">

            {/* Left */}

            <div className="flex items-center gap-4">

                {Icon && (
                    <div
                        className="
                            flex
                            h-12
                            w-12
                            items-center
                            justify-center
                            rounded-2xl
                            bg-slate-800/80
                            border
                            border-slate-700
                        "
                    >
                        <Icon
                            size={22}
                            className={color}
                        />
                    </div>
                )}

                <div>

                    <h2 className="text-xl font-semibold tracking-tight text-white">
                        {title}
                    </h2>

                    {subtitle && (
                        <p className="mt-1 text-sm text-slate-400">
                            {subtitle}
                        </p>
                    )}

                </div>

            </div>

            {/* Right */}

            {children ? (
                children
            ) : action ? (
                <button
                    onClick={onAction}
                    className="
                        flex
                        items-center
                        gap-2
                        rounded-xl
                        border
                        border-slate-700
                        bg-slate-900/50
                        px-3
                        py-2
                        text-sm
                        text-slate-400
                        transition-all
                        hover:border-blue-500
                        hover:text-white
                    "
                >

                    {actionLabel}

                    <ChevronRight size={16} />

                </button>
            ) : (
                <button
                    className="
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-xl
                        border
                        border-slate-700
                        bg-slate-900/50
                        text-slate-500
                        transition-all
                        hover:border-blue-500
                        hover:text-white
                    "
                >
                    <MoreHorizontal size={18} />
                </button>
            )}

        </div>
    );
}