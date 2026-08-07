import api from "./api";

export async function getDashboardSummary(token) {

    const response = await api.get(

        "/dashboard/summary",

        {

            headers: {

                Authorization: `Bearer ${token}`

            }

        }

    );

    return response.data;

}