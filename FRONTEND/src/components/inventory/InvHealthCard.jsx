import { toast } from "sonner";
import { TrendingDown, Brain, Clock, RefreshCw, DollarSign } from "lucide-react";
import { ProgressRing } from "../common/ProgressRing";
import { I, M } from "../../constants/fonts";

export function InvHealthCard() {
    return (<div className="bg-white rounded-2xl border border-[rgba(208,198,174,0.2)] p-6 flex items-start gap-8">
      <div className="flex flex-col items-center gap-2 shrink-0">
        <ProgressRing value={87} color="#16a34a" size={88} sw={7}>
          <p className="font-bold text-[20px] text-[#16a34a]" style={{ fontFamily: M }}>87%</p>
        </ProgressRing>
        <p className="text-[11px] font-bold text-[#4d4634] text-center" style={{ fontFamily: I }}>Inv. Health</p>
      </div>
      <div className="grid grid-cols-4 gap-5 flex-1">
        {[
            { l: "Production Coverage", v: "42 Days", col: "#3b82f6", Ic: Clock },
            { l: "Money in Inventory", v: "₹2.4 Cr", col: "#1b1c1c", Ic: DollarSign },
            { l: "Inventory Turnover", v: "8.3x", col: "#16a34a", Ic: RefreshCw },
            { l: "Potential Savings", v: "₹5.8L", col: "#16a34a", Ic: TrendingDown },
        ].map((s, i) => (<div key={i} className="flex flex-col gap-1.5">
            <div className="size-8 rounded-lg flex items-center justify-center" style={{ background: `${s.col}12` }}>
              <s.Ic size={15} style={{ color: s.col }}/>
            </div>
            <p className="font-bold text-[20px] leading-none" style={{ color: s.col, fontFamily: M }}>{s.v}</p>
            <p className="text-[11px] text-[#4d4634]" style={{ fontFamily: I }}>{s.l}</p>
          </div>))}
      </div>
      <div className="w-[240px] shrink-0 p-4 rounded-xl flex flex-col gap-3" style={{ background: "rgba(255,213,74,0.07)", border: "1px solid rgba(255,213,74,0.25)" }}>
        <div className="flex items-center gap-2">
          <Brain size={13} style={{ color: "#735c00" }}/>
          <p className="font-bold text-[12px] text-[#735c00]" style={{ fontFamily: M }}>AI Recommendation</p>
        </div>
        <p className="text-[12px] text-[#4d4634] leading-relaxed" style={{ fontFamily: I }}>
          3 items need <strong>urgent reorder</strong>. Vanilla Flavoring will halt production in 2 days. Mumbai Cold Store at 88% capacity — transfer 300 units.
        </p>
        <div className="flex gap-2">
          <button onClick={() => toast.info("Opening AI analysis…")} className="flex-1 py-2 rounded-lg text-[11px] font-bold text-white hover:bg-[#1b1c1c] transition" style={{ background: "#303031", fontFamily: M }}>View Analysis</button>
          <button onClick={() => toast.success("Optimizing inventory…")} className="flex-1 py-2 rounded-lg text-[11px] font-bold hover:opacity-90 transition" style={{ background: "#ffd54a", color: "#735c00", fontFamily: M }}>Optimize →</button>
        </div>
      </div>
    </div>);
}
