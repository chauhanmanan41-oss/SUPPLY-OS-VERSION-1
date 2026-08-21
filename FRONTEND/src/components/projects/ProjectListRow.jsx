import { toast } from "sonner";
import { MoreHorizontal } from "lucide-react";
import { I, M } from "../../constants/fonts";
import { fmtCr } from "../../utils/formatCurrency";

export function ProjectListRow({ p, onOpenWorkspace }) {
    const riskColor = p.risk === "low" ? "#16a34a" : p.risk === "medium" ? "#eab308" : "#ba1a1a";
    return (<div className="flex items-center gap-5 px-6 py-4 border-b border-[rgba(208,198,174,0.12)] hover:bg-[rgba(255,249,230,0.4)] transition group">
      <div className="size-9 rounded-xl bg-[#efeded] flex items-center justify-center text-lg border border-[rgba(208,198,174,0.3)] shrink-0">{p.emoji}</div>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-[#1b1c1c] text-[14px] leading-tight truncate" style={{ fontFamily: M }}>{p.name}</p>
        <p className="text-[#4d4634] text-[12px] mt-0.5" style={{ fontFamily: I }}>{p.category} · {p.model}</p>
      </div>
      <div className="w-[130px] shrink-0">
        <div className="flex items-center gap-1.5 mb-1">
          <div className="size-1.5 rounded-full" style={{ background: p.stageColor }}/>
          <span className="text-[11px] font-semibold" style={{ fontFamily: I, color: p.stageColor }}>{p.stage}</span>
        </div>
        <div className="h-1 bg-[#efeded] rounded-full overflow-hidden">
          <div className="h-full rounded-full" style={{ width: `${p.progress}%`, background: p.stageColor }}/>
        </div>
      </div>
      <div className="w-14 text-center shrink-0">
        <p className="font-bold text-[13px]" style={{ fontFamily: M, color: p.healthColor }}>{p.health}%</p>
        <p className="text-[10px] text-[#4d4634]" style={{ fontFamily: I }}>Health</p>
      </div>
      <div className="w-20 text-right shrink-0">
        <p className="font-bold text-[#1b1c1c] text-[13px]" style={{ fontFamily: M }}>{fmtCr(p.budget)}</p>
        <p className="text-[10px] text-[#4d4634]" style={{ fontFamily: I }}>{Math.round(p.spent / p.budget * 100)}% used</p>
      </div>
      <div className="w-24 text-right shrink-0">
        <p className="text-[#4d4634] text-[12px]" style={{ fontFamily: I }}>{p.launch}</p>
      </div>
      <div className="size-2 rounded-full shrink-0" style={{ background: riskColor, boxShadow: `0 0 0 3px ${riskColor}22` }}/>
      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition shrink-0">
        <button onClick={() => onOpenWorkspace(p.id)} className="px-3 py-1.5 bg-[#303031] text-white text-[12px] font-bold rounded-lg hover:bg-[#1b1c1c] transition" style={{ fontFamily: M }}>
          Open
        </button>
        <button onClick={() => toast.info(`More options — ${p.name}`)} className="size-7 flex items-center justify-center rounded-lg bg-[#efeded] hover:bg-[rgba(208,198,174,0.4)] transition">
          <MoreHorizontal size={14} className="text-[#4d4634]"/>
        </button>
      </div>
    </div>);
}
/* Horizontal launch timeline */
