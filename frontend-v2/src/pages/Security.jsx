import DashboardLayout from "../layouts/DashboardLayout";

import SecurityHeader from "../components/security/SecurityHeader";
import SecurityOverview from "../components/security/SecurityOverview";
import IAMPanel from "../components/security/IAMPanel";
import SecretsManager from "../components/security/SecretsManager";
import KMSPanel from "../components/security/KMSPanel";
import WAFShield from "../components/security/WAFShield";
import SecurityArchitecture from "../components/security/SecurityArchitecture";

export default function Security() {

    return (

        <DashboardLayout>

            <div className="space-y-8">

                <SecurityHeader />

                <SecurityOverview />

                <IAMPanel />

                <SecretsManager />

                <KMSPanel />

                <WAFShield />

                <SecurityArchitecture />

            </div>

        </DashboardLayout>

    );

}