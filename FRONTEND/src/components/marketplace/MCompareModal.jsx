import { toast } from "sonner";
import { motion } from "motion/react";
import { Shield, X, Send } from "lucide-react";
import { I, M } from "../../constants/fonts";
import { MKT_PARTNERS } from "../../constants/marketplace";

export function MCompareModal({ selected, partners = MKT_PARTNERS, onClose }) {
    const list = partners && partners.length > 0 ? partners : MKT_PARTNERS;
    const items = list.filter(p => selected.includes(p.id));
    const best = (field, higher = true) => {
        const vals = items.map(p => parseFloat(String(p[field]).replace(/[^\d.]/g, "") || "0"));
        const target = higher ? Math.max(...vals) : Math.min(...vals);
        return items.findIndex(p => parseFloat(String(p[field]).replace(/[^\d.]/g, "") || "0") === target);
    };
    const rows = [
        { label: "AI Match Score", field: "match", higher: true },
        { label: "Rating", field: "rating", higher: true },
        { label: "Lead Time", field: "lead", higher: false },
        { label: "Response Time", field: "response", higher: false },
        { label: "Min. Order", field: "moq", higher: false },
        { label: "Price", field: "price", higher: false },
        { label: "Capacity", field: "capacity", higher: true },
        { label: "Projects Done", field: "projects", higher: true },
    ];
    return (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6" onClick={onClose}>
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.2 }} onClick={e => e.stopPropagation()} className="bg-white rounded-2xl shadow-[0_24px_80px_rgba(0,0,0,0.18)] overflow-hidden" style={{ maxWidth: 700, width: "100%", maxHeight: "85vh", overflowY: "auto", scrollbarWidth: "none" }}>
        <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b border-[rgba(208,198,174,0.2)] flex items-center justify-between">
          <p className="font-bold text-[16px] text-[#1b1c1c]" style={{ fontFamily: M }}>Partner Comparison</p>
          <button onClick={onClose} className="p-2 hover:bg-[#efeded] rounded-xl transition">
            <X size={18} style={{ color: "#4d4634" }}/>
          </button>
        </div>
        <div className="px-6 py-4">
          {/* Header row */}
          <div className="grid mb-1" style={{ gridTemplateColumns: `180px repeat(${items.length}, 1fr)` }}>
            <div />
            {items.map(p => (<div key={p.id} className="text-center px-2 py-3">
                <div className="size-10 rounded-xl flex items-center justify-center text-xl mx-auto mb-1" style={{ background: p.bg || "rgba(59,130,246,0.1)" }}>{p.logo || "🏭"}</div>
                <p className="font-bold text-[13px] text-[#1b1c1c]" style={{ fontFamily: M }}>{p.name}</p>
                <p className="text-[11px]" style={{ color: p.col, fontFamily: I }}>{p.type}</p>
              </div>))}
          </div>
          {/* Data rows */}
          {rows.map((row, ri) => {
            const bestIdx = best(row.field, row.higher);
            return (<div key={ri} className="grid border-t border-[rgba(208,198,174,0.12)] py-3" style={{ gridTemplateColumns: `180px repeat(${items.length}, 1fr)` }}>
                <span className="text-[12px] text-[#4d4634] self-center" style={{ fontFamily: I }}>{row.label}</span>
                {items.map((p, pi) => (<div key={p.id} className="text-center px-2">
                    <span className={`font-bold text-[14px] px-3 py-1 rounded-lg inline-block`} style={{
                        fontFamily: M,
                        background: pi === bestIdx ? "rgba(22,163,74,0.1)" : "transparent",
                        color: pi === bestIdx ? "#16a34a" : "#1b1c1c"
                    }}>
                      {row.field === "match" ? `${p[row.field] || 90}%` : String(p[row.field] ?? "-")}
                    </span>
                    {pi === bestIdx && <p className="text-[9px] text-[#16a34a] font-bold mt-0.5" style={{ fontFamily: I }}>Best</p>}
                  </div>))}
              </div>);
        })}
          {/* Certs row */}
          <div className="grid border-t border-[rgba(208,198,174,0.12)] py-3" style={{ gridTemplateColumns: `180px repeat(${items.length}, 1fr)` }}>
            <span className="text-[12px] text-[#4d4634] self-start pt-1" style={{ fontFamily: I }}>Certifications</span>
            {items.map(p => (<div key={p.id} className="flex flex-col gap-1 items-center">
                {(Array.isArray(p.certs) ? p.certs : ["Verified"]).map(c => (<span key={c} className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold" style={{ background: "#efeded", color: "#4d4634", fontFamily: I }}>
                    <Shield size={8} style={{ color: "#16a34a" }}/>{c}
                  </span>))}
              </div>))}
          </div>
          {/* CTA row */}
          <div className="grid mt-4 gap-3" style={{ gridTemplateColumns: `180px repeat(${items.length}, 1fr)` }}>
            <div />
            {items.map(p => (<button key={p.id} onClick={() => { toast.success(`RFQ sent to ${p.name}`); onClose(); }} className="py-2.5 rounded-xl text-[13px] font-bold hover:opacity-90 transition" style={{ background: "#ffd54a", color: "#735c00", fontFamily: M }}>Send RFQ</button>))}
          </div>
        </div>
      </motion.div>
    </div>);
}
