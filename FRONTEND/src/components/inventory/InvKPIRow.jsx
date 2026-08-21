import { ShoppingBag, AlertTriangle, Package, Activity, DollarSign, Building2, Archive, Zap } from "lucide-react";
import { Sparkline } from "../common/Sparkline";
import { I, M } from "../../constants/fonts";
import { INV_KPI_SPARK } from "../../constants/inventory";

export function InvKPIRow() {
    const kpis = [
        { label: "Total Inv. Value", value: "₹2.4Cr", sub: "+8.2% this month", Ic: DollarSign, iCol: "#16a34a", iBg: "rgba(22,163,74,0.08)", spark: INV_KPI_SPARK.value, sCol: "#16a34a" },
        { label: "Raw Materials", value: "₹77L", sub: "12 active items", Ic: Package, iCol: "#3b82f6", iBg: "rgba(59,130,246,0.08)", spark: INV_KPI_SPARK.raw, sCol: "#3b82f6" },
        { label: "Packaging", value: "₹27L", sub: "3 items low", Ic: Archive, iCol: "#a855f7", iBg: "rgba(168,85,247,0.08)", spark: INV_KPI_SPARK.pkg, sCol: "#a855f7" },
        { label: "Finished Goods", value: "₹22.4L", sub: "4 products", Ic: ShoppingBag, iCol: "#14b8a6", iBg: "rgba(20,184,166,0.08)", spark: INV_KPI_SPARK.finished, sCol: "#14b8a6" },
        { label: "Warehouse Util.", value: "64%", sub: "1 near capacity", Ic: Building2, iCol: "#f97316", iBg: "rgba(249,115,22,0.08)", spark: INV_KPI_SPARK.whUtil, sCol: "#f97316" },
        { label: "Low Stock Items", value: "3", sub: "reorder required", Ic: AlertTriangle, iCol: "#eab308", iBg: "rgba(234,179,8,0.08)", spark: INV_KPI_SPARK.low, sCol: "#eab308" },
        { label: "Critical Items", value: "3", sub: "action needed now", Ic: Zap, iCol: "#ba1a1a", iBg: "rgba(186,26,26,0.08)", spark: INV_KPI_SPARK.crit, sCol: "#ba1a1a" },
        { label: "Inventory Health", value: "87%", sub: "+3% vs last month", Ic: Activity, iCol: "#16a34a", iBg: "rgba(22,163,74,0.08)", spark: [80, 82, 84, 83, 85, 86, 87, 87], sCol: "#16a34a" },
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
          <Sparkline data={k.spark} color={k.sCol} w={54} h={24}/>
        </div>))}
    </div>);
}
