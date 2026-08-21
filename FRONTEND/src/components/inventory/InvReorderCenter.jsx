import { toast } from "sonner";
import { RefreshCw, Sparkles } from "lucide-react";
import { Badge } from "../common/Badge";
import { I, M } from "../../constants/fonts";
import { INV_REORDERS } from "../../constants/inventory";

export function InvReorderCenter() {
    return (<div>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <RefreshCw size={15} style={{ color: "#3b82f6" }}/>
          <p className="font-bold text-[15px] text-[#1b1c1c]" style={{ fontFamily: M }}>Reorder Center</p>
          <Badge label={`${INV_REORDERS.length} items`} color="#3b82f6" bg="rgba(59,130,246,0.1)"/>
        </div>
        <button onClick={() => toast.success("Bulk reorder created")} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-bold hover:opacity-90 transition" style={{ background: "#ffd54a", color: "#735c00", fontFamily: M }}>
          <Sparkles size={12}/> Auto Reorder All
        </button>
      </div>
      <div className="bg-white rounded-2xl border border-[rgba(208,198,174,0.2)] overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-[rgba(208,198,174,0.15)] bg-[#fbf9f9]">
              {["Item", "Current Stock", "Safety Stock", "Rec. Quantity", "Supplier", "Est. Cost", "Delivery", "AI Conf.", "Action"].map((h, i) => (<th key={i} className="px-4 py-2.5 text-[10px] font-bold text-[#4d4634] uppercase tracking-[0.5px] whitespace-nowrap" style={{ fontFamily: I }}>{h}</th>))}
            </tr>
          </thead>
          <tbody>
            {INV_REORDERS.map((r, i) => {
            const urgency = r.conf >= 96 ? "#ba1a1a" : r.conf >= 90 ? "#eab308" : "#3b82f6";
            return (<tr key={i} className="border-b border-[rgba(208,198,174,0.1)] hover:bg-[#fafafa] transition-colors last:border-0">
                  <td className="px-4 py-3.5">
                    <p className="font-semibold text-[13px] text-[#1b1c1c]" style={{ fontFamily: M }}>{r.item}</p>
                  </td>
                  <td className="px-4 py-3.5">
                    <p className="text-[12px]" style={{ color: urgency, fontFamily: M, fontWeight: 600 }}>{r.current}</p>
                  </td>
                  <td className="px-4 py-3.5">
                    <p className="text-[12px] text-[#4d4634]" style={{ fontFamily: I }}>{r.safety}</p>
                  </td>
                  <td className="px-4 py-3.5">
                    <p className="font-bold text-[13px] text-[#1b1c1c]" style={{ fontFamily: M }}>{r.qty}</p>
                  </td>
                  <td className="px-4 py-3.5">
                    <p className="text-[12px] text-[#4d4634]" style={{ fontFamily: I }}>{r.supplier}</p>
                  </td>
                  <td className="px-4 py-3.5">
                    <p className="font-bold text-[13px] text-[#1b1c1c]" style={{ fontFamily: M }}>{r.cost}</p>
                  </td>
                  <td className="px-4 py-3.5">
                    <p className="text-[12px] text-[#4d4634]" style={{ fontFamily: I }}>{r.delivery}</p>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-1.5 rounded-full bg-[#efeded] overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${r.conf}%`, background: urgency }}/>
                      </div>
                      <span className="font-bold text-[11px]" style={{ color: urgency, fontFamily: M }}>{r.conf}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex gap-1.5">
                      <button onClick={() => toast.success(`RFQ created for ${r.item}`)} className="px-2.5 py-1.5 rounded-lg text-[11px] font-bold text-white hover:bg-[#1b1c1c] transition" style={{ background: "#303031", fontFamily: M }}>RFQ</button>
                      <button onClick={() => toast.success(`PO created for ${r.item}`)} className="px-2.5 py-1.5 rounded-lg text-[11px] font-bold hover:opacity-90 transition" style={{ background: "#ffd54a", color: "#735c00", fontFamily: M }}>PO</button>
                    </div>
                  </td>
                </tr>);
        })}
          </tbody>
        </table>
      </div>
    </div>);
}
