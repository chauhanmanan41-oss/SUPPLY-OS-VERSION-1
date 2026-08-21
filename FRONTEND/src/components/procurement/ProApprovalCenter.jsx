import { useState } from "react";
import { toast } from "sonner";
import { CheckCircle } from "lucide-react";
import { Badge } from "../common/Badge";
import { I, M } from "../../constants/fonts";
import { PRO_APPROVALS } from "../../constants/procurement";

export function ProApprovalCenter() {
    const [approved, setApproved] = useState([]);
    const pending = PRO_APPROVALS.filter(a => !approved.includes(a.id));
    const PRI_AP = {
        high: { col: "#ba1a1a", bg: "rgba(186,26,26,0.1)" },
        medium: { col: "#f97316", bg: "rgba(249,115,22,0.1)" },
    };
    return (<div>
      <div className="flex items-center gap-3 mb-3">
        <p className="font-bold text-[15px] text-[#1b1c1c]" style={{ fontFamily: M }}>Approval Center</p>
        {pending.length > 0 && (<Badge label={`${pending.length} Pending`} color="#ba1a1a" bg="rgba(186,26,26,0.1)"/>)}
      </div>
      {pending.length === 0 ? (<div className="bg-white rounded-2xl border border-[rgba(208,198,174,0.2)] p-10 text-center">
          <CheckCircle size={32} className="mx-auto mb-2" style={{ color: "#16a34a" }}/>
          <p className="font-bold text-[14px] text-[#1b1c1c]" style={{ fontFamily: M }}>All caught up!</p>
          <p className="text-[12px] text-[#4d4634] mt-1" style={{ fontFamily: I }}>No pending approvals.</p>
        </div>) : (<div className="flex flex-col gap-3">
          {pending.map(a => {
                const pc = PRI_AP[a.priority] ?? { col: "#6b7280", bg: "rgba(107,114,128,0.1)" };
                const riskCol = a.risk === "low" ? "#16a34a" : "#eab308";
                return (<div key={a.id} className="bg-white rounded-2xl border border-[rgba(208,198,174,0.2)] p-5 flex items-start gap-5">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <p className="font-bold text-[14px] text-[#1b1c1c]" style={{ fontFamily: M }}>{a.title}</p>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: pc.bg, color: pc.col, fontFamily: I }}>{a.priority} priority</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: `${riskCol}18`, color: riskCol, fontFamily: I }}>{a.risk} risk</span>
                  </div>
                  <p className="text-[12px] text-[#4d4634] mb-3" style={{ fontFamily: I }}>{a.supplier} · {a.amount}</p>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                        { l: "Approver", v: a.approver },
                        { l: "Level", v: a.level },
                        { l: "Time Left", v: a.timeLeft },
                    ].map((d, i) => (<div key={i}>
                        <p className="text-[10px] text-[#4d4634]" style={{ fontFamily: I }}>{d.l}</p>
                        <p className="font-semibold text-[12px] text-[#1b1c1c]" style={{ fontFamily: M }}>{d.v}</p>
                      </div>))}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => toast.info("AI risk analysis loading…")} className="px-3 py-2 rounded-xl text-[12px] font-semibold border border-[rgba(208,198,174,0.3)] text-[#4d4634] hover:bg-[#efeded] transition" style={{ fontFamily: M }}>AI Risk</button>
                  <button onClick={() => { toast.error(`${a.id} rejected`); setApproved(s => [...s, a.id]); }} className="px-3 py-2 rounded-xl text-[12px] font-bold text-[#ba1a1a] border border-[rgba(186,26,26,0.3)] hover:bg-[rgba(186,26,26,0.05)] transition" style={{ fontFamily: M }}>Reject</button>
                  <button onClick={() => { toast.success(`${a.id} approved!`); setApproved(s => [...s, a.id]); }} className="px-3 py-2 rounded-xl text-[12px] font-bold text-white hover:bg-[#1b1c1c] transition" style={{ background: "#303031", fontFamily: M }}>Approve</button>
                </div>
              </div>);
            })}
        </div>)}
    </div>);
}
