import { toast } from "sonner";
import { AlertTriangle } from "lucide-react";
import { I, M } from "../../constants/fonts";
import { INV_RISKS } from "../../constants/inventory";

export function InvRisks() {
    const sevCfg = {
        high: { col: "#ba1a1a", bg: "rgba(186,26,26,0.1)" },
        medium: { col: "#eab308", bg: "rgba(234,179,8,0.1)" },
        low: { col: "#6b7280", bg: "rgba(107,114,128,0.1)" },
    };
    return (<div>
      <div className="flex items-center gap-2 mb-3">
        <AlertTriangle size={15} style={{ color: "#ba1a1a" }}/>
        <p className="font-bold text-[15px] text-[#1b1c1c]" style={{ fontFamily: M }}>Inventory Risks</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {INV_RISKS.map((r, i) => {
            const sc = sevCfg[r.severity] ?? sevCfg.low;
            return (<div key={i} className="rounded-2xl border p-5 flex flex-col gap-3" style={{ background: r.bg, borderColor: r.brd }}>
              <div className="flex items-start justify-between gap-3">
                <p className="font-bold text-[14px] text-[#1b1c1c]" style={{ fontFamily: M }}>{r.title}</p>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 capitalize" style={{ background: sc.bg, color: sc.col, fontFamily: I }}>{r.severity}</span>
              </div>
              <p className="text-[12px] text-[#4d4634]" style={{ fontFamily: I }}>{r.impact}</p>
              <div className="flex justify-between">
                <div>
                  <p className="text-[10px] text-[#4d4634]" style={{ fontFamily: I }}>Est. Financial Loss</p>
                  <p className="font-bold text-[14px]" style={{ color: r.col, fontFamily: M }}>{r.loss}</p>
                </div>
              </div>
              <div className="p-3 rounded-xl" style={{ background: "rgba(255,213,74,0.08)", border: "1px solid rgba(255,213,74,0.2)" }}>
                <p className="text-[10px] font-bold text-[#735c00] mb-0.5" style={{ fontFamily: M }}>AI Recommendation</p>
                <p className="text-[11px] text-[#4d4634]" style={{ fontFamily: I }}>{r.rec}</p>
              </div>
              <button onClick={() => toast.success("Action applied!")} className="w-full py-2 rounded-xl text-[12px] font-bold hover:opacity-90 transition" style={{ background: r.col, color: "white", fontFamily: M }}>Apply Recommendation →</button>
            </div>);
        })}
      </div>
    </div>);
}
