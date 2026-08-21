import { toast } from "sonner";
import { Plus, Truck, Download, CheckCircle } from "lucide-react";
import { I, M } from "../../constants/fonts";
import { useApi } from "../../hooks/useApi";
import { api } from "../../services/api";

export function ProPOSection() {
    const { data: pos, refetch } = useApi("/procurement/purchase-orders/");
    const AP_COLORS = {
        "Approved": { col: "#16a34a", bg: "rgba(22,163,74,0.1)" },
        "Pending": { col: "#eab308", bg: "rgba(234,179,8,0.1)" },
        "Pending Finance": { col: "#f97316", bg: "rgba(249,115,22,0.1)" },
    };
    return (<div>
      <div className="flex items-center justify-between mb-3">
        <p className="font-bold text-[15px] text-[#1b1c1c]" style={{ fontFamily: M }}>Purchase Orders</p>
        <button onClick={() => toast.success("New PO draft created")} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-bold hover:opacity-90 transition" style={{ background: "#ffd54a", color: "#735c00", fontFamily: M }}>
          <Plus size={13}/> Create PO
        </button>
      </div>
      <div className="flex flex-col gap-3">
        {(pos || []).map((po, i) => {
            const ap = AP_COLORS[po.po_status === "approved" ? "Approved" : po.po_status === "pending" ? "Pending" : "Approved"] ?? { col: "#6b7280", bg: "rgba(107,114,128,0.1)" };
            return (<div key={po.id || i} className="bg-white rounded-2xl border border-[rgba(208,198,174,0.2)] p-4 flex items-center gap-4">
              <div className="size-11 rounded-2xl flex items-center justify-center text-2xl bg-[#fbf9f9] border border-[rgba(208,198,174,0.2)] shrink-0">
                📦
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                  <p className="font-bold text-[11px] text-[#4d4634]" style={{ fontFamily: I }}>{po.po_number}</p>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: ap.bg, color: ap.col, fontFamily: I }}>{po.po_status}</span>
                </div>
                <p className="font-bold text-[14px] text-[#1b1c1c]" style={{ fontFamily: M }}>{po.supplier_name || "Supplier"}</p>
                <p className="text-[12px] text-[#4d4634]" style={{ fontFamily: I }}>{po.product_name || "Product"}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="font-bold text-[15px] text-[#1b1c1c]" style={{ fontFamily: M }}>${po.total_amount}</p>
                <p className="text-[11px] text-[#4d4634]" style={{ fontFamily: I }}>{po.expected_delivery || "No ETA"}</p>
                <p className="text-[10px] font-semibold text-[#3b82f6] mt-0.5" style={{ fontFamily: I }}>{po.actual_delivery ? `Received: ${po.actual_delivery}` : "Awaiting"}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {po.po_status !== "received" && (
                  <button 
                    onClick={async () => {
                      try {
                        await api.post(`/procurement/purchase-orders/${po.id}/mark-received/`);
                        toast.success(`${po.po_number} marked as received`);
                        refetch();
                      } catch (err) {
                        toast.error(err.message || "Failed to receive PO");
                      }
                    }} 
                    className="px-3 py-2 rounded-xl text-[12px] font-bold text-white hover:bg-[#1b1c1c] transition flex items-center gap-1.5" 
                    style={{ background: "#303031", fontFamily: M }}
                  >
                    <CheckCircle size={13} /> Receive
                  </button>
                )}
                <button onClick={() => toast.info("Downloading PO…")} className="p-2 rounded-xl border border-[rgba(208,198,174,0.3)] text-[#4d4634] hover:bg-[#efeded] transition">
                  <Download size={14}/>
                </button>
              </div>
            </div>);
        })}
      </div>
    </div>);
}
