import {
    AlertTriangle,
    Cloud,
    Loader2,
    MapPin,
    RefreshCw,
    Settings2,
    ShieldCheck,
    Trash2,
    Unplug
} from "lucide-react";

const STATUS_STYLES = {
    CONNECTED:
        "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",

    PENDING:
        "border-amber-500/30 bg-amber-500/10 text-amber-300",

    ERROR:
        "border-red-500/30 bg-red-500/10 text-red-300",

    DISCONNECTED:
        "border-slate-600 bg-slate-800 text-slate-300"
};

const ACTION_STYLES = {
    neutral:
        "border-slate-700 text-slate-200 hover:border-cyan-500 hover:text-cyan-300",

    primary:
        "border-blue-500/40 bg-blue-500/10 text-blue-300 hover:bg-blue-500/20",

    warning:
        "border-amber-500/40 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20",

    danger:
        "border-red-500/40 bg-red-500/10 text-red-300 hover:bg-red-500/20"
};

function getStatus(
    connection
) {
    const status =
        String(
            connection?.status || "PENDING"
        ).toUpperCase();

    return STATUS_STYLES[status]
        ? status
        : "PENDING";
}

function formatDate(
    value
) {
    if (!value) {
        return "Never";
    }

    const date =
        new Date(value);

    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
        return "Never";
    }

    return date.toLocaleString();
}

function ActionButton({
    icon: Icon,
    label,
    tone = "neutral",
    loading = false,
    disabled = false,
    onClick
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={
                disabled ||
                loading
            }
            className={`
                inline-flex items-center
                justify-center gap-2
                rounded-lg border
                px-3 py-2
                text-xs font-semibold
                transition
                disabled:cursor-not-allowed
                disabled:opacity-50
                ${ACTION_STYLES[tone]}
            `}
        >
            {
                loading
                    ? (
                        <Loader2
                            size={15}
                            className="animate-spin"
                        />
                    )
                    : (
                        <Icon
                            size={15}
                        />
                    )
            }

            {label}
        </button>
    );
}

function confirmDisconnect(
    connection,
    onDisconnect
) {
    const confirmed =
        window.confirm(
            `Disconnect "${connection.name}"?\n\n` +
            "Minerva will preserve its configuration and " +
            "verification history. The IAM role will remain in AWS."
        );

    if (confirmed) {
        onDisconnect?.(
            connection.id
        );
    }
}

function confirmDelete(
    connection,
    onDelete
) {
    const confirmed =
        window.confirm(
            `Delete "${connection.name}" permanently?\n\n` +
            "This removes the saved connection from Minerva. " +
            "It does not delete the IAM role from AWS."
        );

    if (confirmed) {
        onDelete?.(
            connection.id
        );
    }
}

export default function AWSConnectionsList({
    connections = [],
    selectedConnectionId = null,
    busyAction = null,
    onSelect,
    onVerify,
    onDisconnect,
    onDelete
}) {
    const savedConnections =
        Array.isArray(
            connections
        )
            ? connections
            : [];

    const actionsLocked =
        Boolean(
            busyAction
        );

    return (
        <section
            className="
                rounded-3xl border border-slate-800
                bg-slate-900 p-5 sm:p-6
            "
        >
            <div
                className="
                    mb-5 flex flex-col gap-3
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                "
            >
                <div>
                    <h2
                        className="
                            text-2xl font-bold
                            text-white
                        "
                    >
                        Your AWS connections
                    </h2>

                    <p
                        className="
                            mt-1 text-sm
                            text-slate-400
                        "
                    >
                        Manage AWS accounts saved
                        under your Minerva account.
                    </p>
                </div>

                <span
                    className="
                        w-fit rounded-full
                        border border-slate-700
                        bg-slate-950/50
                        px-3 py-1.5
                        text-xs font-semibold
                        text-slate-300
                    "
                >
                    {savedConnections.length}
                    {" "}
                    saved
                </span>
            </div>

            {
                savedConnections.length === 0
                    ? (
                        <div
                            className="
                                flex flex-col items-center
                                justify-center
                                rounded-2xl
                                border border-dashed
                                border-slate-700
                                bg-slate-950/30
                                px-6 py-10
                                text-center
                            "
                        >
                            <div
                                className="
                                    flex h-12 w-12
                                    items-center justify-center
                                    rounded-2xl
                                    bg-orange-500/10
                                "
                            >
                                <Cloud
                                    size={24}
                                    className="text-orange-400"
                                />
                            </div>

                            <h3
                                className="
                                    mt-4 font-semibold
                                    text-white
                                "
                            >
                                No saved AWS connections
                            </h3>

                            <p
                                className="
                                    mt-2 max-w-md
                                    text-sm leading-6
                                    text-slate-400
                                "
                            >
                                Use the connection form above
                                to add your first read-only AWS
                                IAM role.
                            </p>
                        </div>
                    )
                    : (
                        <div className="space-y-4">
                            {
                                savedConnections.map(
                                    connection => {
                                        const status =
                                            getStatus(
                                                connection
                                            );

                                        const selected =
                                            Number(
                                                selectedConnectionId
                                            ) ===
                                            Number(
                                                connection.id
                                            );

                                        const verifying =
                                            busyAction?.type ===
                                                "verify" &&
                                            busyAction
                                                ?.connectionId ===
                                                connection.id;

                                        const disconnecting =
                                            busyAction?.type ===
                                                "disconnect" &&
                                            busyAction
                                                ?.connectionId ===
                                                connection.id;

                                        const deleting =
                                            busyAction?.type ===
                                                "delete" &&
                                            busyAction
                                                ?.connectionId ===
                                                connection.id;

                                        return (
                                            <article
                                                key={
                                                    connection.id
                                                }
                                                className={`
                                                    rounded-2xl
                                                    border p-5
                                                    transition
                                                    ${
                                                        selected
                                                            ? "border-cyan-500/60 bg-cyan-500/5"
                                                            : "border-slate-800 bg-slate-950/30"
                                                    }
                                                `}
                                            >
                                                <div
                                                    className="
                                                        flex flex-col
                                                        gap-4
                                                        lg:flex-row
                                                        lg:items-start
                                                        lg:justify-between
                                                    "
                                                >
                                                    <div
                                                        className="
                                                            min-w-0
                                                        "
                                                    >
                                                        <div
                                                            className="
                                                                flex
                                                                flex-wrap
                                                                items-center
                                                                gap-3
                                                            "
                                                        >
                                                            <h3
                                                                className="
                                                                    text-lg
                                                                    font-semibold
                                                                    text-white
                                                                "
                                                            >
                                                                {
                                                                    connection
                                                                        .name
                                                                }
                                                            </h3>

                                                            <span
                                                                className={`
                                                                    rounded-full
                                                                    border
                                                                    px-2.5
                                                                    py-1
                                                                    text-xs
                                                                    font-bold
                                                                    ${
                                                                        STATUS_STYLES[
                                                                            status
                                                                        ]
                                                                    }
                                                                `}
                                                            >
                                                                {status}
                                                            </span>
                                                        </div>

                                                        <code
                                                            className="
                                                                mt-3 block
                                                                break-all
                                                                text-xs
                                                                leading-5
                                                                text-slate-400
                                                            "
                                                        >
                                                            {
                                                                connection
                                                                    .roleArn
                                                            }
                                                        </code>
                                                    </div>

                                                    <div
                                                        className="
                                                            flex
                                                            flex-wrap
                                                            gap-2
                                                        "
                                                    >
                                                        <ActionButton
                                                            icon={
                                                                Settings2
                                                            }
                                                            label={
                                                                status ===
                                                                "CONNECTED"
                                                                    ? "Details"
                                                                    : "Setup"
                                                            }
                                                            disabled={
                                                                actionsLocked
                                                            }
                                                            onClick={
                                                                () =>
                                                                    onSelect?.(
                                                                        connection
                                                                            .id
                                                                    )
                                                            }
                                                        />

                                                        <ActionButton
                                                            icon={
                                                                RefreshCw
                                                            }
                                                            label={
                                                                status ===
                                                                "CONNECTED"
                                                                    ? "Verify again"
                                                                    : status ===
                                                                        "ERROR"
                                                                        ? "Retry verify"
                                                                        : "Verify"
                                                            }
                                                            tone="primary"
                                                            loading={
                                                                verifying
                                                            }
                                                            disabled={
                                                                actionsLocked &&
                                                                !verifying
                                                            }
                                                            onClick={
                                                                () =>
                                                                    onVerify?.(
                                                                        connection
                                                                            .id
                                                                    )
                                                            }
                                                        />

                                                        {
                                                            status ===
                                                                "CONNECTED" && (
                                                                <ActionButton
                                                                    icon={
                                                                        Unplug
                                                                    }
                                                                    label="Disconnect"
                                                                    tone="warning"
                                                                    loading={
                                                                        disconnecting
                                                                    }
                                                                    disabled={
                                                                        actionsLocked &&
                                                                        !disconnecting
                                                                    }
                                                                    onClick={
                                                                        () =>
                                                                            confirmDisconnect(
                                                                                connection,
                                                                                onDisconnect
                                                                            )
                                                                    }
                                                                />
                                                            )
                                                        }

                                                        <ActionButton
                                                            icon={
                                                                Trash2
                                                            }
                                                            label="Delete"
                                                            tone="danger"
                                                            loading={
                                                                deleting
                                                            }
                                                            disabled={
                                                                actionsLocked &&
                                                                !deleting
                                                            }
                                                            onClick={
                                                                () =>
                                                                    confirmDelete(
                                                                        connection,
                                                                        onDelete
                                                                    )
                                                            }
                                                        />
                                                    </div>
                                                </div>

                                                <div
                                                    className="
                                                        mt-5 grid
                                                        gap-3
                                                        sm:grid-cols-3
                                                    "
                                                >
                                                    <div
                                                        className="
                                                            rounded-xl
                                                            bg-slate-900/70
                                                            p-3
                                                        "
                                                    >
                                                        <div
                                                            className="
                                                                flex
                                                                items-center
                                                                gap-2
                                                                text-xs
                                                                text-slate-500
                                                            "
                                                        >
                                                            <MapPin
                                                                size={14}
                                                            />

                                                            Region
                                                        </div>

                                                        <p
                                                            className="
                                                                mt-2
                                                                text-sm
                                                                font-semibold
                                                                text-slate-200
                                                            "
                                                        >
                                                            {
                                                                connection
                                                                    .region
                                                            }
                                                        </p>
                                                    </div>

                                                    <div
                                                        className="
                                                            rounded-xl
                                                            bg-slate-900/70
                                                            p-3
                                                        "
                                                    >
                                                        <div
                                                            className="
                                                                flex
                                                                items-center
                                                                gap-2
                                                                text-xs
                                                                text-slate-500
                                                            "
                                                        >
                                                            <ShieldCheck
                                                                size={14}
                                                            />

                                                            Verified account
                                                        </div>

                                                        <p
                                                            className="
                                                                mt-2
                                                                text-sm
                                                                font-semibold
                                                                text-slate-200
                                                            "
                                                        >
                                                            {
                                                                connection
                                                                    .accountId ||
                                                                "Not verified"
                                                            }
                                                        </p>
                                                    </div>

                                                    <div
                                                        className="
                                                            rounded-xl
                                                            bg-slate-900/70
                                                            p-3
                                                        "
                                                    >
                                                        <p
                                                            className="
                                                                text-xs
                                                                text-slate-500
                                                            "
                                                        >
                                                            Last checked
                                                        </p>

                                                        <p
                                                            className="
                                                                mt-2
                                                                text-sm
                                                                font-semibold
                                                                text-slate-200
                                                            "
                                                        >
                                                            {
                                                                formatDate(
                                                                    connection
                                                                        .lastCheckedAt
                                                                )
                                                            }
                                                        </p>
                                                    </div>
                                                </div>

                                                {
                                                    status ===
                                                        "ERROR" &&
                                                    connection
                                                        .lastError && (
                                                        <div
                                                            className="
                                                                mt-4
                                                                flex
                                                                items-start
                                                                gap-2
                                                                rounded-xl
                                                                border
                                                                border-red-500/30
                                                                bg-red-500/10
                                                                p-3
                                                                text-sm
                                                                text-red-200
                                                            "
                                                        >
                                                            <AlertTriangle
                                                                size={17}
                                                                className="
                                                                    mt-0.5
                                                                    shrink-0
                                                                "
                                                            />

                                                            {
                                                                connection
                                                                    .lastError
                                                            }
                                                        </div>
                                                    )
                                                }

                                                {
                                                    status ===
                                                        "DISCONNECTED" && (
                                                        <p
                                                            className="
                                                                mt-4
                                                                text-sm
                                                                text-slate-400
                                                            "
                                                        >
                                                            Configuration
                                                            preserved. Open
                                                            Setup and verify
                                                            again to reconnect.
                                                        </p>
                                                    )
                                                }
                                            </article>
                                        );
                                    }
                                )
                            }
                        </div>
                    )
            }
        </section>
    );
}
