const serviceService = require("../services/service.service");

/*
|--------------------------------------------------------------------------
| Create Service
|--------------------------------------------------------------------------
*/

async function create(req, res, next) {

    try {

        const {

            name,
            url,
            serviceType,
            checkInterval

        } = req.body;

        const service =
            await serviceService.createService(

                req.user.id,

                name,

                url,

                serviceType,

                checkInterval

            );

        res.status(201).json({

            success: true,

            message: "Service added successfully.",

            data: service

        });

    }

    catch (error) {

        next(error);

    }

}

/*
|--------------------------------------------------------------------------
| Get All Services
|--------------------------------------------------------------------------
*/

async function getAll(req, res, next) {

    try {

        const services =
            await serviceService.getServices(

                req.user.id

            );

        res.json({

            success: true,

            data: services

        });

    }

    catch (error) {

        next(error);

    }

}

/*
|--------------------------------------------------------------------------
| Get Single Service
|--------------------------------------------------------------------------
*/

async function getById(req, res, next) {

    try {

        const service =
            await serviceService.getServiceById(

                req.params.id,

                req.user.id

            );

        if (!service) {

            return res.status(404).json({

                success: false,

                message: "Service not found."

            });

        }

        res.json({

            success: true,

            data: service

        });

    }

    catch (error) {

        next(error);

    }

}

/*
|--------------------------------------------------------------------------
| Delete Service
|--------------------------------------------------------------------------
*/

async function remove(req, res, next) {

    try {

        await serviceService.deleteService(

            req.params.id,

            req.user.id

        );

        res.json({

            success: true,

            message: "Service deleted successfully."

        });

    }

    catch (error) {

        next(error);

    }

}

module.exports = {

    create,
    getAll,
    getById,
    remove

};