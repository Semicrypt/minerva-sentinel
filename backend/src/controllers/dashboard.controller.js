const repository =
require("../repositories/dashboard.repository");

async function getSummary(req, res) {

    try {

        const summary =
        await repository.getSummary();

        return res.json({

            success: true,

            data: summary

        });

    }

    catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message:
            "Unable to load dashboard."

        });

    }

}

module.exports = {

    getSummary

};