import { toast } from "sonner";
import { Factory } from "lucide-react";
import { I, M } from "../../constants/fonts";
import { ORD_MFG_CARDS } from "../../constants/orders";

export function OrdMfgSection() {
    return (<div>
      <p className="font-bold text-[15px] text-[#1b1c1c] mb-3" style={{ fontFamily: M }}>Manufacturing Progress</p>
      <div className="grid grid-cols-3 gap-4">
        {ORD_MFG_CARDS.map((c, i) => (<div key={i} className="bg-white rounded-2xl border border-[rgba(208,198,174,0.2)] p-5 flex flex-col gap-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-bold text-[14px] text-[#1b1c1c]" style={{ fontFamily: M }}>{c.product}</p>
                <p className="text-[12px] text-[#4d4634] mt-0.5" style={{ fontFamily: I }}>{c.manufacturer}</p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[11px] font-bold shrink-0" style={{ background: `${c.col}15`, color: c.col, fontFamily: M }}>{c.pct}%</span>
            </div>
            <div>
              <div className="flex justify-between mb-1.5">
                <span className="text-[11px] text-[#4d4634]" style={{ fontFamily: I }}>Production</span>
                <span className="text-[11px] font-bold text-[#1b1c1c]" style={{ fontFamily: M }}>{c.pct}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#efeded] overflow-hidden">
                <div className="h-full rounded-full transition-all" style={{ width: `${c.pct}%`, background: c.col }}/>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { l: "Quality Check", v: c.quality },
                { l: "Packaging", v: c.packaging },
                { l: "Completion", v: c.completion },
                { l: "Capacity", v: c.capacity },
            ].map((d, j) => (<div key={j} className="p-2.5 rounded-xl bg-[#fbf9f9] border border-[rgba(208,198,174,0.2)]">
                  <p className="text-[9px] text-[#4d4634] uppercase tracking-wide" style={{ fontFamily: I }}>{d.l}</p>
                  <p className="font-semibold text-[12px] text-[#1b1c1c] mt-0.5" style={{ fontFamily: M }}>{d.v}</p>
                </div>))}
            </div>
            <div className="flex gap-2">
              <button onClick={() => toast.info("Opening factory view…")} className="flex-1 py-2 rounded-xl text-[12px] font-semibold border border-[rgba(208,198,174,0.3)] text-[#4d4634] hover:bg-[#efeded] transition" style={{ fontFamily: M }}>View Factory</button>
              <button onClick={() => toast.info("Contacting manufacturer…")} className="flex-1 py-2 rounded-xl text-[12px] font-bold text-white hover:bg-[#1b1c1c] transition" style={{ background: "#303031", fontFamily: M }}>Contact</button>
            </div>
          </div>))}
      </div>
    </div>);
}
