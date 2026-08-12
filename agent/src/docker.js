const Docker = require("dockerode");

/*
|--------------------------------------------------------------------------
| Docker Connection
|--------------------------------------------------------------------------
*/

const docker = new Docker({
    socketPath: "/var/run/docker.sock"
});

/*
|--------------------------------------------------------------------------
| Helper: Round
|--------------------------------------------------------------------------
*/

function round(value, decimals = 2) {

    const number = Number(value);

    if (!Number.isFinite(number)) {
        return 0;
    }

    return Number(
        number.toFixed(decimals)
    );

}

/*
|--------------------------------------------------------------------------
| Helper: Bytes To MB
|--------------------------------------------------------------------------
*/

function bytesToMB(bytes) {

    return round(
        Number(bytes || 0) /
        1024 /
        1024
    );

}

/*
|--------------------------------------------------------------------------
| Calculate CPU Usage
|--------------------------------------------------------------------------
*/

function calculateCpuPercent(stats) {

    if (!stats) {
        return 0;
    }

    const cpuStats =
        stats.cpu_stats || {};

    const previousCpuStats =
        stats.precpu_stats || {};

    const cpuDelta =
        (
            cpuStats.cpu_usage?.total_usage || 0
        ) -
        (
            previousCpuStats.cpu_usage?.total_usage || 0
        );

    const systemDelta =
        (
            cpuStats.system_cpu_usage || 0
        ) -
        (
            previousCpuStats.system_cpu_usage || 0
        );

    const onlineCpus =
        cpuStats.online_cpus ||
        cpuStats.cpu_usage?.percpu_usage?.length ||
        1;

    if (
        cpuDelta <= 0 ||
        systemDelta <= 0
    ) {

        return 0;

    }

    return round(
        (
            cpuDelta /
            systemDelta
        ) *
        onlineCpus *
        100
    );

}

/*
|--------------------------------------------------------------------------
| Calculate Memory Usage
|--------------------------------------------------------------------------
*/

function calculateMemory(stats) {

    if (!stats) {

        return {
            usedBytes: 0,
            limitBytes: 0,
            usedMB: 0,
            limitMB: 0,
            percent: 0
        };

    }

    const memoryStats =
        stats.memory_stats || {};

    const totalUsage =
        Number(
            memoryStats.usage || 0
        );

    const cache =
        Number(
            memoryStats.stats?.inactive_file ??
            memoryStats.stats?.cache ??
            0
        );

    const used =
        Math.max(
            totalUsage - cache,
            0
        );

    const limit =
        Number(
            memoryStats.limit || 0
        );

    const percent =
        limit > 0
            ? round(
                (used / limit) * 100
            )
            : 0;

    return {

        usedBytes:
            used,

        limitBytes:
            limit,

        usedMB:
            bytesToMB(used),

        limitMB:
            bytesToMB(limit),

        percent

    };

}

/*
|--------------------------------------------------------------------------
| Calculate Network Usage
|--------------------------------------------------------------------------
*/

function calculateNetwork(stats) {

    if (!stats) {

        return {
            rxBytes: 0,
            txBytes: 0,
            rxMB: 0,
            txMB: 0
        };

    }

    const networks =
        stats.networks || {};

    let rxBytes = 0;
    let txBytes = 0;

    for (
        const network of
        Object.values(networks)
    ) {

        rxBytes +=
            Number(
                network.rx_bytes || 0
            );

        txBytes +=
            Number(
                network.tx_bytes || 0
            );

    }

    return {

        rxBytes,

        txBytes,

        rxMB:
            bytesToMB(rxBytes),

        txMB:
            bytesToMB(txBytes)

    };

}

/*
|--------------------------------------------------------------------------
| Format Container Name
|--------------------------------------------------------------------------
*/

function getContainerName(names) {

    if (
        !Array.isArray(names) ||
        names.length === 0
    ) {

        return "unknown";

    }

    return names[0]
        .replace(
            /^\//,
            ""
        );

}

/*
|--------------------------------------------------------------------------
| Docker Engine Information
|--------------------------------------------------------------------------
*/

async function getDockerInfo() {

    const info =
        await docker.info();

    return {

        containers:
            Number(
                info.Containers || 0
            ),

        running:
            Number(
                info.ContainersRunning || 0
            ),

        paused:
            Number(
                info.ContainersPaused || 0
            ),

        stopped:
            Number(
                info.ContainersStopped || 0
            ),

        images:
            Number(
                info.Images || 0
            ),

        serverVersion:
            info.ServerVersion || null,

        operatingSystem:
            info.OperatingSystem || null,

        architecture:
            info.Architecture || null,

        cpus:
            Number(
                info.NCPU || 0
            ),

        memoryBytes:
            Number(
                info.MemTotal || 0
            ),

        memoryMB:
            bytesToMB(
                info.MemTotal
            ),

        name:
            info.Name || null

    };

}

/*
|--------------------------------------------------------------------------
| Get Containers
|--------------------------------------------------------------------------
*/

async function getContainers() {

    const containers =
        await docker.listContainers({
            all: true
        });

    const results = [];

    for (
        const containerInfo of
        containers
    ) {

        const container =
            docker.getContainer(
                containerInfo.Id
            );

        let stats = null;

        if (
            containerInfo.State ===
            "running"
        ) {

            try {

                stats =
                    await container.stats({
                        stream: false
                    });

            }

            catch (error) {

                console.error(
                    `Unable to read stats for ${getContainerName(containerInfo.Names)}:`,
                    error.message
                );

            }

        }

        results.push({

            id:
                containerInfo.Id,

            shortId:
                containerInfo.Id.substring(
                    0,
                    12
                ),

            name:
                getContainerName(
                    containerInfo.Names
                ),

            image:
                containerInfo.Image,

            imageId:
                containerInfo.ImageID,

            state:
                containerInfo.State,

            status:
                containerInfo.Status,

            created:
                containerInfo.Created
                    ? new Date(
                        containerInfo.Created *
                        1000
                    ).toISOString()
                    : null,

            ports:
                containerInfo.Ports || [],

            labels:
                containerInfo.Labels || {},

            cpuPercent:
                calculateCpuPercent(
                    stats
                ),

            memory:
                calculateMemory(
                    stats
                ),

            network:
                calculateNetwork(
                    stats
                )

        });

    }

    return results;

}

/*
|--------------------------------------------------------------------------
| Get One Container
|--------------------------------------------------------------------------
*/

async function getContainer(
    containerId
) {

    const container =
        docker.getContainer(
            containerId
        );

    const inspect =
        await container.inspect();

    let stats = null;

    if (
        inspect.State?.Running
    ) {

        try {

            stats =
                await container.stats({
                    stream: false
                });

        }

        catch (error) {

            console.error(
                `Unable to read stats for container ${containerId}:`,
                error.message
            );

        }

    }

    return {

        id:
            inspect.Id,

        shortId:
            inspect.Id
                ? inspect.Id.substring(
                    0,
                    12
                )
                : null,

        name:
            inspect.Name
                ? inspect.Name.replace(
                    /^\//,
                    ""
                )
                : "unknown",

        image:
            inspect.Config?.Image ||
            null,

        imageId:
            inspect.Image ||
            null,

        state:
            inspect.State ||
            null,

        platform:
            inspect.Platform ||
            null,

        restartCount:
            Number(
                inspect.RestartCount || 0
            ),

        created:
            inspect.Created ||
            null,

        hostname:
            inspect.Config?.Hostname ||
            null,

        cpuPercent:
            calculateCpuPercent(
                stats
            ),

        memory:
            calculateMemory(
                stats
            ),

        network:
            calculateNetwork(
                stats
            )

    };

}
/*
|--------------------------------------------------------------------------
| Get Docker Images
|--------------------------------------------------------------------------
*/

async function getImages() {

    const images =
        await docker.listImages({
            all: false
        });

    const containers =
        await docker.listContainers({
            all: true
        });

    return images.map(
        image => {

            const imageId =
                String(
                    image.Id || ""
                );

            const repoTags =
                Array.isArray(
                    image.RepoTags
                )
                    ? image.RepoTags.filter(
                        Boolean
                    )
                    : [];

            const containerCount =
                containers.filter(
                    container =>
                        container.ImageID ===
                        imageId
                ).length;

            return {

                id:
                    imageId,

                shortId:
                    imageId
                        .replace(
                            /^sha256:/,
                            ""
                        )
                        .substring(
                            0,
                            12
                        ),

                repoTags,

                sizeBytes:
                    Number(
                        image.Size || 0
                    ),

                sizeMB:
                    bytesToMB(
                        image.Size
                    ),

                created:
                    image.Created
                        ? new Date(
                            image.Created *
                            1000
                        ).toISOString()
                        : null,

                containers:
                    containerCount,

                inUse:
                    containerCount > 0

            };

        }
    );

}

/*
|--------------------------------------------------------------------------
| Get Docker Networks
|--------------------------------------------------------------------------
*/

async function getNetworks() {

    const networks =
        await docker.listNetworks();

    const results = [];

    for (
        const networkInfo of
        networks
    ) {

        try {

            const network =
                docker.getNetwork(
                    networkInfo.Id
                );

            const inspect =
                await network.inspect();

            const attachedContainers =
                inspect.Containers || {};

            results.push({

                id:
                    inspect.Id,

                shortId:
                    String(
                        inspect.Id || ""
                    ).substring(
                        0,
                        12
                    ),

                name:
                    inspect.Name,

                driver:
                    inspect.Driver,

                scope:
                    inspect.Scope,

                internal:
                    Boolean(
                        inspect.Internal
                    ),

                attachable:
                    Boolean(
                        inspect.Attachable
                    ),

                ingress:
                    Boolean(
                        inspect.Ingress
                    ),

                containers:
                    Object.keys(
                        attachedContainers
                    ).length,

                created:
                    inspect.Created ||
                    null,

                labels:
                    inspect.Labels || {}

            });

        }

        catch (error) {

            console.error(
                `Unable to inspect Docker network ${networkInfo.Name}:`,
                error.message
            );

            results.push({

                id:
                    networkInfo.Id,

                shortId:
                    String(
                        networkInfo.Id || ""
                    ).substring(
                        0,
                        12
                    ),

                name:
                    networkInfo.Name,

                driver:
                    networkInfo.Driver,

                scope:
                    networkInfo.Scope,

                internal:
                    Boolean(
                        networkInfo.Internal
                    ),

                attachable:
                    Boolean(
                        networkInfo.Attachable
                    ),

                ingress:
                    Boolean(
                        networkInfo.Ingress
                    ),

                containers: 0,

                created:
                    networkInfo.Created ||
                    null,

                labels:
                    networkInfo.Labels || {}

            });

        }

    }

    return results;

}

/*
|--------------------------------------------------------------------------
| Get Docker Volumes
|--------------------------------------------------------------------------
*/

async function getVolumes() {

    const result =
        await docker.listVolumes();

    const volumes =
        Array.isArray(
            result.Volumes
        )
            ? result.Volumes
            : [];

    return volumes.map(
        volume => {

            return {

                name:
                    volume.Name,

                driver:
                    volume.Driver,

                mountpoint:
                    volume.Mountpoint,

                scope:
                    volume.Scope,

                createdAt:
                    volume.CreatedAt ||
                    null,

                labels:
                    volume.Labels || {}

            };

        }
    );

}

/*
|--------------------------------------------------------------------------
| Exports
|--------------------------------------------------------------------------
*/

module.exports = {

    getDockerInfo,

    getContainers,

    getContainer,

    getImages,

    getNetworks,

    getVolumes

};