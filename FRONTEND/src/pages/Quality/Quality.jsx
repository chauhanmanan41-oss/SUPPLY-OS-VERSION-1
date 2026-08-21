import { useState } from "react";
import { Plus, Download } from "lucide-react";
import { I, M } from "../../constants/fonts";
import { useApi } from "../../hooks/useApi";
import { Badge } from "../../components/common/Badge";
import { CreateInspectionModal } from "./CreateInspectionModal";
import { toast } from "sonner";

export function QualityPage() {
  const [modal, setModal] = useState(false);
  const { data: inspections, refetch } = useApi("/quality/");

  return (
    <div className="flex flex-1 overflow-hidden">
      <main className="flex-1 overflow-y-auto bg-[#fbf9f9]" style={{ scrollbarWidth: "none" }}>
        <div className="flex flex-col gap-6 p-8">
          
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-[26px] font-bold text-[#1b1c1c]" style={{ fontFamily: M }}>Quality Assurance</h1>
              <p className="text-[14px] text-[#4d4634] mt-1 max-w-xl" style={{ fontFamily: I }}>
                Track quality inspections, compliance, and product defects.
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <button onClick={() => setModal(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-bold text-white hover:bg-[#1b1c1c] transition" style={{ background: "#303031", fontFamily: M }}>
                <Plus size={14}/> New Inspection
              </button>
              <button onClick={() => toast.info("Exporting report...")} className="flex items-center gap-2 px-4 py-2.5 border border-[rgba(208,198,174,0.3)] rounded-xl text-[13px] font-semibold text-[#1b1c1c] hover:bg-[#efeded] transition" style={{ fontFamily: M }}>
                <Download size={14}/> Export
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[rgba(208,198,174,0.2)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-[rgba(208,198,174,0.15)] bg-[#fbf9f9]">
                    {["Inspection ID", "Batch", "Result", "Inspector", "Date"].map((h, i) => <th key={i} className="px-4 py-3 text-[10px] font-bold text-[#4d4634] uppercase tracking-[0.5px]" style={{ fontFamily: I }}>{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {(inspections || []).map(i => (
                    <tr key={i.id} className="border-b border-[rgba(208,198,174,0.15)] last:border-0 hover:bg-[#fbf9f9]">
                      <td className="px-4 py-3 text-[13px] font-semibold text-[#1b1c1c]" style={{ fontFamily: M }}>{i.id.substring(0,8)}</td>
                      <td className="px-4 py-3 text-[13px] text-[#4d4634]" style={{ fontFamily: I }}>{i.batch_number}</td>
                      <td className="px-4 py-3 text-[13px]" style={{ fontFamily: I }}>
                        <Badge label={i.result} color={i.result === "pass" ? "#16a34a" : "#dc2626"} bg={i.result === "pass" ? "rgba(22,163,74,0.1)" : "rgba(220,38,38,0.1)"} />
                      </td>
                      <td className="px-4 py-3 text-[13px] text-[#4d4634]" style={{ fontFamily: I }}>{i.inspected_by_name || "Auto"}</td>
                      <td className="px-4 py-3 text-[13px] text-[#4d4634]" style={{ fontFamily: I }}>{new Date(i.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                  {inspections?.length === 0 && <tr><td colSpan={5} className="px-4 py-8 text-center text-[#4d4634] text-[13px]">No inspections found.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
          <div className="h-16" />
        </div>
      </main>
      
      {modal && <CreateInspectionModal onClose={() => setModal(false)} onSuccess={() => { toast.success("Inspection saved"); refetch(); }} />}
    </div>
  );
}
