import DashboardLayout from "../layouts/DashboardLayout";

import SettingsHeader from "../components/settings/SettingsHeader";
import ProfileSettings from "../components/settings/ProfileSettings";
import AppearanceSettings from "../components/settings/AppearanceSettings";
import NotificationSettings from "../components/settings/NotificationSettings";
import MonitoringSettings from "../components/settings/MonitoringSettings";
import SystemStatus from "../components/settings/SystemStatus";

export default function Settings() {

    return (

        <DashboardLayout>

            <div className="space-y-8">

                <SettingsHeader />

                <ProfileSettings />

                <AppearanceSettings />

                <NotificationSettings />

                <MonitoringSettings />

                <SystemStatus />

            </div>

        </DashboardLayout>

    );

}