const ValidationError = require("../errors/ValidationError");

const repository = require("../repositories/service.repository");

/*
|--------------------------------------------------------------------------
| Create Service
|--------------------------------------------------------------------------
*/

async function createService(
    userId,
    name,
    url,
    serviceType,
    checkInterval
) {

    if (!name || !url || !serviceType) {

        throw new ValidationError(
            "All fields are required."
        );

    }

    return repository.createService(
        userId,
        name.trim(),
        url.trim(),
        serviceType.trim(),
        checkInterval || 60
    );

}

/*
|--------------------------------------------------------------------------
| Get User Services
|--------------------------------------------------------------------------
*/

async function getServices(userId) {

    return repository.getServicesByUser(userId);

}

/*
|--------------------------------------------------------------------------
| Get One Service
|--------------------------------------------------------------------------
*/

async function getServiceById(id, userId) {

    const service =
        await repository.getServiceById(id);

    if (!service) {

        return null;

    }

    if (service.user_id !== userId) {

        return null;

    }

    return service;

}

/*
|--------------------------------------------------------------------------
| Delete Service
|--------------------------------------------------------------------------
*/

async function deleteService(id, userId) {

    const service =
        await repository.getServiceById(id);

    if (!service) {

        throw new ValidationError(
            "Service not found."
        );

    }

    if (service.user_id !== userId) {

        throw new ValidationError(
            "Unauthorized."
        );

    }

    await repository.deleteService(id);

}

module.exports = {

    createService,
    getServices,
    getServiceById,
    deleteService

};