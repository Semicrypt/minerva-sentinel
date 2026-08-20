const connectionRepository =
    require(
        "../repositories/aws-connection.repository"
    );

const ec2Service =
    require(
        "../services/aws-ec2.service"
    );

function getUserId(req) {
    const userId =
        Number(
            req.user?.id
        );

    return (
        Number.isInteger(userId) &&
        userId > 0
    )
        ? userId
        : null;
}

function getConnectionId(req) {
    const connectionId =
        Number(
            req.params?.id
        );

    return (
        Number.isInteger(connectionId) &&
        connectionId > 0
    )
        ? connectionId
        : null;
}

function getAwsResourceFailure(error) {
    if (
        error?.statusCode &&
        error.statusCode < 500
    ) {
        return {
            statusCode:
                error.statusCode,

            message:
                error.message
        };
    }

    const errorName =
        String(
            error?.name || ""
        );

    if (
        errorName ===
            "CredentialsProviderError" ||
        errorName ===
            "InvalidClientTokenId" ||
        errorName ===
            "ExpiredToken" ||
        errorName ===
            "UnrecognizedClientException"
    ) {
        return {
            statusCode: 503,

            message:
                "Minerva Sentinel's server-side AWS identity is unavailable or invalid."
        };
    }

    if (
        errorName === "AccessDenied" ||
        errorName ===
            "AccessDeniedException"
    ) {
        return {
            statusCode: 403,

            message:
                "AWS denied access to the connected role. Check its trust policy and External ID, then verify the connection again."
        };
    }

    if (
        errorName ===
        "UnauthorizedOperation"
    ) {
        return {
            statusCode: 403,

            message:
                "The connected AWS role cannot describe EC2 instances. Ensure its read-only policy allows ec2:DescribeInstances."
        };
    }

    return {
        statusCode: 502,

        message:
            "Minerva Sentinel could not retrieve EC2 resources from AWS."
    };
}

async function getEc2Inventory(
    req,
    res,
    next
) {
    const userId =
        getUserId(req);

    const connectionId =
        getConnectionId(req);

    if (!userId) {
        return res.status(401).json({
            success: false,

            message:
                "Authenticated user is invalid."
        });
    }

    if (!connectionId) {
        return res.status(400).json({
            success: false,

            message:
                "AWS connection ID is invalid."
        });
    }

    try {
        /*
        | Account ownership is enforced by querying with both
        | connection ID and authenticated user ID.
        */

        const connection =
            await connectionRepository
                .getConnectionById(
                    connectionId,
                    userId
                );

        if (!connection) {
            return res.status(404).json({
                success: false,

                message:
                    "AWS connection was not found."
            });
        }

        const status =
            String(
                connection.status || ""
            ).toUpperCase();

        if (status !== "CONNECTED") {
            return res.status(409).json({
                success: false,

                message:
                    "AWS connection must be connected before resources can be discovered."
            });
        }

        let inventory;

        try {
            inventory =
                await ec2Service
                    .getEc2Inventory({
                        userId,
                        connection
                    });
        } catch (error) {
            const failure =
                getAwsResourceFailure(
                    error
                );

            return res
                .status(
                    failure.statusCode
                )
                .json({
                    success: false,

                    message:
                        failure.message
                });
        }

        return res.json({
            success: true,

            data:
                inventory
        });
    } catch (error) {
        return next(error);
    }
}

module.exports = {
    getEc2Inventory
};
