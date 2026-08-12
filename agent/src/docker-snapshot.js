const docker =
    require("./docker");

function number(value) {
    const result = Number(value);

    return Number.isFinite(result)
        ? result
        : 0;
}

function text(value) {
    if (
        value === undefined ||
        value === null
    ) {
        return null;
    }

    return String(value);
}

function sanitizePorts(ports) {
    if (!Array.isArray(ports)) {
        return [];
    }

    return ports.map(port => ({
        ip:
            text(port.IP),

        privatePort:
            number(port.PrivatePort),

        publicPort:
            port.PublicPort === undefined
                ? null
                : number(port.PublicPort),

        type:
            text(port.Type)
    }));
}

function sanitizeMemory(memory) {
    const value =
        memory &&
        typeof memory === "object"
            ? memory
            : {};

    return {
        usedBytes:
            number(value.usedBytes),

        limitBytes:
            number(value.limitBytes),

        usedMB:
            number(value.usedMB),

        limitMB:
            number(value.limitMB),

        percent:
            number(value.percent)
    };
}

function sanitizeNetworkUsage(network) {
    const value =
        network &&
        typeof network === "object"
            ? network
            : {};

    return {
        rxBytes:
            number(value.rxBytes),

        txBytes:
            number(value.txBytes),

        rxMB:
            number(value.rxMB),

        txMB:
            number(value.txMB)
    };
}

function sanitizeEngineInfo(info) {
    const value =
        info &&
        typeof info === "object"
            ? info
            : {};

    return {
        containers:
            number(value.containers),

        running:
            number(value.running),

        paused:
            number(value.paused),

        stopped:
            number(value.stopped),

        images:
            number(value.images),

        serverVersion:
            text(value.serverVersion),

        operatingSystem:
            text(value.operatingSystem),

        architecture:
            text(value.architecture),

        cpus:
            number(value.cpus),

        memoryBytes:
            number(value.memoryBytes),

        memoryMB:
            number(value.memoryMB),

        name:
            text(value.name)
    };
}

function sanitizeContainers(containers) {
    if (!Array.isArray(containers)) {
        return [];
    }

    return containers.map(container => ({
        id:
            text(container.id),

        shortId:
            text(container.shortId),

        name:
            text(container.name),

        image:
            text(container.image),

        imageId:
            text(container.imageId),

        state:
            text(container.state),

        status:
            text(container.status),

        created:
            text(container.created),

        ports:
            sanitizePorts(
                container.ports
            ),

        cpuPercent:
            number(
                container.cpuPercent
            ),

        memory:
            sanitizeMemory(
                container.memory
            ),

        network:
            sanitizeNetworkUsage(
                container.network
            )
    }));
}

function sanitizeImages(images) {
    if (!Array.isArray(images)) {
        return [];
    }

    return images.map(image => ({
        id:
            text(image.id),

        shortId:
            text(image.shortId),

        repoTags:
            Array.isArray(image.repoTags)
                ? image.repoTags
                    .filter(Boolean)
                    .map(String)
                : [],

        sizeBytes:
            number(image.sizeBytes),

        sizeMB:
            number(image.sizeMB),

        created:
            text(image.created),

        containers:
            number(image.containers),

        inUse:
            Boolean(image.inUse)
    }));
}

function sanitizeNetworks(networks) {
    if (!Array.isArray(networks)) {
        return [];
    }

    return networks.map(network => ({
        id:
            text(network.id),

        shortId:
            text(network.shortId),

        name:
            text(network.name),

        driver:
            text(network.driver),

        scope:
            text(network.scope),

        internal:
            Boolean(network.internal),

        attachable:
            Boolean(network.attachable),

        ingress:
            Boolean(network.ingress),

        containers:
            number(network.containers)
    }));
}

function sanitizeVolumes(volumes) {
    if (!Array.isArray(volumes)) {
        return [];
    }

    return volumes.map(volume => ({
        name:
            text(volume.name),

        driver:
            text(volume.driver),

        mountpoint:
            text(volume.mountpoint),

        scope:
            text(volume.scope),

        createdAt:
            text(
                volume.createdAt ||
                volume.created
            ),

        sizeBytes:
            number(volume.sizeBytes),

        sizeMB:
            number(volume.sizeMB),

        refCount:
            number(volume.refCount)
    }));
}

async function collectDockerSnapshot() {
    const [
        engineInfo,
        containers,
        images,
        networks,
        volumes
    ] = await Promise.all([
        docker.getDockerInfo(),
        docker.getContainers(),
        docker.getImages(),
        docker.getNetworks(),
        docker.getVolumes()
    ]);

    return {
        engineInfo:
            sanitizeEngineInfo(
                engineInfo
            ),

        containers:
            sanitizeContainers(
                containers
            ),

        images:
            sanitizeImages(
                images
            ),

        networks:
            sanitizeNetworks(
                networks
            ),

        volumes:
            sanitizeVolumes(
                volumes
            ),

        collectedAt:
            new Date().toISOString()
    };
}

module.exports = {
    collectDockerSnapshot
};
