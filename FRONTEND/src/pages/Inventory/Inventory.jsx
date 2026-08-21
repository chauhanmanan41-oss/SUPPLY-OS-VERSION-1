import { useState } from "react";
import { toast } from "sonner";
import { Plus, ArrowUpRight, RefreshCw, Download } from "lucide-react";
import { InvAdvisor } from "../../components/inventory/InvAdvisor";
import { InvAnalytics } from "../../components/inventory/InvAnalytics";
import { InvCategories } from "../../components/inventory/InvCategories";
import { InvForecast } from "../../components/inventory/InvForecast";
import { InvHealthCard } from "../../components/inventory/InvHealthCard";
import { InvKPIRow } from "../../components/inventory/InvKPIRow";
import { InvLowStockAlerts } from "../../components/inventory/InvLowStockAlerts";
import { InvReorderCenter } from "../../components/inventory/InvReorderCenter";
import { InvRisks } from "../../components/inventory/InvRisks";
import { InvTable } from "../../components/inventory/InvTable";
import { InvWarehouses } from "../../components/inventory/InvWarehouses";
import { TransferStockModal } from "../../components/inventory/TransferStockModal";
import { AdjustStockModal } from "../../components/inventory/AdjustStockModal";
import { I, M } from "../../constants/fonts";

export function InventoryPage() {
    const [transferModal, setTransferModal] = useState(false);
    const [adjustModal, setAdjustModal] = useState(false);

    return (<div className="flex flex-1 overflow-hidden">
      <main className="flex-1 overflow-y-auto bg-[#fbf9f9]" style={{ scrollbarWidth: "none" }}>
        <div className="flex flex-col gap-6 p-8">

          {/* Header */}
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-[26px] font-bold text-[#1b1c1c]" style={{ fontFamily: M }}>Inventory</h1>
              <p className="text-[14px] text-[#4d4634] mt-1 max-w-xl" style={{ fontFamily: I }}>
                Monitor inventory across raw materials, packaging, warehouses and finished products with AI-powered insights.
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <button onClick={() => setAdjustModal(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-bold hover:opacity-90 transition" style={{ background: "#ffd54a", color: "#735c00", fontFamily: M }}>
                <Plus size={14}/> Receive / Adjust Stock
              </button>
              <button onClick={() => setTransferModal(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-bold text-white hover:bg-[#1b1c1c] transition" style={{ background: "#303031", fontFamily: M }}>
                <ArrowUpRight size={14}/> Transfer Stock
              </button>
              <button onClick={() => toast.success("Reorder request created")} className="flex items-center gap-2 px-4 py-2.5 border border-[rgba(208,198,174,0.3)] rounded-xl text-[13px] font-semibold text-[#1b1c1c] hover:bg-[#efeded] transition" style={{ fontFamily: M }}>
                <RefreshCw size={14}/> Request Reorder
              </button>
              <button onClick={() => toast.info("Exporting inventory report…")} className="flex items-center gap-2 px-4 py-2.5 border border-[rgba(208,198,174,0.3)] rounded-xl text-[13px] font-semibold text-[#1b1c1c] hover:bg-[#efeded] transition" style={{ fontFamily: M }}>
                <Download size={14}/> Export Report
              </button>
            </div>
          </div>

          <InvKPIRow />
          <InvHealthCard />
          <InvCategories />
          <InvTable />
          <InvWarehouses />
          <InvLowStockAlerts />
          <InvForecast />
          <InvRisks />
          <InvReorderCenter />
          <InvAnalytics />

          <div className="h-16"/>
        </div>
      </main>
      <InvAdvisor />

      {transferModal && <TransferStockModal onClose={() => setTransferModal(false)} onSuccess={() => toast.success("Stock transferred successfully!")} />}
      {adjustModal && <AdjustStockModal onClose={() => setAdjustModal(false)} onSuccess={() => toast.success("Stock adjusted successfully!")} />}
    </div>);
}
