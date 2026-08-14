const {
    STSClient,
    AssumeRoleCommand,
    GetCallerIdentityCommand
} = require("@aws-sdk/client-sts");

const ValidationError =
    require("../errors/ValidationError");

const ROLE_ARN_PATTERN =
    /^arn:[^:]+:iam::([0-9]{12}):role\/.+$/;

const REGION_PATTERN =
    /^[a-z0-9-]{3,32}$/;

const EXTERNAL_ID_PATTERN =
    /^msaws_[0-9a-f]{32,64}$/;

function getPositiveInteger(
    value,
    message
) {
    const number =
        Number(value);

    if (
        !Number.isInteger(number) ||
        number <= 0
    ) {
        throw new ValidationError(
            message
        );
    }

    return number;
}

function validateRoleArn(roleArn) {
    const normalizedRoleArn =
        String(roleArn || "").trim();

    const match =
        ROLE_ARN_PATTERN.exec(
            normalizedRoleArn
        );

    if (!match) {
        throw new ValidationError(
            "AWS IAM role ARN is invalid."
        );
    }

    return {
        roleArn: normalizedRoleArn,
        accountId: match[1]
    };
}

function validateRegion(region) {
    const normalizedRegion =
        String(region || "")
            .trim()
            .toLowerCase();

    if (
        !REGION_PATTERN.test(
            normalizedRegion
        )
    ) {
        throw new ValidationError(
            "AWS region is invalid."
        );
    }

    return normalizedRegion;
}

function validateExternalId(externalId) {
    const normalizedExternalId =
        String(externalId || "").trim();

    if (
        !EXTERNAL_ID_PATTERN.test(
            normalizedExternalId
        )
    ) {
        throw new ValidationError(
            "AWS External ID is invalid."
        );
    }

    return normalizedExternalId;
}

function createRoleSessionName(
    userId,
    connectionId
) {
    const timestamp =
        Date.now().toString(36);

    return (
        `minerva-${userId}-` +
        `${connectionId}-${timestamp}`
    ).slice(0, 64);
}

function getTemporaryCredentials(
    response
) {
    const credentials =
        response?.Credentials;

    if (
        !credentials?.AccessKeyId ||
        !credentials?.SecretAccessKey ||
        !credentials?.SessionToken
    ) {
        throw new Error(
            "AWS STS did not return usable temporary credentials."
        );
    }

    return {
        accessKeyId:
            credentials.AccessKeyId,

        secretAccessKey:
            credentials.SecretAccessKey,

        sessionToken:
            credentials.SessionToken,

        expiration:
            credentials.Expiration
    };
}

async function verifyRoleConnection({
    userId,
    connectionId,
    roleArn,
    region,
    externalId
}) {
    const verifiedUserId =
        getPositiveInteger(
            userId,
            "Authenticated user ID is invalid."
        );

    const verifiedConnectionId =
        getPositiveInteger(
            connectionId,
            "AWS connection ID is invalid."
        );

    const role =
        validateRoleArn(roleArn);

    const verifiedRegion =
        validateRegion(region);

    const verifiedExternalId =
        validateExternalId(
            externalId
        );

    const sourceClient =
        new STSClient({
            region: verifiedRegion
        });

    let assumedRoleClient = null;

    try {
        const assumeRoleResponse =
            await sourceClient.send(
                new AssumeRoleCommand({
                    RoleArn:
                        role.roleArn,

                    RoleSessionName:
                        createRoleSessionName(
                            verifiedUserId,
                            verifiedConnectionId
                        ),

                    ExternalId:
                        verifiedExternalId,

                    DurationSeconds: 900
                })
            );

        const temporaryCredentials =
            getTemporaryCredentials(
                assumeRoleResponse
            );

        assumedRoleClient =
            new STSClient({
                region:
                    verifiedRegion,

                credentials:
                    temporaryCredentials
            });

        const identity =
            await assumedRoleClient.send(
                new GetCallerIdentityCommand({})
            );

        const accountId =
            String(
                identity?.Account || ""
            ).trim();

        const principalArn =
            String(
                identity?.Arn || ""
            ).trim();

        if (
            !/^[0-9]{12}$/.test(
                accountId
            )
        ) {
            throw new Error(
                "AWS STS returned an invalid account ID."
            );
        }

        if (
            accountId !==
            role.accountId
        ) {
            throw new Error(
                "The assumed AWS account does not match the IAM role ARN."
            );
        }

        if (!principalArn) {
            throw new Error(
                "AWS STS did not return the assumed role ARN."
            );
        }

        return {
            accountId,
            principalArn,
            principalId:
                identity?.UserId || null
        };
    } finally {
        if (assumedRoleClient) {
            assumedRoleClient.destroy();
        }

        sourceClient.destroy();
    }
}

module.exports = {
    verifyRoleConnection
};
