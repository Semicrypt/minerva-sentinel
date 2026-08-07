import DashboardLayout from "../layouts/DashboardLayout";

import AlertsHeader from "../components/alerts/AlertsHeader";
import AlertsOverview from "../components/alerts/AlertsOverview";
import ActiveAlerts from "../components/alerts/ActiveAlerts";
import AlertTimeline from "../components/alerts/AlertTimeline";
import AlertPolicies from "../components/alerts/AlertPolicies";
import IncidentManagement from "../components/alerts/IncidentManagement";
import AlertsArchitecture from "../components/alerts/AlertsArchitecture";

export default function Alerts() {

    return (

        <DashboardLayout>

            <div className="space-y-8">

                <AlertsHeader />

                <AlertsOverview />

                <ActiveAlerts />

                <AlertTimeline />

                <AlertPolicies />

                <IncidentManagement />

                <AlertsArchitecture />

            </div>

        </DashboardLayout>

    );

}