import { toast } from "sonner";
import { Brain } from "lucide-react";
import { Badge } from "../common/Badge";
import { I, M } from "../../constants/fonts";
import { INV_FORECASTS } from "../../constants/inventory";

export function InvForecast() {
    return (<div>
      <div className="flex items-center gap-2 mb-3">
        <Brain size={15} style={{ color: "#735c00" }}/>
        <p className="font-bold text-[15px] text-[#1b1c1c]" style={{ fontFamily: M }}>AI Inventory Forecast</p>
        <Badge label="AI Powered" color="#735c00" bg="rgba(255,213,74,0.2)"/>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {INV_FORECASTS.map((f, i) => (<div key={i} className="bg-white rounded-2xl border border-[rgba(208,198,174,0.2)] p-5 flex flex-col gap-4">
            <div className="flex items-start justify-between gap-2">
              <p className="font-bold text-[14px] text-[#1b1c1c]" style={{ fontFamily: M }}>{f.name}</p>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0" style={{ background: `${f.col}15`, color: f.col, fontFamily: I }}>{f.impact} Impact</span>
            </div>
            <div className="flex flex-col gap-2">
              {[
                { l: "Consumption Rate", v: f.rate },
                { l: "Predicted Stock-out", v: f.stockout },
                { l: "Recommended Reorder", v: f.reorder },
                { l: "Supplier Lead Time", v: f.lead },
                { l: "Safety Stock Rec.", v: f.safety },
            ].map((d, j) => (<div key={j} className="flex justify-between items-center border-b border-[rgba(208,198,174,0.1)] last:border-0 py-1">
                  <span className="text-[11px] text-[#4d4634]" style={{ fontFamily: I }}>{d.l}</span>
                  <span className="font-semibold text-[12px]" style={{ color: d.l.includes("Stock-out") || d.l.includes("Reorder") ? f.col : "#1b1c1c", fontFamily: M }}>{d.v}</span>
                </div>))}
            </div>
            <div className="flex items-center justify-between pt-1">
              <div>
                <p className="text-[10px] text-[#4d4634]" style={{ fontFamily: I }}>AI Confidence</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <div className="w-20 h-1.5 rounded-full bg-[#efeded] overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${f.conf}%`, background: f.col }}/>
                  </div>
                  <span className="font-bold text-[12px]" style={{ color: f.col, fontFamily: M }}>{f.conf}%</span>
                </div>
              </div>
              <button onClick={() => toast.success(`Reorder created for ${f.name}`)} className="px-3 py-2 rounded-xl text-[11px] font-bold hover:opacity-90 transition" style={{ background: f.col, color: "white", fontFamily: M }}>
                {f.reorder === "Today" ? "Reorder Now →" : "Schedule →"}
              </button>
            </div>
          </div>))}
      </div>
    </div>);
}
