import {
    useCallback,
    useEffect,
    useRef,
    useState
} from "react";

import AWSEC2Inventory from "./AWSEC2Inventory";

import {
    getAwsEc2Inventory
} from "../../services/aws.service";

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

export default function AWSEC2InventoryPanel({
    connection
}) {
    const [
        inventory,
        setInventory
    ] = useState(null);

    const [
        loading,
        setLoading
    ] = useState(false);

    const [
        refreshing,
        setRefreshing
    ] = useState(false);

    const [
        error,
        setError
    ] = useState("");

    const requestIdRef =
        useRef(0);

    const loadInventory =
        useCallback(
            async ({
                refresh = false
            } = {}) => {
                const connectionId =
                    Number(
                        connection?.id
                    );

                const status =
                    String(
                        connection?.status || ""
                    ).toUpperCase();

                if (
                    !Number.isInteger(
                        connectionId
                    ) ||
                    connectionId <= 0 ||
                    status !== "CONNECTED"
                ) {
                    requestIdRef.current += 1;

                    setInventory(null);
                    setLoading(false);
                    setRefreshing(false);
                    setError("");

                    return;
                }

                const requestId =
                    ++requestIdRef.current;

                if (refresh) {
                    setRefreshing(true);
                } else {
                    setLoading(true);
                    setInventory(null);
                }

                setError("");

                try {
                    const result =
                        await getAwsEc2Inventory(
                            connectionId
                        );

                    if (!result) {
                        throw new Error(
                            "AWS returned no EC2 inventory data."
                        );
                    }

                    if (
                        requestIdRef.current ===
                        requestId
                    ) {
                        setInventory(
                            result
                        );
                    }
                } catch (
                    requestError
                ) {
                    if (
                        requestIdRef.current ===
                        requestId
                    ) {
                        setError(
                            requestErrorMessage(
                                requestError,
                                "Unable to load live EC2 inventory."
                            )
                        );
                    }
                } finally {
                    if (
                        requestIdRef.current ===
                        requestId
                    ) {
                        setLoading(false);
                        setRefreshing(false);
                    }
                }
            },
            [connection]
        );

    useEffect(
        () => {
            void loadInventory();

            return () => {
                requestIdRef.current += 1;
            };
        },
        [loadInventory]
    );

    return (
        <AWSEC2Inventory
            inventory={inventory}
            loading={loading}
            refreshing={refreshing}
            error={error}
            onRefresh={
                () =>
                    loadInventory({
                        refresh: true
                    })
            }
        />
    );
}