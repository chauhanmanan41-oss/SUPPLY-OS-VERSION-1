import { motion } from "motion/react";
import { ChevronRight } from "lucide-react";
import { Badge } from "../common/Badge";
import { I, M } from "../../constants/fonts";
import { ORD_STAGES } from "../../constants/orders";

export function OrdPipeline({ active, onStage }) {
    return (<div className="bg-white rounded-2xl border border-[rgba(208,198,174,0.2)] px-5 py-4">
      <div className="flex items-center justify-between mb-4">
        <p className="font-bold text-[14px] text-[#1b1c1c]" style={{ fontFamily: M }}>Order Pipeline</p>
        <div className="flex items-center gap-3">
          <Badge label="62 Total" color="#1b1c1c" bg="rgba(27,28,28,0.07)"/>
          {active && (<button onClick={() => onStage(active)} className="text-[11px] text-[#3b82f6] hover:underline" style={{ fontFamily: I }}>
              Clear filter
            </button>)}
        </div>
      </div>
      <div className="flex items-center gap-1 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
        {ORD_STAGES.map((s, i) => (<div key={s.id} className="flex items-center gap-1 shrink-0">
            <motion.button whileHover={{ y: -2 }} transition={{ duration: 0.12 }} onClick={() => onStage(s.id)} className="flex flex-col items-center gap-1.5 px-3 py-2.5 rounded-xl transition-all min-w-[74px]" style={{ background: active === s.id ? `${s.col}12` : "#fbf9f9", border: `1.5px solid ${active === s.id ? s.col : "rgba(208,198,174,0.2)"}` }}>
              <div className="size-7 rounded-full flex items-center justify-center text-[12px] font-bold text-white" style={{ background: s.col, fontFamily: M }}>{s.count}</div>
              <p className="text-[10px] font-semibold text-center leading-tight whitespace-nowrap" style={{ color: active === s.id ? s.col : "#4d4634", fontFamily: I }}>{s.label}</p>
              {s.id !== "done" && (<div className="w-10 h-[3px] rounded-full bg-[#efeded] overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${s.pct}%`, background: s.col }}/>
                </div>)}
            </motion.button>
            {i < ORD_STAGES.length - 1 && (<ChevronRight size={11} style={{ color: "rgba(208,198,174,0.5)" }}/>)}
          </div>))}
      </div>
    </div>);
}
