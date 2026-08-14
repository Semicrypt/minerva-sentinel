import api from "./api";

/*
|---------------------------------------------------------------------------
| AWS Onboarding Configuration
|---------------------------------------------------------------------------
*/

export async function getAwsSetup() {
    const response =
        await api.get(
            "/aws/setup"
        );

    return response.data?.data || null;
}

/*
|---------------------------------------------------------------------------
| AWS Connections
|---------------------------------------------------------------------------
*/

export async function getAwsConnections() {
    const response =
        await api.get(
            "/aws/connections"
        );

    return Array.isArray(
        response.data?.data
    )
        ? response.data.data
        : [];
}

export async function createAwsConnection({
    name,
    roleArn,
    region
}) {
    const response =
        await api.post(
            "/aws/connections",
            {
                name,
                roleArn,
                region
            }
        );

    return response.data?.data || null;
}

export async function verifyAwsConnection(
    connectionId
) {
    const response =
        await api.post(
            `/aws/connections/${connectionId}/verify`
        );

    return response.data;
}

export async function disconnectAwsConnection(
    connectionId
) {
    const response =
        await api.patch(
            `/aws/connections/${connectionId}/disconnect`
        );

    return response.data;
}

export async function deleteAwsConnection(
    connectionId
) {
    const response =
        await api.delete(
            `/aws/connections/${connectionId}`
        );

    return response.data;
}