import {
    useCallback,
    useEffect,
    useState
} from "react";

import DashboardLayout from "../layouts/DashboardLayout";

import ObservabilityHeader from "../components/observability/ObservabilityHeader";
import MetricsOverview from "../components/observability/MetricsOverview";
import LiveMetrics from "../components/observability/LiveMetrics";
import MetricsHistoryChart from "../components/observability/MetricsHistoryChart";
import LogsViewer from "../components/observability/LogsViewer";
import TracesPanel from "../components/observability/TracesPanel";
import ServiceHealth from "../components/observability/ServiceHealth";
import ArchitectureDiagram from "../components/observability/ArchitectureDiagram";

import {
    getSystemMetrics,
    getMetricHistory
} from "../services/metrics.service";

import {
    getHosts
} from "../services/host.service";

export default function Observability() {

    const [metrics, setMetrics] =
        useState(null);

    const [history, setHistory] =
        useState([]);

    const [hostname, setHostname] =
        useState("");

    const [hostStatus, setHostStatus] =
        useState("ONLINE");

    const [loading, setLoading] =
        useState(true);

    const [refreshing, setRefreshing] =
        useState(false);

    const [error, setError] =
        useState(null);

    /*
    |--------------------------------------------------------------------------
    | Load Observability Data
    |--------------------------------------------------------------------------
    */

    const loadObservabilityData =
        useCallback(
            async (
                manualRefresh = false
            ) => {

                try {

                    if (
                        manualRefresh
                    ) {

                        setRefreshing(
                            true
                        );

                    }
                    else {

                        setLoading(
                            true
                        );

                    }

                    setError(
                        null
                    );

                    /*
                    |--------------------------------------------------------------------------
                    | Live Metrics
                    |--------------------------------------------------------------------------
                    */

                    const liveMetrics =
                        await getSystemMetrics();

                    setMetrics(
                        liveMetrics
                    );

                    const currentHostname =
                        liveMetrics?.hostname ||
                        "";

                    setHostname(
                        currentHostname
                    );

                    /*
                    |--------------------------------------------------------------------------
                    | Historical Metrics
                    |--------------------------------------------------------------------------
                    */

                    if (
                        currentHostname
                    ) {

                        const historyData =
                            await getMetricHistory(
                                currentHostname,
                                60
                            );

                        setHistory(
                            Array.isArray(
                                historyData
                            )
                                ? historyData
                                : []
                        );

                    }
                    else {

                        setHistory(
                            []
                        );

                    }

                    /*
                    |--------------------------------------------------------------------------
                    | Host Health
                    |--------------------------------------------------------------------------
                    */

                    const hostData =
                        await getHosts();

                    if (
                        Array.isArray(
                            hostData
                        )
                    ) {

                        const currentHost =
                            hostData.find(
                                host =>
                                    host.hostname ===
                                    currentHostname
                            );

                        if (
                            currentHost
                        ) {

                            setHostStatus(
                                currentHost.status ||
                                "ONLINE"
                            );

                        }

                    }

                }

                catch (
                    requestError
                ) {

                    console.error(
                        "Unable to load observability data:",
                        requestError
                    );

                    setError(
                        "Unable to load observability metrics."
                    );

                }

                finally {

                    setLoading(
                        false
                    );

                    setRefreshing(
                        false
                    );

                }

            },
            []
        );

    /*
    |--------------------------------------------------------------------------
    | Initial Load + Automatic Refresh
    |--------------------------------------------------------------------------
    */

    useEffect(
        () => {

            loadObservabilityData();

            const interval =
                setInterval(

                    loadObservabilityData,

                    5000

                );

            return () =>
                clearInterval(
                    interval
                );

        },
        [
            loadObservabilityData
        ]
    );

    /*
    |--------------------------------------------------------------------------
    | Page
    |--------------------------------------------------------------------------
    */

    return (

        <DashboardLayout>

            <div className="space-y-8">

                <ObservabilityHeader
                    hostname={
                        hostname
                    }
                    status={
                        hostStatus
                    }
                    refreshing={
                        refreshing
                    }
                    onRefresh={
                        () =>
                            loadObservabilityData(
                                true
                            )
                    }
                />

                {
                    error && (

                        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-red-300">

                            {error}

                        </div>

                    )
                }

                <MetricsOverview
                    metrics={
                        metrics
                    }
                    loading={
                        loading
                    }
                />

                <LiveMetrics
                    metrics={
                        metrics
                    }
                    loading={
                        loading
                    }
                />

                <MetricsHistoryChart
                    history={
                        history
                    }
                    hostname={
                        hostname
                    }
                />

                {/*
                |--------------------------------------------------------------------------
                | Future Observability Modules
                |--------------------------------------------------------------------------
                |
                | These sections still use placeholder data.
                |
                | They remain visible for now so we do not redesign the UI.
                |
                | LogsViewer will become real during the Logs milestone.
                | TracesPanel will become real when tracing is implemented.
                | ServiceHealth will be connected to service monitoring separately.
                |--------------------------------------------------------------------------
                */}

                <LogsViewer />

                <TracesPanel />

                <ServiceHealth />

                <ArchitectureDiagram />

            </div>

        </DashboardLayout>

    );

}