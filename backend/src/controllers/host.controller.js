const hostService =
require("../services/host.service");

/*
|--------------------------------------------------------------------------
| Get All Hosts
|--------------------------------------------------------------------------
*/

async function getAll(req, res, next) {

    try {

        const hosts =
            await hostService.getHosts();

        res.json({

            success: true,

            data: hosts

        });

    }

    catch (error) {

        next(error);

    }

}

/*
|--------------------------------------------------------------------------
| Get One Host
|--------------------------------------------------------------------------
*/

async function getOne(req, res, next) {

    try {

        const host =
            await hostService.getHostByHostname(

                req.params.hostname

            );

        if (!host) {

            return res.status(404).json({

                success: false,

                message: "Host not found."

            });

        }

        res.json({

            success: true,

            data: host

        });

    }

    catch (error) {

        next(error);

    }

}

module.exports = {

    getAll,

    getOne

};