import { toast } from "sonner";
import { motion } from "motion/react";
import { X } from "lucide-react";
import { Badge } from "../common/Badge";
import { I, M } from "../../constants/fonts";
import { PRO_QUOTES } from "../../constants/procurement";

export function ProQuoteModal({ onClose }) {
    const best = (field, higher) => {
        const vals = PRO_QUOTES.map(q => parseFloat(String(q[field]).replace(/[^\d.]/g, "") || "0"));
        const target = higher ? Math.max(...vals) : Math.min(...vals);
        return PRO_QUOTES.findIndex(q => parseFloat(String(q[field]).replace(/[^\d.]/g, "") || "0") === target);
    };
    const rows = [
        { label: "Quoted Price", key: "price", higher: false },
        { label: "MOQ", key: "moq", higher: false },
        { label: "Lead Time", key: "lead", higher: false },
        { label: "Capacity", key: "cap", higher: true },
        { label: "Quality Rating", key: "rating", higher: true },
        { label: "Transport Cost", key: "transport", higher: false },
        { label: "Payment Terms", key: "payment", higher: false },
        { label: "AI Match", key: "match", higher: true },
        { label: "Risk Score", key: "risk", higher: false },
    ];
    return (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6" onClick={onClose}>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.2 }} onClick={e => e.stopPropagation()} className="bg-white rounded-2xl shadow-[0_24px_80px_rgba(0,0,0,0.16)] overflow-hidden" style={{ width: "100%", maxWidth: 740, maxHeight: "88vh", overflowY: "auto", scrollbarWidth: "none" }}>
        <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b border-[rgba(208,198,174,0.2)] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <p className="font-bold text-[16px] text-[#1b1c1c]" style={{ fontFamily: M }}>Quotation Comparison</p>
            <Badge label="Whey Protein Isolate" color="#3b82f6" bg="rgba(59,130,246,0.1)"/>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-[#efeded] rounded-xl transition">
            <X size={18} style={{ color: "#4d4634" }}/>
          </button>
        </div>
        <div className="px-6 py-5">
          {/* Supplier headers */}
          <div className="grid mb-2" style={{ gridTemplateColumns: "160px repeat(3, 1fr)" }}>
            <div />
            {PRO_QUOTES.map((q, i) => (<div key={i} className="text-center px-2 py-3">
                <p className="font-bold text-[13px] text-[#1b1c1c]" style={{ fontFamily: M }}>{q.supplier}</p>
                {q.best && (<p className="text-[10px] font-bold text-[#16a34a] mt-0.5" style={{ fontFamily: I }}>⭐ AI Recommended</p>)}
              </div>))}
          </div>
          {/* Data rows */}
          {rows.map((row, ri) => {
            const bi = best(row.key, row.higher);
            return (<div key={ri} className="grid border-t border-[rgba(208,198,174,0.12)] py-3 items-center" style={{ gridTemplateColumns: "160px repeat(3, 1fr)" }}>
                <span className="text-[12px] text-[#4d4634]" style={{ fontFamily: I }}>{row.label}</span>
                {PRO_QUOTES.map((q, qi) => (<div key={qi} className="text-center">
                    <span className="font-bold text-[13px] px-2.5 py-1 rounded-lg inline-block" style={{ fontFamily: M, background: qi === bi ? "rgba(22,163,74,0.1)" : "transparent", color: qi === bi ? "#16a34a" : "#1b1c1c" }}>
                      {row.key === "match" ? `${q[row.key]}%` : row.key === "risk" ? `${q[row.key]}/100` : String(q[row.key])}
                    </span>
                    {qi === bi && <p className="text-[9px] text-[#16a34a] font-bold mt-0.5" style={{ fontFamily: I }}>Best</p>}
                  </div>))}
              </div>);
        })}
          {/* CTA */}
          <div className="grid mt-5 gap-3" style={{ gridTemplateColumns: "160px repeat(3, 1fr)" }}>
            <div />
            {PRO_QUOTES.map((q, i) => (<button key={i} onClick={() => { toast.success(`${q.supplier} selected. Creating PO…`); onClose(); }} className="py-2.5 rounded-xl text-[12px] font-bold transition" style={{ background: q.best ? "#ffd54a" : "#303031", color: q.best ? "#735c00" : "white", fontFamily: M }}>
                {q.best ? "⭐ Select (AI Rec.)" : "Select Supplier"}
              </button>))}
          </div>
        </div>
      </motion.div>
    </div>);
}
