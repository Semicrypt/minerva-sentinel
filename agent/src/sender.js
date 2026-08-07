const axios =
    require("axios");

const {
    API_URL,
    API_KEY
} =
    require("./config");

/*
|--------------------------------------------------------------------------
| Send Metrics
|--------------------------------------------------------------------------
*/

async function sendMetrics(metrics) {

    try {

        const headers = {

            "Content-Type":
                "application/json"

        };

        /*
        | Send agent key when configured.
        |
        | The backend does not enforce this yet.
        | We will use it later when securing agent ingestion.
        */

        if (API_KEY) {

            headers[
                "X-Minerva-Agent-Key"
            ] =
                API_KEY;

        }

        const response =
            await axios.post(

                API_URL,

                metrics,

                {

                    headers,

                    timeout: 10000

                }

            );

        console.log(
            "✅ Metrics sent successfully"
        );

        return response.data;

    }

    catch (error) {

        console.error(
            "❌ Failed to send metrics"
        );

        if (
            error.response
        ) {

            console.error(
                `HTTP ${error.response.status}`
            );

            console.error(
                error.response.data
            );

        }
        else {

            console.error(
                error.message
            );

        }

        return null;

    }

}

module.exports = {

    sendMetrics

};