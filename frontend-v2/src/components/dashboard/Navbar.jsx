import {
    Bell,
    ChevronDown,
    Menu,
    Search,
    Settings
} from "lucide-react";

import {
    useLocation,
    useNavigate
} from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import useIncidentCount from "../../hooks/useIncidentCount";

const pages = {
    "/dashboard": {
        title: "Dashboard",
        subtitle: "Monitor your infrastructure in real time."
    },
    "/infrastructure": {
        title: "Infrastructure",
        subtitle: "Monitor servers, virtual machines and cloud resources."
    },
    "/services": {
        title: "Services",
        subtitle: "Monitor APIs, websites and application services."
    },
    "/aws": {
        title: "AWS Resources",
        subtitle: "Inspect your connected AWS infrastructure."
    },
    "/containers": {
        title: "Containers",
        subtitle: "Monitor Docker containers and images."
    },
    "/observability": {
        title: "Observability",
        subtitle: "Understand application health and performance."
    },
    "/cicd": {
        title: "CI/CD",
        subtitle: "Track deployments and delivery pipelines."
    },
    "/alerts": {
        title: "Alerts",
        subtitle: "Track incidents and active monitoring alerts."
    },
    "/logs": {
        title: "Logs",
        subtitle: "Search, filter and inspect infrastructure logs."
    },
    "/storage": {
        title: "Storage",
        subtitle: "Monitor storage resources and usage."
    },
    "/security": {
        title: "Security",
        subtitle: "Review infrastructure security status."
    },
    "/cost-explorer": {
        title: "Cost Explorer",
        subtitle: "Understand your cloud usage and spending."
    },
    "/settings": {
        title: "Settings",
        subtitle: "Configure Minerva Sentinel and manage your account."
    }
};

const iconButtonClass =
    "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-700 bg-slate-900/80 text-slate-400 transition hover:border-blue-500 hover:text-white sm:h-11 sm:w-11";

function formatRole(role) {
    if (!role) {
        return "User";
    }

    return role
        .replace(/[-_]/g, " ")
        .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function getDisplayName(user) {
    if (user?.full_name?.trim()) {
        return user.full_name.trim();
    }

    if (user?.email) {
        return user.email.split("@")[0];
    }

    return "User";
}

function getInitials(name) {
    const words = name
        .trim()
        .split(/\s+/)
        .filter(Boolean);

    if (words.length === 0) {
        return "U";
    }

    if (words.length === 1) {
        return words[0].slice(0, 2).toUpperCase();
    }

    return (
        words[0][0] +
        words[words.length - 1][0]
    ).toUpperCase();
}

export default function Navbar({
    onMenuClick = () => {}
}) {
    const location = useLocation();
    const navigate = useNavigate();

    const { user } = useAuth();
    const activeIncidentCount = useIncidentCount();

    const current =
        pages[location.pathname] || {
            title: "Minerva Sentinel",
            subtitle: "Cloud Monitoring Platform"
        };

    const displayName = getDisplayName(user);
    const initials = getInitials(displayName);
    const displayRole = formatRole(user?.role);

    return (
        <header className="sticky top-0 z-40 border-b border-slate-800 bg-[#08111F]/90 backdrop-blur-xl">
            <div className="flex min-h-20 items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
                <button
                    type="button"
                    onClick={onMenuClick}
                    aria-label="Open navigation menu"
                    className={`${iconButtonClass} lg:hidden`}
                >
                    <Menu size={20} />
                </button>

                <div className="min-w-0 flex-1">
                    <h1 className="truncate text-2xl font-bold tracking-tight text-white sm:text-3xl">
                        {current.title}
                    </h1>

                    <p className="mt-1 hidden truncate text-sm text-slate-400 sm:block">
                        {current.subtitle}
                    </p>
                </div>

                <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                    <div className="relative hidden xl:block">
                        <Search
                            size={17}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                        />

                        <input
                            type="search"
                            aria-label="Search infrastructure"
                            placeholder="Search infrastructure..."
                            className="h-11 w-64 rounded-xl border border-slate-700 bg-slate-900 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 2xl:w-80"
                        />
                    </div>

                    <button
                        type="button"
                        aria-label={`View alerts${
                            activeIncidentCount > 0
                                ? ` (${activeIncidentCount} active)`
                                : ""
                        }`}
                        onClick={() => navigate("/alerts")}
                        className={`${iconButtonClass} relative`}
                    >
                        <Bell size={19} />

                        {activeIncidentCount > 0 && (
                            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                                {activeIncidentCount}
                            </span>
                        )}
                    </button>

                    <button
                        type="button"
                        aria-label="Open settings"
                        onClick={() => navigate("/settings")}
                        className={`${iconButtonClass} hidden md:flex`}
                    >
                        <Settings size={19} />
                    </button>

                    <button
                        type="button"
                        aria-label="Open account settings"
                        onClick={() => navigate("/settings")}
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-700 bg-slate-900/80 transition hover:border-blue-500 sm:h-11 sm:w-auto sm:gap-3 sm:px-3"
                    >
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 text-sm font-bold text-white">
                            {initials}
                        </span>

                        <span className="hidden text-left sm:block">
                            <span className="block max-w-36 truncate text-sm font-semibold text-white">
                                {displayName}
                            </span>

                            <span className="block text-[11px] text-slate-400">
                                {displayRole}
                            </span>
                        </span>

                        <ChevronDown
                            size={16}
                            className="hidden text-slate-500 sm:block"
                        />
                    </button>
                </div>
            </div>
        </header>
    );
}