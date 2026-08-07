const repository = require("../repositories/incident.repository");

/**
 * Handle service status changes
 */
async function processIncident(service, status) {

    // Check if there is already an open incident
    const openIncident =
        await repository.getOpenIncident(service.id);

    // Service just went DOWN
    if (status === "DOWN") {

        if (!openIncident) {

            await repository.createIncident(

                service.id,

                `${service.name} is DOWN`,

                `${service.name} failed its health check.`

            );

            console.log(
                `🚨 Incident created for ${service.name}`
            );

        }

        return;
    }

    // Service came back UP
    if (status === "UP") {

        if (openIncident) {

            await repository.resolveIncident(service.id);

            console.log(
                `✅ Incident resolved for ${service.name}`
            );

        }

    }

}

module.exports = {

    processIncident

};