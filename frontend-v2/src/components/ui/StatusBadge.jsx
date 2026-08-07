import {
    CheckCircle2,
    AlertTriangle,
    XCircle,
    Info
} from "lucide-react";

const variants = {
    online: {
        icon: CheckCircle2,
        classes: "bg-emerald-500/15 text-emerald-400"
    },
    healthy: {
        icon: CheckCircle2,
        classes: "bg-emerald-500/15 text-emerald-400"
    },
    warning: {
        icon: AlertTriangle,
        classes: "bg-yellow-500/15 text-yellow-400"
    },
    critical: {
        icon: XCircle,
        classes: "bg-red-500/15 text-red-400"
    },
    offline: {
        icon: XCircle,
        classes: "bg-red-500/15 text-red-400"
    },
    info: {
        icon: Info,
        classes: "bg-blue-500/15 text-blue-400"
    }
};

export default function StatusBadge({
    status = "info",
    label
}) {
    const item = variants[status] || variants.info;
    const Icon = item.icon;

    return (
        <span
            className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${item.classes}`}
        >
            <Icon size={14} />

            {label || status}
        </span>
    );
}