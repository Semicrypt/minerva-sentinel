const axios = require("axios");

const serviceRepository = require("../repositories/service.repository");
const incidentService = require("./incident.service");

let io = null;

function setSocketIO(socketServer) {

    io = socketServer;

}

async function monitorServices() {

    console.log("\n================================");
    console.log("Monitoring Cycle Started");
    console.log("================================");

    const services = await serviceRepository.getAllServices();

    const updates = [];

    for (const service of services) {

        try {

            const start = Date.now();

            const response = await axios.get(service.url, {

                timeout: 10000

            });

            const responseTime = Date.now() - start;

            console.log(
                `✅ ${service.name} | ${response.status} | ${responseTime} ms`
            );

            await serviceRepository.updateServiceStatus(
                service.id,
                "UP"
            );

            await serviceRepository.createCheck(
                service.id,
                "UP",
                responseTime,
                response.status
            );

            await incidentService.processIncident(
                service,
                "UP"
            );

            updates.push({

                id: service.id,
                name: service.name,
                status: "UP",
                responseTime,
                httpStatus: response.status

            });

        }

        catch (error) {

            const httpStatus =
                error.response?.status || 0;

            console.log(
                `❌ ${service.name} | DOWN`
            );

            await serviceRepository.updateServiceStatus(
                service.id,
                "DOWN"
            );

            await serviceRepository.createCheck(
                service.id,
                "DOWN",
                0,
                httpStatus
            );

            await incidentService.processIncident(
                service,
                "DOWN"
            );

            updates.push({

                id: service.id,
                name: service.name,
                status: "DOWN",
                responseTime: 0,
                httpStatus

            });

        }

    }

    if (io) {

        io.emit("monitor:update", {

            updatedAt: new Date().toISOString(),

            services: updates

        });

    }

}

module.exports = {

    monitorServices,

    setSocketIO

};