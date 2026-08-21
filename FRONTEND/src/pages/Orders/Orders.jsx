import { useState } from "react";
import { toast } from "sonner";
import { Plus, Brain, Truck, Download } from "lucide-react";
import { OrdAdvisor } from "../../components/orders/OrdAdvisor";
import { OrdAnalytics } from "../../components/orders/OrdAnalytics";
import { OrdDelayedSection } from "../../components/orders/OrdDelayedSection";
import { OrdHealthCard } from "../../components/orders/OrdHealthCard";
import { OrdKPIRow } from "../../components/orders/OrdKPIRow";
import { OrdMfgSection } from "../../components/orders/OrdMfgSection";
import { OrdPipeline } from "../../components/orders/OrdPipeline";
import { OrdShipmentSection } from "../../components/orders/OrdShipmentSection";
import { OrdTable } from "../../components/orders/OrdTable";
import { CreateOrderModal } from "../../components/orders/CreateOrderModal";
import { I, M } from "../../constants/fonts";

export function OrdersPage() {
    const [pipeStage, setPipeStage] = useState(null);
    const [orderModal, setOrderModal] = useState(false);
    
    return (<div className="flex flex-1 overflow-hidden">
      <main className="flex-1 overflow-y-auto bg-[#fbf9f9]" style={{ scrollbarWidth: "none" }}>
        <div className="flex flex-col gap-6 p-8">

          {/* ── Header ── */}
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-[26px] font-bold text-[#1b1c1c]" style={{ fontFamily: M }}>Orders</h1>
              <p className="text-[14px] text-[#4d4634] mt-1" style={{ fontFamily: I }}>
                Track every active order from manufacturing to final delivery.
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <button onClick={() => setOrderModal(true)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-[13px] text-white hover:bg-[#1b1c1c] transition" style={{ background: "#303031", fontFamily: M }}>
                <Plus size={14}/> Create Order
              </button>
              <button onClick={() => toast.info("Opening shipment tracker…")} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-bold text-white hover:bg-[#1b1c1c] transition" style={{ background: "#303031", fontFamily: M }}>
                <Truck size={14}/> Track Shipment
              </button>
              <button onClick={() => toast.success("Orders exported")} className="flex items-center gap-2 px-4 py-2.5 border border-[rgba(208,198,174,0.3)] rounded-xl text-[13px] font-semibold text-[#1b1c1c] hover:bg-[#efeded] transition" style={{ fontFamily: M }}>
                <Download size={14}/> Export
              </button>
              <button onClick={() => toast.info("Generating AI report…")} className="flex items-center gap-2 px-4 py-2.5 border border-[rgba(208,198,174,0.3)] rounded-xl text-[13px] font-semibold text-[#1b1c1c] hover:bg-[#efeded] transition" style={{ fontFamily: M }}>
                <Brain size={14}/> AI Report
              </button>
            </div>
          </div>

          {/* ── KPIs ── */}
          <OrdKPIRow />

          {/* ── AI Health ── */}
          <OrdHealthCard />

          {/* ── Pipeline ── */}
          <OrdPipeline active={pipeStage} onStage={id => setPipeStage(s => s === id ? null : id)}/>

          {/* ── Orders Table ── */}
          <OrdTable stageFilter={pipeStage}/>

          {/* ── Manufacturing ── */}
          <OrdMfgSection />

          {/* ── Shipments ── */}
          <OrdShipmentSection />

          {/* ── Delayed Orders ── */}
          <OrdDelayedSection />

          {/* ── Analytics ── */}
          <OrdAnalytics />

          <div className="h-16"/>
        </div>
      </main>

      {/* ── Right AI Advisor ── */}
      <OrdAdvisor />

      {orderModal && <CreateOrderModal onClose={() => setOrderModal(false)} onSuccess={() => toast.success("Order created successfully!")} />}
    </div>);
}
