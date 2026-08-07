const repository = require("../repositories/incident.repository");

async function getAllIncidents(req, res) {

    try {

        const incidents =
            await repository.getAllIncidents();

        return res.json({

            success: true,

            data: incidents

        });

    }

    catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message: "Unable to load incidents."

        });

    }

}

module.exports = {

    getAllIncidents

};