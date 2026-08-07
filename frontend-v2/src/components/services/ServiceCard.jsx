import {
    useState
} from "react";

import {
    Globe,
    Clock3,
    Activity,
    ShieldCheck,
    MoreVertical,
    ExternalLink,
    Trash2,
    X
} from "lucide-react";

export default function ServiceCard({

    service,

    onDelete

}) {

    const [menuOpen, setMenuOpen] =
        useState(false);

    const [confirmDelete, setConfirmDelete] =
        useState(false);

    const [deleting, setDeleting] =
        useState(false);

    const healthy =
        String(
            service.status || ""
        ).toUpperCase() ===
        "UP";

    async function handleDelete() {

        if (!onDelete) {

            return;

        }

        try {

            setDeleting(
                true
            );

            await onDelete(
                service
            );

            setConfirmDelete(
                false
            );

            setMenuOpen(
                false
            );

        }

        finally {

            setDeleting(
                false
            );

        }

    }

    return (

        <div
            className="
                relative
                rounded-3xl
                border
                border-slate-800
                bg-[#111827]
                p-6
                shadow-xl
                shadow-black/20
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-blue-500/40
            "
        >

            {/* Header */}

            <div className="flex items-start justify-between">

                <div className="flex items-center gap-4">

                    <div
                        className="
                            flex
                            h-14
                            w-14
                            items-center
                            justify-center
                            rounded-2xl
                            bg-blue-500/10
                        "
                    >

                        <Globe
                            size={26}
                            className="text-blue-400"
                        />

                    </div>

                    <div>

                        <h2 className="text-lg font-semibold text-white">

                            {service.name}

                        </h2>

                        <a
                            href={service.url}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-1 flex items-center gap-1 text-sm text-slate-400 hover:text-blue-400"
                        >

                            {service.url}

                            <ExternalLink
                                size={14}
                            />

                        </a>

                    </div>

                </div>

                <div className="relative">

                    <button
                        type="button"
                        onClick={
                            () =>
                                setMenuOpen(
                                    previous =>
                                        !previous
                                )
                        }
                        className="
                            rounded-xl
                            p-2
                            text-slate-500
                            transition
                            hover:bg-slate-800
                            hover:text-white
                        "
                    >

                        <MoreVertical
                            size={18}
                        />

                    </button>

                    {
                        menuOpen && (

                            <div
                                className="
                                    absolute
                                    right-0
                                    top-11
                                    z-20
                                    w-44
                                    rounded-2xl
                                    border
                                    border-slate-700
                                    bg-slate-900
                                    p-2
                                    shadow-2xl
                                    shadow-black/50
                                "
                            >

                                <button
                                    type="button"
                                    onClick={
                                        () => {

                                            setConfirmDelete(
                                                true
                                            );

                                            setMenuOpen(
                                                false
                                            );

                                        }
                                    }
                                    className="
                                        flex
                                        w-full
                                        items-center
                                        gap-3
                                        rounded-xl
                                        px-4
                                        py-3
                                        text-left
                                        text-sm
                                        font-medium
                                        text-red-400
                                        transition
                                        hover:bg-red-500/10
                                    "
                                >

                                    <Trash2
                                        size={16}
                                    />

                                    Delete Service

                                </button>

                            </div>

                        )
                    }

                </div>

            </div>

            {/* Metrics */}

            <div className="mt-8 grid grid-cols-2 gap-6 lg:grid-cols-4">

                <div>

                    <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-wide text-slate-500">

                        <Activity
                            size={14}
                        />

                        Status

                    </div>

                    <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            healthy
                                ? "bg-emerald-500/15 text-emerald-400"
                                : "bg-red-500/15 text-red-400"
                        }`}
                    >

                        {service.status || "UNKNOWN"}

                    </span>

                </div>

                <div>

                    <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-wide text-slate-500">

                        <Clock3
                            size={14}
                        />

                        Response

                    </div>

                    <p className="text-xl font-bold text-white">

                        {
                            service.response_time !== undefined &&
                            service.response_time !== null
                                ? `${service.response_time} ms`
                                : "--"
                        }

                    </p>

                </div>

                <div>

                    <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-wide text-slate-500">

                        <ShieldCheck
                            size={14}
                        />

                        Interval

                    </div>

                    <p className="text-xl font-bold text-white">

                        {service.check_interval}s

                    </p>

                </div>

                <div>

                    <div className="mb-2 text-xs uppercase tracking-wide text-slate-500">

                        Monitoring

                    </div>

                    <p
                        className={
                            healthy
                                ? "font-semibold text-emerald-400"
                                : "font-semibold text-red-400"
                        }
                    >

                        {
                            healthy
                                ? "Available"
                                : "Unavailable"
                        }

                    </p>

                </div>

            </div>

            {/* Footer */}

            <div className="mt-8 flex items-center justify-between border-t border-slate-800 pt-5">

                <span className="text-sm text-slate-400">

                    Type

                    <span className="ml-2 font-medium capitalize text-white">

                        {
                            service.service_type ||
                            "website"
                        }

                    </span>

                </span>

                <span
                    className={`flex items-center gap-2 text-sm font-medium ${
                        healthy
                            ? "text-emerald-400"
                            : "text-red-400"
                    }`}
                >

                    <span
                        className={`h-2.5 w-2.5 rounded-full ${
                            healthy
                                ? "bg-emerald-400"
                                : "bg-red-400"
                        }`}
                    />

                    {
                        healthy
                            ? "Monitoring"
                            : "Unavailable"
                    }

                </span>

            </div>

            {/* Delete Confirmation */}

            {
                confirmDelete && (

                    <div
                        className="
                            absolute
                            inset-0
                            z-30
                            flex
                            items-center
                            justify-center
                            rounded-3xl
                            bg-slate-950/95
                            p-6
                            backdrop-blur-sm
                        "
                    >

                        <div className="w-full max-w-md">

                            <div className="flex items-start justify-between">

                                <div>

                                    <h3 className="text-xl font-bold text-white">

                                        Delete Service?

                                    </h3>

                                    <p className="mt-3 leading-7 text-slate-400">

                                        Remove{" "}

                                        <span className="font-semibold text-white">

                                            {service.name}

                                        </span>

                                        {" "}from Minerva Sentinel monitoring.

                                    </p>

                                </div>

                                <button
                                    type="button"
                                    disabled={deleting}
                                    onClick={
                                        () =>
                                            setConfirmDelete(
                                                false
                                            )
                                    }
                                    className="rounded-xl p-2 text-slate-500 hover:bg-slate-800 hover:text-white"
                                >

                                    <X
                                        size={18}
                                    />

                                </button>

                            </div>

                            <div className="mt-7 flex justify-end gap-3">

                                <button
                                    type="button"
                                    disabled={deleting}
                                    onClick={
                                        () =>
                                            setConfirmDelete(
                                                false
                                            )
                                    }
                                    className="
                                        rounded-xl
                                        border
                                        border-slate-700
                                        px-5
                                        py-3
                                        text-sm
                                        font-semibold
                                        text-slate-300
                                        hover:border-slate-500
                                        disabled:opacity-50
                                    "
                                >

                                    Cancel

                                </button>

                                <button
                                    type="button"
                                    disabled={deleting}
                                    onClick={handleDelete}
                                    className="
                                        flex
                                        items-center
                                        gap-2
                                        rounded-xl
                                        bg-red-600
                                        px-5
                                        py-3
                                        text-sm
                                        font-semibold
                                        text-white
                                        transition
                                        hover:bg-red-500
                                        disabled:cursor-not-allowed
                                        disabled:opacity-50
                                    "
                                >

                                    <Trash2
                                        size={16}
                                    />

                                    {
                                        deleting
                                            ? "Deleting..."
                                            : "Delete"
                                    }

                                </button>

                            </div>

                        </div>

                    </div>

                )
            }

        </div>

    );

}