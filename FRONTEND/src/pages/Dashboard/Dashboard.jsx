import { CompanyOverview } from "../../components/dashboard/CompanyOverview";
import { QuickActions } from "../../components/dashboard/QuickActions";
import { ActiveProductPortfolio } from "../../components/dashboard/ActiveProductPortfolio";
import { AIExecutiveSummary } from "../../components/dashboard/AIExecutiveSummary";
import { KPISection } from "../../components/dashboard/KPISection";
import { BusinessHealth } from "../../components/dashboard/BusinessHealth";
import { ActivityAndTimeline } from "../../components/dashboard/ActivityAndTimeline";
import { ProcurementTable } from "../../components/dashboard/ProcurementTable";
import { ExecutiveDecisionCenter } from "../../components/dashboard/ExecutiveDecisionCenter";
import { useApi } from "../../hooks/useApi";
//import { getDashboardOverview } from "../../services/dashboardService";
//import { useEffect } from "react";

export function Dashboard({ onAction, onOpenWorkspace }) {
  const { data, loading, error } = useApi("/dashboard/overview/");

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="size-8 border-[3px] border-[#303031]/20 border-t-[#303031] rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center text-red-500">
        Failed to load dashboard data.
      </div>
    );
  }

  const kpis = data?.kpis || {};
  const products = data?.products || [];
  const recentOrders = data?.recent_purchase_orders || [];
  return (
    <>
      <main className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
        <div className="px-8 py-8 flex flex-col gap-8 max-w-[1100px]">
          <CompanyOverview kpis={kpis} />
          <QuickActions onAction={onAction} />
          {/* Extra 8px pushes gap to 40px total */}
          <div className="mt-2">
            <ActiveProductPortfolio onOpenWorkspace={onOpenWorkspace} products={products} />
          </div>
          <AIExecutiveSummary />
          <KPISection kpis={kpis} />
          <BusinessHealth />
          <ActivityAndTimeline />
          <ProcurementTable orders={recentOrders} />
          <div className="h-8" />
        </div>
      </main>
      <ExecutiveDecisionCenter />
    </>
  );
}
