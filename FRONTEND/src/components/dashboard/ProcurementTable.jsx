import { toast } from "sonner";
import { ChevronRight, Filter } from "lucide-react";
import svgPaths from "../../imports/HtmlBody/svg-whh5jpitbk";
import { Badge } from "../common/Badge";
import { I, JM, M } from "../../constants/fonts";

export function ProcurementTable({ orders = [] }) {
    const cols = ["PO #", "Supplier", "Project", "Status", "Value", "Delivery Date", "Risk", "AI Rec"];
    return (<div className="bg-white rounded-2xl border border-[rgba(208,198,174,0.2)] shadow-[0_1px_2px_rgba(0,0,0,0.05)] overflow-hidden">
      {/* Header */}
      <div className="px-8 py-5 border-b border-[rgba(208,198,174,0.2)] flex items-center justify-between">
        <div>
          <h3 className="text-[#1b1c1c] font-bold text-base" style={{ fontFamily: M }}>Procurement Overview</h3>
          <p className="text-[#4d4634] text-[12px] mt-0.5" style={{ fontFamily: I }}>{orders.length} recent purchase orders</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => toast.info("Filtering procurement table.")} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[rgba(115,92,0,0.06)] text-[#735c00] text-sm font-bold hover:bg-[rgba(115,92,0,0.1)] transition" style={{ fontFamily: M }}>
            <Filter size={13}/> Filter
          </button>
          <button onClick={() => toast.info("Showing full procurement table.")} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[rgba(115,92,0,0.06)] text-[#735c00] text-sm font-bold hover:bg-[rgba(115,92,0,0.1)] transition" style={{ fontFamily: M }}>
            View All <ChevronRight size={13}/>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-[rgba(251,249,249,0.8)] border-b border-[rgba(208,198,174,0.2)]">
              {cols.map(c => (<th key={c} className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-[0.6px] text-[#4d4634] first:pl-8 last:pr-8 last:text-right whitespace-nowrap" style={{ fontFamily: I }}>{c}</th>))}
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={cols.length} className="px-6 py-8 text-center text-[#4d4634]" style={{ fontFamily: I }}>
                  No recent purchase orders.
                </td>
              </tr>
            ) : orders.map((r) => {
              const statusColor = r.status === "delayed" ? "#ba1a1a" : r.status === "received" ? "#16a34a" : "#eab308";
              const statusBg = r.status === "delayed" ? "rgba(186,26,26,0.1)" : r.status === "received" ? "rgba(22,163,74,0.1)" : "rgba(234,179,8,0.1)";
              const isDelayed = r.status === "delayed";
              
              return (
              <tr key={r.id} className={`border-b border-[rgba(208,198,174,0.1)] hover:bg-[rgba(255,249,230,0.5)] transition-colors cursor-pointer ${isDelayed ? "bg-[rgba(186,26,26,0.02)]" : ""}`} onClick={() => toast.info(`Opening PO ${r.po_number}`)}>
                <td className="pl-8 pr-6 py-5">
                  <span className="font-mono text-[14px] font-semibold" style={{ fontFamily: JM, color: isDelayed ? "#ba1a1a" : "#4d4634" }}>{r.po_number}</span>
                </td>
                <td className="px-6 py-5">
                  <span className="text-[#1b1c1c] font-bold text-[13px]" style={{ fontFamily: I, color: isDelayed ? "#ba1a1a" : "#1b1c1c" }}>{r.supplier}</span>
                </td>
                <td className="px-6 py-5">
                  <span className="text-[#735c00] font-semibold text-[13px]" style={{ fontFamily: I }}>General</span>
                </td>
                <td className="px-6 py-5">
                  <Badge label={r.status} color={statusColor} bg={statusBg}/>
                </td>
                <td className="px-6 py-5">
                  <span className="font-mono text-[14px] text-[#1b1c1c]" style={{ fontFamily: JM }}>₹{r.total_amount?.toLocaleString()}</span>
                </td>
                <td className="px-6 py-5">
                  <span className="text-[#4d4634] text-[13px] font-medium" style={{ fontFamily: I, color: isDelayed ? "#ba1a1a" : "#4d4634" }}>TBD</span>
                </td>
                <td className="px-6 py-5 text-center">
                  <div className="size-3 rounded-full mx-auto" style={{ background: statusColor, boxShadow: `0 0 0 3px ${statusColor}22` }}/>
                </td>
                <td className="pl-6 pr-8 py-5 text-right">
                  <span className="text-[#d0c6ae] text-base" style={{ fontFamily: I }}>—</span>
                </td>
              </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>);
}
