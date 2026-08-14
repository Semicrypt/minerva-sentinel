const repository =
    require(
        "../repositories/aws-connection.repository"
    );

const stsService =
    require(
        "../services/aws-sts.service"
    );

const ROLE_ARN_PATTERN =
    /^arn:[^:]+:iam::[0-9]{12}:role\/.+$/;

const REGION_PATTERN =
    /^[a-z0-9-]{3,32}$/;

function getUserId(req) {
    const userId =
        Number(req.user?.id);

    return Number.isInteger(userId) &&
        userId > 0
        ? userId
        : null;
}

function getConnectionId(req) {
    const connectionId =
        Number(req.params?.id);

    return Number.isInteger(connectionId) &&
        connectionId > 0
        ? connectionId
        : null;
}

function getAwsFailure(error) {
    if (
        error?.statusCode &&
        error.statusCode < 500
    ) {
        return {
            statusCode: error.statusCode,
            message: error.message
        };
    }

    const errorName =
        String(error?.name || "");

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
            statusCode: 400,
            message:
                "AWS denied the role assumption. Check the role trust policy, External ID and Minerva server IAM permission."
        };
    }

    return {
        statusCode: 502,
        message:
            "AWS could not verify this IAM role. Check the role ARN, region, trust policy and External ID."
    };
}

async function createConnection(
    req,
    res,
    next
) {
    try {
        const userId =
            getUserId(req);

        if (!userId) {
            return res.status(401).json({
                success: false,
                message:
                    "Authenticated user is invalid."
            });
        }

        const name =
            String(
                req.body?.name || ""
            ).trim();

        const roleArn =
            String(
                req.body?.roleArn || ""
            ).trim();

        const region =
            String(
                req.body?.region || ""
            )
                .trim()
                .toLowerCase();

        if (!name) {
            return res.status(400).json({
                success: false,
                message:
                    "AWS connection name is required."
            });
        }

        if (name.length > 100) {
            return res.status(400).json({
                success: false,
                message:
                    "AWS connection name must not exceed 100 characters."
            });
        }

        if (
            roleArn.length > 2048 ||
            !ROLE_ARN_PATTERN.test(roleArn)
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "A valid AWS IAM role ARN is required."
            });
        }

        if (
            !REGION_PATTERN.test(region)
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "A valid AWS region is required."
            });
        }

        const connection =
            await repository
                .createConnection({
                    userId,
                    name,
                    roleArn,
                    region
                });

        return res.status(201).json({
            success: true,
            message:
                "AWS connection created. Add its External ID to the IAM role trust policy, then verify the connection.",
            data: connection
        });
    } catch (error) {
        if (
            error.code === "23505" &&
            error.constraint ===
                "aws_connections_user_name_key"
        ) {
            return res.status(409).json({
                success: false,
                message:
                    "An AWS connection with this name already exists."
            });
        }

        return next(error);
    }
}

async function getConnections(
    req,
    res,
    next
) {
    try {
        const userId =
            getUserId(req);

        if (!userId) {
            return res.status(401).json({
                success: false,
                message:
                    "Authenticated user is invalid."
            });
        }

        const connections =
            await repository
                .getConnections(userId);

        return res.json({
            success: true,
            data: connections
        });
    } catch (error) {
        return next(error);
    }
}

async function verifyConnection(
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
        const connection =
            await repository
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

        let identity;

        try {
            identity =
                await stsService
                    .verifyRoleConnection({
                        userId,
                        connectionId,
                        roleArn:
                            connection.roleArn,
                        region:
                            connection.region,
                        externalId:
                            connection.externalId
                    });
        } catch (error) {
            const failure =
                getAwsFailure(error);

            const failedConnection =
                await repository
                    .markError({
                        connectionId,
                        userId,
                        lastError:
                            failure.message
                    });

            if (!failedConnection) {
                return res.status(404).json({
                    success: false,
                    message:
                        "AWS connection was not found."
                });
            }

            return res
                .status(failure.statusCode)
                .json({
                    success: false,
                    message:
                        failure.message,
                    data:
                        failedConnection
                });
        }

        const connectedConnection =
            await repository
                .markConnected({
                    connectionId,
                    userId,
                    accountId:
                        identity.accountId
                });

        if (!connectedConnection) {
            return res.status(404).json({
                success: false,
                message:
                    "AWS connection was not found."
            });
        }

        return res.json({
            success: true,
            message:
                "AWS account connected and verified successfully.",
            data: connectedConnection
        });
    } catch (error) {
        return next(error);
    }
}

async function disconnectConnection(
    req,
    res,
    next
) {
    try {
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

        const connection =
            await repository
                .disconnectConnection(
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

        return res.json({
            success: true,
            message:
                "AWS connection disconnected. Its configuration and verification history were preserved.",
            data: connection
        });
    } catch (error) {
        return next(error);
    }
}

async function deleteConnection(
    req,
    res,
    next
) {
    try {
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

        const connection =
            await repository
                .deleteConnection(
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

        return res.json({
            success: true,
            message:
                "AWS connection deleted.",
            data: connection
        });
    } catch (error) {
        return next(error);
    }
}

module.exports = {
    createConnection,
    getConnections,
    verifyConnection,
    disconnectConnection,
    deleteConnection
};