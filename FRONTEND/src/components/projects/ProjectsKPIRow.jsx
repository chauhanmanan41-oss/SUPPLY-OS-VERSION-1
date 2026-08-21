import { Filter } from "lucide-react";
import { I, M } from "../../constants/fonts";

export function ProjectsKPIRow() {
    const kpis = [
        { label: "Total Projects", value: "6", sub: "+1 this month", color: "#1b1c1c", borderColor: "rgba(208,198,174,0.2)" },
        { label: "Planning", value: "1", sub: "Protein Powder", color: "#3b82f6", borderColor: "rgba(59,130,246,0.2)" },
        { label: "Manufacturing", value: "1", sub: "Coffee Brand", color: "#f97316", borderColor: "rgba(249,115,22,0.2)" },
        { label: "Completed", value: "0", sub: "On track", color: "#16a34a", borderColor: "rgba(22,163,74,0.2)" },
        { label: "Delayed", value: "1", sub: "Vitamin Pack", color: "#ba1a1a", borderColor: "rgba(186,26,26,0.2)" },
        { label: "Avg. AI Health", value: "82%", sub: "↑ 4% this month", color: "#16a34a", borderColor: "rgba(208,198,174,0.2)" },
        { label: "Est. Revenue", value: "₹6.6Cr", sub: "Across portfolio", color: "#735c00", borderColor: "rgba(255,213,74,0.3)" },
    ];
    return (<div className="grid gap-3" style={{ gridTemplateColumns: "repeat(7, minmax(0,1fr))" }}>
      {kpis.map(k => (<div key={k.label} className="bg-white rounded-2xl p-4 flex flex-col gap-1.5 border shadow-[0_1px_2px_rgba(0,0,0,0.05)]" style={{ borderColor: k.borderColor }}>
          <p className="text-[10px] font-bold uppercase tracking-[0.55px] text-[#4d4634]" style={{ fontFamily: I }}>{k.label}</p>
          <p className="font-bold text-2xl leading-none" style={{ fontFamily: M, color: k.color }}>{k.value}</p>
          <p className="text-[11px] text-[#4d4634]/70" style={{ fontFamily: I }}>{k.sub}</p>
        </div>))}
    </div>);
}
/* Filter + sort bar */
