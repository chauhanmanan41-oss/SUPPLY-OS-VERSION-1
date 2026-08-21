import { toast } from "sonner";
import { Sparkles } from "lucide-react";
import { ProgressRing } from "../common/ProgressRing";
import { I, M } from "../../constants/fonts";
import { fmtCr } from "../../utils/formatCurrency";

export function AIPortfolioSidebar({ projects, onOpenWorkspace }) {
    const atRisk = projects.filter(p => p.risk === "high" || p.risk === "medium");
    const upcomingLaunches = [...projects].sort((a, b) => a.progress > b.progress ? -1 : 1).slice(0, 3);
    const overBudget = projects.filter(p => p.spent / p.budget > 0.85);
    const aiRecs = [
        { project: "Protein Powder", rec: "Switch manufacturer to BioSynth India", saving: "₹3.2L", conf: 96 },
        { project: "Vitamin Pack", rec: "Escalate FSSAI clearance to fast track", saving: "₹1.8L", conf: 91 },
        { project: "Coffee Brand", rec: "Consolidate PO-8919 & PO-8921 freight", saving: "₹45K", conf: 88 },
    ];
    return (<div className="w-[380px] shrink-0 h-full flex flex-col bg-[#fbf9f9] border-l border-[rgba(208,198,174,0.2)]">
      {/* Header */}
      <div className="px-6 py-5 border-b border-[rgba(208,198,174,0.2)] shrink-0">
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-xl bg-[#ffd54a] flex items-center justify-center shrink-0">
            <Sparkles size={15} className="text-[#735c00]"/>
          </div>
          <div>
            <h3 className="text-[#1b1c1c] font-bold text-base" style={{ fontFamily: M }}>AI Portfolio Insights</h3>
            <p className="text-[#4d4634] text-[11px] mt-0.5" style={{ fontFamily: I }}>Real-time intelligence · {projects.length} projects</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4" style={{ scrollbarWidth: "none" }}>
        {/* Business Health strip */}
        <div className="bg-white rounded-xl border border-[rgba(208,198,174,0.2)] p-4">
          <p className="text-[11px] font-bold uppercase tracking-[0.55px] text-[#4d4634] mb-3" style={{ fontFamily: I }}>Portfolio Health</p>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className="font-bold text-3xl text-[#eab308]" style={{ fontFamily: M }}>82%</p>
              <p className="text-[10px] text-[#4d4634] mt-0.5" style={{ fontFamily: I }}>Overall</p>
            </div>
            <div className="flex-1 flex flex-col gap-1.5">
              {[{ label: "On Track", val: 4, total: 6, color: "#16a34a" },
            { label: "At Risk", val: 1, total: 6, color: "#eab308" },
            { label: "Delayed", val: 1, total: 6, color: "#ba1a1a" }].map(s => (<div key={s.label} className="flex items-center gap-2">
                  <span className="text-[11px] text-[#4d4634] w-16 shrink-0" style={{ fontFamily: I }}>{s.label}</span>
                  <div className="flex-1 h-1.5 bg-[#efeded] rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${(s.val / s.total) * 100}%`, background: s.color }}/>
                  </div>
                  <span className="text-[11px] font-bold text-[#1b1c1c] w-4 shrink-0" style={{ fontFamily: M }}>{s.val}</span>
                </div>))}
            </div>
          </div>
        </div>

        {/* AI Recommendations */}
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.55px] text-[#4d4634] mb-2 px-1" style={{ fontFamily: I }}>Top AI Recommendations</p>
          <div className="flex flex-col gap-2">
            {aiRecs.map((r, i) => (<div key={i} className="bg-white rounded-xl border p-4 flex flex-col gap-3" style={{ borderColor: "rgba(255,213,74,0.3)", background: "rgba(255,249,230,0.4)" }}>
                <div className="flex items-start gap-2">
                  <div className="size-5 rounded-lg bg-[rgba(255,213,74,0.2)] flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles size={11} className="text-[#735c00]"/>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-bold text-[#735c00] uppercase tracking-[0.4px]" style={{ fontFamily: I }}>{r.project}</p>
                    <p className="text-[12px] text-[#1b1c1c] font-semibold mt-0.5 leading-snug" style={{ fontFamily: I }}>{r.rec}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="text-[9px] font-bold uppercase text-[#4d4634]" style={{ fontFamily: I }}>Saving</p>
                      <p className="font-bold text-[#16a34a] text-sm" style={{ fontFamily: M }}>{r.saving}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-bold uppercase text-[#4d4634]" style={{ fontFamily: I }}>Confidence</p>
                      <p className="font-bold text-[#1b1c1c] text-sm" style={{ fontFamily: M }}>{r.conf}%</p>
                    </div>
                  </div>
                  <button onClick={() => toast.success(`Action initiated for ${r.project}`)} className="px-3 py-1.5 bg-[#303031] text-white text-[11px] font-bold rounded-lg hover:bg-[#1b1c1c] transition" style={{ fontFamily: M }}>Apply</button>
                </div>
              </div>))}
          </div>
        </div>

        {/* Projects at risk */}
        {atRisk.length > 0 && (<div>
            <p className="text-[11px] font-bold uppercase tracking-[0.55px] text-[#4d4634] mb-2 px-1" style={{ fontFamily: I }}>Projects at Risk</p>
            <div className="flex flex-col gap-2">
              {atRisk.map(p => (<div key={p.id} className="bg-white rounded-xl border border-[rgba(186,26,26,0.15)] p-4 flex items-center gap-3">
                  <span className="text-xl">{p.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-[#1b1c1c] text-[13px]" style={{ fontFamily: M }}>{p.name}</p>
                    <p className="text-[#ba1a1a] text-[11px]" style={{ fontFamily: I }}>{p.riskLabel} · {p.stage}</p>
                  </div>
                  <button onClick={() => onOpenWorkspace(p.id)} className="px-3 py-1.5 bg-[#ba1a1a] text-white text-[11px] font-bold rounded-lg hover:opacity-90 transition" style={{ fontFamily: M }}>Fix</button>
                </div>))}
            </div>
          </div>)}

        {/* Budget alerts */}
        {overBudget.length > 0 && (<div>
            <p className="text-[11px] font-bold uppercase tracking-[0.55px] text-[#4d4634] mb-2 px-1" style={{ fontFamily: I }}>Budget Alerts</p>
            <div className="flex flex-col gap-2">
              {overBudget.map(p => (<div key={p.id} className="bg-white rounded-xl border border-[rgba(234,179,8,0.2)] p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-bold text-[#1b1c1c] text-[13px]" style={{ fontFamily: M }}>{p.emoji} {p.name}</p>
                    <span className="text-[#eab308] text-[11px] font-bold" style={{ fontFamily: I }}>{Math.round(p.spent / p.budget * 100)}% used</span>
                  </div>
                  <div className="h-1.5 bg-[#efeded] rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-[#eab308]" style={{ width: `${Math.min(p.spent / p.budget * 100, 100)}%` }}/>
                  </div>
                  <p className="text-[#4d4634] text-[11px] mt-1.5" style={{ fontFamily: I }}>
                    {fmtCr(p.spent)} of {fmtCr(p.budget)} spent
                  </p>
                </div>))}
            </div>
          </div>)}

        {/* Upcoming launches */}
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.55px] text-[#4d4634] mb-2 px-1" style={{ fontFamily: I }}>Upcoming Launches</p>
          <div className="flex flex-col gap-2">
            {upcomingLaunches.map(p => (<div key={p.id} className="bg-white rounded-xl border border-[rgba(208,198,174,0.2)] p-4 flex items-center gap-3">
                <span className="text-xl">{p.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-[#1b1c1c] text-[13px]" style={{ fontFamily: M }}>{p.name}</p>
                  <p className="text-[#4d4634] text-[11px]" style={{ fontFamily: I }}>{p.launch}</p>
                </div>
                <div className="size-9 shrink-0">
                  <ProgressRing value={p.progress} color={p.stageColor} size={36} sw={3}>
                    <span className="text-[8px] font-bold text-[#1b1c1c]" style={{ fontFamily: M }}>{p.progress}%</span>
                  </ProgressRing>
                </div>
              </div>))}
          </div>
        </div>
      </div>
    </div>);
}
/* Full Projects page */
