import {
    Search,
    Bell,
    SunMedium,
    Settings,
    Plus,
    ChevronDown
} from "lucide-react";

import { useLocation } from "react-router-dom";

export default function Navbar() {

    const location = useLocation();

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
        "/alerts": {
            title: "Alerts",
            subtitle: "Track incidents and active monitoring alerts."
        },
        "/analytics": {
            title: "Analytics",
            subtitle: "Performance insights, trends and historical metrics."
        },
        "/logs": {
            title: "Logs",
            subtitle: "Search, filter and inspect infrastructure logs."
        },
        "/settings": {
            title: "Settings",
            subtitle: "Configure Minerva Sentinel and manage your account."
        }
    };

    const current =
        pages[location.pathname] || {
            title: "Minerva Sentinel",
            subtitle: "Cloud Monitoring Platform"
        };

    return (
        <header
            className="
                sticky
                top-0
                z-40
                border-b
                border-slate-800
                bg-[#08111F]/90
                backdrop-blur-xl
            "
        >
            <div className="flex h-24 items-center justify-between px-10">

                {/* Left */}

                <div>

                    <h1 className="text-4xl font-bold tracking-tight text-white">
                        {current.title}
                    </h1>

                    <p className="mt-2 text-slate-400">
                        {current.subtitle}
                    </p>

                </div>

                {/* Right */}

                <div className="flex items-center gap-4">

                    {/* Search */}

                    <div className="relative hidden xl:block">

                        <Search
                            size={18}
                            className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500"
                        />

                        <input
                            placeholder="Search infrastructure, services, hosts..."
                            className="
                                h-14
                                w-[460px]
                                rounded-2xl
                                border
                                border-slate-700
                                bg-slate-900
                                pl-14
                                pr-5
                                text-sm
                                text-white
                                placeholder:text-slate-500
                                outline-none
                                transition-all
                                focus:border-blue-500
                                focus:ring-2
                                focus:ring-blue-500/20
                            "
                        />

                    </div>

                    {/* Add */}

                    <button
                        className="
                            flex
                            h-14
                            items-center
                            gap-2
                            rounded-2xl
                            bg-gradient-to-r
                            from-blue-600
                            to-cyan-500
                            px-5
                            font-semibold
                            text-white
                            shadow-lg
                            shadow-blue-500/20
                            transition-all
                            hover:scale-105
                        "
                    >

                        <Plus size={18} />

                        Add

                    </button>

                    {/* Theme */}

                    <button
                        className="
                            flex
                            h-14
                            w-14
                            items-center
                            justify-center
                            rounded-2xl
                            border
                            border-slate-700
                            bg-slate-900
                            text-slate-400
                            transition
                            hover:border-blue-500
                            hover:text-white
                        "
                    >

                        <SunMedium size={20} />

                    </button>

                    {/* Notifications */}

                    <button
                        className="
                            relative
                            flex
                            h-14
                            w-14
                            items-center
                            justify-center
                            rounded-2xl
                            border
                            border-slate-700
                            bg-slate-900
                            text-slate-400
                            transition
                            hover:border-blue-500
                            hover:text-white
                        "
                    >

                        <Bell size={20} />

                        <span
                            className="
                                absolute
                                right-3
                                top-3
                                flex
                                h-5
                                w-5
                                items-center
                                justify-center
                                rounded-full
                                bg-red-500
                                text-[10px]
                                font-bold
                                text-white
                            "
                        >
                            3
                        </span>

                    </button>

                    {/* Settings */}

                    <button
                        className="
                            flex
                            h-14
                            w-14
                            items-center
                            justify-center
                            rounded-2xl
                            border
                            border-slate-700
                            bg-slate-900
                            text-slate-400
                            transition
                            hover:border-blue-500
                            hover:text-white
                        "
                    >

                        <Settings size={20} />

                    </button>

                    {/* User */}

                    <button
                        className="
                            flex
                            h-14
                            items-center
                            gap-4
                            rounded-2xl
                            border
                            border-slate-700
                            bg-slate-900
                            px-4
                            transition
                            hover:border-blue-500
                        "
                    >

                        <div
                            className="
                                flex
                                h-11
                                w-11
                                items-center
                                justify-center
                                rounded-2xl
                                bg-gradient-to-br
                                from-blue-500
                                to-purple-600
                                text-lg
                                font-bold
                            "
                        >
                            D
                        </div>

                        <div className="text-left">

                            <p className="font-semibold text-white">
                                Divine
                            </p>

                            <p className="text-xs text-slate-400">
                                Administrator
                            </p>

                        </div>

                        <ChevronDown
                            size={18}
                            className="text-slate-500"
                        />

                    </button>

                </div>

            </div>

        </header>
    );
}