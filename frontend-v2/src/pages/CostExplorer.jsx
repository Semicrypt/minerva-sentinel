import DashboardLayout from "../layouts/DashboardLayout";

import CostHeader from "../components/cost/CostHeader";
import CostOverview from "../components/cost/CostOverview";
import MonthlySpend from "../components/cost/MonthlySpend";
import ServiceBreakdown from "../components/cost/ServiceBreakdown";
import ResourceCosts from "../components/cost/ResourceCosts";
import BudgetTracker from "../components/cost/BudgetTracker";
import OptimizationTips from "../components/cost/OptimizationTips";
import CostArchitecture from "../components/cost/CostArchitecture";

export default function CostExplorer() {

    return (

        <DashboardLayout>

            <div className="space-y-8">

                <CostHeader />

                <CostOverview />

                <MonthlySpend />

                <ServiceBreakdown />

                <ResourceCosts />

                <BudgetTracker />

                <OptimizationTips />

                <CostArchitecture />

            </div>

        </DashboardLayout>

    );

}