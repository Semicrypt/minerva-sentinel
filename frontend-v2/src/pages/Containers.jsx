import {
    Boxes,
    Check,
    CircleAlert,
    Copy,
    KeyRound,
    LoaderCircle,
    Plus,
    RefreshCw,
    Server,
    ShieldCheck,
    Terminal,
    WifiOff
} from "lucide-react";

import {
    useCallback,
    useEffect,
    useMemo,
    useState
} from "react";

import DashboardLayout from
    "../layouts/DashboardLayout";

import ContainersHeader from
    "../components/containers/ContainersHeader";

import DockerOverview from
    "../components/containers/DockerOverview";

import RunningContainers from
    "../components/containers/RunningContainers";

import ImagesPanel from
    "../components/containers/ImagesPanel";

import NetworksVolumes from
    "../components/containers/NetworksVolumes";

import ContainerArchitecture from
    "../components/containers/ContainerArchitecture";

import {
    createDockerConnection,
    getDockerConnections,
    getDockerContainers,
    getDockerImages,
    getDockerInfo,
    getDockerNetworks,
    getDockerVolumes
} from "../services/docker.service";

function formatDate(value) {
    if (!value) {
        return "Never";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "Not available";
    }

    return date.toLocaleString();
}

function getStatusStyle(status) {
    switch (
        String(status || "").toUpperCase()
    ) {
        case "ONLINE":
            return {
                label: "Online",
                badge:
                    "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
                dot: "bg-emerald-400"
            };

        case "OFFLINE":
            return {
                label: "Offline",
                badge:
                    "border-red-500/20 bg-red-500/10 text-red-300",
                dot: "bg-red-400"
            };

        default:
            return {
                label: "Awaiting Agent",
                badge:
                    "border-amber-500/20 bg-amber-500/10 text-amber-300",
                dot: "bg-amber-400"
            };
    }
}

function getSuggestedApiUrl() {
    const hostname =
        window.location.hostname;

    if (
        hostname === "localhost" ||
        hostname === "127.0.0.1"
    ) {
        return (
            "http://host.docker.internal:" +
            "5000/api"
        );
    }

    return (
        `${window.location.origin}/api`
    );
}

function CommandBlock({
    id,
    command,
    copiedCommand,
    onCopy
}) {
    const copied =
        copiedCommand === id;

    return (
        <div className="mt-3 overflow-hidden rounded-xl border border-slate-700 bg-slate-950/80">
            <div className="flex items-center justify-between border-b border-slate-800 px-4 py-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Terminal
                </span>

                <button
                    type="button"
                    onClick={() =>
                        onCopy(id, command)
                    }
                    className="inline-flex items-center gap-2 text-xs font-semibold text-cyan-400 transition hover:text-cyan-300"
                >
                    {copied ? (
                        <Check size={15} />
                    ) : (
                        <Copy size={15} />
                    )}

                    {copied
                        ? "Copied"
                        : "Copy"}
                </button>
            </div>

            <pre className="overflow-x-auto whitespace-pre-wrap break-words p-4 text-sm leading-6 text-slate-300">
                <code>{command}</code>
            </pre>
        </div>
    );
}

export default function Containers() {
    const [
        connections,
        setConnections
    ] = useState([]);

    const [
        connectionName,
        setConnectionName
    ] = useState("");

    const [
        selectedConnectionId,
        setSelectedConnectionId
    ] = useState("");

    const [
        manualAgentKey,
        setManualAgentKey
    ] = useState("");

    const [
        createdCredential,
        setCreatedCredential
    ] = useState(null);

    const [dockerInfo, setDockerInfo] =
        useState(null);

    const [containers, setContainers] =
        useState([]);

    const [images, setImages] =
        useState([]);

    const [networks, setNetworks] =
        useState([]);

    const [volumes, setVolumes] =
        useState([]);

    const [
        snapshotAvailable,
        setSnapshotAvailable
    ] = useState(false);

    const [loading, setLoading] =
        useState(true);

    const [refreshing, setRefreshing] =
        useState(false);

    const [creating, setCreating] =
        useState(false);

    const [
        copiedCommand,
        setCopiedCommand
    ] = useState("");

    const [error, setError] =
        useState("");

    const [message, setMessage] =
        useState("");

    const clearDockerData =
        useCallback(() => {
            setDockerInfo(null);
            setContainers([]);
            setImages([]);
            setNetworks([]);
            setVolumes([]);
            setSnapshotAvailable(false);
        }, []);

    const loadPage = useCallback(
        async (manualRefresh = false) => {
            if (manualRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            setError("");

            try {
                const connectionData =
                    await getDockerConnections();

                setConnections(
                    connectionData
                );

                setSelectedConnectionId(
                    currentId => {
                        const stillExists =
                            connectionData.some(
                                connection =>
                                    String(
                                        connection.id
                                    ) ===
                                    String(currentId)
                            );

                        if (stillExists) {
                            return currentId;
                        }

                        return connectionData[0]
                            ? String(
                                connectionData[0].id
                            )
                            : "";
                    }
                );

                if (
                    connectionData.length === 0
                ) {
                    clearDockerData();

                    if (manualRefresh) {
                        setMessage(
                            "Docker connections refreshed."
                        );
                    }

                    return;
                }

                try {
                    const [
                        info,
                        containerData,
                        imageData,
                        networkData,
                        volumeData
                    ] = await Promise.all([
                        getDockerInfo(),
                        getDockerContainers(),
                        getDockerImages(),
                        getDockerNetworks(),
                        getDockerVolumes()
                    ]);

                    setDockerInfo(info);
                    setContainers(
                        containerData
                    );
                    setImages(imageData);
                    setNetworks(networkData);
                    setVolumes(volumeData);
                    setSnapshotAvailable(
                        true
                    );
                } catch (snapshotError) {
                    if (
                        snapshotError.response
                            ?.status === 409
                    ) {
                        clearDockerData();
                    } else {
                        throw snapshotError;
                    }
                }

                if (manualRefresh) {
                    setMessage(
                        "Docker information refreshed."
                    );
                }
            } catch (requestError) {
                console.error(
                    "Unable to load Docker information:",
                    requestError
                );

                setError(
                    requestError.response?.data
                        ?.message ||
                    "Unable to load Docker information."
                );
            } finally {
                setLoading(false);
                setRefreshing(false);
            }
        },
        [clearDockerData]
    );

    useEffect(() => {
        loadPage();
    }, [loadPage]);

    useEffect(() => {
        if (!message) {
            return undefined;
        }

        const timeout =
            window.setTimeout(
                () => setMessage(""),
                2500
            );

        return () =>
            window.clearTimeout(timeout);
    }, [message]);

    const selectedConnection =
        useMemo(() => {
            return (
                connections.find(
                    connection =>
                        String(
                            connection.id
                        ) ===
                        String(
                            selectedConnectionId
                        )
                ) ||
                connections[0] ||
                null
            );
        }, [
            connections,
            selectedConnectionId
        ]);

    const agentKeyForCommand =
        createdCredential?.agentKey ||
        manualAgentKey.trim() ||
        "PASTE_YOUR_PRIVATE_MSDK_KEY_HERE";

    const connectionForCommand =
        createdCredential?.connection ||
        selectedConnection;

    const agentContainerName =
        connectionForCommand
            ? `minerva-agent-${connectionForCommand.id}`
            : "minerva-agent";

    const suggestedApiUrl =
        getSuggestedApiUrl();

    const buildCommand =
    "docker pull ghcr.io/semicrypt/minerva-sentinel-agent:latest";
        [
            "cd ~/hybrid-cloud-monitor-v2",
            "",
            "docker build \\",
            "  -t minerva-sentinel-agent:local \\",
            "  ./agent"
        ].join("\n");

    const runCommand =
        [
            "docker run -d \\",
            `  --name ${agentContainerName} \\`,
            "  --restart unless-stopped \\",
            "  --add-host=host.docker.internal:host-gateway \\",
            `  -e MINERVA_API_URL="${suggestedApiUrl}" \\`,
            `  -e MINERVA_AGENT_KEY="${agentKeyForCommand}" \\`,
            '  -e INTERVAL="30000" \\',
            "  -v /var/run/docker.sock:/var/run/docker.sock:ro \\",
            "  ghcr.io/semicrypt/minerva-sentinel-agent:latest"
        ].join("\n");

    const logsCommand =
        `docker logs -f ${agentContainerName}`;

    const stopCommand =
        [
            `docker stop ${agentContainerName}`,
            `docker rm ${agentContainerName}`
        ].join("\n");

    async function copyText(
        id,
        value
    ) {
        try {
            await navigator.clipboard
                .writeText(value);

            setCopiedCommand(id);

            window.setTimeout(
                () =>
                    setCopiedCommand(""),
                2000
            );
        } catch (copyError) {
            console.error(
                "Unable to copy command:",
                copyError
            );

            setError(
                "Unable to copy automatically. Select and copy the command manually."
            );
        }
    }

    async function handleCreateConnection(
        event
    ) {
        event.preventDefault();

        const name =
            connectionName.trim();

        if (!name) {
            setError(
                "Enter a name for this Docker connection."
            );

            return;
        }

        setCreating(true);
        setError("");
        setMessage("");
        setCreatedCredential(null);

        try {
            const data =
                await createDockerConnection(
                    name
                );

            if (
                !data?.connection ||
                !data?.agentKey
            ) {
                throw new Error(
                    "The connection response was incomplete."
                );
            }

            setConnections(
                current => [
                    data.connection,
                    ...current
                ]
            );

            setSelectedConnectionId(
                String(
                    data.connection.id
                )
            );

            setCreatedCredential(data);
            setManualAgentKey("");
            setConnectionName("");

            setMessage(
                "Docker connection created. Save the agent key now."
            );
        } catch (requestError) {
            console.error(
                "Unable to create Docker connection:",
                requestError
            );

            setError(
                requestError.response?.data
                    ?.message ||
                requestError.message ||
                "Unable to create Docker connection."
            );
        } finally {
            setCreating(false);
        }
    }

    return (
        <DashboardLayout>
            <div className="space-y-8">
                <section className="rounded-3xl border border-slate-800 bg-[#111827] p-6 sm:p-8">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                        <div className="flex items-start gap-4">
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-cyan-500/10">
                                <Boxes
                                    size={28}
                                    className="text-cyan-400"
                                />
                            </div>

                            <div>
                                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
                                    Docker Engine
                                </p>

                                <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">
                                    Docker Connections
                                </h1>

                                <p className="mt-3 max-w-3xl leading-7 text-slate-400">
                                    Each Docker agent sends
                                    data only to the account
                                    connected by its private
                                    key.
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() =>
                                loadPage(true)
                            }
                            disabled={
                                loading || refreshing
                            }
                            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 font-semibold text-slate-200 transition hover:border-cyan-500/60 hover:text-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
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
                                : "Refresh"}
                        </button>
                    </div>
                </section>

                {message && (
                    <div className="flex items-start gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
                        <ShieldCheck
                            size={18}
                            className="mt-0.5 shrink-0"
                        />

                        {message}
                    </div>
                )}

                {error && (
                    <div className="flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                        <CircleAlert
                            size={18}
                            className="mt-0.5 shrink-0"
                        />

                        {error}
                    </div>
                )}

                <div className="grid gap-8 xl:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
                    <section className="self-start rounded-3xl border border-slate-800 bg-[#111827] p-6 sm:p-8">
                        <div className="flex items-center gap-3">
                            <Plus
                                size={22}
                                className="text-cyan-400"
                            />

                            <h2 className="text-2xl font-bold text-white">
                                Create Connection
                            </h2>
                        </div>

                        <form
                            onSubmit={
                                handleCreateConnection
                            }
                            className="mt-6"
                        >
                            <label
                                htmlFor="connection-name"
                                className="text-sm font-semibold text-slate-300"
                            >
                                Connection name
                            </label>

                            <input
                                id="connection-name"
                                value={connectionName}
                                onChange={event =>
                                    setConnectionName(
                                        event.target.value
                                    )
                                }
                                maxLength={100}
                                placeholder="Production Docker Host"
                                className="mt-3 w-full rounded-xl border border-slate-700 bg-slate-950/50 px-4 py-3 text-slate-200 outline-none focus:border-cyan-500"
                            />

                            <button
                                type="submit"
                                disabled={
                                    creating ||
                                    !connectionName.trim()
                                }
                                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 px-5 py-3 font-bold text-slate-950 transition hover:bg-cyan-400 disabled:opacity-50"
                            >
                                {creating ? (
                                    <LoaderCircle
                                        size={19}
                                        className="animate-spin"
                                    />
                                ) : (
                                    <KeyRound
                                        size={19}
                                    />
                                )}

                                {creating
                                    ? "Creating..."
                                    : "Create Agent Key"}
                            </button>
                        </form>
                    </section>

                    <section className="rounded-3xl border border-slate-800 bg-[#111827] p-6 sm:p-8">
                        <h2 className="text-2xl font-bold text-white">
                            Your Connections
                        </h2>

                        {loading && (
                            <div className="mt-8 flex min-h-40 items-center justify-center">
                                <LoaderCircle
                                    size={25}
                                    className="animate-spin text-cyan-400"
                                />
                            </div>
                        )}

                        {!loading &&
                            connections.length ===
                                0 && (
                                <div className="mt-8 rounded-2xl border border-dashed border-slate-700 px-6 py-10 text-center">
                                    <WifiOff
                                        size={38}
                                        className="mx-auto text-slate-500"
                                    />

                                    <p className="mt-4 font-semibold text-white">
                                        Docker not connected
                                    </p>
                                </div>
                            )}

                        {!loading &&
                            connections.length >
                                0 && (
                                <div className="mt-6 space-y-4">
                                    {connections.map(
                                        connection => {
                                            const status =
                                                getStatusStyle(
                                                    connection.status
                                                );

                                            return (
                                                <button
                                                    key={
                                                        connection.id
                                                    }
                                                    type="button"
                                                    onClick={() =>
                                                        setSelectedConnectionId(
                                                            String(
                                                                connection.id
                                                            )
                                                        )
                                                    }
                                                    className={`w-full rounded-2xl border p-5 text-left transition ${
                                                        String(
                                                            connection.id
                                                        ) ===
                                                        String(
                                                            selectedConnection?.id
                                                        )
                                                            ? "border-cyan-500/50 bg-cyan-500/5"
                                                            : "border-slate-800 bg-slate-900/40"
                                                    }`}
                                                >
                                                    <div className="flex items-start justify-between gap-4">
                                                        <div className="flex min-w-0 gap-3">
                                                            <Server
                                                                size={
                                                                    21
                                                                }
                                                                className="mt-0.5 shrink-0 text-blue-400"
                                                            />

                                                            <div>
                                                                <p className="font-bold text-white">
                                                                    {
                                                                        connection.name
                                                                    }
                                                                </p>

                                                                <p className="mt-1 text-sm text-slate-500">
                                                                    Last
                                                                    seen:{" "}
                                                                    {formatDate(
                                                                        connection.lastSeen
                                                                    )}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <span
                                                            className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${status.badge}`}
                                                        >
                                                            <span
                                                                className={`h-2 w-2 rounded-full ${status.dot}`}
                                                            />

                                                            {
                                                                status.label
                                                            }
                                                        </span>
                                                    </div>
                                                </button>
                                            );
                                        }
                                    )}
                                </div>
                            )}
                    </section>
                </div>

                <section className="rounded-3xl border border-slate-800 bg-[#111827] p-6 sm:p-8">
                    <div className="flex items-center gap-3">
                        <Terminal
                            size={23}
                            className="text-cyan-400"
                        />

                        <div>
                            <h2 className="text-2xl font-bold text-white">
                                Docker Connection Steps
                            </h2>

                            <p className="mt-1 text-slate-400">
                                Follow these steps on the
                                machine running Docker.
                            </p>
                        </div>
                    </div>

                    {connections.length > 1 && (
                        <div className="mt-6 max-w-md">
                            <label
                                htmlFor="guide-connection"
                                className="text-sm font-semibold text-slate-300"
                            >
                                Connection
                            </label>

                            <select
                                id="guide-connection"
                                value={
                                    selectedConnectionId
                                }
                                onChange={event =>
                                    setSelectedConnectionId(
                                        event.target.value
                                    )
                                }
                                className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950/50 px-4 py-3 text-white"
                            >
                                {connections.map(
                                    connection => (
                                        <option
                                            key={
                                                connection.id
                                            }
                                            value={
                                                connection.id
                                            }
                                        >
                                            {
                                                connection.name
                                            }
                                        </option>
                                    )
                                )}
                            </select>
                        </div>
                    )}

                    {createdCredential && (
                        <div className="mt-6 rounded-2xl border border-amber-500/30 bg-amber-500/5 p-5">
                            <p className="font-bold text-amber-300">
                                Save this key now
                            </p>

                            <code className="mt-3 block break-all rounded-xl bg-slate-950/70 p-4 text-sm text-cyan-300">
                                {
                                    createdCredential.agentKey
                                }
                            </code>
                        </div>
                    )}

                    {!createdCredential && (
                        <div className="mt-6 max-w-2xl">
                            <label
                                htmlFor="private-agent-key"
                                className="text-sm font-semibold text-slate-300"
                            >
                                Previously saved agent key
                            </label>

                            <input
                                id="private-agent-key"
                                type="password"
                                value={manualAgentKey}
                                onChange={event =>
                                    setManualAgentKey(
                                        event.target.value
                                    )
                                }
                                autoComplete="off"
                                placeholder="Paste your saved msdk_ key to build the command"
                                className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950/50 px-4 py-3 text-white outline-none focus:border-cyan-500"
                            />

                            <p className="mt-2 text-xs text-slate-500">
                                This value stays only in
                                this browser state and is
                                not sent back to Minerva.
                            </p>
                        </div>
                    )}

                    <div className="mt-8 space-y-8">
                        <div>
                            <h3 className="font-bold text-white">
                                1. Download the agent image (optional)
                            </h3>
                             <p className="mt-2 text-sm text-slate-400">
                                Docker will download the public agent
                                automatically when Step 2 runs. You can
                                also download it first using this command.
                                It works from any folder and does not
                                require the Minerva project repository.
                            </p>





                            <CommandBlock
                                id="build"
                                command={buildCommand}
                                copiedCommand={
                                    copiedCommand
                                }
                                onCopy={copyText}
                            />
                        </div>

                        <div>
                            <h3 className="font-bold text-white">
                                2. Start the private agent
                            </h3>

                            <p className="mt-2 text-sm text-slate-400">
                                The Docker socket is mounted
                                read-only. The private key
                                links snapshots only to the
                                selected account connection.
                            </p>

                            <CommandBlock
                                id="run"
                                command={runCommand}
                                copiedCommand={
                                    copiedCommand
                                }
                                onCopy={copyText}
                            />
                        </div>

                        <div>
                            <h3 className="font-bold text-white">
                                3. Verify uploads
                            </h3>

                            <CommandBlock
                                id="logs"
                                command={logsCommand}
                                copiedCommand={
                                    copiedCommand
                                }
                                onCopy={copyText}
                            />

                            <p className="mt-3 text-sm text-slate-400">
                                Wait for “Docker snapshot
                                uploaded,” then click Refresh
                                at the top of this page.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-bold text-white">
                                4. Stop and remove the agent
                            </h3>

                            <CommandBlock
                                id="stop"
                                command={stopCommand}
                                copiedCommand={
                                    copiedCommand
                                }
                                onCopy={copyText}
                            />
                        </div>
                    </div>

                    <div className="mt-8 flex items-start gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-sm leading-6 text-emerald-200/80">
                        <ShieldCheck
                            size={19}
                            className="mt-0.5 shrink-0"
                        />

                        Never share an agent key. It grants
                        permission to upload Docker data to
                        one account connection.
                    </div>
                </section>

                {snapshotAvailable && (
                    <>
                        <ContainersHeader
                            dockerInfo={
                                dockerInfo
                            }
                            loading={loading}
                            refreshing={
                                refreshing
                            }
                            error={null}
                            onRefresh={() =>
                                loadPage(true)
                            }
                        />

                        <DockerOverview
                            dockerInfo={
                                dockerInfo
                            }
                            containers={
                                containers
                            }
                            loading={loading}
                        />

                        <RunningContainers
                            containers={
                                containers
                            }
                            loading={loading}
                        />

                        <ImagesPanel
                            images={images}
                            loading={loading}
                        />

                        <NetworksVolumes
                            networks={
                                networks
                            }
                            volumes={volumes}
                            loading={loading}
                        />

                        <ContainerArchitecture />
                    </>
                )}

                {!loading &&
                    connections.length > 0 &&
                    !snapshotAvailable && (
                        <section className="rounded-3xl border border-dashed border-slate-700 bg-[#111827] px-6 py-14 text-center">
                            <WifiOff
                                size={42}
                                className="mx-auto text-amber-400"
                            />

                            <h2 className="mt-4 text-xl font-bold text-white">
                                Waiting for the first Docker
                                snapshot
                            </h2>

                            <p className="mx-auto mt-2 max-w-2xl text-slate-400">
                                Start the agent using the
                                steps above. Docker metrics
                                will appear here after its
                                first authenticated upload.
                            </p>
                        </section>
                    )}
            </div>
        </DashboardLayout>
    );
}