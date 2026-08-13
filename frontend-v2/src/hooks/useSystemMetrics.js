import {
    useEffect,
    useState
} from "react";

import {
    useAuth
} from "../context/AuthContext";

import {
    getHosts
} from "../services/host.service";

const MAX_HISTORY_POINTS = 20;
const REFRESH_INTERVAL_MS = 10000;

function createEmptyHistory() {
    return {
        cpu: [],
        memory: [],
        disk: [],
        network: []
    };
}

function getNumber(
    object,
    keys
) {
    for (const key of keys) {
        const value =
            Number(object?.[key]);

        if (Number.isFinite(value)) {
            return value;
        }
    }

    return 0;
}

function isActiveHost(host) {
    const status =
        String(
            host?.status || ""
        ).toUpperCase();

    return (
        status === "ONLINE" ||
        status === "WARNING"
    );
}

function average(
    hosts,
    keys
) {
    if (hosts.length === 0) {
        return 0;
    }

    const total =
        hosts.reduce(
            (sum, host) =>
                sum +
                getNumber(
                    host,
                    keys
                ),
            0
        );

    return Number(
        (
            total /
            hosts.length
        ).toFixed(2)
    );
}

function createAccountMetrics(
    activeHosts
) {
    if (activeHosts.length === 0) {
        return null;
    }

    const singleHost =
        activeHosts.length === 1
            ? activeHosts[0]
            : null;

    return {
        hostname:
            singleHost?.hostname ||
            `${activeHosts.length} active hosts`,

        platform:
            singleHost?.platform ||
            "multiple",

        architecture:
            singleHost?.architecture ||
            "multiple",

        cpu: {
            usage:
                average(
                    activeHosts,
                    [
                        "latest_cpu",
                        "latestCpu"
                    ]
                )
        },

        memory: {
            usage:
                average(
                    activeHosts,
                    [
                        "latest_memory",
                        "latestMemory"
                    ]
                )
        },

        disk: {
            usage:
                average(
                    activeHosts,
                    [
                        "latest_disk",
                        "latestDisk"
                    ]
                )
        },

        uptime: {
            seconds:
                average(
                    activeHosts,
                    [
                        "latest_uptime",
                        "latestUptime"
                    ]
                )
        },

        /*
        | Network usage is not currently stored
        | in the user-owned hosts table.
        */

        network: {
            rxPerSecond: 0,
            txPerSecond: 0,
            available: false
        },

        source:
            "account-owned-hosts"
    };
}

export default function useSystemMetrics() {
    const {
        user
    } = useAuth();

    const [metrics, setMetrics] =
        useState(null);

    const [history, setHistory] =
        useState(
            createEmptyHistory
        );

    const [hostCount, setHostCount] =
        useState(0);

    const [
        activeHostCount,
        setActiveHostCount
    ] = useState(0);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState(null);

    useEffect(() => {
        let mounted = true;
        let intervalId;

        /*
        | Clear the previous account immediately
        | whenever the logged-in user changes.
        */

        setMetrics(null);
        setHistory(
            createEmptyHistory()
        );
        setHostCount(0);
        setActiveHostCount(0);
        setError(null);
        setLoading(true);

        async function loadOwnedHosts() {
            if (!user?.id) {
                if (mounted) {
                    setLoading(false);
                }

                return;
            }

            try {
                const response =
                    await getHosts();

                if (!mounted) {
                    return;
                }

                const hosts =
                    Array.isArray(response)
                        ? response
                        : [];

                const activeHosts =
                    hosts.filter(
                        isActiveHost
                    );

                const accountMetrics =
                    createAccountMetrics(
                        activeHosts
                    );

                setHostCount(
                    hosts.length
                );

                setActiveHostCount(
                    activeHosts.length
                );

                setMetrics(
                    accountMetrics
                );

                setError(null);

                if (!accountMetrics) {
                    setHistory(
                        createEmptyHistory()
                    );

                    return;
                }

                setHistory(previous => ({
                    cpu: [
                        ...previous.cpu,
                        accountMetrics.cpu.usage
                    ].slice(
                        -MAX_HISTORY_POINTS
                    ),

                    memory: [
                        ...previous.memory,
                        accountMetrics.memory.usage
                    ].slice(
                        -MAX_HISTORY_POINTS
                    ),

                    disk: [
                        ...previous.disk,
                        accountMetrics.disk.usage
                    ].slice(
                        -MAX_HISTORY_POINTS
                    ),

                    network: []
                }));
            } catch (requestError) {
                console.error(
                    "Unable to load account hosts:",
                    requestError
                );

                if (mounted) {
                    setMetrics(null);
                    setHostCount(0);
                    setActiveHostCount(0);

                    setError(
                        requestError.response?.data
                            ?.message ||
                        "Unable to load your infrastructure."
                    );
                }
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        }

        loadOwnedHosts();

        intervalId =
            window.setInterval(
                loadOwnedHosts,
                REFRESH_INTERVAL_MS
            );

        return () => {
            mounted = false;

            window.clearInterval(
                intervalId
            );
        };
    }, [user?.id]);

    return {
        metrics,
        history,
        connected:
            activeHostCount > 0,
        loading,
        error,
        hostCount,
        activeHostCount
    };
}