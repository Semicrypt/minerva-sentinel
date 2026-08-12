import {
    useState
} from "react";

import {
    AlertTriangle,
    Box,
    CheckCircle2,
    LoaderCircle,
    Package,
    RefreshCw,
    Unplug,
    X
} from "lucide-react";

import {
    disconnectDockerConnection
} from "../../services/docker.service";

export default function ContainersHeader({
    dockerInfo,
    loading,
    refreshing,
    error,
    onRefresh
}) {
    const [
        disconnectDialogOpen,
        setDisconnectDialogOpen
    ] = useState(false);

    const [
        disconnecting,
        setDisconnecting
    ] = useState(false);

    const [
        disconnectError,
        setDisconnectError
    ] = useState("");

    const connected =
        Boolean(dockerInfo) &&
        !error;

    const connection =
        dockerInfo?.minervaConnection ||
        null;

    const connectionId =
        Number(connection?.id);

    const connectionName =
        connection?.name ||
        "this Docker connection";

    function openDisconnectDialog() {
        setDisconnectError("");
        setDisconnectDialogOpen(true);
    }

    function closeDisconnectDialog() {
        if (disconnecting) {
            return;
        }

        setDisconnectError("");
        setDisconnectDialogOpen(false);
    }

    async function handleDisconnect() {
        if (
            !Number.isInteger(connectionId) ||
            connectionId <= 0
        ) {
            setDisconnectError(
                "The Docker connection ID is unavailable. Refresh the page and try again."
            );

            return;
        }

        setDisconnecting(true);
        setDisconnectError("");

        try {
            await disconnectDockerConnection(
                connectionId
            );

            setDisconnecting(false);
            setDisconnectDialogOpen(false);

            /*
            | Reload connections and clear the
            | disconnected snapshot from the page.
            */

            if (onRefresh) {
                await onRefresh();
            }
        } catch (requestError) {
            console.error(
                "Unable to disconnect Docker:",
                requestError
            );

            setDisconnecting(false);

            setDisconnectError(
                requestError.response?.data
                    ?.message ||
                "Unable to disconnect Docker."
            );
        }
    }

    return (
        <>
            <section className="rounded-[32px] border border-slate-800 bg-[#111827] p-8 shadow-xl shadow-black/20">
                <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <div className="flex items-center gap-4">
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-500/10">
                                <Box
                                    size={30}
                                    className="text-sky-400"
                                />
                            </div>

                            <div>
                                <p className="text-sm uppercase tracking-[0.28em] text-slate-500">
                                    Docker Engine
                                </p>

                                <h1 className="mt-1 text-4xl font-black text-white">
                                    Containers
                                </h1>
                            </div>
                        </div>

                        <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-400">
                            Monitor Docker containers,
                            images, networks, volumes, CPU
                            usage, memory consumption and
                            runtime health from a single
                            dashboard.
                        </p>

                        {error && (
                            <div className="mt-6 flex items-center gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4">
                                <AlertTriangle
                                    size={18}
                                    className="shrink-0 text-red-400"
                                />

                                <span className="text-sm text-red-300">
                                    {error}
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="grid gap-4">
                        <div className="flex items-center justify-between gap-6 rounded-2xl border border-slate-800 bg-slate-900/50 px-5 py-4">
                            <div className="flex items-center gap-3">
                                <Package
                                    size={18}
                                    className="text-cyan-400"
                                />

                                <span className="text-slate-300">
                                    Docker Version
                                </span>
                            </div>

                            <span className="font-semibold text-white">
                                {loading
                                    ? "Loading..."
                                    : dockerInfo
                                        ?.serverVersion ||
                                      "Unavailable"}
                            </span>
                        </div>

                        <div className="flex items-center justify-between gap-6 rounded-2xl border border-slate-800 bg-slate-900/50 px-5 py-4">
                            <div className="flex items-center gap-3">
                                <CheckCircle2
                                    size={18}
                                    className={
                                        connected
                                            ? "text-emerald-400"
                                            : "text-red-400"
                                    }
                                />

                                <span className="text-slate-300">
                                    Engine
                                </span>
                            </div>

                            <span
                                className={
                                    connected
                                        ? "font-semibold text-emerald-400"
                                        : "font-semibold text-red-400"
                                }
                            >
                                {loading
                                    ? "Checking..."
                                    : connected
                                        ? "Connected"
                                        : "Disconnected"}
                            </span>
                        </div>

                        <button
                            type="button"
                            onClick={onRefresh}
                            disabled={
                                refreshing ||
                                loading ||
                                disconnecting
                            }
                            className="flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-sky-500 to-cyan-500 px-6 py-4 font-semibold text-white transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
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
                                : "Refresh Docker"}
                        </button>

                        {connected &&
                            connectionId > 0 && (
                            <button
                                type="button"
                                onClick={
                                    openDisconnectDialog
                                }
                                disabled={
                                    loading ||
                                    refreshing ||
                                    disconnecting
                                }
                                className="flex items-center justify-center gap-3 rounded-2xl border border-red-500/40 bg-red-500/10 px-6 py-4 font-semibold text-red-300 transition hover:border-red-400 hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                <Unplug size={18} />

                                Disconnect Docker
                            </button>
                        )}
                    </div>
                </div>
            </section>

            {disconnectDialogOpen && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="disconnect-docker-title"
                >
                    <div className="w-full max-w-lg rounded-3xl border border-red-500/30 bg-[#111827] p-6 shadow-2xl sm:p-8">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/10">
                                <Unplug
                                    size={24}
                                    className="text-red-400"
                                />
                            </div>

                            <button
                                type="button"
                                onClick={
                                    closeDisconnectDialog
                                }
                                disabled={disconnecting}
                                aria-label="Close"
                                className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-800 hover:text-white disabled:opacity-50"
                            >
                                <X size={21} />
                            </button>
                        </div>

                        <h2
                            id="disconnect-docker-title"
                            className="mt-5 text-2xl font-bold text-white"
                        >
                            Disconnect Docker?
                        </h2>

                        <p className="mt-3 leading-7 text-slate-400">
                            This will disconnect{" "}
                            <span className="font-semibold text-white">
                                {connectionName}
                            </span>
                            , revoke its private agent key
                            and remove its saved Docker
                            snapshot.
                        </p>

                        <div className="mt-5 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4">
                            <p className="text-sm leading-6 text-amber-200">
                                You must also stop the agent
                                container on the monitored
                                Docker machine:
                            </p>

                            <code className="mt-3 block overflow-x-auto rounded-xl bg-slate-950/70 p-3 text-sm text-cyan-300">
                                docker stop
                                {" "}
                                minerva-agent-
                                {connectionId}
                                {" && "}
                                docker rm
                                {" "}
                                minerva-agent-
                                {connectionId}
                            </code>
                        </div>

                        {disconnectError && (
                            <div className="mt-5 flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
                                <AlertTriangle
                                    size={18}
                                    className="mt-0.5 shrink-0"
                                />

                                {disconnectError}
                            </div>
                        )}

                        <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                            <button
                                type="button"
                                onClick={
                                    closeDisconnectDialog
                                }
                                disabled={disconnecting}
                                className="rounded-xl border border-slate-700 px-5 py-3 font-semibold text-slate-300 transition hover:bg-slate-800 disabled:opacity-50"
                            >
                                Keep Connected
                            </button>

                            <button
                                type="button"
                                onClick={handleDisconnect}
                                disabled={disconnecting}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-500 px-5 py-3 font-bold text-white transition hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {disconnecting ? (
                                    <LoaderCircle
                                        size={18}
                                        className="animate-spin"
                                    />
                                ) : (
                                    <Unplug size={18} />
                                )}

                                {disconnecting
                                    ? "Disconnecting..."
                                    : "Disconnect Docker"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}