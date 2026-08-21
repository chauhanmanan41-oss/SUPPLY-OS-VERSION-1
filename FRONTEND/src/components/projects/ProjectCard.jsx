import { useState } from "react";
import { toast } from "sonner";
import { motion } from "motion/react";
import { Brain, Factory, BarChart2, Clock, Package, Truck, Users, ArrowUpRight, List, Copy, Archive, Download, Sparkles } from "lucide-react";
import { I, M } from "../../constants/fonts";
import { fmtCr } from "../../utils/formatCurrency";

export function ProjectCard({ p, onOpenWorkspace }) {
    const [hovered, setHovered] = useState(false);
    const riskColor = p.risk === "low" ? "#16a34a" : p.risk === "medium" ? "#eab308" : "#ba1a1a";
    return (<motion.div onHoverStart={() => setHovered(true)} onHoverEnd={() => setHovered(false)} whileHover={{ y: -5, boxShadow: "0 16px 40px rgba(0,0,0,0.1)" }} transition={{ duration: 0.18 }} className="bg-white rounded-2xl border border-[rgba(208,198,174,0.2)] flex flex-col overflow-hidden" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
      {/* Stage colour top bar */}
      <div className="h-[3px] w-full" style={{ background: p.stageColor }}/>

      <div className="p-5 flex flex-col gap-4 flex-1">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="size-11 rounded-xl bg-[#efeded] flex items-center justify-center text-[22px] border border-[rgba(208,198,174,0.3)] shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)] shrink-0">
              {p.emoji}
            </div>
            <div className="min-w-0">
              <p className="font-bold text-[#1b1c1c] text-[15px] leading-tight truncate" style={{ fontFamily: M }}>{p.name}</p>
              <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                <span className="inline-flex items-center px-2 py-[2px] rounded-md text-[10px] font-bold tracking-[0.5px] uppercase" style={{ background: "rgba(208,198,174,0.15)", color: "#4d4634", fontFamily: I }}>{p.category}</span>
                <span className="inline-flex items-center px-2 py-[2px] rounded-md text-[10px] font-bold tracking-[0.5px] uppercase" style={{ background: p.stageBg, color: p.stageColor, fontFamily: I }}>{p.stage}</span>
              </div>
            </div>
          </div>
          {/* Health badge */}
          <div className="flex flex-col items-end shrink-0 gap-0.5">
            <div className="size-2 rounded-full" style={{ background: riskColor, boxShadow: `0 0 0 3px ${riskColor}22` }}/>
            <span className="text-[10px] font-bold" style={{ fontFamily: I, color: riskColor }}>{p.riskLabel}</span>
          </div>
        </div>

        {/* Progress */}
        <div>
          <div className="flex justify-between mb-1.5">
            <span className="text-[10px] font-bold text-[#4d4634] uppercase tracking-[0.5px]" style={{ fontFamily: I }}>Progress</span>
            <span className="text-[12px] font-bold text-[#1b1c1c]" style={{ fontFamily: M }}>{p.progress}%</span>
          </div>
          <div className="h-1.5 bg-[#efeded] rounded-full overflow-hidden">
            <motion.div className="h-full rounded-full" initial={{ width: 0 }} animate={{ width: `${p.progress}%` }} transition={{ duration: 0.9, ease: "easeOut" }} style={{ background: p.stageColor }}/>
          </div>
        </div>

        {/* Budget + Spent + Profit */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "Budget", value: fmtCr(p.budget) },
            { label: `Spent ${Math.round(p.spent / p.budget * 100)}%`, value: fmtCr(p.spent) },
            { label: "Est. Profit", value: fmtCr(p.profit) },
        ].map(s => (<div key={s.label} className="bg-[#fbf9f9] rounded-xl p-2.5 border border-[rgba(208,198,174,0.15)]">
              <p className="text-[9px] font-bold text-[#4d4634] uppercase tracking-[0.4px]" style={{ fontFamily: I }}>{s.label}</p>
              <p className="text-[13px] font-bold text-[#1b1c1c] mt-0.5 leading-none" style={{ fontFamily: M }}>{s.value}</p>
            </div>))}
        </div>

        {/* AI Health + Launch */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Brain size={11} style={{ color: p.healthColor }}/>
            <span className="text-[12px] font-bold" style={{ color: p.healthColor, fontFamily: M }}>AI {p.health}%</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock size={11} className="text-[#4d4634]"/>
            <span className="text-[12px] text-[#4d4634]" style={{ fontFamily: I }}>{p.launch}</span>
          </div>
        </div>

        {/* Assignments */}
        <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
          {[
            { Icon: Users, val: `${p.suppliers} Suppliers` },
            { Icon: Factory, val: p.manufacturer },
            { Icon: Package, val: p.warehouse },
            { Icon: Truck, val: p.transport },
        ].map(({ Icon, val }, i) => (<div key={i} className="flex items-center gap-1.5 min-w-0">
              <Icon size={10} className="text-[#4d4634] shrink-0"/>
              <span className="text-[11px] truncate" style={{ fontFamily: I, color: val === "Not Assigned" ? "rgba(77,70,52,0.35)" : "#4d4634" }}>{val}</span>
            </div>))}
        </div>

        {/* Next milestone */}
        <div className="flex items-center gap-2 px-3 py-2 bg-[rgba(208,198,174,0.08)] rounded-xl border border-[rgba(208,198,174,0.15)]">
          <ArrowUpRight size={11} className="text-[#4d4634] shrink-0"/>
          <span className="text-[11px]" style={{ fontFamily: I, color: "#4d4634" }}>
            Next: <span className="font-semibold text-[#1b1c1c]">{p.milestone}</span>
          </span>
        </div>

        {/* AI Insight */}
        <div className="flex items-start gap-2 px-3 py-2 rounded-xl border" style={{ background: "rgba(255,213,74,0.06)", borderColor: "rgba(255,213,74,0.3)" }}>
          <Sparkles size={11} className="text-[#735c00] shrink-0 mt-0.5"/>
          <p className="text-[11px] leading-[1.45]" style={{ fontFamily: I, color: "#735c00" }}>{p.aiInsight}</p>
        </div>

        {/* Hover quick actions */}
        {hovered && (<div className="flex items-center gap-1.5 border-t border-[rgba(208,198,174,0.15)] pt-3">
            {[
                { icon: Copy, label: "Duplicate" },
                { icon: Archive, label: "Archive" },
                { icon: Download, label: "Export" },
            ].map(({ icon: Icon, label }) => (<button key={label} onClick={() => toast.info(`${label} — ${p.name}`)} className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-[11px] font-semibold text-[#4d4634] bg-[#efeded] hover:bg-[rgba(208,198,174,0.4)] transition" style={{ fontFamily: I }}>
                <Icon size={11}/> {label}
              </button>))}
          </div>)}

        {/* Primary CTAs */}
        <div className="flex gap-2 mt-auto pt-1">
          <button onClick={() => onOpenWorkspace(p.id)} className="flex-1 bg-[#303031] text-white font-bold text-[13px] py-2.5 rounded-xl hover:bg-[#1b1c1c] transition flex items-center justify-center gap-1.5" style={{ fontFamily: M }}>
            Open Workspace
          </button>
          <button onClick={() => toast.info(`Analytics — ${p.name}`)} className="px-4 py-2.5 border border-[rgba(208,198,174,0.3)] bg-white text-[#1b1c1c] font-semibold text-[13px] rounded-xl hover:bg-[#efeded] transition" style={{ fontFamily: M }}>
            <BarChart2 size={15}/>
          </button>
        </div>
      </div>
    </motion.div>);
}
/* List row (compact) */
