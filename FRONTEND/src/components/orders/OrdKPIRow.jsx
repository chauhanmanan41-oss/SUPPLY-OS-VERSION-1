import { Factory, AlertTriangle, CheckCircle, Clock, Package, Truck, X, Activity } from "lucide-react";
import { Sparkline } from "../common/Sparkline";
import { I, M } from "../../constants/fonts";
import { ORD_KPI_SPARK } from "../../constants/orders";

export function OrdKPIRow() {
    const kpis = [
        { label: "Total Orders", value: "62", sub: "+8 this month", Ic: Package, iCol: "#1b1c1c", iBg: "rgba(27,28,28,0.06)", spark: ORD_KPI_SPARK.total, sCol: "#1b1c1c" },
        { label: "Active Orders", value: "28", sub: "6 require action", Ic: Activity, iCol: "#3b82f6", iBg: "rgba(59,130,246,0.08)", spark: ORD_KPI_SPARK.active, sCol: "#3b82f6" },
        { label: "Manufacturing", value: "4", sub: "2 behind schedule", Ic: Factory, iCol: "#f97316", iBg: "rgba(249,115,22,0.08)", spark: ORD_KPI_SPARK.mfg, sCol: "#f97316" },
        { label: "In Transit", value: "4", sub: "1 delayed", Ic: Truck, iCol: "#8b5cf6", iBg: "rgba(139,92,246,0.08)", spark: ORD_KPI_SPARK.transit, sCol: "#8b5cf6" },
        { label: "Delivered", value: "31", sub: "+3 this week", Ic: CheckCircle, iCol: "#16a34a", iBg: "rgba(22,163,74,0.08)", spark: ORD_KPI_SPARK.delivered, sCol: "#16a34a" },
        { label: "Delayed", value: "3", sub: "₹1.4L at risk", Ic: AlertTriangle, iCol: "#ba1a1a", iBg: "rgba(186,26,26,0.08)", spark: ORD_KPI_SPARK.delayed, sCol: "#ba1a1a" },
        { label: "Cancelled", value: "2", sub: "this quarter", Ic: X, iCol: "#6b7280", iBg: "rgba(107,114,128,0.08)", spark: [1, 0, 2, 1, 0, 1, 2, 2], sCol: "#6b7280" },
        { label: "Avg Delivery Time", value: "14.2d", sub: "↓ 2.1d vs prev", Ic: Clock, iCol: "#14b8a6", iBg: "rgba(20,184,166,0.08)", spark: [16, 15, 14, 15, 13, 14, 15, 14], sCol: "#14b8a6" },
    ];
    return (<div className="grid grid-cols-4 gap-3">
      {kpis.map((k, i) => (<div key={i} className="bg-white rounded-2xl border border-[rgba(208,198,174,0.2)] p-4 flex items-center gap-3">
          <div className="size-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: k.iBg }}>
            <k.Ic size={18} style={{ color: k.iCol }}/>
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-bold text-[20px] text-[#1b1c1c] leading-none" style={{ fontFamily: M }}>{k.value}</p>
            <p className="text-[10px] text-[#4d4634] mt-0.5" style={{ fontFamily: I }}>{k.label}</p>
            <p className="text-[10px] font-semibold text-[#4d4634] mt-0.5" style={{ fontFamily: I }}>{k.sub}</p>
          </div>
          <Sparkline data={k.spark} color={k.sCol} w={56} h={24}/>
        </div>))}
    </div>);
}
