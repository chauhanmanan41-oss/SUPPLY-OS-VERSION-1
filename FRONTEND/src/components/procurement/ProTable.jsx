import { useState } from "react";
import { toast } from "sonner";
import { Search, Filter, Download } from "lucide-react";
import { Badge } from "../common/Badge";
import { ProTableRow } from "./ProTableRow";
import { I, M } from "../../constants/fonts";
import { PRO_RECORDS, PRO_STAGES } from "../../constants/procurement";

export function ProTable({ stageFilter }) {
    const [expandedId, setExpandedId] = useState(null);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatus] = useState("All");
    const [priorityFilter, setPri] = useState("All");
    const filtered = PRO_RECORDS.filter(r => {
        if (search && !r.product.toLowerCase().includes(search.toLowerCase()) && !r.supplier.toLowerCase().includes(search.toLowerCase()))
            return false;
        if (statusFilter !== "All" && r.stage !== statusFilter)
            return false;
        if (priorityFilter !== "All" && r.priority !== priorityFilter.toLowerCase())
            return false;
        if (stageFilter) {
            const s = PRO_STAGES.find(x => x.id === stageFilter);
            if (s && !r.stage.toLowerCase().includes(s.label.split(" ")[0].toLowerCase()))
                return false;
        }
        return true;
    });
    return (<div className="bg-white rounded-2xl border border-[rgba(208,198,174,0.2)] overflow-hidden">
      {/* Filter bar */}
      <div className="px-5 py-4 border-b border-[rgba(208,198,174,0.12)] flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-[rgba(208,198,174,0.3)] bg-[#fbf9f9] flex-1 min-w-[200px]">
          <Search size={13} style={{ color: "#4d4634" }}/>
          <input type="text" placeholder="Search procurement…" value={search} onChange={e => setSearch(e.target.value)} className="flex-1 text-[13px] text-[#1b1c1c] bg-transparent outline-none placeholder-[#4d4634]/40" style={{ fontFamily: I }}/>
        </div>
        <select value={statusFilter} onChange={e => setStatus(e.target.value)} className="px-3 py-2 rounded-xl border border-[rgba(208,198,174,0.3)] bg-[#fbf9f9] text-[12px] text-[#4d4634] outline-none" style={{ fontFamily: I }}>
          {["All", "RFQ Created", "Supplier Quotes", "AI Comparison", "Negotiation", "Purchase Order", "Manufacturing"].map(s => (<option key={s}>{s}</option>))}
        </select>
        <select value={priorityFilter} onChange={e => setPri(e.target.value)} className="px-3 py-2 rounded-xl border border-[rgba(208,198,174,0.3)] bg-[#fbf9f9] text-[12px] text-[#4d4634] outline-none" style={{ fontFamily: I }}>
          {["All", "High", "Medium", "Low"].map(p => <option key={p}>{p}</option>)}
        </select>
        <div className="ml-auto flex items-center gap-2">
          <Badge label={`${filtered.length} records`} color="#3b82f6" bg="rgba(59,130,246,0.1)"/>
          <button onClick={() => toast.success("Report exported")} className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[rgba(208,198,174,0.3)] text-[12px] font-semibold text-[#4d4634] hover:bg-[#efeded] transition" style={{ fontFamily: M }}>
            <Download size={13}/> Export
          </button>
        </div>
      </div>
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-[rgba(208,198,174,0.15)] bg-[#fbf9f9]">
              {["", "ID", "Product", "Supplier", "Stage", "Quotes", "AI Rec.", "Value", "Delivery", "Progress", "Risk", "Actions", ""].map((h, i) => (<th key={i} className="px-3 py-2.5 text-[10px] font-bold text-[#4d4634] uppercase tracking-[0.5px] whitespace-nowrap first:px-4 last:px-4" style={{ fontFamily: I }}>{h}</th>))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(r => (<ProTableRow key={r.id} r={r} expanded={expandedId === r.id} onExpand={() => setExpandedId(expandedId === r.id ? null : r.id)}/>))}
            {filtered.length === 0 && (<tr>
                <td colSpan={13} className="text-center py-12 text-[13px] text-[#4d4634]" style={{ fontFamily: I }}>
                  No procurement records match your filters.
                </td>
              </tr>)}
          </tbody>
        </table>
      </div>
    </div>);
}
