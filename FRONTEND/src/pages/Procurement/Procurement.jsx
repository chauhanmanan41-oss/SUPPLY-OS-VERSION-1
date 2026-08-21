import { useState } from "react";
import { toast } from "sonner";
import { Plus, Brain, ScrollText, Download } from "lucide-react";
import { ProAdvisor } from "../../components/procurement/ProAdvisor";
import { ProAnalytics } from "../../components/procurement/ProAnalytics";
import { ProApprovalCenter } from "../../components/procurement/ProApprovalCenter";
import { ProInsights } from "../../components/procurement/ProInsights";
import { ProKPIRow } from "../../components/procurement/ProKPIRow";
import { ProPOSection } from "../../components/procurement/ProPOSection";
import { ProPipeline } from "../../components/procurement/ProPipeline";
import { ProQuoteModal } from "../../components/procurement/ProQuoteModal";
import { ProTable } from "../../components/procurement/ProTable";
import { CreateRFQModal } from "../../components/procurement/CreateRFQModal";
import { CreatePOModal } from "../../components/procurement/CreatePOModal";
import { I, M } from "../../constants/fonts";

export function ProcurementPage() {
    const [pipeStage, setPipeStage] = useState(null);
    const [quoteModal, setQuoteModal] = useState(false);
    const [rfqModal, setRfqModal] = useState(false);
    const [poModal, setPoModal] = useState(false);

    return (<div className="flex flex-1 overflow-hidden">
      {/* Main scroll area */}
      <main className="flex-1 overflow-y-auto bg-[#fbf9f9]" style={{ scrollbarWidth: "none" }}>
        <div className="flex flex-col gap-6 p-8">

          {/* ── Page Header ── */}
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-[26px] font-bold text-[#1b1c1c]" style={{ fontFamily: M }}>Procurement</h1>
              <p className="text-[14px] text-[#4d4634] mt-1 max-w-xl" style={{ fontFamily: I }}>
                Manage procurement, RFQs, supplier quotations, purchase orders and approvals from one intelligent workspace.
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <button onClick={() => setRfqModal(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-bold hover:opacity-90 transition" style={{ background: "#ffd54a", color: "#735c00", fontFamily: M }}>
                <Plus size={14}/> Create RFQ
              </button>
              <button onClick={() => toast.info("Generating AI procurement plan…")} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-bold text-white hover:bg-[#1b1c1c] transition" style={{ background: "#303031", fontFamily: M }}>
                <Brain size={14}/> AI Plan
              </button>
              <button onClick={() => setPoModal(true)} className="flex items-center gap-2 px-4 py-2.5 border border-[rgba(208,198,174,0.3)] rounded-xl text-[13px] font-semibold text-[#1b1c1c] hover:bg-[#efeded] transition" style={{ fontFamily: M }}>
                <ScrollText size={14}/> Create PO
              </button>
              <button onClick={() => toast.info("Exporting report…")} className="flex items-center gap-2 px-4 py-2.5 border border-[rgba(208,198,174,0.3)] rounded-xl text-[13px] font-semibold text-[#1b1c1c] hover:bg-[#efeded] transition" style={{ fontFamily: M }}>
                <Download size={14}/> Export
              </button>
            </div>
          </div>

          {/* ── KPIs ── */}
          <ProKPIRow />

          {/* ── Pipeline ── */}
          <ProPipeline active={pipeStage} onStage={id => setPipeStage(s => s === id ? null : id)}/>

          {/* ── AI Insights ── */}
          <ProInsights onCompare={() => setQuoteModal(true)}/>

          {/* ── Main Table ── */}
          <ProTable stageFilter={pipeStage}/>

          {/* ── Approvals + POs ── */}
          <ProApprovalCenter />
          <ProPOSection />

          {/* ── Analytics ── */}
          <ProAnalytics />

          <div className="h-16"/>
        </div>
      </main>

      {/* ── Right AI Advisor ── */}
      <ProAdvisor />

      {/* ── Quote Comparison Modal ── */}
      {quoteModal && <ProQuoteModal onClose={() => setQuoteModal(false)}/>}
      
      {rfqModal && <CreateRFQModal onClose={() => setRfqModal(false)} onSuccess={() => toast.success("RFQ created successfully")} />}
      {poModal && <CreatePOModal onClose={() => setPoModal(false)} onSuccess={() => toast.success("PO created successfully")} />}
    </div>);
}
