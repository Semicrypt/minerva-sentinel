import DashboardLayout from "../layouts/DashboardLayout";

import AWSHeader from "../components/aws/AWSHeader";
import AWSOverview from "../components/aws/AWSOverview";
import EC2Instances from "../components/aws/EC2Instances";
import CloudWatchMetrics from "../components/aws/CloudWatchMetrics";
import AWSArchitecture from "../components/aws/AWSArchitecture";

export default function AWSResources() {

    return (

        <DashboardLayout>

            <div className="space-y-8">

                <AWSHeader />

                <AWSOverview />

                <CloudWatchMetrics />

                <EC2Instances />

                <AWSArchitecture />

            </div>

        </DashboardLayout>

    );

}