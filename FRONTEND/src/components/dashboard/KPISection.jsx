import { TrendingUp, TrendingDown, RefreshCw } from "lucide-react";
import { Sparkline } from "../common/Sparkline";
import { StatusDot } from "../common/StatusDot";
import { I, M } from "../../constants/fonts";

export function KPISection({ kpis }) {
    const liveKpis = [
        {
            label: "Total Revenue", value: `₹${(kpis?.revenue ?? 0).toLocaleString()}`, trend: 12, up: true, note: "Month over Month",
            spark: [2, 2, 3, 2, 3, 3, 3], color: "#16a34a", borderColor: "rgba(208,198,174,0.2)"
        },
        {
            label: "Inventory Value", value: `₹${(kpis?.inventory_value ?? 0).toLocaleString()}`, trend: 4, up: false, note: "Current value",
            spark: [55, 58, 60, 63, 66, 68, 68], color: "#eab308", borderColor: "rgba(234,179,8,0.3)"
        },
        {
            label: "Active Products", value: `${kpis?.active_products ?? 0}`, trend: 3, up: true, note: "In portfolio",
            spark: [72, 75, 77, 79, 80, 81, 82], color: "#16a34a", borderColor: "rgba(208,198,174,0.2)"
        },
        {
            label: "Production Batches", value: `${kpis?.production_in_progress ?? 0}`, trend: 8, up: false, note: "In progress",
            spark: [6, 8, 9, 10, 11, 12, 12], color: "#ff8a73", borderColor: "rgba(255,213,74,0.3)"
        },
    ];

    return (<div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-[#1b1c1c] font-bold text-lg" style={{ fontFamily: M }}>Business Metrics</h2>
        <div className="flex items-center gap-1.5 text-[#4d4634] text-xs font-semibold" style={{ fontFamily: I }}>
          <RefreshCw size={11}/>
          <span>Updated 2m ago</span>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {liveKpis.map((k) => (<div key={k.label} className="bg-white rounded-2xl border shadow-[0_1px_2px_rgba(0,0,0,0.05)] p-6 flex flex-col gap-4 hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)] transition-shadow" style={{ borderColor: k.borderColor }}>
            {/* Label + badge */}
            <div className="flex items-start justify-between">
              <p className="text-[#4d4634] text-[13px] font-bold" style={{ fontFamily: I }}>{k.label}</p>
              <div className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold ${k.up ? "bg-[rgba(22,163,74,0.1)] text-[#16a34a]" : "bg-[rgba(186,26,26,0.1)] text-[#ba1a1a]"}`} style={{ fontFamily: I }}>
                {k.up ? <TrendingUp size={11}/> : <TrendingDown size={11}/>}
                {k.trend}%
              </div>
            </div>

            {/* Value */}
            <p className="font-bold text-4xl leading-none text-[#1b1c1c]" style={{ fontFamily: M }}>{k.value}</p>

            {/* Sparkline */}
            <div className="w-full">
              <Sparkline data={k.spark} color={k.color} w={120} h={32}/>
            </div>

            {/* Bottom note */}
            <div className="pt-3 border-t border-[rgba(208,198,174,0.2)] flex items-center gap-2">
              <StatusDot color={k.up ? "#16a34a" : "#ba1a1a"}/>
              <span className="text-[#4d4634] text-[12px] font-semibold" style={{ fontFamily: I }}>{k.note}</span>
            </div>
          </div>))}
      </div>
    </div>);
}
