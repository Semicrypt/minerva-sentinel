import {
    Search,
    Plus,
    ChevronDown
} from "lucide-react";

export default function ServicesToolbar({

    searchQuery = "",
    setSearchQuery = () => {},

    statusFilter = "All",
    setStatusFilter = () => {},

    typeFilter = "All",
    setTypeFilter = () => {},

    onAddServiceClick = () => {}

}) {

    return (

        <div className="rounded-3xl border border-slate-800 bg-[#111827] px-7 py-5 shadow-xl shadow-black/20">

            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                {/* Search */}

                <div className="relative w-full lg:max-w-lg">

                    <Search
                        size={17}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                    />

                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search services..."
                        className="
                            h-11
                            w-full
                            rounded-xl
                            border
                            border-slate-700
                            bg-slate-900
                            pl-11
                            pr-4
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

                <div className="flex flex-wrap items-center gap-3">

                    {/* Status */}

                    <div className="relative">

                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="
                                h-11
                                appearance-none
                                rounded-xl
                                border
                                border-slate-700
                                bg-slate-900
                                px-4
                                pr-10
                                text-sm
                                text-slate-300
                                outline-none
                                transition
                                focus:border-blue-500
                            "
                        >

                            <option>All</option>
                            <option>UP</option>
                            <option>DOWN</option>
                            <option>PAUSED</option>

                        </select>

                        <ChevronDown
                            size={16}
                            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
                        />

                    </div>

                    {/* Type */}

                    <div className="relative">

                        <select
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}
                            className="
                                h-11
                                appearance-none
                                rounded-xl
                                border
                                border-slate-700
                                bg-slate-900
                                px-4
                                pr-10
                                text-sm
                                text-slate-300
                                outline-none
                                transition
                                focus:border-blue-500
                            "
                        >

                            <option>All</option>
                            <option>Website</option>
                            <option>API</option>
                            <option>Database</option>
                            <option>Docker</option>

                        </select>

                        <ChevronDown
                            size={16}
                            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
                        />

                    </div>

                    {/* Add Service */}

                    <button
                        onClick={onAddServiceClick}
                        className="
                            flex
                            h-11
                            items-center
                            gap-2
                            rounded-xl
                            bg-gradient-to-r
                            from-blue-600
                            to-cyan-500
                            px-5
                            text-sm
                            font-semibold
                            text-white
                            shadow-lg
                            shadow-blue-900/20
                            transition-all
                            hover:scale-[1.02]
                            hover:shadow-blue-500/30
                        "
                    >

                        <Plus size={17} />

                        Add Service

                    </button>

                </div>

            </div>

        </div>

    );

}