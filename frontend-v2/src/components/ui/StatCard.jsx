import Card from "./Card";
import IconBadge from "./IconBadge";
import ProgressBar from "./ProgressBar";
import StatusBadge from "./StatusBadge";
import MiniSparkline from "./MiniSparkline";
import AnimatedCounter from "./AnimatedCounter";

import {
    ArrowUpRight,
    ArrowDownRight
} from "lucide-react";

const sparklineColors = {
    blue: "#3B82F6",
    emerald: "#10B981",
    purple: "#8B5CF6",
    cyan: "#06B6D4",
    orange: "#F59E0B",
    red: "#EF4444"
};

export default function StatCard({
    title,
    value,
    subtitle = "Updated just now",
    icon: Icon,
    color = "blue",
    progress = 70,
    status = "healthy",
    change = "+2.4%",
    trend = "up",
    sparklineData = [18, 22, 20, 28, 25, 33, 30, 36, 34, 42]
}) {

    const positive = trend === "up";

    const numericValue =
        typeof value === "string"
            ? parseFloat(value)
            : value;

    const suffix =
        typeof value === "string"
            ? value.replace(/[0-9.]/g, "")
            : "";

    return (

        <Card
            glow={color}
            className="relative p-6"
        >

            {/* Icon */}

            <div className="flex justify-center">

                <IconBadge
                    icon={Icon}
                    color={color}
                />

            </div>

            {/* Header */}

            <div className="mt-5 text-center">

                <h3 className="text-base font-semibold text-white">

                    {title}

                </h3>

                <p className="mt-1 text-sm text-slate-400">

                    {subtitle}

                </p>

            </div>

            {/* Value */}

            <div className="mt-6 text-center">

                <h2 className="text-5xl font-bold text-white">

                    <AnimatedCounter
                        value={numericValue}
                        suffix={suffix}
                    />

                </h2>

                <div className="mt-3 flex justify-center items-center gap-2">

                    {positive ? (

                        <ArrowUpRight
                            size={15}
                            className="text-emerald-400"
                        />

                    ) : (

                        <ArrowDownRight
                            size={15}
                            className="text-red-400"
                        />

                    )}

                    <span
                        className={`text-sm font-semibold ${
                            positive
                                ? "text-emerald-400"
                                : "text-red-400"
                        }`}
                    >

                        {change}

                    </span>

                    <span className="text-sm text-slate-500">

                        last hour

                    </span>

                </div>

            </div>

            {/* Sparkline */}

            <div className="mt-6">

                <MiniSparkline
                    color={
                        sparklineColors[color] ||
                        sparklineColors.blue
                    }
                    data={sparklineData}
                />

            </div>

            {/* Progress */}

            <div className="mt-6">

                <div className="mb-2 flex items-center justify-between">

                    <span className="text-sm text-slate-400">

                        Utilization

                    </span>

                    <span className="text-sm font-semibold text-white">

                        {progress}%

                    </span>

                </div>

                <ProgressBar
                    value={progress}
                    color={color}
                />

            </div>

            {/* Footer */}

            <div className="mt-6 flex items-center justify-between border-t border-slate-800 pt-4">

                <StatusBadge
                    status={status}
                />

                <div className="flex items-center gap-2">

                    <span className="relative flex h-2 w-2">

                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>

                        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400"></span>

                    </span>

                    <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-slate-500">

                        LIVE

                    </span>

                </div>

            </div>

        </Card>

    );

}