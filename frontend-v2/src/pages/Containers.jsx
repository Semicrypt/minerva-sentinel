import {
    useCallback,
    useEffect,
    useState
} from "react";

import DashboardLayout from "../layouts/DashboardLayout";

import ContainersHeader from "../components/containers/ContainersHeader";
import DockerOverview from "../components/containers/DockerOverview";
import RunningContainers from "../components/containers/RunningContainers";
import ImagesPanel from "../components/containers/ImagesPanel";
import NetworksVolumes from "../components/containers/NetworksVolumes";
import ContainerArchitecture from "../components/containers/ContainerArchitecture";

import {
    getDockerInfo,
    getDockerContainers,
    getDockerImages,
    getDockerNetworks,
    getDockerVolumes
} from "../services/docker.service";

export default function Containers() {

    const [dockerInfo, setDockerInfo] =
        useState(null);

    const [containers, setContainers] =
        useState([]);

    const [images, setImages] =
        useState([]);

    const [networks, setNetworks] =
        useState([]);

    const [volumes, setVolumes] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [refreshing, setRefreshing] =
        useState(false);

    const [error, setError] =
        useState(null);

    /*
    |--------------------------------------------------------------------------
    | Load Docker Data
    |--------------------------------------------------------------------------
    */

    const loadDockerData =
        useCallback(
            async (
                manualRefresh = false
            ) => {

                try {

                    if (manualRefresh) {

                        setRefreshing(true);

                    }
                    else {

                        setLoading(true);

                    }

                    setError(null);

                    const [
                        info,
                        containerData,
                        imageData,
                        networkData,
                        volumeData
                    ] =
                        await Promise.all([

                            getDockerInfo(),

                            getDockerContainers(),

                            getDockerImages(),

                            getDockerNetworks(),

                            getDockerVolumes()

                        ]);

                    setDockerInfo(
                        info
                    );

                    setContainers(
                        containerData
                    );

                    setImages(
                        imageData
                    );

                    setNetworks(
                        networkData
                    );

                    setVolumes(
                        volumeData
                    );

                }

                catch (requestError) {

                    console.error(
                        "Unable to load Docker data:",
                        requestError
                    );

                    setError(
                        "Unable to connect to the Docker monitoring API."
                    );

                }

                finally {

                    setLoading(false);

                    setRefreshing(false);

                }

            },
            []
        );

    /*
    |--------------------------------------------------------------------------
    | Initial Load
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        loadDockerData();

    }, [loadDockerData]);

    /*
    |--------------------------------------------------------------------------
    | Page
    |--------------------------------------------------------------------------
    */

    return (

        <DashboardLayout>

            <div className="space-y-8">

                <ContainersHeader
                    dockerInfo={dockerInfo}
                    loading={loading}
                    refreshing={refreshing}
                    error={error}
                    onRefresh={
                        () =>
                            loadDockerData(true)
                    }
                />

                <DockerOverview
                    dockerInfo={dockerInfo}
                    containers={containers}
                    loading={loading}
                />

                <RunningContainers
                    containers={containers}
                    loading={loading}
                />

                <ImagesPanel
                    images={images}
                    loading={loading}
                />

                <NetworksVolumes
                    networks={networks}
                    volumes={volumes}
                    loading={loading}
                />

                <ContainerArchitecture />

            </div>

        </DashboardLayout>

    );

}