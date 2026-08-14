import {
    Activity,
    AlertTriangle,
    CheckCircle2,
    Clock3,
    MapPin,
    RefreshCw,
    Server,
    ShieldCheck
} from "lucide-react";

const STATE_STYLES = {
    running:
        "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",

    pending:
        "border-amber-500/30 bg-amber-500/10 text-amber-300",

    stopping:
        "border-orange-500/30 bg-orange-500/10 text-orange-300",

    stopped:
        "border-slate-600 bg-slate-700/40 text-slate-300",

    shuttingDown:
        "border-rose-500/30 bg-rose-500/10 text-rose-300",

    terminated:
        "border-rose-500/30 bg-rose-500/10 text-rose-300",

    unknown:
        "border-slate-600 bg-slate-700/40 text-slate-300"
};

function getStateDetails(
    state
) {
    const normalizedState =
        String(
            state || "unknown"
        )
            .trim()
            .toLowerCase();

    const styleKey =
        normalizedState ===
            "shutting-down"
            ? "shuttingDown"
            : normalizedState;

    return {
        state:
            normalizedState,

        label:
            normalizedState
                .split("-")
                .map(
                    word =>
                        word
                            .charAt(0)
                            .toUpperCase() +
                        word.slice(1)
                )
                .join(" "),

        className:
            STATE_STYLES[
                styleKey
            ] ||
            STATE_STYLES.unknown
    };
}

function displayValue(
    value,
    fallback = "Not available"
) {
    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return fallback;
    }

    return String(
        value
    );
}

function formatDateTime(
    value
) {
    if (!value) {
        return "Not available";
    }

    const date =
        new Date(
            value
        );

    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
        return "Not available";
    }

    return date.toLocaleString();
}

function SummaryCard({
    icon: Icon,
    label,
    value,
    accentClass =
        "text-cyan-300"
}) {
    return (
        <div
            className="
                rounded-2xl border
                border-slate-800
                bg-slate-950/40
                p-5
            "
        >
            <div
                className="
                    flex items-center
                    gap-3 text-sm
                    text-slate-400
                "
            >
                <Icon
                    size={18}
                    className={
                        accentClass
                    }
                />

                <span>
                    {label}
                </span>
            </div>

            <p
                className="
                    mt-3 break-words
                    text-2xl font-bold
                    text-white
                "
            >
                {value}
            </p>
        </div>
    );
}

function DetailItem({
    label,
    value
}) {
    return (
        <div
            className="
                min-w-0 rounded-xl
                bg-slate-950/40
                px-4 py-3
            "
        >
            <dt
                className="
                    text-xs font-medium
                    uppercase
                    tracking-wide
                    text-slate-500
                "
            >
                {label}
            </dt>

            <dd
                className="
                    mt-1 break-all
                    text-sm font-semibold
                    text-slate-200
                "
            >
                {displayValue(
                    value
                )}
            </dd>
        </div>
    );
}

function InstanceCard({
    instance
}) {
    const stateDetails =
        getStateDetails(
            instance?.state
        );

    const instanceName =
        instance?.name ||
        instance?.instanceId ||
        "Unnamed EC2 instance";

    return (
        <article
            className="
                rounded-2xl border
                border-slate-800
                bg-slate-900/50
                p-5
            "
        >
            <div
                className="
                    flex flex-col gap-4
                    lg:flex-row
                    lg:items-start
                    lg:justify-between
                "
            >
                <div
                    className="
                        flex min-w-0
                        items-start gap-3
                    "
                >
                    <div
                        className="
                            flex h-11 w-11
                            shrink-0 items-center
                            justify-center
                            rounded-xl
                            bg-orange-500/10
                        "
                    >
                        <Server
                            size={21}
                            className="
                                text-orange-300
                            "
                        />
                    </div>

                    <div
                        className="
                            min-w-0
                        "
                    >
                        <h3
                            className="
                                truncate text-lg
                                font-bold text-white
                            "
                        >
                            {instanceName}
                        </h3>

                        <p
                            className="
                                mt-1 break-all
                                font-mono text-xs
                                text-cyan-300
                            "
                        >
                            {
                                instance?.instanceId ||
                                "Instance ID unavailable"
                            }
                        </p>
                    </div>
                </div>

                <span
                    className={`
                        inline-flex w-fit
                        items-center
                        rounded-full border
                        px-3 py-1
                        text-xs font-bold
                        ${stateDetails.className}
                    `}
                >
                    {stateDetails.label}
                </span>
            </div>

            <dl
                className="
                    mt-5 grid gap-3
                    sm:grid-cols-2
                    xl:grid-cols-4
                "
            >
                <DetailItem
                    label="Instance type"
                    value={
                        instance?.instanceType
                    }
                />

                <DetailItem
                    label="Availability zone"
                    value={
                        instance?.availabilityZone
                    }
                />

                <DetailItem
                    label="Private IP"
                    value={
                        instance?.privateIpAddress
                    }
                />

                <DetailItem
                    label="Public IP"
                    value={
                        instance?.publicIpAddress
                    }
                />

                <DetailItem
                    label="VPC"
                    value={
                        instance?.vpcId
                    }
                />

                <DetailItem
                    label="Subnet"
                    value={
                        instance?.subnetId
                    }
                />

                <DetailItem
                    label="Platform"
                    value={
                        instance?.platformDetails
                    }
                />

                <DetailItem
                    label="Monitoring"
                    value={
                        instance?.monitoringState
                    }
                />
            </dl>

            <div
                className="
                    mt-4 flex items-center
                    gap-2 text-xs
                    text-slate-500
                "
            >
                <Clock3
                    size={14}
                />

                <span>
                    Launched{" "}
                    {formatDateTime(
                        instance?.launchTime
                    )}
                </span>
            </div>
        </article>
    );
}

function LoadingState() {
    return (
        <div
            role="status"
            className="
                rounded-2xl border
                border-cyan-500/20
                bg-cyan-500/5
                px-6 py-10
                text-center
            "
        >
            <RefreshCw
                size={28}
                className="
                    mx-auto animate-spin
                    text-cyan-300
                "
            />

            <p
                className="
                    mt-4 font-semibold
                    text-white
                "
            >
                Loading live EC2 inventory
            </p>

            <p
                className="
                    mt-2 text-sm
                    text-slate-400
                "
            >
                Minerva is securely assuming
                the read-only IAM role.
            </p>
        </div>
    );
}

export default function AWSEC2Inventory({
    inventory = null,
    loading = false,
    refreshing = false,
    error = "",
    onRefresh
}) {
    const instances =
        Array.isArray(
            inventory?.instances
        )
            ? inventory.instances
            : [];

    const summary =
        inventory?.summary || {};

    const totalInstances =
        Number.isFinite(
            Number(
                summary.total
            )
        )
            ? Number(
                summary.total
            )
            : instances.length;

    const runningInstances =
        Number(
            summary.running || 0
        );

    const stoppedInstances =
        Number(
            summary.stopped || 0
        );

    const refreshDisabled =
        loading ||
        refreshing ||
        typeof onRefresh !==
            "function";

    return (
        <section
            className="
                rounded-3xl border
                border-slate-800
                bg-[#111827]
                p-6 shadow-xl
                shadow-black/20
                md:p-8
            "
        >
            <div
                className="
                    flex flex-col gap-5
                    lg:flex-row
                    lg:items-start
                    lg:justify-between
                "
            >
                <div>
                    <p
                        className="
                            text-sm font-bold
                            uppercase
                            tracking-[0.22em]
                            text-cyan-400
                        "
                    >
                        Live AWS resources
                    </p>

                    <h2
                        className="
                            mt-2 text-3xl
                            font-black text-white
                        "
                    >
                        EC2 Inventory
                    </h2>

                    <p
                        className="
                            mt-2 max-w-3xl
                            text-slate-400
                        "
                    >
                        Live instances returned
                        through temporary,
                        server-side AWS
                        credentials.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={
                        onRefresh
                    }
                    disabled={
                        refreshDisabled
                    }
                    className="
                        inline-flex items-center
                        justify-center gap-2
                        rounded-xl border
                        border-cyan-500/30
                        bg-cyan-500/10
                        px-4 py-3
                        font-semibold
                        text-cyan-200
                        transition
                        hover:bg-cyan-500/20
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                    "
                >
                    <RefreshCw
                        size={17}
                        className={
                            refreshing
                                ? "animate-spin"
                                : ""
                        }
                    />

                    {
                        refreshing
                            ? "Refreshing..."
                            : "Refresh inventory"
                    }
                </button>
            </div>

            {
                error && (
                    <div
                        role="alert"
                        className="
                            mt-6 flex gap-3
                            rounded-2xl border
                            border-rose-500/30
                            bg-rose-500/10
                            p-5 text-rose-200
                        "
                    >
                        <AlertTriangle
                            size={20}
                            className="
                                mt-0.5 shrink-0
                            "
                        />

                        <div>
                            <p
                                className="
                                    font-bold
                                "
                            >
                                Unable to load
                                EC2 inventory
                            </p>

                            <p
                                className="
                                    mt-1 text-sm
                                    leading-6
                                "
                            >
                                {error}
                            </p>
                        </div>
                    </div>
                )
            }

            {
                loading &&
                !inventory
                    ? (
                        <div
                            className="
                                mt-6
                            "
                        >
                            <LoadingState />
                        </div>
                    )
                    : inventory
                        ? (
                            <>
                                <div
                                    className="
                                        mt-6 grid
                                        gap-4
                                        sm:grid-cols-2
                                        xl:grid-cols-4
                                    "
                                >
                                    <SummaryCard
                                        icon={
                                            Server
                                        }
                                        label="Total instances"
                                        value={
                                            totalInstances
                                        }
                                    />

                                    <SummaryCard
                                        icon={
                                            CheckCircle2
                                        }
                                        label="Running"
                                        value={
                                            runningInstances
                                        }
                                        accentClass="
                                            text-emerald-300
                                        "
                                    />

                                    <SummaryCard
                                        icon={
                                            Activity
                                        }
                                        label="Stopped"
                                        value={
                                            stoppedInstances
                                        }
                                        accentClass="
                                            text-slate-300
                                        "
                                    />

                                    <SummaryCard
                                        icon={
                                            MapPin
                                        }
                                        label="AWS region"
                                        value={
                                            displayValue(
                                                inventory.region
                                            )
                                        }
                                    />
                                </div>

                                <div
                                    className="
                                        mt-6 flex
                                        flex-col gap-2
                                        rounded-2xl
                                        border
                                        border-slate-800
                                        bg-slate-950/30
                                        px-5 py-4
                                        text-sm
                                        text-slate-400
                                        sm:flex-row
                                        sm:items-center
                                        sm:justify-between
                                    "
                                >
                                    <div
                                        className="
                                            flex items-center
                                            gap-2
                                        "
                                    >
                                        <ShieldCheck
                                            size={17}
                                            className="
                                                text-emerald-300
                                            "
                                        />

                                        <span>
                                            Verified account{" "}
                                            <strong
                                                className="
                                                    text-slate-200
                                                "
                                            >
                                                {
                                                    displayValue(
                                                        inventory.accountId
                                                    )
                                                }
                                            </strong>
                                        </span>
                                    </div>

                                    <span>
                                        Collected{" "}
                                        {
                                            formatDateTime(
                                                inventory.collectedAt
                                            )
                                        }
                                    </span>
                                </div>

                                {
                                    instances.length > 0
                                        ? (
                                            <div
                                                className="
                                                    mt-6 grid
                                                    gap-4
                                                "
                                            >
                                                {
                                                    instances.map(
                                                        instance => (
                                                            <InstanceCard
                                                                key={
                                                                    instance.instanceId
                                                                }
                                                                instance={
                                                                    instance
                                                                }
                                                            />
                                                        )
                                                    )
                                                }
                                            </div>
                                        )
                                        : (
                                            <div
                                                className="
                                                    mt-6 rounded-2xl
                                                    border
                                                    border-slate-800
                                                    bg-slate-950/30
                                                    px-6 py-10
                                                    text-center
                                                "
                                            >
                                                <Server
                                                    size={30}
                                                    className="
                                                        mx-auto
                                                        text-slate-500
                                                    "
                                                />

                                                <p
                                                    className="
                                                        mt-4
                                                        font-semibold
                                                        text-white
                                                    "
                                                >
                                                    No EC2 instances
                                                    found
                                                </p>

                                                <p
                                                    className="
                                                        mt-2 text-sm
                                                        text-slate-400
                                                    "
                                                >
                                                    No instances were
                                                    returned from this
                                                    AWS region.
                                                </p>
                                            </div>
                                        )
                                }
                            </>
                        )
                        : (
                            !error && (
                                <div
                                    className="
                                        mt-6 rounded-2xl
                                        border
                                        border-slate-800
                                        bg-slate-950/30
                                        px-6 py-10
                                        text-center
                                        text-slate-400
                                    "
                                >
                                    EC2 inventory is
                                    not available yet.
                                </div>
                            )
                        )
            }
        </section>
    );
}