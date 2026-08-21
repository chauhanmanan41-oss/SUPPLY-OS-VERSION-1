import { useState } from "react";
import { toast } from "sonner";
import { CheckCircle, ChevronDown, Zap } from "lucide-react";
import { I, M } from "../../constants/fonts";
import { MKT_SC } from "../../constants/marketplace";

export function MSupplyBuilder() {
    const [open, setOpen] = useState(true);
    const done = MKT_SC.filter(s => s.done).length;
    return (<div className="bg-white rounded-2xl border border-[rgba(208,198,174,0.2)] overflow-hidden">
      <div className="px-6 py-4 flex items-center justify-between border-b border-[rgba(208,198,174,0.12)]" style={{ background: "rgba(255,213,74,0.04)" }}>
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(255,213,74,0.2)" }}>
            <Zap size={15} style={{ color: "#735c00" }}/>
          </div>
          <div>
            <p className="font-bold text-[15px] text-[#1b1c1c]" style={{ fontFamily: M }}>AI Supply Chain Builder</p>
            <p className="text-[12px] text-[#4d4634]" style={{ fontFamily: I }}>
              Complete checklist for: <strong>Protein Powder</strong>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[13px] font-bold text-[#16a34a]" style={{ fontFamily: M }}>{done}/{MKT_SC.length} Partners Found</span>
          <button onClick={() => setOpen(v => !v)} className="p-1.5 hover:bg-[#efeded] rounded-lg transition">
            <ChevronDown size={16} style={{ color: "#4d4634", transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}/>
          </button>
        </div>
      </div>
      {open && (<div className="px-6 py-5 grid grid-cols-2 gap-3">
          {MKT_SC.map((item, i) => (<div key={i} className="flex items-center justify-between px-4 py-3 rounded-xl border" style={{ borderColor: item.done ? "rgba(22,163,74,0.2)" : "rgba(208,198,174,0.2)", background: item.done ? "rgba(22,163,74,0.04)" : "#fbf9f9" }}>
              <div className="flex items-center gap-3">
                <div className="size-6 rounded-full flex items-center justify-center shrink-0" style={{ background: item.done ? "#16a34a" : "rgba(208,198,174,0.25)" }}>
                  {item.done
                    ? <CheckCircle size={12} style={{ color: "white" }}/>
                    : <span className="text-[10px] font-bold text-[#4d4634]">{i + 1}</span>}
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-[#1b1c1c]" style={{ fontFamily: M }}>{item.label}</p>
                  <p className="text-[10px] text-[#4d4634]" style={{ fontFamily: I }}>{item.type}</p>
                </div>
              </div>
              {item.done
                    ? <span className="text-[11px] font-bold text-[#16a34a]" style={{ fontFamily: M }}>✓ Found</span>
                    : <button onClick={() => toast.info(`Finding best ${item.label}…`)} className="px-3 py-1.5 rounded-lg text-[11px] font-bold hover:opacity-90 transition" style={{ background: "#ffd54a", color: "#735c00", fontFamily: M }}>Find →</button>}
            </div>))}
        </div>)}
    </div>);
}
