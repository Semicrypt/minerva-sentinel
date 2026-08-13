import api from "./api";

export async function getIncidents() {
    const response = await api.get(
        "/incidents"
    );

    return response.data?.data || [];
}

export async function acknowledgeAllIncidents() {
    const response = await api.patch(
        "/incidents/acknowledge-all"
    );

    return response.data;
}

export async function acknowledgeIncident(
    incidentId
) {
    const response = await api.patch(
        `/incidents/${incidentId}/acknowledge`
    );

    return response.data;
}

export async function resolveIncident(
    incidentId
) {
    const response = await api.patch(
        `/incidents/${incidentId}/resolve`
    );

    return response.data;
}

export async function recordIncidentRootCause(
    incidentId,
    details
) {
    const response = await api.post(
        `/incidents/${incidentId}/root-cause`,
        {
            details
        }
    );

    return response.data;
}

export async function recordIncidentRemediation(
    incidentId,
    details
) {
    const response = await api.post(
        `/incidents/${incidentId}/remediation`,
        {
            details
        }
    );

    return response.data;
}