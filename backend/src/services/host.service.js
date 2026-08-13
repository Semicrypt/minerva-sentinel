const repository =
    require("../repositories/host.repository");

async function getHosts(userId) {
    return repository.getHosts(
        userId
    );
}

async function getHostByHostname(
    userId,
    hostname
) {
    return repository
        .getHostByHostname(
            userId,
            hostname
        );
}

module.exports = {
    getHosts,
    getHostByHostname
};