import {
    Search,
    Bell,
    Settings,
    ChevronDown,
    Menu
} from "lucide-react";

import {
    useLocation,
    useNavigate
} from "react-router-dom";

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

export default function Navbar({ onMenuClick = () => {} }) {
    const location = useLocation();
    const navigate = useNavigate();

    const current = pages[location.pathname] || {
        title: "Minerva Sentinel",
        subtitle: "Cloud Monitoring Platform"
    };

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
                        aria-label="View alerts"
                        onClick={() => navigate("/alerts")}
                        className={iconButtonClass}
                    >
                        <Bell size={19} />

                        <span className="absolute hidden" />

                        <span className="relative -ml-3 -mt-5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white">
                            3
                        </span>
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
                        aria-label="Open account menu"
                        onClick={() => navigate("/settings")}
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-700 bg-slate-900/80 transition hover:border-blue-500 sm:h-11 sm:w-auto sm:gap-3 sm:px-3"
                    >
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 text-sm font-bold text-white">
                            D
                        </span>

                        <span className="hidden text-left sm:block">
                            <span className="block text-sm font-semibold text-white">
                                Divine
                            </span>

                            <span className="block text-[11px] text-slate-400">
                                Administrator
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