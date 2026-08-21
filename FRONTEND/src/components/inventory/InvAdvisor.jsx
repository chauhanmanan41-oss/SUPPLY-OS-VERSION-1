import { toast } from "sonner";
import { Brain, Activity } from "lucide-react";
import { ProgressRing } from "../common/ProgressRing";
import { I, M } from "../../constants/fonts";
import { INV_ACTIVITY, INV_WAREHOUSES } from "../../constants/inventory";

export function InvAdvisor() {
    return (<div className="w-[285px] shrink-0 h-full overflow-y-auto border-l border-[rgba(208,198,174,0.2)] bg-white" style={{ scrollbarWidth: "none" }}>
      <div className="px-5 py-5 flex flex-col gap-5">
        <div className="flex items-center gap-2.5">
          <div className="size-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(255,213,74,0.15)" }}>
            <Brain size={15} style={{ color: "#735c00" }}/>
          </div>
          <div>
            <p className="font-bold text-[14px] text-[#1b1c1c]" style={{ fontFamily: M }}>AI Inventory Advisor</p>
            <p className="text-[11px] text-[#4d4634]" style={{ fontFamily: I }}>SupplyOS Intelligence</p>
          </div>
        </div>

        {/* Health */}
        <div className="flex items-center gap-4 p-4 rounded-xl" style={{ background: "rgba(22,163,74,0.05)", border: "1px solid rgba(22,163,74,0.2)" }}>
          <ProgressRing value={87} color="#16a34a" size={54} sw={5}>
            <p className="font-bold text-[13px] text-[#16a34a]" style={{ fontFamily: M }}>87%</p>
          </ProgressRing>
          <div>
            <p className="font-bold text-[14px] text-[#1b1c1c]" style={{ fontFamily: M }}>Inventory Health</p>
            <p className="text-[11px] text-[#16a34a] font-semibold mt-0.5" style={{ fontFamily: I }}>3 critical alerts</p>
          </div>
        </div>

        {/* Summary */}
        <div className="p-4 rounded-xl" style={{ background: "rgba(255,213,74,0.06)", border: "1px solid rgba(255,213,74,0.2)" }}>
          <p className="text-[10px] font-bold text-[#735c00] uppercase tracking-wide mb-3" style={{ fontFamily: M }}>Today's Summary</p>
          {[
            { l: "Production Coverage", v: "42 days", col: "#3b82f6" },
            { l: "Critical Items", v: "3", col: "#ba1a1a" },
            { l: "Overstock Items", v: "1", col: "#3b82f6" },
            { l: "Understock Items", v: "3", col: "#eab308" },
            { l: "Potential Savings", v: "₹5.8L", col: "#16a34a" },
        ].map((r, i) => (<div key={i} className="flex justify-between items-center mb-1.5 last:mb-0">
              <span className="text-[12px] text-[#4d4634]" style={{ fontFamily: I }}>{r.l}</span>
              <span className="font-bold text-[12px]" style={{ color: r.col, fontFamily: M }}>{r.v}</span>
            </div>))}
        </div>

        {/* Warehouse alerts */}
        <div>
          <p className="text-[10px] font-bold text-[#4d4634] uppercase tracking-wide mb-2" style={{ fontFamily: M }}>Warehouse Alerts</p>
          {INV_WAREHOUSES.filter(w => w.used >= 70).map((w, i) => (<div key={i} className="flex items-center justify-between px-3 py-2.5 rounded-xl mb-2 last:mb-0" style={{ background: w.used >= 85 ? "rgba(186,26,26,0.06)" : "rgba(234,179,8,0.06)", border: `1px solid ${w.used >= 85 ? "rgba(186,26,26,0.2)" : "rgba(234,179,8,0.2)"}` }}>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-semibold text-[#1b1c1c]" style={{ fontFamily: M }}>{w.name.split(" ")[0]}</p>
                <p className="text-[10px]" style={{ color: w.used >= 85 ? "#ba1a1a" : "#eab308", fontFamily: I }}>{w.used}% capacity used</p>
              </div>
              <button onClick={() => toast.info("Transfer wizard opening…")} className="text-[10px] font-bold px-2 py-1 rounded-lg ml-2 shrink-0" style={{ background: "#ffd54a", color: "#735c00", fontFamily: M }}>Transfer</button>
            </div>))}
        </div>

        {/* Upcoming deliveries */}
        <div>
          <p className="text-[10px] font-bold text-[#4d4634] uppercase tracking-wide mb-2" style={{ fontFamily: M }}>Upcoming Deliveries</p>
          {[
            { item: "Vanilla Flavoring 200L", date: "Jan 18", col: "#ba1a1a" },
            { item: "HDPE Jars 10,000 pcs", date: "Jan 20", col: "#eab308" },
            { item: "Sweetener Blend 50kg", date: "Jan 22", col: "#eab308" },
        ].map((d, i) => (<div key={i} className="flex justify-between items-center py-1.5 border-b border-[rgba(208,198,174,0.1)] last:border-0">
              <span className="text-[11px] text-[#4d4634]" style={{ fontFamily: I }}>{d.item}</span>
              <span className="font-bold text-[11px] shrink-0 ml-2" style={{ color: d.col, fontFamily: M }}>{d.date}</span>
            </div>))}
        </div>

        {/* Activity */}
        <div>
          <p className="text-[10px] font-bold text-[#4d4634] uppercase tracking-wide mb-3" style={{ fontFamily: M }}>Recent Activity</p>
          <div className="flex flex-col gap-3">
            {INV_ACTIVITY.slice(0, 5).map((a, i) => (<div key={i} className="flex items-start gap-2.5">
                <span className="text-base shrink-0 leading-none mt-0.5">{a.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] text-[#1b1c1c] leading-snug" style={{ fontFamily: I }}>{a.text}</p>
                  <p className="text-[10px] text-[#4d4634] mt-0.5" style={{ fontFamily: I }}>{a.time}</p>
                </div>
              </div>))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <button onClick={() => toast.info("AI Advisor opening…")} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-[13px] hover:opacity-90 transition" style={{ background: "#ffd54a", color: "#735c00", fontFamily: M }}>
            <Brain size={14}/> Ask AI Advisor
          </button>
          <button onClick={() => toast.info("Optimizing inventory…")} className="w-full py-2.5 rounded-xl text-[13px] font-semibold border border-[rgba(208,198,174,0.3)] text-[#4d4634] hover:bg-[#efeded] transition" style={{ fontFamily: M }}>Optimize Inventory</button>
          <button onClick={() => toast.info("Generating forecast…")} className="w-full py-2.5 rounded-xl text-[13px] font-semibold border border-[rgba(208,198,174,0.3)] text-[#4d4634] hover:bg-[#efeded] transition" style={{ fontFamily: M }}>Generate Forecast</button>
        </div>
      </div>
    </div>);
}
