import api from "./api";

/*
|--------------------------------------------------------------------------
| Live Local System Metrics
|--------------------------------------------------------------------------
*/

export async function getSystemMetrics() {

    const response =
        await api.get(
            "/metrics/system"
        );

    return response.data.data;

}

/*
|--------------------------------------------------------------------------
| Latest Metrics - All Hosts
|--------------------------------------------------------------------------
*/

export async function getLatestMetrics() {

    const response =
        await api.get(
            "/metrics/latest"
        );

    return response.data.data;

}

/*
|--------------------------------------------------------------------------
| Latest Metrics - One Host
|--------------------------------------------------------------------------
*/

export async function getLatestMetric(
    hostname
) {

    const response =
        await api.get(
            `/metrics/${hostname}`
        );

    return response.data.data;

}

/*
|--------------------------------------------------------------------------
| Historical Metrics
|--------------------------------------------------------------------------
*/

export async function getMetricHistory(
    hostname,
    limit = 30
) {

    const response =
        await api.get(
            `/metrics/history?hostname=${encodeURIComponent(hostname)}&limit=${limit}`
        );

    return response.data.data;

}