import { useCallback, useEffect, useRef, useState } from "react";
import {
    AlertTriangle,
    Check,
    Clock3,
    Copy,
    KeyRound,
    LoaderCircle,
    RefreshCw,
    Server,
    ShieldCheck,
    Terminal,
    Trash2,
    Unplug,
    WifiOff,
    X
} from "lucide-react";
import {
    createHostConnection,
    deleteHostConnection,
    disconnectHostConnection,
    getHostConnections
} from "../../services/host.service";

const IMAGE =
    "ghcr.io/semicrypt/minerva-sentinel-agent:latest";

const STEP_INFO = [
    [
        "pull",
        "Download the agent image (optional)",
        "Docker can download the public Host Agent image before it starts."
    ],
    [
        "run",
        "Start the private Host Agent",
        "Run the generated Docker command containing this connection’s private key."
    ],
    [
        "logs",
        "Verify host uploads",
        "Watch the logs until Minerva reports “Host metrics uploaded.”"
    ],
    [
        "stop",
        "Stop and remove the agent",
        "Use the cleanup command later, then revoke the key with Disconnect."
    ]
];

function apiDefault() {
    const configured =
        String(
            import.meta.env.VITE_AGENT_API_URL || ""
        ).trim();

    if (configured) {
        return configured.replace(
            /\/+$/,
            ""
        );
    }

    if (
        typeof window ===
        "undefined"
    ) {
        return "/api";
    }

    const {
        hostname,
        origin
    } = window.location;

    return (
        hostname === "localhost" ||
        hostname === "127.0.0.1"
    )
        ? "http://host.docker.internal:5000/api"
        : `${origin}/api`;
}

function quote(value) {
    return `'${String(value).replace(
        /'/g,
        `'"'"'`
    )}'`;
}

function message(
    error,
    fallback
) {
    return (
        error?.response?.data?.message ||
        error?.message ||
        fallback
    );
}

function createData(response) {
    const body =
        response?.data ??
        response;

    return body?.data ?? body;
}

function listData(response) {
    const body =
        response?.data ??
        response;

    const data =
        body?.data ??
        body;

    return Array.isArray(data)
        ? data
        : [];
}

async function copyValue(value) {
    if (
        navigator.clipboard?.writeText
    ) {
        try {
            await navigator.clipboard.writeText(
                value
            );

            return;
        } catch {
            // Use the textarea fallback.
        }
    }

    const node =
        document.createElement(
            "textarea"
        );

    node.value = value;
    node.style.position = "fixed";
    node.style.opacity = "0";

    document.body.appendChild(node);

    node.focus();
    node.select();

    const copied =
        document.execCommand(
            "copy"
        );

    node.remove();

    if (!copied) {
        throw new Error(
            "Clipboard copy failed."
        );
    }
}

function statusOf(connection) {
    const saved =
        String(
            connection?.status ||
            "PENDING"
        ).toUpperCase();

    if (
        saved === "DISCONNECTED" ||
        !connection?.lastSeen
    ) {
        return saved;
    }

    const lastSeen =
        new Date(
            connection.lastSeen
        ).getTime();

    return (
        Number.isFinite(lastSeen) &&
        Date.now() - lastSeen > 45000
    )
        ? "OFFLINE"
        : saved;
}

function dateOf(value) {
    if (!value) {
        return "Not connected yet";
    }

    const date =
        new Date(value);

    return Number.isNaN(
        date.getTime()
    )
        ? "Unknown"
        : date.toLocaleString();
}

function Badge({
    status
}) {
    const color = {
        ONLINE:
            "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",

        OFFLINE:
            "border-amber-500/30 bg-amber-500/10 text-amber-300",

        DISCONNECTED:
            "border-red-500/30 bg-red-500/10 text-red-300",

        PENDING:
            "border-blue-500/30 bg-blue-500/10 text-blue-300"
    };

    return (
        <span
            className={`
                shrink-0
                rounded-full
                border
                px-2.5
                py-1
                text-[11px]
                font-semibold
                ${
                    color[status] ||
                    color.PENDING
                }
            `}
        >
            {status}
        </span>
    );
}

function commandsFor(
    connection,
    key,
    apiUrl
) {
    const url =
        apiUrl
            .trim()
            .replace(
                /\/+$/,
                ""
            );

    if (
        !connection ||
        !key ||
        !url
    ) {
        return null;
    }

    const id =
        String(
            connection.id
        ).replace(
            /[^a-zA-Z0-9_.-]/g,
            "-"
        );

    const container =
        `minerva-host-agent-${id}`;

    return {
        pull:
            `docker pull ${IMAGE}`,

        run: [
            "docker run -d \\",
            `  --name ${container} \\`,
            "  --restart unless-stopped \\",
            "  --add-host=host.docker.internal:host-gateway \\",
            "  --pid=host \\",
            "  --cgroupns=host \\",
            "  -e MINERVA_AGENT_MODE=host \\",
            `  -e MINERVA_API_URL=${quote(url)} \\`,
            `  -e MINERVA_AGENT_KEY=${quote(key)} \\`,
            `  -e MINERVA_HOSTNAME=${quote(connection.name)} \\`,
            "  -e MINERVA_HOST_ROOT=/hostfs \\",
            "  -e INTERVAL=10000 \\",
            "  -v /:/hostfs:ro \\",
            `  ${IMAGE}`
        ].join("\n"),

        logs:
            `docker logs -f ${container}`,

        stop:
            `docker stop ${container}\n` +
            `docker rm ${container}`
    };
}

function TerminalBlock({
    id,
    value,
    copied,
    onCopy
}) {
    return (
        <div
            className="
                mt-3
                overflow-hidden
                rounded-xl
                border
                border-slate-700
                bg-slate-950/80
            "
        >
            <div
                className="
                    flex
                    items-center
                    justify-between
                    border-b
                    border-slate-800
                    px-4
                    py-2
                "
            >
                <span
                    className="
                        text-xs
                        font-semibold
                        uppercase
                        tracking-wider
                        text-slate-500
                    "
                >
                    Terminal
                </span>

                <button
                    type="button"
                    onClick={() =>
                        onCopy(
                            id,
                            value
                        )
                    }
                    className="
                        inline-flex
                        items-center
                        gap-2
                        text-xs
                        font-semibold
                        text-cyan-400
                        hover:text-cyan-300
                    "
                >
                    {
                        copied === id
                            ? <Check size={15} />
                            : <Copy size={15} />
                    }

                    {
                        copied === id
                            ? "Copied"
                            : "Copy"
                    }
                </button>
            </div>

            <pre
                className="
                    overflow-x-auto
                    whitespace-pre
                    p-4
                    text-sm
                    leading-6
                    text-slate-300
                "
            >
                <code>
                    {value}
                </code>
            </pre>
        </div>
    );
}

function StepPreview() {
    return (
        <>
            <div
                className="
                    mt-5
                    flex
                    items-start
                    gap-3
                    rounded-xl
                    border
                    border-cyan-500/25
                    bg-cyan-500/5
                    p-4
                "
            >
                <KeyRound
                    size={19}
                    className="
                        mt-0.5
                        shrink-0
                        text-cyan-400
                    "
                />

                <div>
                    <p
                        className="
                            font-semibold
                            text-cyan-200
                        "
                    >
                        Create an agent key to show the commands
                    </p>

                    <p
                        className="
                            mt-1
                            text-sm
                            leading-6
                            text-slate-400
                        "
                    >
                        Minerva inserts the private key into the Docker command automatically.
                    </p>
                </div>
            </div>

            <div
                className="
                    mt-5
                    space-y-3
                "
            >
                {
                    STEP_INFO.map(
                        (
                            [
                                id,
                                title,
                                description
                            ],
                            index
                        ) => (
                            <div
                                key={id}
                                className="
                                    flex
                                    items-start
                                    gap-3
                                    rounded-xl
                                    border
                                    border-slate-800
                                    bg-slate-950/45
                                    p-4
                                "
                            >
                                <span
                                    className="
                                        flex
                                        h-8
                                        w-8
                                        shrink-0
                                        items-center
                                        justify-center
                                        rounded-full
                                        bg-cyan-500/10
                                        text-sm
                                        font-bold
                                        text-cyan-300
                                    "
                                >
                                    {index + 1}
                                </span>

                                <div>
                                    <h4
                                        className="
                                            font-bold
                                            text-white
                                        "
                                    >
                                        {title}
                                    </h4>

                                    <p
                                        className="
                                            mt-1
                                            text-sm
                                            leading-5
                                            text-slate-400
                                        "
                                    >
                                        {description}
                                    </p>
                                </div>
                            </div>
                        )
                    )
                }
            </div>
        </>
    );
}

export default function AddHostModal({
    open,
    onClose,
    onHostsChanged
}) {
    const [
        name,
        setName
    ] = useState("");

    const [
        apiUrl,
        setApiUrl
    ] = useState(apiDefault);

    const [
        connections,
        setConnections
    ] = useState([]);

    const [
        created,
        setCreated
    ] = useState(null);

    const [
        loading,
        setLoading
    ] = useState(false);

    const [
        refreshing,
        setRefreshing
    ] = useState(false);

    const [
        creating,
        setCreating
    ] = useState(false);

    const [
        busy,
        setBusy
    ] = useState("");

    const [
        copied,
        setCopied
    ] = useState("");

    const [
        error,
        setError
    ] = useState("");

    const [
        notice,
        setNotice
    ] = useState("");

    const createdRef =
        useRef(null);

    const closeRef =
        useRef(onClose);

    const timerRef =
        useRef(null);

    const guideRef =
        useRef(null);

    useEffect(
        () => {
            closeRef.current =
                onClose;
        },
        [onClose]
    );

    const clearCreated =
        useCallback(
            () => {
                createdRef.current =
                    null;

                setCreated(null);
            },
            []
        );

    const close =
        useCallback(
            () => {
                if (
                    createdRef
                        .current
                        ?.agentKey &&
                    !window.confirm(
                        "This one-time private key cannot be displayed again after closing. Close anyway?"
                    )
                ) {
                    return;
                }

                clearCreated();
                setName("");
                setError("");
                setNotice("");
                setCopied("");

                closeRef
                    .current
                    ?.();
            },
            [clearCreated]
        );

    const load =
        useCallback(
            async (
                mode = "silent"
            ) => {
                if (
                    mode ===
                    "initial"
                ) {
                    setLoading(true);
                }

                if (
                    mode ===
                    "manual"
                ) {
                    setRefreshing(true);
                }

                try {
                    setConnections(
                        listData(
                            await getHostConnections()
                        )
                    );
                } catch (
                    requestError
                ) {
                    if (
                        mode !==
                        "silent"
                    ) {
                        setError(
                            message(
                                requestError,
                                "Unable to load host connections."
                            )
                        );
                    }
                } finally {
                    if (
                        mode ===
                        "initial"
                    ) {
                        setLoading(false);
                    }

                    if (
                        mode ===
                        "manual"
                    ) {
                        setRefreshing(false);
                    }
                }
            },
            []
        );

    useEffect(
        () => {
            if (!open) {
                clearCreated();
                return undefined;
            }

            setError("");
            setNotice("");
            setName("");
            setCopied("");

            load("initial");

            const interval =
                window.setInterval(
                    () =>
                        load(
                            "silent"
                        ),
                    5000
                );

            const previousOverflow =
                document.body.style.overflow;

            document.body.style.overflow =
                "hidden";

            function onKeyDown(event) {
                if (
                    event.key ===
                    "Escape"
                ) {
                    close();
                }
            }

            window.addEventListener(
                "keydown",
                onKeyDown
            );

            return () => {
                window.clearInterval(
                    interval
                );

                window.removeEventListener(
                    "keydown",
                    onKeyDown
                );

                document.body.style.overflow =
                    previousOverflow;
            };
        },
        [
            open,
            clearCreated,
            close,
            load
        ]
    );

    useEffect(
        () => {
            if (!created) {
                return undefined;
            }

            const frame =
                window.requestAnimationFrame(
                    () =>
                        guideRef
                            .current
                            ?.scrollIntoView({
                                behavior:
                                    "smooth",
                                block:
                                    "start"
                            })
                );

            return () =>
                window.cancelAnimationFrame(
                    frame
                );
        },
        [created]
    );

    useEffect(
        () => () => {
            if (timerRef.current) {
                window.clearTimeout(
                    timerRef.current
                );
            }
        },
        []
    );

    const selected =
        created?.connection
            ? (
                connections.find(
                    item =>
                        String(
                            item.id
                        ) ===
                        String(
                            created
                                .connection
                                .id
                        )
                ) ||
                created.connection
            )
            : null;

    const commands =
        commandsFor(
            selected,
            created?.agentKey,
            apiUrl
        );

    async function copyText(
        id,
        value
    ) {
        try {
            await copyValue(value);
            setCopied(id);

            if (timerRef.current) {
                window.clearTimeout(
                    timerRef.current
                );
            }

            timerRef.current =
                window.setTimeout(
                    () => setCopied(""),
                    1600
                );
        } catch {
            setError(
                "Copy failed. Select the command and copy it manually."
            );
        }
    }

    async function create(event) {
        event.preventDefault();

        if (
            createdRef
                .current
                ?.agentKey
        ) {
            setError(
                "Save the current one-time key before creating another connection."
            );

            guideRef
                .current
                ?.scrollIntoView({
                    behavior:
                        "smooth",
                    block:
                        "start"
                });

            return;
        }

        const trimmed =
            name.trim();

        if (!trimmed) {
            setError(
                "Enter a name for this host connection."
            );

            return;
        }

        setCreating(true);
        setError("");
        setNotice("");

        try {
            const result =
                createData(
                    await createHostConnection(
                        trimmed
                    )
                );

            if (
                !result?.connection ||
                !result?.agentKey
            ) {
                throw new Error(
                    "The connection response did not include its one-time key."
                );
            }

            const credential = {
                connection:
                    result.connection,
                agentKey:
                    result.agentKey
            };

            createdRef.current =
                credential;

            setCreated(
                credential
            );

            setConnections(
                current => [
                    result.connection,

                    ...current.filter(
                        item =>
                            String(
                                item.id
                            ) !==
                            String(
                                result
                                    .connection
                                    .id
                            )
                    )
                ]
            );

            setName("");

            setNotice(
                "Private key created. The four complete commands are ready below."
            );

            void load(
                "silent"
            );

            onHostsChanged?.();
        } catch (
            requestError
        ) {
            setError(
                message(
                    requestError,
                    "Unable to create the host connection."
                )
            );
        } finally {
            setCreating(false);
        }
    }

    async function disconnect(
        connection
    ) {
        if (
            !window.confirm(
                `Disconnect ${connection.name}? Its key will be revoked, but saved data will remain.`
            )
        ) {
            return;
        }

        setBusy(
            `disconnect-${connection.id}`
        );

        setError("");

        try {
            await disconnectHostConnection(
                connection.id
            );

            if (
                String(
                    createdRef
                        .current
                        ?.connection
                        ?.id
                ) ===
                String(
                    connection.id
                )
            ) {
                clearCreated();
            }

            setNotice(
                `${connection.name} was disconnected.`
            );

            await load(
                "silent"
            );

            onHostsChanged?.();
        } catch (
            requestError
        ) {
            setError(
                message(
                    requestError,
                    "Unable to disconnect the host."
                )
            );
        } finally {
            setBusy("");
        }
    }

    async function remove(
        connection
    ) {
        if (
            !window.confirm(
                `Permanently delete ${connection.name} and its linked metric history?`
            )
        ) {
            return;
        }

        setBusy(
            `delete-${connection.id}`
        );

        setError("");

        try {
            await deleteHostConnection(
                connection.id
            );

            if (
                String(
                    createdRef
                        .current
                        ?.connection
                        ?.id
                ) ===
                String(
                    connection.id
                )
            ) {
                clearCreated();
            }

            setNotice(
                `${connection.name} was permanently deleted.`
            );

            await load(
                "silent"
            );

            onHostsChanged?.();
        } catch (
            requestError
        ) {
            setError(
                message(
                    requestError,
                    "Unable to delete the host connection."
                )
            );
        } finally {
            setBusy("");
        }
    }

    if (!open) {
        return null;
    }

    return (
        <div
            className="
                fixed
                inset-0
                z-50
                flex
                items-center
                justify-center
                bg-black/80
                p-3
                backdrop-blur-sm
                sm:p-5
            "
            role="dialog"
            aria-modal="true"
            aria-labelledby="host-modal-title"
        >
            <div
                className="
                    flex
                    h-[calc(100dvh-2rem)]
                    max-h-[900px]
                    w-full
                    max-w-7xl
                    flex-col
                    overflow-hidden
                    rounded-3xl
                    border
                    border-slate-800
                    bg-[#0b1220]
                    shadow-2xl
                    shadow-black/60
                "
            >
                <header
                    className="
                        flex
                        shrink-0
                        items-center
                        justify-between
                        gap-4
                        border-b
                        border-slate-800
                        px-5
                        py-4
                        sm:px-7
                    "
                >
                    <div
                        className="
                            flex
                            min-w-0
                            items-center
                            gap-4
                        "
                    >
                        <div
                            className="
                                flex
                                h-12
                                w-12
                                shrink-0
                                items-center
                                justify-center
                                rounded-2xl
                                bg-blue-500/10
                            "
                        >
                            <Server
                                size={24}
                                className="text-blue-400"
                            />
                        </div>

                        <div className="min-w-0">
                            <h2
                                id="host-modal-title"
                                className="
                                    truncate
                                    text-xl
                                    font-bold
                                    text-white
                                    sm:text-2xl
                                "
                            >
                                Connect Infrastructure Host
                            </h2>

                            <p
                                className="
                                    mt-1
                                    hidden
                                    text-sm
                                    text-slate-400
                                    sm:block
                                "
                            >
                                Create a private connection, then run the generated commands on the machine you want to monitor.
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={close}
                        className="
                            shrink-0
                            rounded-xl
                            p-2
                            text-slate-400
                            hover:bg-slate-800
                            hover:text-white
                        "
                        aria-label="Close add host window"
                    >
                        <X size={22} />
                    </button>
                </header>

                <main
                    className="
                        min-h-0
                        flex-1
                        overflow-y-auto
                        p-4
                        sm:p-6
                    "
                >
                    {
                        (error || notice) && (
                            <div
                                className="
                                    mb-4
                                    space-y-3
                                "
                                aria-live="polite"
                            >
                                {
                                    error && (
                                        <div
                                            className="
                                                flex
                                                items-start
                                                gap-3
                                                rounded-xl
                                                border
                                                border-red-500/20
                                                bg-red-500/10
                                                px-4
                                                py-3
                                                text-sm
                                                text-red-200
                                            "
                                        >
                                            <AlertTriangle
                                                size={18}
                                                className="
                                                    mt-0.5
                                                    shrink-0
                                                "
                                            />

                                            {error}
                                        </div>
                                    )
                                }

                                {
                                    notice && (
                                        <div
                                            className="
                                                flex
                                                items-start
                                                gap-3
                                                rounded-xl
                                                border
                                                border-emerald-500/20
                                                bg-emerald-500/10
                                                px-4
                                                py-3
                                                text-sm
                                                text-emerald-200
                                            "
                                        >
                                            <Check
                                                size={18}
                                                className="
                                                    mt-0.5
                                                    shrink-0
                                                "
                                            />

                                            {notice}
                                        </div>
                                    )
                                }
                            </div>
                        )
                    }

                    <div
                        className="
                            grid
                            items-start
                            gap-5
                            lg:grid-cols-[300px_minmax(0,1fr)]
                        "
                    >
                        <aside
                            className="
                                space-y-5
                                lg:sticky
                                lg:top-0
                            "
                        >
                            <section
                                className="
                                    rounded-2xl
                                    border
                                    border-slate-800
                                    bg-[#111827]
                                    p-5
                                "
                            >
                                <div
                                    className="
                                        flex
                                        items-center
                                        gap-3
                                    "
                                >
                                    <KeyRound
                                        size={22}
                                        className="text-cyan-400"
                                    />

                                    <h3
                                        className="
                                            text-xl
                                            font-bold
                                            text-white
                                        "
                                    >
                                        Create Connection
                                    </h3>
                                </div>

                                <form
                                    onSubmit={create}
                                    className="mt-5"
                                >
                                    <label
                                        htmlFor="host-name"
                                        className="
                                            text-sm
                                            font-semibold
                                            text-slate-300
                                        "
                                    >
                                        Connection name
                                    </label>

                                    <input
                                        id="host-name"
                                        value={name}
                                        onChange={
                                            event =>
                                                setName(
                                                    event
                                                        .target
                                                        .value
                                                )
                                        }
                                        maxLength={100}
                                        autoComplete="off"
                                        placeholder="Production Linux Host"
                                        className="
                                            mt-2
                                            h-11
                                            w-full
                                            rounded-xl
                                            border
                                            border-slate-700
                                            bg-slate-950/60
                                            px-4
                                            text-white
                                            outline-none
                                            placeholder:text-slate-600
                                            focus:border-cyan-500
                                        "
                                    />

                                    <button
                                        type="submit"
                                        disabled={
                                            creating ||
                                            !name.trim() ||
                                            Boolean(created)
                                        }
                                        className="
                                            mt-4
                                            inline-flex
                                            h-11
                                            w-full
                                            items-center
                                            justify-center
                                            gap-2
                                            rounded-xl
                                            bg-cyan-500
                                            px-4
                                            font-bold
                                            text-slate-950
                                            hover:bg-cyan-400
                                            disabled:cursor-not-allowed
                                            disabled:opacity-50
                                        "
                                    >
                                        {
                                            creating
                                                ? (
                                                    <LoaderCircle
                                                        size={18}
                                                        className="
                                                            animate-spin
                                                        "
                                                    />
                                                )
                                                : (
                                                    <KeyRound
                                                        size={18}
                                                    />
                                                )
                                        }

                                        {
                                            creating
                                                ? "Creating..."
                                                : created
                                                    ? "Key Ready"
                                                    : "Create Agent Key"
                                        }
                                    </button>
                                </form>

                                <p
                                    className="
                                        mt-3
                                        text-xs
                                        leading-5
                                        text-amber-200/70
                                    "
                                >
                                    The private key is shown once and kept while this modal remains open.
                                </p>
                            </section>

                            <section
                                className="
                                    rounded-2xl
                                    border
                                    border-slate-800
                                    bg-[#111827]
                                    p-5
                                "
                            >
                                <div
                                    className="
                                        flex
                                        items-start
                                        justify-between
                                        gap-3
                                    "
                                >
                                    <div>
                                        <h3
                                            className="
                                                text-xl
                                                font-bold
                                                text-white
                                            "
                                        >
                                            Your Connections
                                        </h3>

                                        <p
                                            className="
                                                mt-1
                                                text-sm
                                                text-slate-400
                                            "
                                        >
                                            Disconnect keeps data; Delete removes history.
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            load(
                                                "manual"
                                            )
                                        }
                                        disabled={
                                            refreshing
                                        }
                                        className="
                                            shrink-0
                                            rounded-xl
                                            border
                                            border-slate-700
                                            p-2.5
                                            text-slate-300
                                            hover:border-cyan-500/50
                                            hover:text-cyan-300
                                            disabled:opacity-50
                                        "
                                        aria-label="Refresh host connections"
                                    >
                                        <RefreshCw
                                            size={17}
                                            className={
                                                refreshing
                                                    ? "animate-spin"
                                                    : ""
                                            }
                                        />
                                    </button>
                                </div>

                                {
                                    loading &&
                                    !connections.length
                                        ? (
                                            <div
                                                className="
                                                    flex
                                                    min-h-24
                                                    items-center
                                                    justify-center
                                                    gap-2
                                                    text-sm
                                                    text-slate-400
                                                "
                                            >
                                                <LoaderCircle
                                                    size={19}
                                                    className="
                                                        animate-spin
                                                    "
                                                />

                                                Loading...
                                            </div>
                                        )
                                        : !connections.length
                                            ? (
                                                <div
                                                    className="
                                                        mt-4
                                                        flex
                                                        items-center
                                                        gap-3
                                                        rounded-xl
                                                        border
                                                        border-dashed
                                                        border-slate-700
                                                        px-4
                                                        py-4
                                                    "
                                                >
                                                    <WifiOff
                                                        size={24}
                                                        className="
                                                            shrink-0
                                                            text-slate-500
                                                        "
                                                    />

                                                    <div>
                                                        <p
                                                            className="
                                                                font-semibold
                                                                text-white
                                                            "
                                                        >
                                                            No host connections yet
                                                        </p>

                                                        <p
                                                            className="
                                                                mt-1
                                                                text-xs
                                                                text-slate-500
                                                            "
                                                        >
                                                            Create the first key above.
                                                        </p>
                                                    </div>
                                                </div>
                                            )
                                            : (
                                                <div
                                                    className="
                                                        mt-4
                                                        max-h-80
                                                        space-y-3
                                                        overflow-y-auto
                                                        pr-1
                                                    "
                                                >
                                                    {
                                                        connections.map(
                                                            connection => {
                                                                const status =
                                                                    statusOf(
                                                                        connection
                                                                    );

                                                                const disconnecting =
                                                                    busy ===
                                                                    `disconnect-${connection.id}`;

                                                                const deleting =
                                                                    busy ===
                                                                    `delete-${connection.id}`;

                                                                return (
                                                                    <article
                                                                        key={
                                                                            connection.id
                                                                        }
                                                                        className="
                                                                            rounded-xl
                                                                            border
                                                                            border-slate-800
                                                                            bg-slate-950/60
                                                                            p-4
                                                                        "
                                                                    >
                                                                        <div
                                                                            className="
                                                                                flex
                                                                                items-start
                                                                                justify-between
                                                                                gap-3
                                                                            "
                                                                        >
                                                                            <div
                                                                                className="
                                                                                    min-w-0
                                                                                "
                                                                            >
                                                                                <p
                                                                                    className="
                                                                                        truncate
                                                                                        font-bold
                                                                                        text-white
                                                                                    "
                                                                                >
                                                                                    {
                                                                                        connection.name
                                                                                    }
                                                                                </p>

                                                                                <p
                                                                                    className="
                                                                                        mt-1
                                                                                        flex
                                                                                        items-center
                                                                                        gap-2
                                                                                        text-xs
                                                                                        text-slate-500
                                                                                    "
                                                                                >
                                                                                    <Clock3
                                                                                        size={13}
                                                                                    />

                                                                                    Last seen: {
                                                                                        dateOf(
                                                                                            connection.lastSeen
                                                                                        )
                                                                                    }
                                                                                </p>

                                                                                {
                                                                                    connection.agentKeyHint && (
                                                                                        <p
                                                                                            className="
                                                                                                mt-1
                                                                                                text-xs
                                                                                                text-slate-600
                                                                                            "
                                                                                        >
                                                                                            Key: {
                                                                                                connection.agentKeyHint
                                                                                            }
                                                                                        </p>
                                                                                    )
                                                                                }
                                                                            </div>

                                                                            <Badge
                                                                                status={
                                                                                    status
                                                                                }
                                                                            />
                                                                        </div>

                                                                        <div
                                                                            className="
                                                                                mt-3
                                                                                flex
                                                                                flex-wrap
                                                                                gap-2
                                                                                border-t
                                                                                border-slate-800
                                                                                pt-3
                                                                            "
                                                                        >
                                                                            {
                                                                                status !==
                                                                                "DISCONNECTED" && (
                                                                                    <button
                                                                                        type="button"
                                                                                        onClick={() =>
                                                                                            disconnect(
                                                                                                connection
                                                                                            )
                                                                                        }
                                                                                        disabled={
                                                                                            Boolean(
                                                                                                busy
                                                                                            )
                                                                                        }
                                                                                        className="
                                                                                            inline-flex
                                                                                            items-center
                                                                                            gap-2
                                                                                            rounded-lg
                                                                                            border
                                                                                            border-amber-500/30
                                                                                            px-3
                                                                                            py-1.5
                                                                                            text-xs
                                                                                            font-semibold
                                                                                            text-amber-300
                                                                                            hover:bg-amber-500/10
                                                                                            disabled:opacity-50
                                                                                        "
                                                                                    >
                                                                                        {
                                                                                            disconnecting
                                                                                                ? (
                                                                                                    <LoaderCircle
                                                                                                        size={14}
                                                                                                        className="
                                                                                                            animate-spin
                                                                                                        "
                                                                                                    />
                                                                                                )
                                                                                                : (
                                                                                                    <Unplug
                                                                                                        size={14}
                                                                                                    />
                                                                                                )
                                                                                        }

                                                                                        Disconnect
                                                                                    </button>
                                                                                )
                                                                            }

                                                                            <button
                                                                                type="button"
                                                                                onClick={() =>
                                                                                    remove(
                                                                                        connection
                                                                                    )
                                                                                }
                                                                                disabled={
                                                                                    Boolean(
                                                                                        busy
                                                                                    )
                                                                                }
                                                                                className="
                                                                                    inline-flex
                                                                                    items-center
                                                                                    gap-2
                                                                                    rounded-lg
                                                                                    border
                                                                                    border-red-500/30
                                                                                    px-3
                                                                                    py-1.5
                                                                                    text-xs
                                                                                    font-semibold
                                                                                    text-red-300
                                                                                    hover:bg-red-500/10
                                                                                    disabled:opacity-50
                                                                                "
                                                                            >
                                                                                {
                                                                                    deleting
                                                                                        ? (
                                                                                            <LoaderCircle
                                                                                                size={14}
                                                                                                className="
                                                                                                    animate-spin
                                                                                                "
                                                                                            />
                                                                                        )
                                                                                        : (
                                                                                            <Trash2
                                                                                                size={14}
                                                                                            />
                                                                                        )
                                                                                }

                                                                                Delete
                                                                            </button>
                                                                        </div>
                                                                    </article>
                                                                );
                                                            }
                                                        )
                                                    }
                                                </div>
                                            )
                                }
                            </section>
                        </aside>

                        <section
                            ref={guideRef}
                            className="
                                min-w-0
                                rounded-2xl
                                border
                                border-slate-800
                                bg-[#111827]
                                p-5
                                sm:p-6
                            "
                        >
                            <div
                                className="
                                    flex
                                    items-start
                                    gap-3
                                "
                            >
                                <Terminal
                                    size={24}
                                    className="
                                        mt-1
                                        shrink-0
                                        text-cyan-400
                                    "
                                />

                                <div>
                                    <h3
                                        className="
                                            text-2xl
                                            font-bold
                                            text-white
                                        "
                                    >
                                        Host Connection Steps
                                    </h3>

                                    <p
                                        className="
                                            mt-1
                                            text-sm
                                            text-slate-400
                                        "
                                    >
                                        Follow these four steps on the Linux or WSL host you want to monitor.
                                    </p>
                                </div>
                            </div>

                            {
                                !created
                                    ? (
                                        <StepPreview />
                                    )
                                    : (
                                        <>
                                            <div
                                                className="
                                                    mt-5
                                                    rounded-xl
                                                    border
                                                    border-amber-500/30
                                                    bg-amber-500/5
                                                    p-4
                                                "
                                            >
                                                <div
                                                    className="
                                                        flex
                                                        flex-col
                                                        gap-3
                                                        sm:flex-row
                                                        sm:items-center
                                                        sm:justify-between
                                                    "
                                                >
                                                    <div>
                                                        <p
                                                            className="
                                                                font-bold
                                                                text-amber-300
                                                            "
                                                        >
                                                            One-time key for {
                                                                selected?.name
                                                            }
                                                        </p>

                                                        <p
                                                            className="
                                                                mt-1
                                                                text-sm
                                                                text-amber-100/70
                                                            "
                                                        >
                                                            Save this key before closing.
                                                        </p>
                                                    </div>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            copyText(
                                                                "key",
                                                                created.agentKey
                                                            )
                                                        }
                                                        className="
                                                            inline-flex
                                                            items-center
                                                            justify-center
                                                            gap-2
                                                            rounded-xl
                                                            border
                                                            border-amber-500/30
                                                            bg-slate-950/50
                                                            px-4
                                                            py-2
                                                            text-sm
                                                            font-semibold
                                                            text-amber-200
                                                        "
                                                    >
                                                        {
                                                            copied ===
                                                            "key"
                                                                ? (
                                                                    <Check
                                                                        size={16}
                                                                    />
                                                                )
                                                                : (
                                                                    <Copy
                                                                        size={16}
                                                                    />
                                                                )
                                                        }

                                                        {
                                                            copied ===
                                                            "key"
                                                                ? "Copied"
                                                                : "Copy Private Key"
                                                        }
                                                    </button>
                                                </div>

                                                <code
                                                    className="
                                                        mt-3
                                                        block
                                                        break-all
                                                        rounded-lg
                                                        bg-slate-950/70
                                                        p-3
                                                        text-sm
                                                        text-cyan-300
                                                    "
                                                >
                                                    {
                                                        created.agentKey
                                                    }
                                                </code>
                                            </div>

                                            <div
                                                className="
                                                    mt-5
                                                "
                                            >
                                                <label
                                                    htmlFor="agent-api-url"
                                                    className="
                                                        text-sm
                                                        font-semibold
                                                        text-slate-300
                                                    "
                                                >
                                                    Minerva API address
                                                </label>

                                                <input
                                                    id="agent-api-url"
                                                    type="url"
                                                    value={
                                                        apiUrl
                                                    }
                                                    onChange={
                                                        event =>
                                                            setApiUrl(
                                                                event
                                                                    .target
                                                                    .value
                                                            )
                                                    }
                                                    className="
                                                        mt-2
                                                        h-11
                                                        w-full
                                                        rounded-xl
                                                        border
                                                        border-slate-700
                                                        bg-slate-950/60
                                                        px-4
                                                        font-mono
                                                        text-sm
                                                        text-cyan-200
                                                        outline-none
                                                        focus:border-cyan-500
                                                    "
                                                />

                                                <p
                                                    className="
                                                        mt-2
                                                        text-xs
                                                        text-slate-500
                                                    "
                                                >
                                                    Use the reachable API address for a remote host.
                                                </p>
                                            </div>

                                            {
                                                commands
                                                    ? (
                                                        <div
                                                            className="
                                                                mt-7
                                                                space-y-8
                                                            "
                                                        >
                                                            {
                                                                STEP_INFO.map(
                                                                    (
                                                                        [
                                                                            id,
                                                                            title,
                                                                            description
                                                                        ],
                                                                        index
                                                                    ) => (
                                                                        <div
                                                                            key={
                                                                                id
                                                                            }
                                                                        >
                                                                            <h4
                                                                                className="
                                                                                    font-bold
                                                                                    text-white
                                                                                "
                                                                            >
                                                                                {
                                                                                    index +
                                                                                    1
                                                                                }. {
                                                                                    title
                                                                                }
                                                                            </h4>

                                                                            <p
                                                                                className="
                                                                                    mt-2
                                                                                    text-sm
                                                                                    leading-6
                                                                                    text-slate-400
                                                                                "
                                                                            >
                                                                                {
                                                                                    description
                                                                                }
                                                                            </p>

                                                                            <TerminalBlock
                                                                                id={
                                                                                    id
                                                                                }
                                                                                value={
                                                                                    commands[
                                                                                        id
                                                                                    ]
                                                                                }
                                                                                copied={
                                                                                    copied
                                                                                }
                                                                                onCopy={
                                                                                    copyText
                                                                                }
                                                                            />
                                                                        </div>
                                                                    )
                                                                )
                                                            }
                                                        </div>
                                                    )
                                                    : (
                                                        <div
                                                            className="
                                                                mt-5
                                                                rounded-xl
                                                                border
                                                                border-red-500/20
                                                                bg-red-500/10
                                                                px-4
                                                                py-3
                                                                text-sm
                                                                text-red-200
                                                            "
                                                        >
                                                            Enter the Minerva API address to generate the commands.
                                                        </div>
                                                    )
                                            }

                                            <div
                                                className="
                                                    mt-7
                                                    flex
                                                    items-start
                                                    gap-3
                                                    rounded-xl
                                                    border
                                                    border-emerald-500/20
                                                    bg-emerald-500/5
                                                    p-4
                                                    text-sm
                                                    leading-6
                                                    text-emerald-200/80
                                                "
                                            >
                                                <ShieldCheck
                                                    size={18}
                                                    className="
                                                        mt-0.5
                                                        shrink-0
                                                    "
                                                />

                                                Never share an agent key. It permits host-metric uploads to this connection.
                                            </div>
                                        </>
                                    )
                            }
                        </section>
                    </div>
                </main>
            </div>
        </div>
    );
}