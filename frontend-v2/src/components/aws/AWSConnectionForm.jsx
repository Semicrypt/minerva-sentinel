import {
    useMemo,
    useState
} from "react";

import {
    ArrowRight,
    Cloud,
    Hash,
    LoaderCircle,
    MapPin,
    ShieldCheck
} from "lucide-react";

import {
    buildAwsRoleArn,
    isValidAwsAccountId
} from "./aws-onboarding.utils";

const REGION_PATTERN =
    /^[a-z0-9-]{3,32}$/;

function requestErrorMessage(
    error
) {
    return (
        error.response?.data?.message ||
        error.message ||
        "Unable to create the AWS connection."
    );
}

export default function AWSConnectionForm({
    setup,
    creating = false,
    requestError = "",
    onCreate
}) {
    const [
        name,
        setName
    ] = useState("");

    const [
        accountId,
        setAccountId
    ] = useState("");

    const [
        region,
        setRegion
    ] = useState("");

    const [
        formError,
        setFormError
    ] = useState("");

    const setupReady =
        Boolean(
            setup?.roleArnTemplate &&
            setup?.roleName &&
            setup?.principalArn
        );

    const roleArn =
        useMemo(
            () => {
                if (
                    !setupReady ||
                    !isValidAwsAccountId(
                        accountId
                    )
                ) {
                    return "";
                }

                try {
                    return buildAwsRoleArn({
                        accountId,
                        roleArnTemplate:
                            setup.roleArnTemplate
                    });
                } catch {
                    return "";
                }
            },
            [
                accountId,
                setup,
                setupReady
            ]
        );

    async function handleSubmit(
        event
    ) {
        event.preventDefault();

        setFormError("");

        const verifiedName =
            name.trim();

        const verifiedRegion =
            region
                .trim()
                .toLowerCase();

        if (!setupReady) {
            setFormError(
                "AWS setup configuration is still loading."
            );

            return;
        }

        if (!verifiedName) {
            setFormError(
                "Connection name is required."
            );

            return;
        }

        if (
            verifiedName.length > 100
        ) {
            setFormError(
                "Connection name must not exceed 100 characters."
            );

            return;
        }

        if (
            !isValidAwsAccountId(
                accountId
            )
        ) {
            setFormError(
                "AWS account ID must contain exactly 12 digits."
            );

            return;
        }

        if (
            !REGION_PATTERN.test(
                verifiedRegion
            )
        ) {
            setFormError(
                "Enter a valid AWS region such as eu-north-1."
            );

            return;
        }

        if (!roleArn) {
            setFormError(
                "Unable to generate the AWS role ARN."
            );

            return;
        }

        if (
            typeof onCreate !==
            "function"
        ) {
            setFormError(
                "AWS connection creation is unavailable."
            );

            return;
        }

        try {
            await onCreate({
                name:
                    verifiedName,

                accountId,

                region:
                    verifiedRegion,

                roleArn
            });
        } catch (
            error
        ) {
            setFormError(
                requestErrorMessage(
                    error
                )
            );
        }
    }

    const visibleError =
        formError ||
        requestError;

    return (
        <section
            className="
                rounded-3xl
                border
                border-slate-800
                bg-slate-950/30
                p-5
            "
        >
            <div className="flex items-start gap-4">
                <div
                    className="
                        flex
                        h-11
                        w-11
                        shrink-0
                        items-center
                        justify-center
                        rounded-2xl
                        bg-orange-500/10
                    "
                >
                    <Cloud
                        size={22}
                        className="text-orange-400"
                    />
                </div>

                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
                        Step 1
                    </p>

                    <h3 className="mt-1 text-xl font-bold text-white">
                        Create AWS connection
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-400">
                        Enter account details only. Minerva Sentinel never
                        asks for AWS access keys or secret keys.
                    </p>
                </div>
            </div>

            <form
                className="mt-6 space-y-5"
                onSubmit={handleSubmit}
                autoComplete="off"
            >
                <div>
                    <label
                        htmlFor="aws-connection-name"
                        className="text-sm font-semibold text-slate-300"
                    >
                        Connection name
                    </label>

                    <input
                        id="aws-connection-name"
                        type="text"
                        value={name}
                        maxLength={100}
                        disabled={creating}
                        onChange={
                            event =>
                                setName(
                                    event.target.value
                                )
                        }
                        placeholder="Production AWS"
                        className="
                            mt-2
                            w-full
                            rounded-xl
                            border
                            border-slate-700
                            bg-slate-900
                            px-4
                            py-3
                            text-white
                            outline-none
                            transition
                            placeholder:text-slate-600
                            focus:border-cyan-500
                            disabled:cursor-not-allowed
                            disabled:opacity-60
                        "
                    />
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                    <div>
                        <label
                            htmlFor="aws-account-id"
                            className="text-sm font-semibold text-slate-300"
                        >
                            AWS account ID
                        </label>

                        <div className="relative mt-2">
                            <Hash
                                size={17}
                                className="
                                    pointer-events-none
                                    absolute
                                    left-4
                                    top-1/2
                                    -translate-y-1/2
                                    text-slate-500
                                "
                            />

                            <input
                                id="aws-account-id"
                                type="text"
                                inputMode="numeric"
                                value={accountId}
                                maxLength={12}
                                disabled={creating}
                                onChange={
                                    event =>
                                        setAccountId(
                                            event.target
                                                .value
                                                .replace(
                                                    /\D/g,
                                                    ""
                                                )
                                                .slice(
                                                    0,
                                                    12
                                                )
                                        )
                                }
                                placeholder="123456789012"
                                className="
                                    w-full
                                    rounded-xl
                                    border
                                    border-slate-700
                                    bg-slate-900
                                    py-3
                                    pl-11
                                    pr-4
                                    font-mono
                                    text-white
                                    outline-none
                                    transition
                                    placeholder:text-slate-600
                                    focus:border-cyan-500
                                    disabled:cursor-not-allowed
                                    disabled:opacity-60
                                "
                            />
                        </div>
                    </div>

                    <div>
                        <label
                            htmlFor="aws-region"
                            className="text-sm font-semibold text-slate-300"
                        >
                            Primary AWS region
                        </label>

                        <div className="relative mt-2">
                            <MapPin
                                size={17}
                                className="
                                    pointer-events-none
                                    absolute
                                    left-4
                                    top-1/2
                                    -translate-y-1/2
                                    text-slate-500
                                "
                            />

                            <input
                                id="aws-region"
                                type="text"
                                value={region}
                                maxLength={32}
                                disabled={creating}
                                onChange={
                                    event =>
                                        setRegion(
                                            event.target
                                                .value
                                                .toLowerCase()
                                                .replace(
                                                    /\s/g,
                                                    ""
                                                )
                                        )
                                }
                                placeholder="eu-north-1"
                                className="
                                    w-full
                                    rounded-xl
                                    border
                                    border-slate-700
                                    bg-slate-900
                                    py-3
                                    pl-11
                                    pr-4
                                    text-white
                                    outline-none
                                    transition
                                    placeholder:text-slate-600
                                    focus:border-cyan-500
                                    disabled:cursor-not-allowed
                                    disabled:opacity-60
                                "
                            />
                        </div>
                    </div>
                </div>

                <div
                    className="
                        rounded-2xl
                        border
                        border-slate-800
                        bg-slate-900/60
                        p-4
                    "
                >
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-300">
                        <ShieldCheck
                            size={17}
                            className="text-emerald-400"
                        />

                        Generated read-only role ARN
                    </div>

                    <code className="mt-3 block break-all text-sm text-cyan-300">
                        {roleArn ||
                            "Enter your 12-digit AWS account ID"}
                    </code>
                </div>

                {visibleError && (
                    <div
                        role="alert"
                        className="
                            rounded-xl
                            border
                            border-rose-500/20
                            bg-rose-500/10
                            px-4
                            py-3
                            text-sm
                            text-rose-300
                        "
                    >
                        {visibleError}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={
                        creating ||
                        !setupReady
                    }
                    className="
                        flex
                        w-full
                        items-center
                        justify-center
                        gap-3
                        rounded-xl
                        bg-gradient-to-r
                        from-blue-600
                        to-cyan-500
                        px-5
                        py-3
                        font-semibold
                        text-white
                        transition
                        hover:brightness-110
                        disabled:cursor-not-allowed
                        disabled:opacity-60
                    "
                >
                    {creating ? (
                        <>
                            <LoaderCircle
                                size={18}
                                className="animate-spin"
                            />

                            Creating connection...
                        </>
                    ) : (
                        <>
                            Create secure connection

                            <ArrowRight size={18} />
                        </>
                    )}
                </button>
            </form>
        </section>
    );
}
