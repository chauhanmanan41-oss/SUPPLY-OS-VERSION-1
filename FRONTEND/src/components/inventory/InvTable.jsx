import { useState } from "react";
import { toast } from "sonner";
import { Search, Download } from "lucide-react";
import { Badge } from "../common/Badge";
import { InvTableRow } from "./InvTableRow";
import { I, M } from "../../constants/fonts";
import { INV_ITEMS } from "../../constants/inventory";

export function InvTable() {
    const [search, setSearch] = useState("");
    const [catFilter, setCat] = useState("All");
    const [statusFilter, setStatus] = useState("All");
    const filtered = INV_ITEMS.filter(r => {
        if (search && !r.name.toLowerCase().includes(search.toLowerCase()) && !r.sku.toLowerCase().includes(search.toLowerCase()))
            return false;
        if (catFilter !== "All" && r.category !== catFilter)
            return false;
        if (statusFilter !== "All" && r.status !== statusFilter.toLowerCase().replace(" ", ""))
            return false;
        return true;
    });
    return (<div className="bg-white rounded-2xl border border-[rgba(208,198,174,0.2)] overflow-hidden">
      <div className="px-5 py-4 border-b border-[rgba(208,198,174,0.12)] flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-[rgba(208,198,174,0.3)] bg-[#fbf9f9] flex-1 min-w-[200px]">
          <Search size={13} style={{ color: "#4d4634" }}/>
          <input type="text" placeholder="Search by item name or SKU…" value={search} onChange={e => setSearch(e.target.value)} className="flex-1 text-[13px] text-[#1b1c1c] bg-transparent outline-none placeholder-[#4d4634]/40" style={{ fontFamily: I }}/>
        </div>
        <select value={catFilter} onChange={e => setCat(e.target.value)} className="px-3 py-2 rounded-xl border border-[rgba(208,198,174,0.3)] bg-[#fbf9f9] text-[12px] text-[#4d4634] outline-none" style={{ fontFamily: I }}>
          {["All", "Raw Materials", "Packaging", "Finished Goods", "Consumables"].map(c => <option key={c}>{c}</option>)}
        </select>
        <select value={statusFilter} onChange={e => setStatus(e.target.value)} className="px-3 py-2 rounded-xl border border-[rgba(208,198,174,0.3)] bg-[#fbf9f9] text-[12px] text-[#4d4634] outline-none" style={{ fontFamily: I }}>
          {["All", "Healthy", "Low Stock", "Critical", "Out of Stock", "Overstock"].map(s => <option key={s}>{s}</option>)}
        </select>
        <div className="ml-auto flex items-center gap-2">
          <Badge label={`${filtered.length} items`} color="#3b82f6" bg="rgba(59,130,246,0.1)"/>
          <button onClick={() => toast.success("Inventory exported")} className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[rgba(208,198,174,0.3)] text-[12px] font-semibold text-[#4d4634] hover:bg-[#efeded] transition" style={{ fontFamily: M }}>
            <Download size={13}/> Export
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-[rgba(208,198,174,0.15)] bg-[#fbf9f9]">
              {["Item / SKU", "Category", "Warehouse", "Available", "Reserved", "Incoming", "Stock Level", "Value", "Status", "AI Recommendation", "Actions"].map((h, i) => (<th key={i} className="px-3 py-2.5 text-[10px] font-bold text-[#4d4634] uppercase tracking-[0.5px] whitespace-nowrap first:px-4 last:px-4" style={{ fontFamily: I }}>{h}</th>))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(r => <InvTableRow key={r.id} r={r}/>)}
            {filtered.length === 0 && (<tr><td colSpan={11} className="text-center py-12 text-[13px] text-[#4d4634]" style={{ fontFamily: I }}>No items match your filters.</td></tr>)}
          </tbody>
        </table>
      </div>
    </div>);
}
