import { CheckCircle } from "lucide-react";
import { I, M } from "../../constants/fonts";
import { WS_MILESTONES } from "../../constants/workspace";

export function WsMilestones() {
    return (<div>
      <p className="font-bold text-[15px] text-[#1b1c1c] mb-3" style={{ fontFamily: M }}>Upcoming Milestones</p>
      <div className="bg-white rounded-2xl border border-[rgba(208,198,174,0.2)] overflow-hidden">
        <div className="relative px-8 py-6">
          <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-[rgba(208,198,174,0.2)] -translate-y-1/2 mx-8" style={{ zIndex: 0 }}/>
          <div className="flex items-start justify-between gap-4 relative" style={{ zIndex: 1 }}>
            {WS_MILESTONES.map((m, i) => (<div key={i} className="flex flex-col items-center gap-2 flex-1">
                <div className={`size-10 rounded-full flex items-center justify-center border-2 transition`} style={{ background: m.active ? m.col : "white", borderColor: m.col, boxShadow: m.active ? `0 0 0 4px ${m.col}22` : undefined }}>
                  {m.done ? <CheckCircle size={16} color="white"/> : m.active ? <div className="size-2 rounded-full bg-white"/> : <div className="size-2 rounded-full" style={{ background: m.col }}/>}
                </div>
                <div className="text-center">
                  <p className="font-bold text-[12px] text-[#1b1c1c]" style={{ fontFamily: M }}>{m.label}</p>
                  <p className="text-[11px] font-semibold mt-0.5" style={{ color: m.col, fontFamily: I }}>{m.date}</p>
                </div>
              </div>))}
          </div>
        </div>
      </div>
    </div>);
}
