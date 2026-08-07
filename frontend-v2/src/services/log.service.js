import api from "./api";

export async function getLogs(options = {}) {

    const params =
        new URLSearchParams();

    if (options.level) {

        params.set(
            "level",
            options.level
        );

    }

    if (options.source) {

        params.set(
            "source",
            options.source
        );

    }

    if (options.search) {

        params.set(
            "search",
            options.search
        );

    }

    if (options.limit) {

        params.set(
            "limit",
            options.limit
        );

    }

    const query =
        params.toString();

    const response =
        await api.get(
            query
                ? `/logs?${query}`
                : "/logs"
        );

    return response.data.data;

}

export async function getLogStats() {

    const response =
        await api.get(
            "/logs/stats"
        );

    return response.data.data;

}

export async function getLogSources() {

    const response =
        await api.get(
            "/logs/sources"
        );

    return response.data.data;

}
