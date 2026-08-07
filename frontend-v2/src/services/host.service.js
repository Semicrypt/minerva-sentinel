import api from "./api";

export async function getHosts() {

    const response = await api.get(

        "/hosts"

    );

    return response.data.data;

}

export async function getHost(hostname) {

    const response = await api.get(

        `/hosts/${hostname}`

    );

    return response.data.data;

}