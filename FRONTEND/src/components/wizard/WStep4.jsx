import { toast } from "sonner";
import { motion } from "motion/react";
import { Factory, CheckCircle, Sparkles } from "lucide-react";
import { ProgressRing } from "../common/ProgressRing";
import { I, M } from "../../constants/fonts";

export function WStep4({ generating, blueprint }) {
    if (generating || !blueprint) {
        return (<div className="max-w-[740px] flex flex-col items-center justify-center py-20 gap-7">
        <div className="size-20 rounded-full bg-[#303031] flex items-center justify-center">
          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}>
            <Sparkles size={32} className="text-[#ffd54a]"/>
          </motion.div>
        </div>
        <div className="text-center">
          <p className="text-[#1b1c1c] font-bold text-xl" style={{ fontFamily: M }}>AI is building your blueprint…</p>
          <p className="text-[#4d4634] text-sm mt-2" style={{ fontFamily: I }}>Analysing 2,400+ manufacturers · 8,000+ suppliers across India</p>
        </div>
        <div className="w-80 bg-[#efeded] rounded-full h-2 overflow-hidden">
          <motion.div className="h-full bg-[#ffd54a] rounded-full" initial={{ width: "5%" }} animate={{ width: "88%" }} transition={{ duration: 2.6, ease: "easeInOut" }}/>
        </div>
        <div className="flex flex-col gap-2 text-center">
          {["Matching manufacturer profiles", "Calculating cost optimisations", "Assessing supply chain risks", "Generating savings opportunities"].map((t, i) => (<motion.p key={t} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.5, duration: 0.4 }} className="text-[#4d4634] text-[13px] flex items-center gap-2 justify-center" style={{ fontFamily: I }}>
              <CheckCircle size={13} className="text-[#16a34a]"/>{t}
            </motion.p>))}
        </div>
      </div>);
    }
    const bp = blueprint;
    const RC = { low: "#16a34a", medium: "#eab308", high: "#ba1a1a" };
    return (<div className="max-w-[740px] flex flex-col gap-5">
      {/* Header confidence bar */}
      <div className="bg-[#303031] rounded-2xl p-6 flex items-center gap-6">
        <ProgressRing value={bp.confidence} color="#ffd54a" size={80} sw={7}>
          <div className="flex flex-col items-center">
            <span className="font-bold text-xl text-white leading-none" style={{ fontFamily: M }}>{bp.confidence}%</span>
            <span className="text-[9px] text-white/45 uppercase tracking-wider" style={{ fontFamily: I }}>AI Score</span>
          </div>
        </ProgressRing>
        <div className="flex-1">
          <p className="text-white font-bold text-lg" style={{ fontFamily: M }}>AI Blueprint Ready</p>
          <p className="text-white/55 text-[13px] mt-1" style={{ fontFamily: I }}>High-confidence supply chain plan based on your requirements.</p>
          <div className="flex items-center gap-6 mt-3">
            {[{ l: "Est. Revenue", v: bp.estimatedRevenue, c: "#16a34a" }, { l: "ROI", v: bp.roi, c: "#ffd54a" }, { l: "Health", v: `${bp.health}%`, c: "#ffd54a" }].map(s => (<div key={s.l}><p className="text-[9px] text-white/35 uppercase tracking-[0.5px]" style={{ fontFamily: I }}>{s.l}</p>
                <p className="font-bold text-[15px] mt-0.5" style={{ fontFamily: M, color: s.c }}>{s.v}</p></div>))}
          </div>
        </div>
        <div className="flex flex-col gap-2 shrink-0">
          <button onClick={() => toast("Comparing alternatives…")} className="px-4 py-2 border border-[rgba(255,255,255,0.15)] rounded-xl text-[13px] font-semibold text-white hover:bg-white/10 transition" style={{ fontFamily: M }}>Compare Options</button>
          <button onClick={() => toast("Regenerating blueprint…")} className="px-4 py-2 border border-[rgba(255,255,255,0.15)] rounded-xl text-[13px] font-semibold text-white hover:bg-white/10 transition" style={{ fontFamily: M }}>Regenerate</button>
        </div>
      </div>

      {/* Manufacturers */}
      <div className="bg-white rounded-2xl border border-[rgba(208,198,174,0.2)] shadow-[0_1px_2px_rgba(0,0,0,0.05)] p-5">
        <p className="text-[#1b1c1c] font-bold text-[14px] mb-4" style={{ fontFamily: M }}>Recommended Manufacturers</p>
        <div className="flex flex-col gap-2.5">
          {bp.manufacturers.map((mf, i) => (<div key={mf.name} className="flex items-center gap-4 p-3.5 rounded-xl border transition hover:border-[rgba(208,198,174,0.5)]" style={{ borderColor: i === 0 ? "rgba(255,213,74,0.35)" : "rgba(208,198,174,0.2)", background: i === 0 ? "rgba(255,249,230,0.4)" : "transparent" }}>
              <div className="size-9 rounded-xl bg-[#efeded] flex items-center justify-center shrink-0"><Factory size={16} className="text-[#4d4634]"/></div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-bold text-[#1b1c1c] text-[13px]" style={{ fontFamily: M }}>{mf.name}</p>
                  {i === 0 && <span className="text-[10px] font-bold px-2 py-0.5 rounded-md" style={{ background: "rgba(255,213,74,0.2)", color: "#735c00", fontFamily: I }}>Recommended</span>}
                </div>
                <p className="text-[#4d4634] text-[12px]" style={{ fontFamily: I }}>{mf.city} · {mf.lead} lead time · {mf.price}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="font-bold text-[#16a34a] text-[15px]" style={{ fontFamily: M }}>{mf.match}%</p>
                <p className="text-[10px] text-[#4d4634]" style={{ fontFamily: I }}>match</p>
              </div>
            </div>))}
        </div>
      </div>

      {/* Cost + Timeline grid */}
      <div className="grid grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl border border-[rgba(208,198,174,0.2)] shadow-[0_1px_2px_rgba(0,0,0,0.05)] p-5">
          <p className="text-[#1b1c1c] font-bold text-[14px] mb-4" style={{ fontFamily: M }}>Cost Breakdown</p>
          <div className="flex flex-col gap-2.5">
            {bp.costs.map(c => (<div key={c.label} className="flex items-center gap-3">
                <p className="text-[12px] text-[#4d4634] w-28 shrink-0" style={{ fontFamily: I }}>{c.label}</p>
                <div className="flex-1 h-2 bg-[#efeded] rounded-full overflow-hidden">
                  <motion.div className="h-full bg-[#ffd54a] rounded-full" initial={{ width: 0 }} animate={{ width: `${c.value * 2}%` }} transition={{ duration: 0.8, delay: 0.1 }}/>
                </div>
                <p className="text-[12px] font-bold text-[#1b1c1c] w-8 text-right shrink-0" style={{ fontFamily: M }}>{c.value}%</p>
              </div>))}
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-[rgba(208,198,174,0.2)] shadow-[0_1px_2px_rgba(0,0,0,0.05)] p-5">
          <p className="text-[#1b1c1c] font-bold text-[14px] mb-4" style={{ fontFamily: M }}>Estimated Timeline</p>
          <div className="flex flex-col gap-2.5">
            {bp.timeline.map(t => (<div key={t.phase} className="flex items-center gap-3">
                <div className="size-2 rounded-full shrink-0" style={{ background: t.color }}/>
                <p className="text-[12px] text-[#4d4634] flex-1" style={{ fontFamily: I }}>{t.phase}</p>
                <p className="text-[12px] font-bold text-[#1b1c1c]" style={{ fontFamily: M }}>{t.weeks}w</p>
              </div>))}
            <div className="pt-2 border-t border-[rgba(208,198,174,0.2)] flex justify-between">
              <span className="text-[12px] font-bold text-[#4d4634]" style={{ fontFamily: I }}>Total</span>
              <span className="text-[13px] font-bold text-[#1b1c1c]" style={{ fontFamily: M }}>{bp.timeline.reduce((a, t) => a + t.weeks, 0)} weeks</span>
            </div>
          </div>
        </div>
      </div>

      {/* Risks + Savings */}
      <div className="grid grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl border border-[rgba(208,198,174,0.2)] shadow-[0_1px_2px_rgba(0,0,0,0.05)] p-5">
          <p className="text-[#1b1c1c] font-bold text-[14px] mb-4" style={{ fontFamily: M }}>Business Risks</p>
          <div className="flex flex-col gap-3">
            {bp.risks.map(r => (<div key={r.risk} className="flex items-start gap-3">
                <div className="size-2 rounded-full mt-1.5 shrink-0" style={{ background: RC[r.severity] }}/>
                <div><p className="text-[13px] font-semibold text-[#1b1c1c]" style={{ fontFamily: I }}>{r.risk}</p>
                  <p className="text-[11px] text-[#4d4634] mt-0.5" style={{ fontFamily: I }}>Fix: {r.fix}</p></div>
              </div>))}
          </div>
        </div>
        <div className="rounded-2xl border p-5" style={{ background: "rgba(255,249,230,0.5)", borderColor: "rgba(255,213,74,0.3)" }}>
          <p className="text-[#1b1c1c] font-bold text-[14px] mb-4" style={{ fontFamily: M }}>Savings Opportunities</p>
          <div className="flex flex-col gap-3">
            {bp.savings.map(s => (<div key={s.opp} className="flex items-start gap-3">
                <Sparkles size={13} className="text-[#735c00] shrink-0 mt-0.5"/>
                <div><p className="text-[13px] font-semibold text-[#1b1c1c]" style={{ fontFamily: I }}>{s.opp}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[12px] font-bold text-[#16a34a]" style={{ fontFamily: M }}>{s.amount}</span>
                    <span className="text-[11px] text-[#4d4634]" style={{ fontFamily: I }}>{s.conf}% confidence</span>
                  </div></div>
              </div>))}
          </div>
        </div>
      </div>
    </div>);
}
/* ── Step 5: Review & Create ── */
