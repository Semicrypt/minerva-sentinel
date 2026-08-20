const TRUST_PRINCIPAL_ARN_PATTERN =
    /^arn:([a-z0-9-]+):iam::([0-9]{12}):role\/([A-Za-z0-9+=,.@_/-]+)$/;

const CONNECTION_ROLE_NAME =
    "MinervaSentinelReadOnlyRole";

function getSetup(
    req,
    res
) {
    const principalArn =
        String(
            process.env
                .AWS_TRUST_PRINCIPAL_ARN ||
            ""
        ).trim();

    const principalMatch =
        TRUST_PRINCIPAL_ARN_PATTERN.exec(
            principalArn
        );

    if (!principalMatch) {
        return res.status(503).json({
            success: false,
            message:
                "AWS connection setup is not configured on this Minerva Sentinel server."
        });
    }

    const partition =
        principalMatch[1];

    const principalAccountId =
        principalMatch[2];

    return res.json({
        success: true,
        data: {
            principalArn,
            principalAccountId,

            roleName:
                CONNECTION_ROLE_NAME,

            roleArnTemplate:
                `arn:${partition}:iam::` +
                `<AWS_ACCOUNT_ID>:role/` +
                CONNECTION_ROLE_NAME,

            externalIdRequired: true
        }
    });
}

module.exports = {
    getSetup
};
