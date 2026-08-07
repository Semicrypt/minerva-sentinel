const repository =
require("../repositories/host.repository");

/*
|--------------------------------------------------------------------------
| Get All Hosts
|--------------------------------------------------------------------------
*/

async function getHosts() {

    return repository.getHosts();

}

/*
|--------------------------------------------------------------------------
| Get One Host
|--------------------------------------------------------------------------
*/

async function getHostByHostname(hostname) {

    const hosts =
        await repository.getHosts();

    return hosts.find(

        host => host.hostname === hostname

    ) || null;

}

module.exports = {

    getHosts,

    getHostByHostname

};