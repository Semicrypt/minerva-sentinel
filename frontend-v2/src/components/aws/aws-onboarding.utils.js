export const AWS_VIEW_ONLY_POLICY_ARN =
    "arn:aws:iam::aws:policy/job-function/ViewOnlyAccess";

const AWS_ACCOUNT_ID_PATTERN =
    /^[0-9]{12}$/;

const AWS_ROLE_ARN_PATTERN =
    /^arn:[a-z0-9-]+:iam::[0-9]{12}:role\/[A-Za-z0-9+=,.@_/-]+$/;

const AWS_PRINCIPAL_ARN_PATTERN =
    /^arn:[a-z0-9-]+:iam::[0-9]{12}:role\/[A-Za-z0-9+=,.@_/-]+$/;

const AWS_ROLE_NAME_PATTERN =
    /^[A-Za-z0-9+=,.@_-]{1,64}$/;

const EXTERNAL_ID_PATTERN =
    /^msaws_[0-9a-f]{32,64}$/;

const ACCOUNT_ID_TOKEN =
    "<AWS_ACCOUNT_ID>";

function normalizedString(
    value
) {
    return String(
        value ?? ""
    ).trim();
}

export function isValidAwsAccountId(
    accountId
) {
    return AWS_ACCOUNT_ID_PATTERN.test(
        normalizedString(
            accountId
        )
    );
}

export function buildAwsRoleArn({
    accountId,
    roleArnTemplate
}) {
    const verifiedAccountId =
        normalizedString(
            accountId
        );

    const verifiedTemplate =
        normalizedString(
            roleArnTemplate
        );

    if (
        !isValidAwsAccountId(
            verifiedAccountId
        )
    ) {
        throw new Error(
            "AWS account ID must contain exactly 12 digits."
        );
    }

    const templateParts =
        verifiedTemplate.split(
            ACCOUNT_ID_TOKEN
        );

    if (
        templateParts.length !== 2
    ) {
        throw new Error(
            "AWS role ARN template is invalid."
        );
    }

    const roleArn =
        templateParts.join(
            verifiedAccountId
        );

    if (
        !AWS_ROLE_ARN_PATTERN.test(
            roleArn
        )
    ) {
        throw new Error(
            "Generated AWS role ARN is invalid."
        );
    }

    return roleArn;
}

export function buildAwsTrustPolicy({
    principalArn,
    externalId
}) {
    const verifiedPrincipalArn =
        normalizedString(
            principalArn
        );

    const verifiedExternalId =
        normalizedString(
            externalId
        );

    if (
        !AWS_PRINCIPAL_ARN_PATTERN.test(
            verifiedPrincipalArn
        )
    ) {
        throw new Error(
            "Minerva Sentinel AWS principal ARN is invalid."
        );
    }

    if (
        !EXTERNAL_ID_PATTERN.test(
            verifiedExternalId
        )
    ) {
        throw new Error(
            "AWS connection External ID is invalid."
        );
    }

    return JSON.stringify(
        {
            Version:
                "2012-10-17",

            Statement: [
                {
                    Sid:
                        "AllowMinervaSentinel",

                    Effect:
                        "Allow",

                    Principal: {
                        AWS:
                            verifiedPrincipalArn
                    },

                    Action:
                        "sts:AssumeRole",

                    Condition: {
                        StringEquals: {
                            "sts:ExternalId":
                                verifiedExternalId
                        }
                    }
                }
            ]
        },
        null,
        2
    );
}

export function buildAwsCliCommands({
    roleName,
    principalArn,
    externalId
}) {
    const verifiedRoleName =
        normalizedString(
            roleName
        );

    if (
        !AWS_ROLE_NAME_PATTERN.test(
            verifiedRoleName
        )
    ) {
        throw new Error(
            "AWS connection role name is invalid."
        );
    }

    const trustPolicy =
        buildAwsTrustPolicy({
            principalArn,
            externalId
        });

    const createRole =
        [
            "aws iam create-role \\",
            `  --role-name ${verifiedRoleName} \\`,
            "  --assume-role-policy-document " +
                `'${trustPolicy}'`
        ].join("\n");

    const attachViewOnlyPolicy =
        [
            "aws iam attach-role-policy \\",
            `  --role-name ${verifiedRoleName} \\`,
            "  --policy-arn " +
                AWS_VIEW_ONLY_POLICY_ARN
        ].join("\n");

    return {
        createRole,
        attachViewOnlyPolicy
    };
}
