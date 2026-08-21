import { toast } from "sonner";
import { Brain, LayoutGrid } from "lucide-react";
import { Badge } from "../common/Badge";
import { I, M } from "../../constants/fonts";

export function ProInsights({ onCompare }) {
    const items = [
        { product: "Whey Protein Isolate", action: "Switch supplier to BioSynth India", savings: "₹2.4L", conf: 96, col: "#16a34a", bg: "rgba(22,163,74,0.05)", brd: "rgba(22,163,74,0.2)" },
        { product: "HDPE Packaging Q1", action: "Bulk 50K units unlocks 8% discount", savings: "₹34K", conf: 91, col: "#3b82f6", bg: "rgba(59,130,246,0.05)", brd: "rgba(59,130,246,0.2)" },
        { product: "VRL Logistics Renewal", action: "6-month contract saves 12% on freight", savings: "₹82K", conf: 88, col: "#a855f7", bg: "rgba(168,85,247,0.05)", brd: "rgba(168,85,247,0.2)" },
    ];
    return (<div className="bg-white rounded-2xl border border-[rgba(208,198,174,0.2)] p-5">
      <div className="flex items-center gap-2 mb-4">
        <Brain size={15} style={{ color: "#735c00" }}/>
        <p className="font-bold text-[14px] text-[#1b1c1c]" style={{ fontFamily: M }}>AI Procurement Insights</p>
        <Badge label="3 Recommendations" color="#735c00" bg="rgba(255,213,74,0.15)"/>
        <button onClick={onCompare} className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold border border-[rgba(208,198,174,0.3)] text-[#4d4634] hover:bg-[#efeded] transition" style={{ fontFamily: M }}>
          <LayoutGrid size={12}/> Compare Quotes
        </button>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {items.map((ins, i) => (<div key={i} className="flex flex-col gap-2.5 px-4 py-3.5 rounded-xl" style={{ background: ins.bg, border: `1px solid ${ins.brd}` }}>
            <p className="text-[10px] font-bold uppercase tracking-wide" style={{ color: ins.col, fontFamily: I }}>{ins.product}</p>
            <p className="text-[13px] font-semibold text-[#1b1c1c] leading-snug" style={{ fontFamily: M }}>{ins.action}</p>
            <div className="flex items-center justify-between mt-auto">
              <div>
                <p className="font-bold text-[14px]" style={{ color: ins.col, fontFamily: M }}>Save {ins.savings}</p>
                <p className="text-[10px] text-[#4d4634]" style={{ fontFamily: I }}>{ins.conf}% confidence</p>
              </div>
              <button onClick={() => toast.success("AI recommendation applied!")} className="px-3 py-1.5 rounded-lg text-[11px] font-bold text-white hover:opacity-90 transition" style={{ background: ins.col, fontFamily: M }}>Apply →</button>
            </div>
          </div>))}
      </div>
    </div>);
}
