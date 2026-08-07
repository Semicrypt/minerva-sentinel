import api from "./api";

/*
|--------------------------------------------------------------------------
| Docker Engine Information
|--------------------------------------------------------------------------
*/

export async function getDockerInfo() {

    const response =
        await api.get(
            "/docker/info"
        );

    return response.data.data;

}

/*
|--------------------------------------------------------------------------
| Docker Containers
|--------------------------------------------------------------------------
*/

export async function getDockerContainers() {

    const response =
        await api.get(
            "/docker/containers"
        );

    return response.data.data;

}

/*
|--------------------------------------------------------------------------
| Single Docker Container
|--------------------------------------------------------------------------
*/

export async function getDockerContainer(
    id
) {

    const response =
        await api.get(
            `/docker/containers/${id}`
        );

    return response.data.data;

}

/*
|--------------------------------------------------------------------------
| Docker Images
|--------------------------------------------------------------------------
*/

export async function getDockerImages() {

    const response =
        await api.get(
            "/docker/images"
        );

    return response.data.data;

}

/*
|--------------------------------------------------------------------------
| Docker Networks
|--------------------------------------------------------------------------
*/

export async function getDockerNetworks() {

    const response =
        await api.get(
            "/docker/networks"
        );

    return response.data.data;

}

/*
|--------------------------------------------------------------------------
| Docker Volumes
|--------------------------------------------------------------------------
*/

export async function getDockerVolumes() {

    const response =
        await api.get(
            "/docker/volumes"
        );

    return response.data.data;

}