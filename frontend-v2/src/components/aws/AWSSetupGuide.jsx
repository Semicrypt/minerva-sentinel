import {
    useState
} from "react";

import {
    Check,
    Copy,
    ExternalLink,
    Loader2,
    ShieldCheck,
    Terminal
} from "lucide-react";

import {
    buildAwsCliCommands,
    buildAwsTrustPolicy
} from "./aws-onboarding.utils";

/*
|--------------------------------------------------------------------------
| Clipboard Helper
|--------------------------------------------------------------------------
*/

async function copyToClipboard(
    value
) {
    if (
        navigator.clipboard?.writeText
    ) {
        await navigator.clipboard.writeText(
            value
        );

        return;
    }

    const textarea =
        document.createElement(
            "textarea"
        );

    textarea.value =
        value;

    textarea.style.position =
        "fixed";

    textarea.style.opacity =
        "0";

    document.body.appendChild(
        textarea
    );

    textarea.select();

    const copied =
        document.execCommand(
            "copy"
        );

    document.body.removeChild(
        textarea
    );

    if (!copied) {
        throw new Error(
            "Clipboard copy failed."
        );
    }
}

/*
|--------------------------------------------------------------------------
| Copy Button
|--------------------------------------------------------------------------
*/

function CopyButton({
    value,
    label = "Copy"
}) {
    const [
        copied,
        setCopied
    ] = useState(false);

    async function handleCopy() {
        if (!value) {
            return;
        }

        try {
            await copyToClipboard(
                value
            );

            setCopied(true);

            window.setTimeout(
                () => {
                    setCopied(false);
                },
                1800
            );
        } catch {
            setCopied(false);
        }
    }

    return (
        <button
            type="button"
            onClick={handleCopy}
            disabled={!value}
            className="
                inline-flex items-center gap-2
                rounded-lg border border-slate-700
                bg-slate-900 px-3 py-2
                text-xs font-semibold text-slate-200
                transition
                hover:border-cyan-500
                hover:text-cyan-300
                disabled:cursor-not-allowed
                disabled:opacity-50
            "
        >
            {
                copied
                    ? (
                        <Check
                            size={15}
                            className="text-emerald-400"
                        />
                    )
                    : (
                        <Copy
                            size={15}
                        />
                    )
            }

            {
                copied
                    ? "Copied"
                    : label
            }
        </button>
    );
}

/*
|--------------------------------------------------------------------------
| Copyable Value
|--------------------------------------------------------------------------
*/

function CopyableValue({
    label,
    value,
    multiline = false
}) {
    return (
        <div
            className="
                rounded-xl border border-slate-800
                bg-slate-950/60 p-4
            "
        >
            <div
                className="
                    mb-3 flex items-center
                    justify-between gap-3
                "
            >
                <p
                    className="
                        text-sm font-semibold
                        text-slate-200
                    "
                >
                    {label}
                </p>

                <CopyButton
                    value={value}
                />
            </div>

            <pre
                className={`
                    overflow-auto rounded-lg
                    bg-slate-950 p-3
                    text-xs leading-6 text-cyan-200
                    ${multiline
                        ? "max-h-64 whitespace-pre-wrap"
                        : "whitespace-pre-wrap break-all"
                    }
                `}
            >
                {value || "Not available"}
            </pre>
        </div>
    );
}

/*
|--------------------------------------------------------------------------
| Step Card
|--------------------------------------------------------------------------
*/

function StepCard({
    number,
    title,
    children
}) {
    return (
        <div
            className="
                rounded-2xl border border-slate-800
                bg-slate-950/30 p-5
            "
        >
            <div
                className="
                    mb-4 flex items-center gap-3
                "
            >
                <span
                    className="
                        flex h-8 w-8 shrink-0
                        items-center justify-center
                        rounded-full
                        bg-cyan-500/15
                        text-sm font-bold
                        text-cyan-300
                    "
                >
                    {number}
                </span>

                <h3
                    className="
                        text-lg font-semibold
                        text-white
                    "
                >
                    {title}
                </h3>
            </div>

            {children}
        </div>
    );
}

/*
|--------------------------------------------------------------------------
| AWS Setup Guide
|--------------------------------------------------------------------------
*/

export default function AWSSetupGuide({
    setup,
    connection,
    onVerify,
    isVerifying = false,
    verifyError = ""
}) {
    if (!connection) {
        return null;
    }

    const principalArn =
        String(
            setup?.principalArn || ""
        ).trim();

    const externalId =
        String(
            connection.externalId || ""
        ).trim();

    const roleName =
        String(
            setup?.roleName ||
            "MinervaSentinelReadOnlyRole"
        ).trim();

    const status =
        String(
            connection.status ||
            "PENDING"
        ).toUpperCase();

    const requestedAccountId =
        String(
            connection.roleArn || ""
        ).split(":")[4] ||
        connection.accountId ||
        "your AWS account";

    const setupReady =
        Boolean(
            principalArn &&
            externalId
        );

    let trustPolicyText = "";
    let commands = null;

    if (setupReady) {
        const trustPolicy =
            buildAwsTrustPolicy({
                principalArn,
                externalId
            });

        trustPolicyText =
            JSON.stringify(
                trustPolicy,
                null,
                2
            );

        commands =
            buildAwsCliCommands({
                roleName,
                principalArn,
                externalId
            });
    }

    const connected =
        status === "CONNECTED";

    const failed =
        status === "ERROR";

    const disconnected =
        status === "DISCONNECTED";

    const statusStyle =
        connected
            ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
            : failed
                ? "border-red-500/30 bg-red-500/10 text-red-300"
                : disconnected
                    ? "border-slate-600 bg-slate-800 text-slate-300"
                    : "border-amber-500/30 bg-amber-500/10 text-amber-300";

    return (
        <section
            className="
                rounded-3xl border border-slate-800
                bg-slate-900 p-5 sm:p-6
            "
        >
            <div
                className="
                    mb-6 flex flex-col gap-4
                    sm:flex-row
                    sm:items-start
                    sm:justify-between
                "
            >
                <div>
                    <p
                        className="
                            mb-2 text-xs font-bold
                            uppercase tracking-[0.2em]
                            text-cyan-400
                        "
                    >
                        AWS onboarding
                    </p>

                    <h2
                        className="
                            text-2xl font-bold
                            text-white
                        "
                    >
                        Finish connecting AWS
                    </h2>

                    <p
                        className="
                            mt-2 text-sm
                            text-slate-400
                        "
                    >
                        Connection:
                        {" "}
                        <span className="text-slate-200">
                            {connection.name}
                        </span>
                    </p>
                </div>

                <span
                    className={`
                        inline-flex w-fit items-center
                        rounded-full border
                        px-3 py-1.5
                        text-xs font-bold
                        ${statusStyle}
                    `}
                >
                    {status}
                </span>
            </div>

            <div
                className="
                    mb-5 grid gap-4
                    xl:grid-cols-2
                "
            >
                <CopyableValue
                    label="IAM role ARN"
                    value={connection.roleArn}
                />

                <CopyableValue
                    label="AWS External ID"
                    value={externalId}
                />
            </div>

            {
                !setupReady && (
                    <div
                        className="
                            mb-5 rounded-xl
                            border border-amber-500/30
                            bg-amber-500/10 p-4
                            text-sm text-amber-200
                        "
                    >
                        AWS setup information is unavailable.
                        Refresh the AWS page before continuing.
                    </div>
                )
            }

            {
                connected
                    ? (
                        <div
                            className="
                                flex items-start gap-3
                                rounded-2xl
                                border border-emerald-500/30
                                bg-emerald-500/10 p-5
                            "
                        >
                            <ShieldCheck
                                className="
                                    mt-0.5 shrink-0
                                    text-emerald-400
                                "
                                size={24}
                            />

                            <div>
                                <h3
                                    className="
                                        font-semibold
                                        text-emerald-200
                                    "
                                >
                                    AWS connection verified
                                </h3>

                                <p
                                    className="
                                        mt-1 text-sm
                                        text-emerald-100/70
                                    "
                                >
                                    Minerva can securely assume
                                    this read-only IAM role using
                                    temporary AWS credentials.
                                </p>
                            </div>
                        </div>
                    )
                    : (
                        <div className="space-y-5">
                            <StepCard
                                number="2"
                                title="Configure the IAM role"
                            >
                                <p
                                    className="
                                        mb-4 text-sm
                                        leading-6 text-slate-400
                                    "
                                >
                                    Sign in to AWS account
                                    {" "}
                                    <span
                                        className="
                                            font-semibold
                                            text-slate-200
                                        "
                                    >
                                        {requestedAccountId}
                                    </span>
                                    , open AWS CloudShell, then
                                    run these commands once in
                                    the displayed order.
                                </p>

                                <a
                                    href="https://console.aws.amazon.com/cloudshell/home"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="
                                        mb-5 inline-flex
                                        items-center gap-2
                                        rounded-lg
                                        bg-orange-500
                                        px-4 py-2.5
                                        text-sm font-semibold
                                        text-white
                                        transition
                                        hover:bg-orange-400
                                    "
                                >
                                    <Terminal
                                        size={17}
                                    />

                                    Open AWS CloudShell

                                    <ExternalLink
                                        size={15}
                                    />
                                </a>

                                {
                                    commands && (
                                        <div className="space-y-4">
                                            <CopyableValue
                                                label="1. Create the trusted IAM role"
                                                value={
                                                    commands.createRole
                                                }
                                                multiline
                                            />

                                            <CopyableValue
                                                label="2. Attach read-only permissions"
                                                value={
                                                    commands
                                                        .attachViewOnlyPolicy
                                                }
                                                multiline
                                            />

                                            <details
                                                className="
                                                    rounded-xl
                                                    border border-slate-800
                                                    bg-slate-950/40 p-4
                                                "
                                            >
                                                <summary
                                                    className="
                                                        cursor-pointer
                                                        text-sm font-semibold
                                                        text-slate-200
                                                    "
                                                >
                                                    View generated trust policy
                                                </summary>

                                                <div className="mt-4">
                                                    <CopyableValue
                                                        label="IAM trust policy"
                                                        value={
                                                            trustPolicyText
                                                        }
                                                        multiline
                                                    />
                                                </div>
                                            </details>
                                        </div>
                                    )
                                }
                            </StepCard>

                            <StepCard
                                number="3"
                                title="Verify the connection"
                            >
                                <p
                                    className="
                                        mb-4 text-sm
                                        leading-6 text-slate-400
                                    "
                                >
                                    After both AWS commands
                                    succeed, return here and
                                    verify the role. Minerva will
                                    use AWS STS on the backend;
                                    no permanent AWS access keys
                                    are stored.
                                </p>

                                {
                                    (
                                        verifyError ||
                                        connection.lastError
                                    ) && (
                                        <div
                                            className="
                                                mb-4 rounded-xl
                                                border border-red-500/30
                                                bg-red-500/10 p-4
                                                text-sm text-red-200
                                            "
                                        >
                                            {
                                                verifyError ||
                                                connection.lastError
                                            }
                                        </div>
                                    )
                                }

                                <button
                                    type="button"
                                    onClick={
                                        () =>
                                            onVerify?.(
                                                connection.id
                                            )
                                    }
                                    disabled={
                                        !setupReady ||
                                        isVerifying ||
                                        typeof onVerify !==
                                            "function"
                                    }
                                    className="
                                        inline-flex items-center
                                        justify-center gap-2
                                        rounded-xl
                                        bg-gradient-to-r
                                        from-blue-600
                                        to-cyan-500
                                        px-5 py-3
                                        text-sm font-bold
                                        text-white
                                        transition
                                        hover:from-blue-500
                                        hover:to-cyan-400
                                        disabled:cursor-not-allowed
                                        disabled:opacity-50
                                    "
                                >
                                    {
                                        isVerifying
                                            ? (
                                                <Loader2
                                                    size={18}
                                                    className="animate-spin"
                                                />
                                            )
                                            : (
                                                <ShieldCheck
                                                    size={18}
                                                />
                                            )
                                    }

                                    {
                                        isVerifying
                                            ? "Verifying..."
                                            : disconnected
                                                ? "Reconnect and verify"
                                                : "Verify AWS connection"
                                    }
                                </button>
                            </StepCard>
                        </div>
                    )
            }
        </section>
    );
}
