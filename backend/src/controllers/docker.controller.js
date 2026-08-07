const dockerService =
require("../services/docker.service");

/*
|--------------------------------------------------------------------------
| Docker Info
|--------------------------------------------------------------------------
*/

async function info(
    req,
    res,
    next
) {

    try {

        const data =
            await dockerService
                .getDockerInfo();

        res.json({

            success: true,

            data

        });

    }

    catch (error) {

        next(error);

    }

}

/*
|--------------------------------------------------------------------------
| Containers
|--------------------------------------------------------------------------
*/

async function containers(
    req,
    res,
    next
) {

    try {

        const data =
            await dockerService
                .getContainers();

        res.json({

            success: true,

            count:
                data.length,

            data

        });

    }

    catch (error) {

        next(error);

    }

}

/*
|--------------------------------------------------------------------------
| Single Container
|--------------------------------------------------------------------------
*/

async function container(
    req,
    res,
    next
) {

    try {

        const data =
            await dockerService
                .getContainer(
                    req.params.id
                );

        res.json({

            success: true,

            data

        });

    }

    catch (error) {

        next(error);

    }

}

/*
|--------------------------------------------------------------------------
| Images
|--------------------------------------------------------------------------
*/

async function images(
    req,
    res,
    next
) {

    try {

        const data =
            await dockerService
                .getImages();

        res.json({

            success: true,

            count:
                data.length,

            data

        });

    }

    catch (error) {

        next(error);

    }

}

/*
|--------------------------------------------------------------------------
| Networks
|--------------------------------------------------------------------------
*/

async function networks(
    req,
    res,
    next
) {

    try {

        const data =
            await dockerService
                .getNetworks();

        res.json({

            success: true,

            count:
                data.length,

            data

        });

    }

    catch (error) {

        next(error);

    }

}

/*
|--------------------------------------------------------------------------
| Volumes
|--------------------------------------------------------------------------
*/

async function volumes(
    req,
    res,
    next
) {

    try {

        const data =
            await dockerService
                .getVolumes();

        res.json({

            success: true,

            count:
                data.length,

            data

        });

    }

    catch (error) {

        next(error);

    }

}

module.exports = {

    info,

    containers,

    container,

    images,

    networks,

    volumes

};