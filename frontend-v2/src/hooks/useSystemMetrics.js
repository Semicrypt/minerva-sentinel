import {
    useEffect,
    useState
} from "react";

import socket from "../services/socketService";

import {
    getSystemMetrics
} from "../services/metrics.service";

/*
|--------------------------------------------------------------------------
| System Metrics Hook
|--------------------------------------------------------------------------
|
| Central place for React components to access live infrastructure metrics.
|
| Responsibilities:
|
| 1. Load the latest metric through REST.
| 2. Listen for Socket.IO system:metrics events.
| 3. Track connection status.
| 4. Keep a short rolling history for sparklines.
|
*/

const MAX_HISTORY_POINTS = 20;

export default function useSystemMetrics() {

    const [metrics, setMetrics] =
        useState(null);

    const [connected, setConnected] =
        useState(socket.connected);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState(null);

    const [history, setHistory] =
        useState({

            cpu: [],

            memory: [],

            disk: [],

            network: []

        });

    /*
    |--------------------------------------------------------------------------
    | Store Metric Sample
    |--------------------------------------------------------------------------
    */

    function handleMetrics(newMetrics) {

        if (!newMetrics) {
            return;
        }

        setMetrics(
            newMetrics
        );

        setHistory(previous => {

            const networkRate =
                (
                    Number(
                        newMetrics.network?.rxPerSecond
                    ) || 0
                ) +
                (
                    Number(
                        newMetrics.network?.txPerSecond
                    ) || 0
                );

            return {

                cpu: [
                    ...previous.cpu,
                    newMetrics.cpu?.usage || 0
                ].slice(
                    -MAX_HISTORY_POINTS
                ),

                memory: [
                    ...previous.memory,
                    newMetrics.memory?.usage || 0
                ].slice(
                    -MAX_HISTORY_POINTS
                ),

                disk: [
                    ...previous.disk,
                    newMetrics.disk?.usage || 0
                ].slice(
                    -MAX_HISTORY_POINTS
                ),

                network: [
                    ...previous.network,
                    networkRate
                ].slice(
                    -MAX_HISTORY_POINTS
                )

            };

        });

    }

    /*
    |--------------------------------------------------------------------------
    | Setup
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        let mounted = true;

        /*
        |--------------------------------------------------------------------------
        | Initial REST Request
        |--------------------------------------------------------------------------
        */

        async function loadInitialMetrics() {

            try {

                const data =
                    await getSystemMetrics();

                if (!mounted) {
                    return;
                }

                handleMetrics(
                    data
                );

                setError(
                    null
                );

            }

            catch (requestError) {

                console.error(
                    "Unable to load system metrics:",
                    requestError
                );

                if (mounted) {

                    setError(
                        "Unable to load system metrics."
                    );

                }

            }

            finally {

                if (mounted) {

                    setLoading(
                        false
                    );

                }

            }

        }

        /*
        |--------------------------------------------------------------------------
        | Socket Events
        |--------------------------------------------------------------------------
        */

        function handleConnect() {

            if (!mounted) {
                return;
            }

            setConnected(
                true
            );

            setError(
                null
            );

        }

        function handleDisconnect() {

            if (!mounted) {
                return;
            }

            setConnected(
                false
            );

        }

        function handleSocketMetrics(
            newMetrics
        ) {

            if (!mounted) {
                return;
            }

            handleMetrics(
                newMetrics
            );

            setLoading(
                false
            );

            setError(
                null
            );

        }

        function handleConnectError(
            socketError
        ) {

            console.error(
                "Socket.IO connection error:",
                socketError.message
            );

            if (mounted) {

                setConnected(
                    false
                );

            }

        }

        /*
        |--------------------------------------------------------------------------
        | Register Listeners
        |--------------------------------------------------------------------------
        */

        socket.on(
            "connect",
            handleConnect
        );

        socket.on(
            "disconnect",
            handleDisconnect
        );

        socket.on(
            "connect_error",
            handleConnectError
        );

        socket.on(
            "system:metrics",
            handleSocketMetrics
        );

        /*
        |--------------------------------------------------------------------------
        | Ensure Socket Is Connected
        |--------------------------------------------------------------------------
        */

        if (!socket.connected) {

            socket.connect();

        }

        loadInitialMetrics();

        /*
        |--------------------------------------------------------------------------
        | Cleanup
        |--------------------------------------------------------------------------
        */

        return () => {

            mounted = false;

            socket.off(
                "connect",
                handleConnect
            );

            socket.off(
                "disconnect",
                handleDisconnect
            );

            socket.off(
                "connect_error",
                handleConnectError
            );

            socket.off(
                "system:metrics",
                handleSocketMetrics
            );

        };

    }, []);

    return {

        metrics,

        history,

        connected,

        loading,

        error

    };

}
