import DashboardLayout from "../layouts/DashboardLayout";

import CICDHeader from "../components/cicd/CICDHeader";
import PipelineOverview from "../components/cicd/PipelineOverview";
import WorkflowStages from "../components/cicd/WorkflowStages";

export default function CICD() {

    return (

        <DashboardLayout>

            <div className="space-y-8">

                <CICDHeader />

                <PipelineOverview />

                <WorkflowStages />

            </div>

        </DashboardLayout>

    );

}