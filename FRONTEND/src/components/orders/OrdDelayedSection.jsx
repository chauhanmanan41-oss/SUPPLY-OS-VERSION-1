import { toast } from "sonner";
import { AlertTriangle } from "lucide-react";
import { Badge } from "../common/Badge";
import { I, M } from "../../constants/fonts";
import { ORD_DELAYED } from "../../constants/orders";

export function OrdDelayedSection() {
    const priCfg = { high: { col: "#ba1a1a", bg: "rgba(186,26,26,0.08)", brd: "rgba(186,26,26,0.2)" }, medium: { col: "#eab308", bg: "rgba(234,179,8,0.08)", brd: "rgba(234,179,8,0.2)" } };
    return (<div>
      <div className="flex items-center gap-2 mb-3">
        <AlertTriangle size={15} style={{ color: "#ba1a1a" }}/>
        <p className="font-bold text-[15px] text-[#1b1c1c]" style={{ fontFamily: M }}>Delayed Orders</p>
        <Badge label={`${ORD_DELAYED.length} delays`} color="#ba1a1a" bg="rgba(186,26,26,0.1)"/>
      </div>
      <div className="flex flex-col gap-3">
        {ORD_DELAYED.map((d, i) => {
            const pc = priCfg[d.priority];
            return (<div key={i} className="p-5 rounded-2xl border flex items-start gap-5" style={{ background: pc.bg, borderColor: pc.brd }}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-bold text-[14px] text-[#1b1c1c]" style={{ fontFamily: M }}>{d.product}</p>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: `${pc.col}20`, color: pc.col, fontFamily: I }}>{d.priority} priority</span>
                </div>
                <p className="text-[12px] text-[#4d4634] mb-3" style={{ fontFamily: I }}>{d.supplier} · Delayed by {d.delay}</p>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <p className="text-[10px] text-[#4d4634]" style={{ fontFamily: I }}>Reason</p>
                    <p className="font-semibold text-[12px] text-[#1b1c1c]" style={{ fontFamily: M }}>{d.reason}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-[#4d4634]" style={{ fontFamily: I }}>Estimated Loss</p>
                    <p className="font-bold text-[13px]" style={{ color: pc.col, fontFamily: M }}>{d.loss}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-[#4d4634]" style={{ fontFamily: I }}>AI Suggestion</p>
                    <p className="font-semibold text-[12px] text-[#1b1c1c]" style={{ fontFamily: M }}>{d.action}</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2 shrink-0">
                <button onClick={() => toast.error("Escalation raised!")} className="px-3 py-2 rounded-xl text-[12px] font-bold text-white hover:opacity-90 transition" style={{ background: pc.col, fontFamily: M }}>Escalate</button>
                <button onClick={() => toast.success("AI recommendation applied!")} className="px-3 py-2 rounded-xl text-[12px] font-bold hover:opacity-90 transition" style={{ background: "#ffd54a", color: "#735c00", fontFamily: M }}>Apply AI →</button>
                <button onClick={() => toast.info("Contacting supplier…")} className="px-3 py-2 rounded-xl text-[12px] font-semibold border border-[rgba(208,198,174,0.3)] text-[#4d4634] hover:bg-white transition" style={{ fontFamily: M }}>Contact</button>
              </div>
            </div>);
        })}
      </div>
    </div>);
}
