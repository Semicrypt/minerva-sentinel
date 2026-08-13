import api from "./api";

/*
|--------------------------------------------------------------------------
| Host Inventory
|--------------------------------------------------------------------------
*/

export async function getHosts() {
    const response =
        await api.get(
            "/hosts"
        );

    return response.data?.data || [];
}

export async function getHost(
    hostname
) {
    const response =
        await api.get(
            `/hosts/${encodeURIComponent(
                hostname
            )}`
        );

    return response.data?.data || null;
}

/*
|--------------------------------------------------------------------------
| Host Connections
|--------------------------------------------------------------------------
*/

export async function getHostConnections() {
    const response =
        await api.get(
            "/hosts/connections"
        );

    return response.data?.data || [];
}

export async function createHostConnection(
    name
) {
    const response =
        await api.post(
            "/hosts/connections",
            {
                name
            }
        );

    /*
    | Return the connection and its one-time private key directly.
    |
    | Backend response:
    | {
    |     success,
    |     message,
    |     data: {
    |         connection,
    |         agentKey
    |     }
    | }
    */

    return response.data?.data || null;
}

/*
|--------------------------------------------------------------------------
| Disconnect Host
|--------------------------------------------------------------------------
|
| This revokes future uploads while preserving the host and history.
|--------------------------------------------------------------------------
*/

export async function disconnectHostConnection(
    connectionId
) {
    const response =
        await api.patch(
            `/hosts/connections/${connectionId}/disconnect`
        );

    return response.data;
}

/*
|--------------------------------------------------------------------------
| Delete Host
|--------------------------------------------------------------------------
|
| This permanently deletes the connection, connected host and its
| account-owned metric history.
|--------------------------------------------------------------------------
*/

export async function deleteHostConnection(
    connectionId
) {
    const response =
        await api.delete(
            `/hosts/connections/${connectionId}`
        );

    return response.data;
}