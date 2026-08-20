import {
    Cloud,
    MapPin,
    RefreshCw,
    ShieldCheck
} from "lucide-react";

const STATUS_DETAILS = {
    CONNECTED: {
        label: "Connected",
        className:
            "bg-emerald-500/10 text-emerald-400"
    },
    PENDING: {
        label: "Pending verification",
        className:
            "bg-amber-500/10 text-amber-300"
    },
    ERROR: {
        label: "Connection error",
        className:
            "bg-rose-500/10 text-rose-300"
    },
    DISCONNECTED: {
        label: "Disconnected",
        className:
            "bg-slate-700/60 text-slate-300"
    },
    NOT_CONNECTED: {
        label: "Not connected",
        className:
            "bg-slate-700/60 text-slate-300"
    },
    LOADING: {
        label: "Loading",
        className:
            "bg-cyan-500/10 text-cyan-300"
    }
};

function getStatus(
    connection,
    loading
) {
    if (loading) {
        return "LOADING";
    }

    return String(
        connection?.status ||
        "NOT_CONNECTED"
    ).toUpperCase();
}

function DetailRow({
    icon: Icon,
    label,
    children
}) {
    return (
        <div
            className="
                flex
                items-center
                justify-between
                gap-4
                rounded-2xl
                border
                border-slate-800
                bg-slate-900/50
                px-5
                py-4
            "
        >
            <div className="flex items-center gap-3 text-slate-400">
                <Icon
                    size={18}
                    className="text-cyan-400"
                />

                <span>{label}</span>
            </div>

            <div className="min-w-0 text-right">
                {children}
            </div>
        </div>
    );
}

export default function AWSHeader({
    connection = null,
    connectionCount = 0,
    loading = false,
    refreshing = false,
    onRefresh
}) {
    const status =
        getStatus(
            connection,
            loading
        );

    const statusDetails =
        STATUS_DETAILS[status] ||
        STATUS_DETAILS.ERROR;

    const refreshDisabled =
        loading ||
        refreshing ||
        typeof onRefresh !== "function";

    return (
        <section
            className="
                rounded-[32px]
                border
                border-slate-800
                bg-[#111827]
                p-6
                shadow-xl
                shadow-black/20
                md:p-8
            "
        >
            <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <div className="flex items-center gap-3">
                        <div
                            className="
                                flex
                                h-14
                                w-14
                                items-center
                                justify-center
                                rounded-2xl
                                bg-orange-500/10
                            "
                        >
                            <Cloud
                                size={28}
                                className="text-orange-400"
                            />
                        </div>

                        <div>
                            <p className="text-sm uppercase tracking-[0.25em] text-slate-500">
                                Amazon Web Services
                            </p>

                            <h1 className="mt-1 text-4xl font-black text-white">
                                AWS Resources
                            </h1>
                        </div>
                    </div>

                    <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-400">
                        Connect AWS using a read-only IAM role and monitor
                        account-owned resources through secure server-side
                        access.
                    </p>

                    <p className="mt-3 text-sm text-slate-500">
                        {connectionCount === 1
                            ? "1 saved AWS connection"
                            : `${connectionCount} saved AWS connections`}
                    </p>
                </div>

                <div className="grid gap-3 lg:min-w-[360px]">
                    <DetailRow
                        icon={Cloud}
                        label="Connection"
                    >
                        <div className="flex flex-wrap items-center justify-end gap-2">
                            <span className="max-w-44 truncate font-semibold text-white">
                                {loading
                                    ? "Loading..."
                                    : connection?.name ||
                                      "No connection"}
                            </span>

                            <span
                                className={`
                                    rounded-full
                                    px-3
                                    py-1
                                    text-xs
                                    font-semibold
                                    ${statusDetails.className}
                                `}
                            >
                                {statusDetails.label}
                            </span>
                        </div>
                    </DetailRow>

                    <DetailRow
                        icon={MapPin}
                        label="Region"
                    >
                        <span className="font-semibold text-white">
                            {loading
                                ? "Loading..."
                                : connection?.region ||
                                  "Not selected"}
                        </span>
                    </DetailRow>

                    <DetailRow
                        icon={ShieldCheck}
                        label="AWS Account"
                    >
                        <span className="font-mono text-sm font-semibold text-white">
                            {loading
                                ? "Loading..."
                                : connection?.accountId ||
                                  "Not verified"}
                        </span>
                    </DetailRow>

                    <button
                        type="button"
                        onClick={onRefresh}
                        disabled={refreshDisabled}
                        className="
                            flex
                            items-center
                            justify-center
                            gap-3
                            rounded-2xl
                            bg-gradient-to-r
                            from-blue-600
                            to-cyan-500
                            px-6
                            py-4
                            font-semibold
                            text-white
                            transition
                            hover:scale-[1.01]
                            disabled:cursor-not-allowed
                            disabled:opacity-60
                            disabled:hover:scale-100
                        "
                    >
                        <RefreshCw
                            size={18}
                            className={
                                refreshing
                                    ? "animate-spin"
                                    : ""
                            }
                        />

                        {refreshing
                            ? "Refreshing..."
                            : "Refresh connections"}
                    </button>
                </div>
            </div>
        </section>
    );
}