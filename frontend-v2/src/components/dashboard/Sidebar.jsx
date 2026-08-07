import {
    NavLink,
    useNavigate
} from "react-router-dom";

import Logo from "./Logo";

import {
    logout
} from "../../services/authService";

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
    LogOut

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

                icon: Bell,

                badge: 3

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

export default function Sidebar() {

    const navigate =
        useNavigate();

    function handleLogout() {

        logout();

        navigate(
            "/login"
        );

    }

    return (

        <aside
            className="
                fixed
                left-0
                top-0
                z-50
                flex
                h-screen
                w-[240px]
                flex-col
                border-r
                border-slate-800
                bg-[#070D18]
            "
        >

            {/* Logo */}

            <div className="border-b border-slate-800 px-8 py-8">

                <Logo />

            </div>

            {/* Navigation */}

            <div className="flex-1 overflow-y-auto px-5 py-6">

                {

                    navigation.map(
                        group => (

                            <div
                                key={
                                    group.section
                                }
                                className="mb-8"
                            >

                                <p
                                    className="
                                        mb-4
                                        px-4
                                        text-xs
                                        font-semibold
                                        uppercase
                                        tracking-[0.28em]
                                        text-slate-500
                                    "
                                >

                                    {group.section}

                                </p>

                                <nav className="space-y-2">

                                    {

                                        group.items.map(
                                            item => {

                                                const Icon =
                                                    item.icon;

                                                return (

                                                    <NavLink

                                                        key={
                                                            item.path
                                                        }

                                                        to={
                                                            item.path
                                                        }

                                                        className={({
                                                            isActive
                                                        }) =>

                                                            `
                                                            group
                                                            flex
                                                            items-center
                                                            justify-between
                                                            rounded-2xl
                                                            px-4
                                                            py-3.5
                                                            transition-all
                                                            duration-300

                                                            ${
                                                                isActive

                                                                    ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-600/20"

                                                                    : "text-slate-400 hover:bg-slate-800 hover:text-white"

                                                            }
                                                            `

                                                        }

                                                    >

                                                        <div className="flex items-center gap-4">

                                                            <Icon
                                                                size={20}
                                                            />

                                                            <span className="font-medium">

                                                                {
                                                                    item.title
                                                                }

                                                            </span>

                                                        </div>

                                                        {

                                                            item.badge && (

                                                                <span
                                                                    className="
                                                                        flex
                                                                        h-6
                                                                        w-6
                                                                        items-center
                                                                        justify-center
                                                                        rounded-full
                                                                        bg-red-500
                                                                        text-xs
                                                                        font-bold
                                                                        text-white
                                                                    "
                                                                >

                                                                    {
                                                                        item.badge
                                                                    }

                                                                </span>

                                                            )

                                                        }

                                                    </NavLink>

                                                );

                                            }
                                        )

                                    }

                                </nav>

                            </div>

                        )
                    )

                }

            </div>

            {/* Footer */}

            <div className="border-t border-slate-800 p-5">

                {/* Hybrid Cloud Status */}

                <div
                    className="
                        rounded-3xl
                        border
                        border-slate-700
                        bg-slate-900/80
                        p-5
                    "
                >

                    <div className="flex items-center justify-between">

                        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">

                            Hybrid Cloud

                        </p>

                        <Circle
                            size={10}
                            fill="#22c55e"
                            className="text-emerald-400"
                        />

                    </div>

                    <div className="mt-5 space-y-4">

                        <div className="flex items-center justify-between">

                            <span className="text-sm text-slate-400">

                                AWS

                            </span>

                            <span className="font-semibold text-emerald-400">

                                Connected

                            </span>

                        </div>

                        <div className="flex items-center justify-between">

                            <span className="text-sm text-slate-400">

                                Docker

                            </span>

                            <span className="font-semibold text-emerald-400">

                                Online

                            </span>

                        </div>

                        <div className="flex items-center justify-between">

                            <span className="text-sm text-slate-400">

                                CloudWatch

                            </span>

                            <span className="font-semibold text-cyan-400">

                                Active

                            </span>

                        </div>

                    </div>

                    <div className="mt-6 border-t border-slate-800 pt-5">

                        <div className="flex items-center justify-between">

                            <span className="text-sm text-slate-400">

                                Platform Health

                            </span>

                            <span className="text-lg font-bold text-white">

                                99.99%

                            </span>

                        </div>

                        <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-800">

                            <div
                                className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500"
                                style={{
                                    width: "99%"
                                }}
                            />

                        </div>

                    </div>

                </div>

                {/* Logout */}

                <button

                    onClick={
                        handleLogout
                    }

                    className="
                        mt-5
                        flex
                        w-full
                        items-center
                        justify-center
                        gap-3
                        rounded-2xl
                        border
                        border-slate-700
                        px-4
                        py-3
                        text-slate-300
                        transition-all
                        duration-300
                        hover:border-red-500
                        hover:bg-red-500/10
                        hover:text-red-400
                    "

                >

                    <LogOut
                        size={18}
                    />

                    Logout

                </button>

                {/* Version */}

                <div className="mt-6 flex items-center justify-between">

                    <div>

                        <p className="text-sm font-semibold text-white">

                            Minerva Sentinel

                        </p>

                        <p className="text-xs text-slate-500">

                            Version 2.0.0

                        </p>

                    </div>

                    <button
                        className="
                            rounded-xl
                            border
                            border-slate-700
                            p-2
                            text-slate-400
                            transition
                            hover:border-cyan-500
                            hover:text-white
                        "
                    >

                        <ChevronLeft
                            size={16}
                        />

                    </button>

                </div>

            </div>

        </aside>

    );

}