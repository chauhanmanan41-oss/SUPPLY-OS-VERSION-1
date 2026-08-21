import { toast } from "sonner";
import { Brain, Activity } from "lucide-react";
import { I, M } from "../../constants/fonts";
import { PRO_ACTIVITY } from "../../constants/procurement";

export function ProAdvisor() {
    return (<div className="w-[285px] shrink-0 h-full overflow-y-auto border-l border-[rgba(208,198,174,0.2)] bg-white" style={{ scrollbarWidth: "none" }}>
      <div className="px-5 py-5 flex flex-col gap-5">
        {/* Header */}
        <div className="flex items-center gap-2.5">
          <div className="size-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(255,213,74,0.15)" }}>
            <Brain size={15} style={{ color: "#735c00" }}/>
          </div>
          <div>
            <p className="font-bold text-[14px] text-[#1b1c1c]" style={{ fontFamily: M }}>AI Procurement Advisor</p>
            <p className="text-[11px] text-[#4d4634]" style={{ fontFamily: I }}>SupplyOS Intelligence</p>
          </div>
        </div>

        {/* Today Summary */}
        <div className="p-4 rounded-xl" style={{ background: "rgba(255,213,74,0.06)", border: "1px solid rgba(255,213,74,0.2)" }}>
          <p className="text-[10px] font-bold text-[#735c00] uppercase tracking-wide mb-3" style={{ fontFamily: M }}>Today's Summary</p>
          {[
            { l: "Active RFQs", v: "7", col: "#3b82f6" },
            { l: "Pending Approval", v: "3", col: "#ba1a1a" },
            { l: "Open Quotes", v: "5", col: "#eab308" },
            { l: "Delayed POs", v: "1", col: "#f97316" },
            { l: "AI Savings Found", v: "₹3.3L", col: "#16a34a" },
        ].map((r, i) => (<div key={i} className="flex justify-between items-center mb-1.5 last:mb-0">
              <span className="text-[12px] text-[#4d4634]" style={{ fontFamily: I }}>{r.l}</span>
              <span className="font-bold text-[12px]" style={{ color: r.col, fontFamily: M }}>{r.v}</span>
            </div>))}
        </div>

        {/* Procurement Health */}
        <div>
          <p className="text-[10px] font-bold text-[#4d4634] uppercase tracking-wide mb-3" style={{ fontFamily: M }}>Procurement Health</p>
          {[
            { l: "RFQ Response Rate", v: 84, col: "#16a34a" },
            { l: "On-time Delivery", v: 76, col: "#eab308" },
            { l: "Budget Compliance", v: 91, col: "#16a34a" },
            { l: "Supplier Quality", v: 88, col: "#16a34a" },
            { l: "AI Coverage", v: 62, col: "#3b82f6" },
        ].map((h, i) => (<div key={i} className="flex items-center gap-3 mb-2">
              <span className="text-[11px] text-[#4d4634] shrink-0 w-[105px]" style={{ fontFamily: I }}>{h.l}</span>
              <div className="flex-1 h-1.5 rounded-full bg-[#efeded] overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${h.v}%`, background: h.col }}/>
              </div>
              <span className="text-[11px] font-bold w-7 text-right shrink-0" style={{ color: h.col, fontFamily: M }}>{h.v}%</span>
            </div>))}
        </div>

        {/* Urgent RFQs */}
        <div>
          <p className="text-[10px] font-bold text-[#4d4634] uppercase tracking-wide mb-2" style={{ fontFamily: M }}>Urgent RFQs</p>
          {[
            { product: "Whey Protein Isolate", due: "2 days", col: "#ba1a1a" },
            { product: "NABL Lab Testing", due: "5 days", col: "#eab308" },
        ].map((u, i) => (<div key={i} className="flex items-center justify-between px-3 py-2.5 rounded-xl mb-2 last:mb-0" style={{ background: `${u.col}08`, border: `1px solid ${u.col}22` }}>
              <p className="text-[12px] font-semibold text-[#1b1c1c]" style={{ fontFamily: M }}>{u.product}</p>
              <p className="text-[11px] font-bold" style={{ color: u.col, fontFamily: M }}>{u.due}</p>
            </div>))}
        </div>

        {/* Supplier Risk */}
        <div>
          <p className="text-[10px] font-bold text-[#4d4634] uppercase tracking-wide mb-2" style={{ fontFamily: M }}>Supplier Risk Watch</p>
          {[
            { name: "FlavourTech India", risk: "Medium", col: "#eab308", note: "3 missed deadlines" },
            { name: "ColdSpace Warehousing", risk: "Low", col: "#16a34a", note: "On track" },
        ].map((s, i) => (<div key={i} className="flex items-center gap-3 mb-2 last:mb-0">
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-semibold text-[#1b1c1c]" style={{ fontFamily: M }}>{s.name}</p>
                <p className="text-[10px] text-[#4d4634]" style={{ fontFamily: I }}>{s.note}</p>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0" style={{ background: `${s.col}18`, color: s.col, fontFamily: I }}>{s.risk}</span>
            </div>))}
        </div>

        {/* Savings */}
        <div className="p-4 rounded-xl" style={{ background: "rgba(22,163,74,0.05)", border: "1px solid rgba(22,163,74,0.2)" }}>
          <p className="text-[10px] font-bold text-[#16a34a] uppercase tracking-wide mb-1" style={{ fontFamily: M }}>Potential Savings</p>
          <p className="text-[22px] font-bold text-[#16a34a]" style={{ fontFamily: M }}>₹3.3 Lakhs</p>
          <p className="text-[11px] text-[#4d4634] mt-0.5" style={{ fontFamily: I }}>3 AI recommendations available</p>
        </div>

        {/* Activity */}
        <div>
          <p className="text-[10px] font-bold text-[#4d4634] uppercase tracking-wide mb-3" style={{ fontFamily: M }}>Activity Feed</p>
          <div className="flex flex-col gap-3">
            {PRO_ACTIVITY.slice(0, 5).map((a, i) => (<div key={i} className="flex items-start gap-2.5">
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
          <button onClick={() => toast.info("Generating procurement report…")} className="w-full py-2.5 rounded-xl text-[13px] font-semibold border border-[rgba(208,198,174,0.3)] text-[#4d4634] hover:bg-[#efeded] transition" style={{ fontFamily: M }}>Generate Report</button>
        </div>
      </div>
    </div>);
}
