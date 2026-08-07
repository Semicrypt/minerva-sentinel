const {
    getSystemMetrics
} =
    require("./system");

const {
    sendMetrics
} =
    require("./sender");

const {
    API_URL,
    INTERVAL
} =
    require("./config");

/*
|--------------------------------------------------------------------------
| Run Agent Cycle
|--------------------------------------------------------------------------
*/

async function runAgent() {

    try {

        const metrics =
            await getSystemMetrics();

        console.clear();

        console.log(
            "=========================================="
        );

        console.log(
            "     Minerva Sentinel Agent (MSA)"
        );

        console.log(
            "=========================================="
        );

        console.log();

        console.log(
            `Backend: ${API_URL}`
        );

        console.log(
            `Interval: ${INTERVAL / 1000}s`
        );

        console.log();

        console.table(
            metrics
        );

        await sendMetrics(
            metrics
        );

    }

    catch (error) {

        console.error(
            "\n❌ Agent Error:"
        );

        console.error(
            error.message
        );

    }

}

/*
|--------------------------------------------------------------------------
| Start Agent
|--------------------------------------------------------------------------
*/

console.log(
    "🚀 Starting Minerva Sentinel Agent..."
);

runAgent();

setInterval(

    runAgent,

    INTERVAL

);