import { TrendingDown, FileText, Clock, Users, Activity, RefreshCw, DollarSign, ScrollText } from "lucide-react";
import { I, M } from "../../constants/fonts";

export function ProKPIRow() {
    const kpis = [
        { label: "Procurement Value", value: "₹74.3L", sub: "+12.4% this month", Ic: DollarSign, iCol: "#16a34a", iBg: "rgba(22,163,74,0.08)" },
        { label: "Open RFQs", value: "7", sub: "3 awaiting quotes", Ic: FileText, iCol: "#3b82f6", iBg: "rgba(59,130,246,0.08)" },
        { label: "Pending Quotations", value: "5", sub: "2 require review", Ic: Clock, iCol: "#eab308", iBg: "rgba(234,179,8,0.08)" },
        { label: "Purchase Orders", value: "6", sub: "4 approved", Ic: ScrollText, iCol: "#a855f7", iBg: "rgba(168,85,247,0.08)" },
        { label: "Suppliers Engaged", value: "18", sub: "3 new this month", Ic: Users, iCol: "#14b8a6", iBg: "rgba(20,184,166,0.08)" },
        { label: "Budget Utilization", value: "68%", sub: "₹32L remaining", Ic: Activity, iCol: "#3b82f6", iBg: "rgba(59,130,246,0.08)" },
        { label: "AI Cost Savings", value: "₹8.6L", sub: "vs last quarter", Ic: TrendingDown, iCol: "#16a34a", iBg: "rgba(22,163,74,0.08)" },
        { label: "Avg Cycle Time", value: "18 days", sub: "↓ 4 days vs prev", Ic: RefreshCw, iCol: "#f97316", iBg: "rgba(249,115,22,0.08)" },
    ];
    return (<div className="grid grid-cols-4 gap-3">
      {kpis.map((k, i) => (<div key={i} className="bg-white rounded-2xl border border-[rgba(208,198,174,0.2)] p-4 flex items-center gap-3">
          <div className="size-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: k.iBg }}>
            <k.Ic size={18} style={{ color: k.iCol }}/>
          </div>
          <div className="min-w-0">
            <p className="font-bold text-[19px] text-[#1b1c1c] leading-none" style={{ fontFamily: M }}>{k.value}</p>
            <p className="text-[10px] text-[#4d4634] mt-0.5" style={{ fontFamily: I }}>{k.label}</p>
            <p className="text-[10px] font-semibold text-[#16a34a] mt-0.5" style={{ fontFamily: I }}>{k.sub}</p>
          </div>
        </div>))}
    </div>);
}
