import { toast } from "sonner";
import { Brain, Activity } from "lucide-react";
import { ProgressRing } from "../common/ProgressRing";
import { I, M } from "../../constants/fonts";
import { ORD_ACTIVITY } from "../../constants/orders";

export function OrdAdvisor() {
    return (<div className="w-[285px] shrink-0 h-full overflow-y-auto border-l border-[rgba(208,198,174,0.2)] bg-white" style={{ scrollbarWidth: "none" }}>
      <div className="px-5 py-5 flex flex-col gap-5">
        {/* Header */}
        <div className="flex items-center gap-2.5">
          <div className="size-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(255,213,74,0.15)" }}>
            <Brain size={15} style={{ color: "#735c00" }}/>
          </div>
          <div>
            <p className="font-bold text-[14px] text-[#1b1c1c]" style={{ fontFamily: M }}>AI Order Advisor</p>
            <p className="text-[11px] text-[#4d4634]" style={{ fontFamily: I }}>SupplyOS Intelligence</p>
          </div>
        </div>

        {/* Health ring */}
        <div className="flex items-center gap-4 p-4 rounded-xl" style={{ background: "rgba(22,163,74,0.05)", border: "1px solid rgba(22,163,74,0.2)" }}>
          <ProgressRing value={94} color="#16a34a" size={56} sw={5}>
            <p className="font-bold text-[13px] text-[#16a34a]" style={{ fontFamily: M }}>94%</p>
          </ProgressRing>
          <div>
            <p className="font-bold text-[14px] text-[#1b1c1c]" style={{ fontFamily: M }}>Order Health</p>
            <p className="text-[11px] text-[#16a34a] font-semibold mt-0.5" style={{ fontFamily: I }}>Good — 3 issues flagged</p>
          </div>
        </div>

        {/* Alerts */}
        <div>
          <p className="text-[10px] font-bold text-[#4d4634] uppercase tracking-wide mb-2" style={{ fontFamily: M }}>Critical Alerts</p>
          {[
            { l: "Delayed Orders", v: "3", col: "#ba1a1a" },
            { l: "Orders At Risk", v: "5", col: "#eab308" },
            { l: "Transport Alerts", v: "1", col: "#f97316" },
            { l: "Production Risks", v: "2", col: "#eab308" },
            { l: "Warehouse Issues", v: "0", col: "#16a34a" },
        ].map((r, i) => (<div key={i} className="flex justify-between items-center py-1.5 border-b border-[rgba(208,198,174,0.1)] last:border-0">
              <span className="text-[12px] text-[#4d4634]" style={{ fontFamily: I }}>{r.l}</span>
              <span className="font-bold text-[12px]" style={{ color: r.col, fontFamily: M }}>{r.v}</span>
            </div>))}
        </div>

        {/* AI Recommendation */}
        <div className="p-4 rounded-xl" style={{ background: "rgba(255,213,74,0.07)", border: "1px solid rgba(255,213,74,0.25)" }}>
          <div className="flex items-center gap-2 mb-2">
            <Brain size={12} style={{ color: "#735c00" }}/>
            <p className="font-bold text-[11px] text-[#735c00]" style={{ fontFamily: M }}>Top Recommendation</p>
          </div>
          <p className="text-[11px] font-bold text-[#1b1c1c] mb-1" style={{ fontFamily: M }}>Protein Powder — GMP Blend</p>
          <p className="text-[11px] text-[#4d4634] leading-relaxed mb-3" style={{ fontFamily: I }}>
            Manufacturing is running 3 days behind. Switch transport to Priority Express to maintain Jan 28 launch.
          </p>
          <div className="flex justify-between mb-3">
            <div>
              <p className="text-[10px] text-[#4d4634]" style={{ fontFamily: I }}>Potential Saving</p>
              <p className="font-bold text-[13px] text-[#16a34a]" style={{ fontFamily: M }}>₹1.5L</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-[#4d4634]" style={{ fontFamily: I }}>Confidence</p>
              <p className="font-bold text-[13px] text-[#16a34a]" style={{ fontFamily: M }}>95%</p>
            </div>
          </div>
          <button onClick={() => toast.success("AI recommendation applied!")} className="w-full py-2 rounded-lg text-[12px] font-bold hover:opacity-90 transition" style={{ background: "#ffd54a", color: "#735c00", fontFamily: M }}>Apply Recommendation →</button>
        </div>

        {/* Predicted Delays */}
        <div>
          <p className="text-[10px] font-bold text-[#4d4634] uppercase tracking-wide mb-2" style={{ fontFamily: M }}>Predicted Delays</p>
          {[
            { product: "GMP Blend", days: "3 days", conf: 91, col: "#ba1a1a" },
            { product: "HDPE Jars", days: "1 day", conf: 82, col: "#eab308" },
        ].map((p, i) => (<div key={i} className="flex items-center gap-3 mb-2 last:mb-0 p-3 rounded-xl" style={{ background: `${p.col}08`, border: `1px solid ${p.col}20` }}>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-semibold text-[#1b1c1c]" style={{ fontFamily: M }}>{p.product}</p>
                <p className="text-[10px]" style={{ color: p.col, fontFamily: I }}>{p.days} predicted delay</p>
              </div>
              <span className="text-[10px] font-bold shrink-0" style={{ color: p.col, fontFamily: M }}>{p.conf}%</span>
            </div>))}
        </div>

        {/* Activity */}
        <div>
          <p className="text-[10px] font-bold text-[#4d4634] uppercase tracking-wide mb-3" style={{ fontFamily: M }}>Recent Activity</p>
          <div className="flex flex-col gap-3">
            {ORD_ACTIVITY.slice(0, 5).map((a, i) => (<div key={i} className="flex items-start gap-2.5">
                <span className="text-base shrink-0 leading-none mt-0.5">{a.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] text-[#1b1c1c] leading-snug" style={{ fontFamily: I }}>{a.text}</p>
                  <p className="text-[10px] text-[#4d4634] mt-0.5" style={{ fontFamily: I }}>{a.time}</p>
                </div>
              </div>))}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-2">
          <button onClick={() => toast.info("AI Advisor opening…")} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-[13px] hover:opacity-90 transition" style={{ background: "#ffd54a", color: "#735c00", fontFamily: M }}>
            <Brain size={14}/> Ask AI Advisor
          </button>
          <button onClick={() => toast.info("Generating report…")} className="w-full py-2.5 rounded-xl text-[13px] font-semibold border border-[rgba(208,198,174,0.3)] text-[#4d4634] hover:bg-[#efeded] transition" style={{ fontFamily: M }}>Generate Report</button>
        </div>
      </div>
    </div>);
}
