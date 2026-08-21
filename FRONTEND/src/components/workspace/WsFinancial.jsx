import { I, M } from "../../constants/fonts";
import { WS_SPEND } from "../../constants/workspace";

export function WsFinancial() {
    return (<div className="bg-white rounded-2xl border border-[rgba(208,198,174,0.2)] p-6">
      <p className="font-bold text-[15px] text-[#1b1c1c] mb-5" style={{ fontFamily: M }}>Financial Overview</p>
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
            { l: "Budget", v: "₹50L", col: "#1b1c1c" },
            { l: "Spent", v: "₹28L", col: "#ba1a1a" },
            { l: "Remaining", v: "₹22L", col: "#16a34a" },
            { l: "Projected Profit", v: "₹32L", col: "#16a34a" },
        ].map((s, i) => (<div key={i} className="p-4 rounded-xl text-center" style={{ background: "rgba(251,249,249,0.8)", border: "1px solid rgba(208,198,174,0.2)" }}>
            <p className="text-[10px] font-bold text-[#4d4634] uppercase tracking-wide mb-1" style={{ fontFamily: I }}>{s.l}</p>
            <p className="font-bold text-[22px]" style={{ color: s.col, fontFamily: M }}>{s.v}</p>
          </div>))}
      </div>
      <p className="font-bold text-[12px] text-[#4d4634] mb-3 uppercase tracking-wide" style={{ fontFamily: M }}>Cost Breakdown</p>
      <div className="flex flex-col gap-2.5">
        {WS_SPEND.map((s, i) => (<div key={i} className="flex items-center gap-3">
            <span className="text-[12px] text-[#4d4634] w-[120px] shrink-0" style={{ fontFamily: I }}>{s.label}</span>
            <div className="flex-1 h-2 rounded-full bg-[#efeded] overflow-hidden">
              <div className="h-full rounded-full" style={{ width: `${s.pct}%`, background: s.col }}/>
            </div>
            <span className="font-bold text-[12px] text-[#1b1c1c] w-[48px] text-right shrink-0" style={{ fontFamily: M }}>{s.val}</span>
            <span className="text-[11px] text-[#4d4634] w-[32px] text-right shrink-0" style={{ fontFamily: I }}>{s.pct}%</span>
          </div>))}
      </div>
    </div>);
}
