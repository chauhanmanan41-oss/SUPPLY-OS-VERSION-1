import { useState } from "react";
import { Plus, Play, CheckCircle } from "lucide-react";
import { I, M } from "../../constants/fonts";
import { useApi } from "../../hooks/useApi";
import { api } from "../../services/api";
import { toast } from "sonner";
import { Badge } from "../../components/common/Badge";
import { CreateBOMModal } from "./CreateBOMModal";
import { CreatePlanModal } from "./CreatePlanModal";
import { CreateBatchModal } from "./CreateBatchModal";

export function ProductionPage() {
  const [tab, setTab] = useState("batches");
  const [bomModal, setBomModal] = useState(false);
  const [planModal, setPlanModal] = useState(false);
  const [batchModal, setBatchModal] = useState(false);

  const { data: boms, refetch: refetchBoms } = useApi("/production/boms/");
  const { data: plans, refetch: refetchPlans } = useApi("/production/plans/");
  const { data: batches, refetch: refetchBatches } = useApi("/production/batches/");

  return (
    <div className="flex flex-1 overflow-hidden">
      <main className="flex-1 overflow-y-auto bg-[#fbf9f9]" style={{ scrollbarWidth: "none" }}>
        <div className="flex flex-col gap-6 p-8">
          
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-[26px] font-bold text-[#1b1c1c]" style={{ fontFamily: M }}>Production</h1>
              <p className="text-[14px] text-[#4d4634] mt-1 max-w-xl" style={{ fontFamily: I }}>
                Manage Bill of Materials (BOMs), Production Plans, and track active Manufacturing Batches.
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <button onClick={() => setBomModal(true)} className="flex items-center gap-2 px-4 py-2.5 border border-[rgba(208,198,174,0.3)] rounded-xl text-[13px] font-semibold text-[#1b1c1c] hover:bg-[#efeded] transition" style={{ fontFamily: M }}>
                <Plus size={14}/> New BOM
              </button>
              <button onClick={() => setPlanModal(true)} className="flex items-center gap-2 px-4 py-2.5 border border-[rgba(208,198,174,0.3)] rounded-xl text-[13px] font-semibold text-[#1b1c1c] hover:bg-[#efeded] transition" style={{ fontFamily: M }}>
                <Plus size={14}/> New Plan
              </button>
              <button onClick={() => setBatchModal(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-bold text-white hover:bg-[#1b1c1c] transition" style={{ background: "#303031", fontFamily: M }}>
                <Play size={14}/> Start Batch
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 border-b border-[rgba(208,198,174,0.2)] mb-4">
            <button onClick={() => setTab("batches")} className={`px-4 py-3 text-[14px] font-bold border-b-2 transition ${tab === "batches" ? "border-[#303031] text-[#1b1c1c]" : "border-transparent text-[#4d4634] hover:text-[#1b1c1c]"}`} style={{ fontFamily: M }}>Batches</button>
            <button onClick={() => setTab("plans")} className={`px-4 py-3 text-[14px] font-bold border-b-2 transition ${tab === "plans" ? "border-[#303031] text-[#1b1c1c]" : "border-transparent text-[#4d4634] hover:text-[#1b1c1c]"}`} style={{ fontFamily: M }}>Plans</button>
            <button onClick={() => setTab("boms")} className={`px-4 py-3 text-[14px] font-bold border-b-2 transition ${tab === "boms" ? "border-[#303031] text-[#1b1c1c]" : "border-transparent text-[#4d4634] hover:text-[#1b1c1c]"}`} style={{ fontFamily: M }}>BOMs</button>
          </div>

          <div className="bg-white rounded-2xl border border-[rgba(208,198,174,0.2)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-[rgba(208,198,174,0.15)] bg-[#fbf9f9]">
                    {tab === "batches" && ["Batch #", "Plan", "Product", "Status", "Start", "End", "Actions"].map((h, i) => <th key={i} className="px-4 py-3 text-[10px] font-bold text-[#4d4634] uppercase tracking-[0.5px]" style={{ fontFamily: I }}>{h}</th>)}
                    {tab === "plans" && ["Plan Name", "Product", "Quantity", "Start Date", "End Date", "Status"].map((h, i) => <th key={i} className="px-4 py-3 text-[10px] font-bold text-[#4d4634] uppercase tracking-[0.5px]" style={{ fontFamily: I }}>{h}</th>)}
                    {tab === "boms" && ["Name", "Product", "Version", "Status"].map((h, i) => <th key={i} className="px-4 py-3 text-[10px] font-bold text-[#4d4634] uppercase tracking-[0.5px]" style={{ fontFamily: I }}>{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {tab === "batches" && (batches || []).map(b => (
                    <tr key={b.id} className="border-b border-[rgba(208,198,174,0.15)] last:border-0 hover:bg-[#fbf9f9]">
                      <td className="px-4 py-3 text-[13px] font-semibold text-[#1b1c1c]" style={{ fontFamily: M }}>{b.batch_number}</td>
                      <td className="px-4 py-3 text-[13px] text-[#4d4634]" style={{ fontFamily: I }}>{b.plan_name}</td>
                      <td className="px-4 py-3 text-[13px] text-[#4d4634]" style={{ fontFamily: I }}>{b.product_name}</td>
                      <td className="px-4 py-3 text-[13px]" style={{ fontFamily: I }}>
                        <Badge label={b.status} color={b.status === "completed" ? "#16a34a" : "#3b82f6"} bg={b.status === "completed" ? "rgba(22,163,74,0.1)" : "rgba(59,130,246,0.1)"} />
                      </td>
                      <td className="px-4 py-3 text-[13px] text-[#4d4634]" style={{ fontFamily: I }}>{b.start_date || "-"}</td>
                      <td className="px-4 py-3 text-[13px] text-[#4d4634]" style={{ fontFamily: I }}>{b.end_date || "-"}</td>
                      <td className="px-4 py-3 text-[13px]">
                        {b.status === "in_progress" && (
                          <button
                            onClick={async () => {
                              try {
                                await api.post(`/production/batches/${b.id}/complete/`);
                                toast.success("Batch completed successfully");
                                refetchBatches();
                              } catch (err) {
                                toast.error(err.message || "Failed to complete batch");
                              }
                            }}
                            className="px-3 py-1.5 rounded-lg text-[11px] font-bold text-white hover:bg-[#1b1c1c] transition flex items-center justify-center gap-1.5"
                            style={{ background: "#3b82f6", fontFamily: M }}
                          >
                            <CheckCircle size={11} /> Complete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  
                  {tab === "plans" && (plans || []).map(p => (
                    <tr key={p.id} className="border-b border-[rgba(208,198,174,0.15)] last:border-0 hover:bg-[#fbf9f9]">
                      <td className="px-4 py-3 text-[13px] font-semibold text-[#1b1c1c]" style={{ fontFamily: M }}>{p.name}</td>
                      <td className="px-4 py-3 text-[13px] text-[#4d4634]" style={{ fontFamily: I }}>{p.product_name}</td>
                      <td className="px-4 py-3 text-[13px] text-[#4d4634]" style={{ fontFamily: I }}>{p.target_quantity}</td>
                      <td className="px-4 py-3 text-[13px] text-[#4d4634]" style={{ fontFamily: I }}>{p.start_date || "-"}</td>
                      <td className="px-4 py-3 text-[13px] text-[#4d4634]" style={{ fontFamily: I }}>{p.end_date || "-"}</td>
                      <td className="px-4 py-3 text-[13px]" style={{ fontFamily: I }}>
                         <Badge label={p.status} color={p.status === "approved" ? "#16a34a" : "#3b82f6"} bg={p.status === "approved" ? "rgba(22,163,74,0.1)" : "rgba(59,130,246,0.1)"} />
                      </td>
                    </tr>
                  ))}

                  {tab === "boms" && (boms || []).map(b => (
                    <tr key={b.id} className="border-b border-[rgba(208,198,174,0.15)] last:border-0 hover:bg-[#fbf9f9]">
                      <td className="px-4 py-3 text-[13px] font-semibold text-[#1b1c1c]" style={{ fontFamily: M }}>{b.name}</td>
                      <td className="px-4 py-3 text-[13px] text-[#4d4634]" style={{ fontFamily: I }}>{b.product_name}</td>
                      <td className="px-4 py-3 text-[13px] text-[#4d4634]" style={{ fontFamily: I }}>{b.version}</td>
                      <td className="px-4 py-3 text-[13px]" style={{ fontFamily: I }}>
                        <Badge label={b.status} color={b.status === "active" ? "#16a34a" : "#3b82f6"} bg={b.status === "active" ? "rgba(22,163,74,0.1)" : "rgba(59,130,246,0.1)"} />
                      </td>
                    </tr>
                  ))}

                  {/* Empty states */}
                  {tab === "batches" && batches?.length === 0 && <tr><td colSpan={6} className="px-4 py-8 text-center text-[#4d4634] text-[13px]">No batches found.</td></tr>}
                  {tab === "plans" && plans?.length === 0 && <tr><td colSpan={6} className="px-4 py-8 text-center text-[#4d4634] text-[13px]">No production plans found.</td></tr>}
                  {tab === "boms" && boms?.length === 0 && <tr><td colSpan={4} className="px-4 py-8 text-center text-[#4d4634] text-[13px]">No BOMs found.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
          <div className="h-16" />
        </div>
      </main>

      {bomModal && <CreateBOMModal onClose={() => setBomModal(false)} onSuccess={() => { toast.success("BOM created!"); refetchBoms(); }} />}
      {planModal && <CreatePlanModal onClose={() => setPlanModal(false)} onSuccess={() => { toast.success("Plan created!"); refetchPlans(); }} />}
      {batchModal && <CreateBatchModal onClose={() => setBatchModal(false)} onSuccess={() => { toast.success("Batch created!"); refetchBatches(); }} />}
    </div>
  );
}
