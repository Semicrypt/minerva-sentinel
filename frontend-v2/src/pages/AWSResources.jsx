import {
    useCallback,
    useEffect,
    useMemo,
    useState
} from "react";

import DashboardLayout from "../layouts/DashboardLayout";

import AWSHeader from "../components/aws/AWSHeader";
import AWSConnectionForm from "../components/aws/AWSConnectionForm";
import AWSConnectionsList from "../components/aws/AWSConnectionsList";
import AWSSetupGuide from "../components/aws/AWSSetupGuide";

import {
    createAwsConnection,
    deleteAwsConnection,
    disconnectAwsConnection,
    getAwsConnections,
    getAwsSetup,
    verifyAwsConnection
} from "../services/aws.service";

const HEADER_PRIORITY = [
    "CONNECTED",
    "PENDING",
    "ERROR",
    "DISCONNECTED"
];

const SETUP_PRIORITY = [
    "PENDING",
    "ERROR",
    "DISCONNECTED",
    "CONNECTED"
];

function normalizeStatus(
    connection
) {
    return String(
        connection?.status || ""
    ).toUpperCase();
}

function selectByStatus(
    connections,
    priority
) {
    for (
        const status
        of priority
    ) {
        const connection =
            connections.find(
                item =>
                    normalizeStatus(
                        item
                    ) === status
            );

        if (connection) {
            return connection;
        }
    }

    return connections[0] || null;
}

function requestErrorMessage(
    error,
    fallback
) {
    return (
        error?.response?.data?.message ||
        error?.message ||
        fallback
    );
}

function replaceConnection(
    connections,
    updatedConnection
) {
    return connections.map(
        connection =>
            Number(connection.id) ===
            Number(updatedConnection.id)
                ? updatedConnection
                : connection
    );
}

function getResponseConnection(
    response
) {
    if (
        response?.data?.id
    ) {
        return response.data;
    }

    if (
        response?.id
    ) {
        return response;
    }

    return null;
}

function Feedback({
    tone,
    message
}) {
    if (!message) {
        return null;
    }

    const toneClass =
        tone === "success"
            ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
            : "border-red-500/30 bg-red-500/10 text-red-200";

    return (
        <div
            role={
                tone === "success"
                    ? "status"
                    : "alert"
            }
            className={`
                rounded-2xl border
                px-5 py-4
                text-sm leading-6
                ${toneClass}
            `}
        >
            {message}
        </div>
    );
}

function LoadingPanel() {
    return (
        <section
            className="
                rounded-3xl border
                border-cyan-500/20
                bg-cyan-500/5
                p-8
            "
        >
            <h2
                className="
                    text-xl font-semibold
                    text-white
                "
            >
                Loading AWS connections
            </h2>

            <p
                className="
                    mt-2 text-sm
                    text-slate-400
                "
            >
                Loading your account-scoped AWS
                setup and saved connections.
            </p>
        </section>
    );
}

export default function AWSResources() {
    const [
        setup,
        setSetup
    ] = useState(null);

    const [
        connections,
        setConnections
    ] = useState([]);

    const [
        selectedConnectionId,
        setSelectedConnectionId
    ] = useState(null);

    const [
        loading,
        setLoading
    ] = useState(true);

    const [
        refreshing,
        setRefreshing
    ] = useState(false);

    const [
        creating,
        setCreating
    ] = useState(false);

    const [
        busyAction,
        setBusyAction
    ] = useState(null);

    const [
        loadError,
        setLoadError
    ] = useState("");

    const [
        createError,
        setCreateError
    ] = useState("");

    const [
        verifyError,
        setVerifyError
    ] = useState("");

    const [
        feedback,
        setFeedback
    ] = useState(null);

    const [
        formVersion,
        setFormVersion
    ] = useState(0);

    const loadPageData =
        useCallback(
            async ({
                initial = false
            } = {}) => {
                if (initial) {
                    setLoading(true);
                } else {
                    setRefreshing(true);
                }

                setLoadError("");
                setFeedback(null);

                try {
                    const [
                        setupResult,
                        connectionsResult
                    ] =
                        await Promise.allSettled([
                            getAwsSetup(),
                            getAwsConnections()
                        ]);

                    const errors = [];

                    if (
                        setupResult.status ===
                            "fulfilled" &&
                        setupResult.value
                    ) {
                        setSetup(
                            setupResult.value
                        );
                    } else {
                        errors.push(
                            setupResult.status ===
                                "rejected"
                                ? requestErrorMessage(
                                    setupResult.reason,
                                    "Unable to load AWS onboarding configuration."
                                )
                                : "AWS onboarding configuration is unavailable."
                        );
                    }

                    if (
                        connectionsResult.status ===
                        "fulfilled"
                    ) {
                        setConnections(
                            connectionsResult.value
                        );
                    } else {
                        errors.push(
                            requestErrorMessage(
                                connectionsResult.reason,
                                "Unable to load AWS connections."
                            )
                        );
                    }

                    setLoadError(
                        errors.join(" ")
                    );

                    if (
                        !initial &&
                        errors.length === 0
                    ) {
                        setFeedback({
                            tone: "success",
                            message:
                                "AWS connections refreshed."
                        });
                    }
                } finally {
                    if (initial) {
                        setLoading(false);
                    } else {
                        setRefreshing(false);
                    }
                }
            },
            []
        );

    useEffect(
        () => {
            void loadPageData({
                initial: true
            });
        },
        [loadPageData]
    );

    useEffect(
        () => {
            const selectedExists =
                connections.some(
                    connection =>
                        Number(
                            connection.id
                        ) ===
                        Number(
                            selectedConnectionId
                        )
                );

            if (selectedExists) {
                return;
            }

            const fallback =
                selectByStatus(
                    connections,
                    SETUP_PRIORITY
                );

            setSelectedConnectionId(
                fallback?.id || null
            );
        },
        [
            connections,
            selectedConnectionId
        ]
    );

    const primaryConnection =
        useMemo(
            () =>
                selectByStatus(
                    connections,
                    HEADER_PRIORITY
                ),
            [connections]
        );

    const selectedConnection =
        useMemo(
            () =>
                connections.find(
                    connection =>
                        Number(
                            connection.id
                        ) ===
                        Number(
                            selectedConnectionId
                        )
                ) || null,
            [
                connections,
                selectedConnectionId
            ]
        );

    async function handleCreate(
        connectionData
    ) {
        setCreating(true);
        setCreateError("");
        setVerifyError("");
        setFeedback(null);

        try {
            const createdConnection =
                await createAwsConnection(
                    connectionData
                );

            if (
                !createdConnection?.id
            ) {
                throw new Error(
                    "AWS did not return the created connection."
                );
            }

            setConnections(
                currentConnections => [
                    createdConnection,

                    ...currentConnections.filter(
                        connection =>
                            Number(
                                connection.id
                            ) !==
                            Number(
                                createdConnection.id
                            )
                    )
                ]
            );

            setSelectedConnectionId(
                createdConnection.id
            );

            setFormVersion(
                version =>
                    version + 1
            );

            setFeedback({
                tone: "success",
                message:
                    "AWS connection saved. Continue with Steps 2 and 3 below."
            });

            return createdConnection;
        } catch (
            error
        ) {
            const message =
                requestErrorMessage(
                    error,
                    "Unable to create the AWS connection."
                );

            setCreateError(
                message
            );

            setFeedback({
                tone: "error",
                message
            });

            throw error;
        } finally {
            setCreating(false);
        }
    }

    async function refreshConnectionsSilently() {
        try {
            const latestConnections =
                await getAwsConnections();

            setConnections(
                latestConnections
            );
        } catch {
            /*
            | The original action error remains
            | the useful message for the user.
            */
        }
    }

    async function runConnectionAction({
        type,
        connectionId,
        request,
        remove = false,
        fallbackMessage
    }) {
        setBusyAction({
            type,
            connectionId
        });

        setVerifyError("");
        setFeedback(null);

        try {
            const response =
                await request(
                    connectionId
                );

            const updatedConnection =
                getResponseConnection(
                    response
                );

            if (remove) {
                setConnections(
                    currentConnections =>
                        currentConnections.filter(
                            connection =>
                                Number(
                                    connection.id
                                ) !==
                                Number(
                                    connectionId
                                )
                        )
                );
            } else if (
                updatedConnection
            ) {
                setConnections(
                    currentConnections =>
                        replaceConnection(
                            currentConnections,
                            updatedConnection
                        )
                );

                setSelectedConnectionId(
                    updatedConnection.id
                );
            } else {
                await refreshConnectionsSilently();
            }

            setFeedback({
                tone: "success",
                message:
                    response?.message ||
                    fallbackMessage
            });
        } catch (
            error
        ) {
            const message =
                requestErrorMessage(
                    error,
                    "Unable to update the AWS connection."
                );

            if (
                type === "verify"
            ) {
                setVerifyError(
                    message
                );

                await refreshConnectionsSilently();
            }

            setFeedback({
                tone: "error",
                message
            });
        } finally {
            setBusyAction(null);
        }
    }

    function handleVerify(
        connectionId
    ) {
        return runConnectionAction({
            type: "verify",
            connectionId,
            request:
                verifyAwsConnection,
            fallbackMessage:
                "AWS connection verified."
        });
    }

    function handleDisconnect(
        connectionId
    ) {
        return runConnectionAction({
            type: "disconnect",
            connectionId,
            request:
                disconnectAwsConnection,
            fallbackMessage:
                "AWS connection disconnected."
        });
    }

    function handleDelete(
        connectionId
    ) {
        return runConnectionAction({
            type: "delete",
            connectionId,
            request:
                deleteAwsConnection,
            remove: true,
            fallbackMessage:
                "AWS connection deleted."
        });
    }

    const selectedIsVerifying =
        busyAction?.type ===
            "verify" &&
        Number(
            busyAction?.connectionId
        ) ===
        Number(
            selectedConnection?.id
        );

    return (
        <DashboardLayout>
            <div
                className="
                    space-y-6 pb-8
                "
            >
                <AWSHeader
                    connection={
                        primaryConnection
                    }
                    connectionCount={
                        connections.length
                    }
                    loading={loading}
                    refreshing={refreshing}
                    onRefresh={
                        () =>
                            loadPageData()
                    }
                />

                <Feedback
                    tone="error"
                    message={loadError}
                />

                <Feedback
                    tone={feedback?.tone}
                    message={feedback?.message}
                />

                {
                    loading
                        ? (
                            <LoadingPanel />
                        )
                        : (
                            <>
                                <div
                                    className="
                                        grid gap-6
                                        xl:grid-cols-2
                                        xl:items-start
                                    "
                                >
                                    <AWSConnectionForm
                                        key={
                                            formVersion
                                        }
                                        setup={setup}
                                        creating={
                                            creating
                                        }
                                        requestError={
                                            createError
                                        }
                                        onCreate={
                                            handleCreate
                                        }
                                    />

                                    <AWSConnectionsList
                                        connections={
                                            connections
                                        }
                                        selectedConnectionId={
                                            selectedConnectionId
                                        }
                                        busyAction={
                                            busyAction
                                        }
                                        onSelect={
                                            connectionId => {
                                                setSelectedConnectionId(
                                                    connectionId
                                                );

                                                setVerifyError(
                                                    ""
                                                );
                                            }
                                        }
                                        onVerify={
                                            handleVerify
                                        }
                                        onDisconnect={
                                            handleDisconnect
                                        }
                                        onDelete={
                                            handleDelete
                                        }
                                    />
                                </div>

                                {
                                    selectedConnection && (
                                        <AWSSetupGuide
                                            setup={setup}
                                            connection={
                                                selectedConnection
                                            }
                                            onVerify={
                                                handleVerify
                                            }
                                            isVerifying={
                                                selectedIsVerifying
                                            }
                                            verifyError={
                                                verifyError
                                            }
                                        />
                                    )
                                }
                            </>
                        )
                }
            </div>
        </DashboardLayout>
    );
}