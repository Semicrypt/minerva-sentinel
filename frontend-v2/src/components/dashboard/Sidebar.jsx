import {
    NavLink,
    useNavigate
} from "react-router-dom";

import Logo from "./Logo";

import {
    logout
} from "../../services/authService";

import useIncidentCount from "../../hooks/useIncidentCount";

import {
    LayoutDashboard,
    Server,
    Globe2,
    Cloud,
    Box,
    Activity,
    GitBranch,
    Bell,
    FileText,
    Database,
    ShieldCheck,
    DollarSign,
    Settings,
    ChevronLeft,
    Circle,
    LogOut,
    X
} from "lucide-react";

const navigation = [
    {
        section: "Operations",
        items: [
            {
                title: "Dashboard",
                path: "/dashboard",
                icon: LayoutDashboard
            },
            {
                title: "Infrastructure",
                path: "/infrastructure",
                icon: Server
            },
            {
                title: "Services",
                path: "/services",
                icon: Globe2
            },
            {
                title: "AWS Resources",
                path: "/aws",
                icon: Cloud
            },
            {
                title: "Containers",
                path: "/containers",
                icon: Box
            },
            {
                title: "Observability",
                path: "/observability",
                icon: Activity
            },
            {
                title: "CI/CD",
                path: "/cicd",
                icon: GitBranch
            }
        ]
    },
    {
        section: "Platform",
        items: [
            {
                title: "Alerts",
                path: "/alerts",
                icon: Bell
            },
            {
                title: "Logs",
                path: "/logs",
                icon: FileText
            },
            {
                title: "Storage",
                path: "/storage",
                icon: Database
            },
            {
                title: "Security",
                path: "/security",
                icon: ShieldCheck
            },
            {
                title: "Cost Explorer",
                path: "/cost-explorer",
                icon: DollarSign
            },
            {
                title: "Settings",
                path: "/settings",
                icon: Settings
            }
        ]
    }
];

export default function Sidebar({
    open = false,
    onClose = () => {}
}) {
    const navigate =
        useNavigate();

    const activeIncidentCount =
        useIncidentCount();

    function handleLogout() {
        logout();

        onClose();

        navigate(
            "/login"
        );
    }

    return (
        <>
            {open && (
                <button
                    type="button"
                    aria-label="Close navigation menu"
                    onClick={onClose}
                    className="
                        fixed
                        inset-0
                        z-40
                        bg-slate-950/70
                        backdrop-blur-sm
                        lg:hidden
                    "
                />
            )}

            <aside
                className={`
                    fixed
                    inset-y-0
                    left-0
                    z-50
                    flex
                    w-72
                    max-w-[88vw]
                    flex-col
                    overflow-hidden
                    border-r
                    border-slate-800
                    bg-[#070D18]/95
                    shadow-2xl
                    shadow-black/30
                    backdrop-blur-xl
                    transition-transform
                    duration-300
                    lg:w-64
                    lg:max-w-none
                    lg:translate-x-0
                    ${
                        open
                            ? "translate-x-0"
                            : "-translate-x-full"
                    }
                `}
            >
                <div
                    className="
                        flex
                        shrink-0
                        items-center
                        justify-between
                        border-b
                        border-slate-800
                        px-5
                        py-5
                    "
                >
                    <div className="min-w-0">
                        <Logo />
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close navigation menu"
                        className="
                            rounded-lg
                            p-2
                            text-slate-400
                            transition
                            hover:bg-slate-800
                            hover:text-white
                            lg:hidden
                        "
                    >
                        <X size={20} />
                    </button>
                </div>

                <div
                    className="
                        min-h-0
                        flex-1
                        overflow-y-auto
                        px-3
                        py-5
                        sm:px-4
                    "
                >
                    {navigation.map(
                        group => (
                            <div
                                key={group.section}
                                className="mb-7 last:mb-0"
                            >
                                <p
                                    className="
                                        mb-3
                                        px-3
                                        text-[11px]
                                        font-semibold
                                        uppercase
                                        tracking-[0.24em]
                                        text-slate-500
                                    "
                                >
                                    {group.section}
                                </p>

                                <nav className="space-y-1.5">
                                    {group.items.map(
                                        item => {
                                            const Icon =
                                                item.icon;

                                            const badgeCount =
                                                item.path === "/alerts"
                                                    ? activeIncidentCount
                                                    : 0;

                                            return (
                                                <NavLink
                                                    key={item.path}
                                                    to={item.path}
                                                    end={
                                                        item.path ===
                                                        "/dashboard"
                                                    }
                                                    onClick={onClose}
                                                    className={({
                                                        isActive
                                                    }) =>
                                                        `
                                                        group
                                                        flex
                                                        items-center
                                                        justify-between
                                                        rounded-xl
                                                        px-3
                                                        py-2.5
                                                        text-sm
                                                        font-medium
                                                        transition-all
                                                        duration-200
                                                        ${
                                                            isActive
                                                                ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-600/20"
                                                                : "text-slate-400 hover:bg-slate-800/80 hover:text-white"
                                                        }
                                                        `
                                                    }
                                                >
                                                    <span
                                                        className="
                                                            flex
                                                            min-w-0
                                                            items-center
                                                            gap-3
                                                        "
                                                    >
                                                        <Icon
                                                            size={18}
                                                            className="shrink-0"
                                                        />

                                                        <span className="truncate">
                                                            {item.title}
                                                        </span>
                                                    </span>

                                                    {badgeCount > 0 && (
                                                        <span
                                                            aria-label={`${badgeCount} active alerts`}
                                                            className="
                                                                flex
                                                                h-5
                                                                min-w-5
                                                                items-center
                                                                justify-center
                                                                rounded-full
                                                                bg-red-500
                                                                px-1.5
                                                                text-[10px]
                                                                font-bold
                                                                text-white
                                                            "
                                                        >
                                                            {badgeCount > 99
                                                                ? "99+"
                                                                : badgeCount}
                                                        </span>
                                                    )}
                                                </NavLink>
                                            );
                                        }
                                    )}
                                </nav>
                            </div>
                        )
                    )}
                </div>

                <div
                    className="
                        shrink-0
                        border-t
                        border-slate-800
                        px-3
                        py-3
                        sm:p-4
                    "
                >
                    <div
                        className="
                            rounded-2xl
                            border
                            border-slate-700
                            bg-slate-900/80
                            p-4
                        "
                    >
                        <div className="flex items-center justify-between">
                            <p
                                className="
                                    text-[11px]
                                    uppercase
                                    tracking-[0.18em]
                                    text-slate-500
                                "
                            >
                                Hybrid Cloud
                            </p>

                            <Circle
                                size={9}
                                fill="#22c55e"
                                className="text-emerald-400"
                            />
                        </div>

                        <div className="mt-4 space-y-3">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-slate-400">
                                    AWS
                                </span>

                                <span className="font-semibold text-emerald-400">
                                    Connected
                                </span>
                            </div>

                            <div className="flex items-center justify-between text-sm">
                                <span className="text-slate-400">
                                    Docker
                                </span>

                                <span className="font-semibold text-emerald-400">
                                    Online
                                </span>
                            </div>

                            <div className="flex items-center justify-between text-sm">
                                <span className="text-slate-400">
                                    CloudWatch
                                </span>

                                <span className="font-semibold text-cyan-400">
                                    Active
                                </span>
                            </div>
                        </div>

                        <div className="mt-4 border-t border-slate-800 pt-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-400">
                                    Platform Health
                                </span>

                                <span className="font-bold text-white">
                                    99.99%
                                </span>
                            </div>

                            <div
                                className="
                                    mt-3
                                    h-1.5
                                    overflow-hidden
                                    rounded-full
                                    bg-slate-800
                                "
                            >
                                <div
                                    className="
                                        h-full
                                        rounded-full
                                        bg-gradient-to-r
                                        from-emerald-400
                                        via-cyan-400
                                        to-blue-500
                                    "
                                    style={{
                                        width: "99%"
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleLogout}
                        className="
                            mt-3
                            flex
                            w-full
                            items-center
                            justify-center
                            gap-2
                            rounded-xl
                            border
                            border-slate-700
                            px-4
                            py-2.5
                            text-sm
                            text-slate-300
                            transition
                            hover:border-red-500
                            hover:bg-red-500/10
                            hover:text-red-400
                        "
                    >
                        <LogOut size={17} />

                        Logout
                    </button>

                    <div className="mt-4 flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold text-white">
                                Minerva Sentinel
                            </p>

                            <p className="text-[11px] text-slate-500">
                                Version 2.0.0
                            </p>
                        </div>

                        <button
                            type="button"
                            aria-label="Collapse sidebar"
                            className="
                                rounded-lg
                                border
                                border-slate-700
                                p-1.5
                                text-slate-400
                                transition
                                hover:border-cyan-500
                                hover:text-white
                            "
                        >
                            <ChevronLeft size={15} />
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
}