import DashboardLayout from "../layouts/DashboardLayout";

import StorageHeader from "../components/storage/StorageHeader";
import StorageOverview from "../components/storage/StorageOverview";
import S3Buckets from "../components/storage/S3Buckets";
import EBSVolumes from "../components/storage/EBSVolumes";
import EFSPanel from "../components/storage/EFSPanel";
import BackupLifecycle from "../components/storage/BackupLifecycle";
import StorageArchitecture from "../components/storage/StorageArchitecture";

export default function Storage() {

    return (

        <DashboardLayout>

            <div className="space-y-8">

                <StorageHeader />

                <StorageOverview />

                <S3Buckets />

                <EBSVolumes />

                <EFSPanel />

                <BackupLifecycle />

                <StorageArchitecture />

            </div>

        </DashboardLayout>

    );

}