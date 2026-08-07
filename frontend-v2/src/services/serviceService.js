import api from "./api";

/*
|--------------------------------------------------------------------------
| Get Services
|--------------------------------------------------------------------------
*/

export async function getServices() {

    const response =
        await api.get(
            "/services"
        );

    return response.data.data;

}

/*
|--------------------------------------------------------------------------
| Create Service
|--------------------------------------------------------------------------
*/

export async function createService(
    service
) {

    const response =
        await api.post(
            "/services",
            {

                name:
                    service.name,

                url:
                    service.url,

                serviceType:
                    service.service_type,

                checkInterval:
                    Number(
                        service.check_interval
                    )

            }
        );

    return response.data;

}

/*
|--------------------------------------------------------------------------
| Delete Service
|--------------------------------------------------------------------------
*/

export async function deleteService(
    serviceId
) {

    const response =
        await api.delete(
            `/services/${serviceId}`
        );

    return response.data;

}

/*
|--------------------------------------------------------------------------
| Get Service Check History
|--------------------------------------------------------------------------
*/

export async function getServiceHistory(
    serviceId
) {

    const response =
        await api.get(
            `/checks/${serviceId}/history`
        );

    return response.data.data;

}