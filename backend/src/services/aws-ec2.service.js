const {
    EC2Client,
    DescribeInstancesCommand
} = require("@aws-sdk/client-ec2");

const stsService =
    require("./aws-sts.service");

/*
|---------------------------------------------------------------------------
| EC2 Instance Normalization
|---------------------------------------------------------------------------
*/

function getInstanceName(tags) {
    if (!Array.isArray(tags)) {
        return null;
    }

    const nameTag =
        tags.find(
            tag =>
                tag?.Key === "Name"
        );

    const name =
        String(
            nameTag?.Value || ""
        ).trim();

    return name || null;
}

function toIsoString(value) {
    if (!value) {
        return null;
    }

    const date =
        value instanceof Date
            ? value
            : new Date(value);

    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
        return null;
    }

    return date.toISOString();
}

function normalizeInstance(instance) {
    return {
        instanceId:
            instance?.InstanceId || null,

        name:
            getInstanceName(
                instance?.Tags
            ),

        state:
            String(
                instance?.State?.Name ||
                "unknown"
            ),

        instanceType:
            instance?.InstanceType || null,

        imageId:
            instance?.ImageId || null,

        architecture:
            instance?.Architecture || null,

        platformDetails:
            instance?.PlatformDetails ||
            null,

        availabilityZone:
            instance?.Placement
                ?.AvailabilityZone ||
            null,

        privateIpAddress:
            instance?.PrivateIpAddress ||
            null,

        publicIpAddress:
            instance?.PublicIpAddress ||
            null,

        privateDnsName:
            instance?.PrivateDnsName ||
            null,

        publicDnsName:
            instance?.PublicDnsName ||
            null,

        vpcId:
            instance?.VpcId || null,

        subnetId:
            instance?.SubnetId || null,

        monitoringState:
            instance?.Monitoring?.State ||
            null,

        launchTime:
            toIsoString(
                instance?.LaunchTime
            )
    };
}

function createSummary(instances) {
    const stateCounts = {};

    for (
        const instance
        of instances
    ) {
        const state =
            String(
                instance?.state ||
                "unknown"
            );

        stateCounts[state] =
            (stateCounts[state] || 0) +
            1;
    }

    return {
        total:
            instances.length,

        running:
            stateCounts.running || 0,

        pending:
            stateCounts.pending || 0,

        stopping:
            stateCounts.stopping || 0,

        stopped:
            stateCounts.stopped || 0,

        shuttingDown:
            stateCounts[
                "shutting-down"
            ] || 0,

        terminated:
            stateCounts.terminated || 0,

        unknown:
            stateCounts.unknown || 0,

        states:
            stateCounts
    };
}

function sortInstances(instances) {
    return instances.sort(
        (
            first,
            second
        ) => {
            const firstLabel =
                first.name ||
                first.instanceId ||
                "";

            const secondLabel =
                second.name ||
                second.instanceId ||
                "";

            return firstLabel.localeCompare(
                secondLabel
            );
        }
    );
}

/*
|---------------------------------------------------------------------------
| Account-Scoped EC2 Inventory
|---------------------------------------------------------------------------
|
| The connection must already have been loaded using both its connection ID
| and authenticated user ID before this service is called.
|
| Temporary AWS credentials remain inside this backend operation and are
| never returned in the inventory response.
|---------------------------------------------------------------------------
*/

async function getEc2Inventory({
    userId,
    connection
}) {
    return stsService
        .withAssumedRoleCredentials(
            {
                userId,

                connectionId:
                    connection?.id,

                roleArn:
                    connection?.roleArn,

                region:
                    connection?.region,

                externalId:
                    connection?.externalId
            },

            async ({
                accountId,
                region,
                credentials
            }) => {
                const ec2Client =
                    new EC2Client({
                        region,
                        credentials
                    });

                try {
                    const instances = [];

                    let nextToken = null;

                    do {
                        const input = {
                            MaxResults: 1000
                        };

                        if (nextToken) {
                            input.NextToken =
                                nextToken;
                        }

                        const response =
                            await ec2Client.send(
                                new DescribeInstancesCommand(
                                    input
                                )
                            );

                        const reservations =
                            Array.isArray(
                                response?.Reservations
                            )
                                ? response.Reservations
                                : [];

                        for (
                            const reservation
                            of reservations
                        ) {
                            const reservationInstances =
                                Array.isArray(
                                    reservation?.Instances
                                )
                                    ? reservation.Instances
                                    : [];

                            for (
                                const instance
                                of reservationInstances
                            ) {
                                instances.push(
                                    normalizeInstance(
                                        instance
                                    )
                                );
                            }
                        }

                        nextToken =
                            response?.NextToken ||
                            null;
                    } while (nextToken);

                    sortInstances(
                        instances
                    );

                    return {
                        connectionId:
                            Number(
                                connection.id
                            ),

                        accountId,

                        region,

                        collectedAt:
                            new Date()
                                .toISOString(),

                        summary:
                            createSummary(
                                instances
                            ),

                        instances
                    };
                } finally {
                    ec2Client.destroy();
                }
            }
        );
}

module.exports = {
    getEc2Inventory
};
