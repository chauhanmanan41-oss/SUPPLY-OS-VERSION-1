import { toast } from "sonner";
import { TrendingUp, TrendingDown, Brain, AlertTriangle, Clock } from "lucide-react";
import { ProgressRing } from "../common/ProgressRing";
import { I, M } from "../../constants/fonts";

export function OrdHealthCard() {
    return (<div className="bg-white rounded-2xl border border-[rgba(208,198,174,0.2)] p-6 flex items-start gap-8">
      {/* Score ring */}
      <div className="flex flex-col items-center gap-2 shrink-0">
        <ProgressRing value={94} color="#16a34a" size={88} sw={7}>
          <p className="font-bold text-[20px] text-[#16a34a]" style={{ fontFamily: M }}>94%</p>
        </ProgressRing>
        <p className="text-[11px] font-bold text-[#4d4634] text-center" style={{ fontFamily: I }}>Order Health</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-4 gap-5 flex-1">
        {[
            { l: "Delayed Orders", v: "3", col: "#ba1a1a", icon: AlertTriangle },
            { l: "Orders At Risk", v: "5", col: "#eab308", icon: Clock },
            { l: "Est. Late Cost", v: "₹4.8L", col: "#ba1a1a", icon: TrendingDown },
            { l: "Potential Savings", v: "₹2.2L", col: "#16a34a", icon: TrendingUp },
        ].map((s, i) => (<div key={i} className="flex flex-col gap-1.5">
            <div className="size-8 rounded-lg flex items-center justify-center" style={{ background: `${s.col}12` }}>
              <s.icon size={15} style={{ color: s.col }}/>
            </div>
            <p className="font-bold text-[22px] leading-none" style={{ color: s.col, fontFamily: M }}>{s.v}</p>
            <p className="text-[11px] text-[#4d4634]" style={{ fontFamily: I }}>{s.l}</p>
          </div>))}
      </div>

      {/* AI Recommendation */}
      <div className="w-[260px] shrink-0 p-4 rounded-xl flex flex-col gap-3" style={{ background: "rgba(255,213,74,0.07)", border: "1px solid rgba(255,213,74,0.25)" }}>
        <div className="flex items-center gap-2">
          <Brain size={14} style={{ color: "#735c00" }}/>
          <p className="font-bold text-[12px] text-[#735c00]" style={{ fontFamily: M }}>AI Recommendation</p>
        </div>
        <p className="text-[12px] text-[#4d4634] leading-relaxed" style={{ fontFamily: I }}>
          GMP blend manufacturing is <strong>3 days behind</strong>. Switch to Priority Express freight to maintain the Jan 28 launch date.
        </p>
        <div className="flex gap-2">
          <button onClick={() => toast.info("Opening AI analysis…")} className="flex-1 py-2 rounded-lg text-[11px] font-bold hover:opacity-90 transition text-white" style={{ background: "#303031", fontFamily: M }}>View Analysis</button>
          <button onClick={() => toast.success("Optimizing deliveries…")} className="flex-1 py-2 rounded-lg text-[11px] font-bold hover:opacity-90 transition" style={{ background: "#ffd54a", color: "#735c00", fontFamily: M }}>Optimize →</button>
        </div>
      </div>
    </div>);
}
