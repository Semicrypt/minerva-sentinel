import api from "./api";

/*
|--------------------------------------------------------------------------
| User Docker Connections
|--------------------------------------------------------------------------
*/

export async function getDockerConnections() {
    const response =
        await api.get(
            "/docker/connections"
        );

    return Array.isArray(
        response.data?.data
    )
        ? response.data.data
        : [];
}

export async function createDockerConnection(
    name
) {
    const response =
        await api.post(
            "/docker/connections",
            {
                name
            }
        );

    return response.data?.data;
}

export async function disconnectDockerConnection(
    connectionId
) {
    const response =
        await api.delete(
            `/docker/connections/${connectionId}`
        );

    return response.data;
}

/*
|--------------------------------------------------------------------------
| User-Owned Docker Snapshot Data
|--------------------------------------------------------------------------
*/

export async function getDockerInfo() {
    const response =
        await api.get(
            "/docker/info"
        );

    const engineInfo =
        response.data?.data;

    if (
        !engineInfo ||
        typeof engineInfo !== "object" ||
        Array.isArray(engineInfo)
    ) {
        return engineInfo;
    }

    /*
    | Preserve the connection metadata returned
    | by the snapshot API. ContainersHeader uses
    | its ID for the disconnect request.
    */

    return {
        ...engineInfo,

        minervaConnection:
            response.data?.connection || null
    };
}

export async function getDockerContainers() {
    const response =
        await api.get(
            "/docker/containers"
        );

    return response.data?.data || [];
}

export async function getDockerContainer(
    id
) {
    const response =
        await api.get(
            `/docker/containers/${id}`
        );

    return response.data?.data;
}

export async function getDockerImages() {
    const response =
        await api.get(
            "/docker/images"
        );

    return response.data?.data || [];
}

export async function getDockerNetworks() {
    const response =
        await api.get(
            "/docker/networks"
        );

    return response.data?.data || [];
}

export async function getDockerVolumes() {
    const response =
        await api.get(
            "/docker/volumes"
        );

    return response.data?.data || [];
}