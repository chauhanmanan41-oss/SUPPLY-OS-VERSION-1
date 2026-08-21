import { useState } from "react";
import {
  CheckCircle, AlertTriangle, XCircle, Sparkles,
  Factory, Package, Truck, ShieldCheck, TrendingUp,
  DollarSign, Clock, ChevronDown,
  ChevronUp, Activity, ArrowRight, Info,
} from "lucide-react";
import { I, M, JM } from "../../constants/fonts";
import { MOCK_BP, W_BIZ_MODELS, W_PRIORITIES } from "../../constants/wizard";
import { fmtCr } from "../../utils/formatCurrency";
import { AIProductValidator } from "../ai/AIProductValidator";

/* ─── tiny helpers ─────────────────────────────────────── */
const NUMS = ["①", "②", "③", "④", "⑤", "⑥", "⑦"];
const RC = { low: "#16a34a", medium: "#eab308", high: "#ba1a1a" };

function Row({ label, value, color }) {
  return (
    <div className="flex justify-between py-1.5 border-b border-[rgba(208,198,174,0.1)] last:border-0">
      <span className="text-[12px] text-[#4d4634]" style={{ fontFamily: I }}>{label}</span>
      <span className="text-[12px] font-semibold" style={{ fontFamily: I, color: color || "#1b1c1c" }}>{value}</span>
    </div>
  );
}

function SectionHeader({ label }) {
  return (
    <p className="text-[11px] font-bold uppercase tracking-[0.55px] text-[#4d4634] mb-3"
      style={{ fontFamily: I }}>{label}</p>
  );
}

function Card({ children, className = "" }) {
  return (
    <div className={`bg-white rounded-2xl border border-[rgba(208,198,174,0.2)] shadow-[0_1px_2px_rgba(0,0,0,0.05)] p-5 ${className}`}>
      {children}
    </div>
  );
}

/* ─── Collapsible wrapper ───────────────────────────────── */
function Collapsible({ title, icon: Icon, iconColor = "#4d4634", defaultOpen = true, badge, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-2xl border border-[rgba(208,198,174,0.2)] shadow-[0_1px_2px_rgba(0,0,0,0.05)] overflow-hidden">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-[#fbf9f9] transition"
      >
        <div className="flex items-center gap-2.5">
          <Icon size={14} style={{ color: iconColor }} />
          <span className="text-[12px] font-bold uppercase tracking-[0.5px]"
            style={{ fontFamily: I, color: iconColor }}>{title}</span>
          {badge && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md"
              style={{ background: `${iconColor}18`, color: iconColor, fontFamily: I }}>
              {badge}
            </span>
          )}
        </div>
        {open ? <ChevronUp size={14} className="text-[#4d4634]" /> : <ChevronDown size={14} className="text-[#4d4634]" />}
      </button>
      {open && <div className="px-5 pb-5">{children}</div>}
    </div>
  );
}

/* ─── KPI pill ──────────────────────────────────────────── */
function KpiCard({ label, value, sub, color = "#1b1c1c", bg = "#f4f2ed", icon: Icon }) {
  return (
    <div className="rounded-2xl p-4 flex flex-col gap-1.5"
      style={{ background: bg, border: `1px solid ${color}18` }}>
      {Icon && (
        <div className="size-7 rounded-lg flex items-center justify-center mb-0.5"
          style={{ background: `${color}15` }}>
          <Icon size={13} style={{ color }} />
        </div>
      )}
      <p className="text-[22px] font-extrabold leading-none" style={{ fontFamily: M, color }}>{value}</p>
      <p className="text-[11px] font-semibold text-[#1b1c1c]" style={{ fontFamily: I }}>{label}</p>
      {sub && <p className="text-[10px] text-[#4d4634]" style={{ fontFamily: I }}>{sub}</p>}
    </div>
  );
}

/* ─── Readiness gauge ───────────────────────────────────── */
function ReadinessBar({ label, score, color }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between items-center">
        <span className="text-[12px] font-semibold text-[#1b1c1c]" style={{ fontFamily: I }}>{label}</span>
        <span className="text-[12px] font-bold" style={{ fontFamily: JM, color }}>{score}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-[#efeded] overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700"
          style={{ width: `${score}%`, background: color }} />
      </div>
    </div>
  );
}

/* ─── Checklist item ────────────────────────────────────── */
function CheckItem({ ok, label, detail }) {
  const color = ok ? "#16a34a" : "#ba1a1a";
  const Icon = ok ? CheckCircle : XCircle;
  return (
    <div className="flex items-start gap-2.5 py-2 border-b border-[rgba(208,198,174,0.08)] last:border-0">
      <Icon size={14} style={{ color, marginTop: 1, flexShrink: 0 }} />
      <div>
        <p className="text-[12px] font-semibold text-[#1b1c1c]" style={{ fontFamily: I }}>{label}</p>
        {detail && (
          <p className="text-[11px] text-[#4d4634] mt-0.5" style={{ fontFamily: I }}>{detail}</p>
        )}
      </div>
      <div className="ml-auto shrink-0">
        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md"
          style={{ background: `${color}12`, color, fontFamily: I }}>
          {ok ? "Ready" : "Missing"}
        </span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════════════════════════ */
export function WStep5({ data, blueprint }) {
  const bp = blueprint ?? MOCK_BP;

  /* ── Computed validations ──────────────────────────────── */
  const checks = [
    { ok: !!data.productName, label: "Product Name", detail: data.productName || "Not provided" },
    { ok: !!data.category, label: "Product Category", detail: data.category || "Not selected" },
    { ok: !!data.businessModel, label: "Business Model", detail: W_BIZ_MODELS.find(m => m.id === data.businessModel)?.label || "Not selected" },
    { ok: !!data.budget, label: "Budget", detail: data.budget ? fmtCr(Number(data.budget)) : "Not set" },
    { ok: !!data.launchTimeline, label: "Launch Timeline", detail: data.launchTimeline || "Not set" },
    { ok: data.priorities.length > 0, label: "Strategic Priorities", detail: `${data.priorities.length} selected` },
    { ok: !!data.rawMaterials, label: "Raw Materials Defined", detail: data.rawMaterials || "Not provided" },
    { ok: !!data.manufacturingRegion, label: "Manufacturing Region", detail: data.manufacturingRegion || "Not specified" },
    { ok: data.transport.length > 0, label: "Transport Modes", detail: data.transport.join(", ") || "None selected" },
    { ok: !!data.warehouseCity, label: "Warehouse City", detail: data.warehouseCity || "Not provided" },
  ];
  const totalChecks = checks.length;
  const passedChecks = checks.filter(c => c.ok).length;
  const completeness = Math.round((passedChecks / totalChecks) * 100);

  /* ── Readiness scores (derived from data + bp) ─────────── */
  const mfgScore = Math.round(
    (!!data.manufacturingRegion ? 35 : 0) +
    (!!data.businessModel ? 30 : 0) +
    (bp.manufacturers.length > 0 ? 25 : 0) +
    (data.qualityLabs ? 10 : 0)
  );
  const bizScore = Math.round(
    (!!data.budget ? 30 : 0) +
    (!!data.launchTimeline ? 25 : 0) +
    (data.priorities.length > 0 ? 20 : 0) +
    (!!data.businessModel ? 15 : 0) +
    (!!data.brandName ? 10 : 0)
  );
  const scScore = Math.round(
    (!!data.rawMaterials ? 25 : 0) +
    (data.transport.length > 0 ? 25 : 0) +
    (!!data.warehouseCity ? 20 : 0) +
    (bp.suppliers.length > 0 ? 20 : 0) +
    (data.coldChain ? 5 : 0) +
    (data.importExport ? 5 : 0)
  );

  /* ── Cost breakdown (from bp.costs) ────────────────────── */
  const totalBudgetNum = Number(data.budget) || 0;
  const totalWeightPct = bp.costs.reduce((s, c) => s + c.value, 0);

  /* ── Timeline total weeks ───────────────────────────────── */
  const totalWeeks = bp.timeline.reduce((s, t) => s + t.weeks, 0);

  /* ── AI summary text (derived) ─────────────────────────── */
  const bizModel = W_BIZ_MODELS.find(m => m.id === data.businessModel)?.label || "your chosen model";
  const topPriority = W_PRIORITIES.find(p => p.id === data.priorities[0])?.label || "quality";
  const aiSummary = `${data.productName || "This product"} is a ${data.category || "consumer"} product targeting the ${data.targetCountry} market via ${bizModel}. ` +
    `With a ${data.riskPreference.toLowerCase()} risk appetite and a focus on ${topPriority.toLowerCase()}, ` +
    `the AI blueprint projects ${bp.roi} ROI and ₹${bp.estimatedRevenue} estimated revenue over the ${totalWeeks}-week go-to-market timeline. ` +
    `${bp.manufacturers[0]?.name || "The recommended manufacturer"} has been selected as the primary manufacturing partner (${bp.manufacturers[0]?.match ?? 96}% match). ` +
    `Supply chain confidence sits at ${bp.confidence}%, with ${bp.risks.filter(r => r.severity === "high").length} high-risk and ${bp.risks.filter(r => r.severity === "medium").length} medium-risk items flagged — all with AI-recommended mitigations.`;

  return (
    <div className="max-w-[760px] flex flex-col gap-5">

      {/* ── 1. HERO BANNER ─────────────────────────────────── */}
      <div className="bg-[#303031] rounded-2xl p-6 flex items-center gap-5">
        <div className="size-14 rounded-full bg-[rgba(255,213,74,0.15)] flex items-center justify-center shrink-0">
          <CheckCircle size={26} className="text-[#ffd54a]" />
        </div>
        <div className="flex-1">
          <p className="text-white font-bold text-lg" style={{ fontFamily: M }}>
            {data.productName || "New Product"} — Final Approval
          </p>
          <p className="text-white/55 text-[13px] mt-1" style={{ fontFamily: I }}>
            AI Confidence: <span className="text-[#ffd54a] font-bold">{bp.confidence}%</span> ·
            Expected ROI: <span className="text-[#16a34a] font-bold">{bp.roi}</span> ·
            Timeline: <span className="text-white/80 font-medium">{totalWeeks} weeks</span> ·
            Completeness: <span className="text-[#ffd54a] font-bold">{completeness}%</span>
          </p>
        </div>
        <div className="shrink-0 text-right hidden sm:block">
          <p className="text-[32px] font-extrabold text-[#ffd54a] leading-none" style={{ fontFamily: M }}>{completeness}%</p>
          <p className="text-white/40 text-[11px] mt-0.5" style={{ fontFamily: I }}>complete</p>
        </div>
      </div>

      <AIProductValidator productData={data} />

      {/* ── 2. FINAL KPI CARDS ─────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <KpiCard label="AI Confidence" value={`${bp.confidence}%`} sub="Blueprint accuracy" color="#735c00" bg="#fffbe6" icon={Sparkles} />
        <KpiCard label="Expected ROI" value={bp.roi} sub="Post 12-month horizon" color="#16a34a" bg="#f0fdf4" icon={TrendingUp} />
        <KpiCard label="Est. Revenue" value={bp.estimatedRevenue} sub="First year projection" color="#1d4ed8" bg="#eff6ff" icon={DollarSign} />
        <KpiCard label="Time to Market" value={`${totalWeeks}w`} sub="End-to-end timeline" color="#7c3aed" bg="#faf5ff" icon={Clock} />
      </div>

      {/* ── 3. EXECUTIVE AI SUMMARY ────────────────────────── */}
      <Collapsible title="Executive AI Summary" icon={Sparkles} iconColor="#735c00" badge="AI Generated" defaultOpen={true}>
        <div className="bg-[#fffbe6] rounded-xl p-4 border border-[#ffd54a30]">
          <div className="flex items-start gap-2.5 mb-2">
            <Info size={13} className="text-[#735c00] mt-0.5 shrink-0" />
            <p className="text-[11px] font-bold uppercase tracking-[0.4px] text-[#735c00]"
              style={{ fontFamily: I }}>AI-Generated Strategic Assessment</p>
          </div>
          <p className="text-[13px] text-[#1b1c1c] leading-relaxed" style={{ fontFamily: I }}>
            {aiSummary}
          </p>
        </div>
        {bp.savings?.length > 0 && (
          <div className="mt-3 flex flex-col gap-2">
            <p className="text-[11px] font-bold uppercase tracking-[0.4px] text-[#16a34a]"
              style={{ fontFamily: I }}>💡 AI Cost-Saving Opportunities</p>
            {bp.savings.map((s, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-[#f0fdf4] border border-[#16a34a20]">
                <div className="flex items-center gap-2">
                  <ArrowRight size={12} className="text-[#16a34a]" />
                  <p className="text-[12px] text-[#1b1c1c]" style={{ fontFamily: I }}>{s.opp}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-3">
                  <span className="text-[12px] font-bold text-[#16a34a]" style={{ fontFamily: M }}>{s.amount}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-[#16a34a18] text-[#16a34a] font-bold"
                    style={{ fontFamily: I }}>{s.conf}% conf.</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Collapsible>

      {/* ── 4. COMPLETION CHECKLIST ────────────────────────── */}
      <Collapsible
        title="Completion Checklist"
        icon={passedChecks === totalChecks ? CheckCircle : AlertTriangle}
        iconColor={passedChecks === totalChecks ? "#16a34a" : "#eab308"}
        badge={`${passedChecks}/${totalChecks}`}
        defaultOpen={passedChecks < totalChecks}
      >
        {/* Progress bar */}
        <div className="mb-4">
          <div className="flex justify-between mb-1.5">
            <span className="text-[11px] text-[#4d4634]" style={{ fontFamily: I }}>
              {passedChecks === totalChecks
                ? "All fields complete — ready to create workspace"
                : `${totalChecks - passedChecks} field(s) missing — workspace can still be created`}
            </span>
            <span className="text-[11px] font-bold" style={{ fontFamily: JM, color: completeness === 100 ? "#16a34a" : "#eab308" }}>
              {completeness}%
            </span>
          </div>
          <div className="h-2 rounded-full bg-[#efeded] overflow-hidden">
            <div className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${completeness}%`,
                background: completeness === 100 ? "#16a34a" : "#eab308",
              }} />
          </div>
        </div>
        <div className="flex flex-col">
          {checks.map((c, i) => <CheckItem key={i} {...c} />)}
        </div>
      </Collapsible>

      {/* ── 5. READINESS PANELS ───────────────────────────── */}
      <Collapsible title="Readiness Assessment" icon={Activity} iconColor="#1d4ed8" defaultOpen={true}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
          {[
            { label: "Manufacturing Readiness", score: mfgScore, color: mfgScore >= 70 ? "#16a34a" : "#eab308", bg: "#f0fdf4", icon: Factory },
            { label: "Business Readiness", score: bizScore, color: bizScore >= 70 ? "#16a34a" : "#eab308", bg: "#eff6ff", icon: TrendingUp },
            { label: "Supply Chain Readiness", score: scScore, color: scScore >= 70 ? "#16a34a" : "#eab308", bg: "#faf5ff", icon: Truck },
          ].map(({ label, score, color, bg, icon: Ic }) => (
            <div key={label} className="rounded-2xl p-4 flex flex-col gap-3"
              style={{ background: bg, border: `1px solid ${color}25` }}>
              <div className="flex items-center gap-2">
                <Ic size={13} style={{ color }} />
                <p className="text-[11px] font-bold text-[#1b1c1c]" style={{ fontFamily: I }}>{label}</p>
              </div>
              <p className="text-[28px] font-extrabold leading-none" style={{ fontFamily: M, color }}>{score}%</p>
              <div className="h-1.5 rounded-full bg-[rgba(0,0,0,0.06)] overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${score}%`, background: color }} />
              </div>
              <p className="text-[10px] text-[#4d4634]" style={{ fontFamily: I }}>
                {score >= 80 ? "Excellent — proceed with confidence" :
                  score >= 60 ? "Good — minor gaps to address" :
                    "Review recommended before launch"}
              </p>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-2.5">
          <ReadinessBar label="Manufacturing Readiness" score={mfgScore} color={mfgScore >= 70 ? "#16a34a" : "#eab308"} />
          <ReadinessBar label="Business Readiness" score={bizScore} color={bizScore >= 70 ? "#16a34a" : "#eab308"} />
          <ReadinessBar label="Supply Chain Readiness" score={scScore} color={scScore >= 70 ? "#16a34a" : "#eab308"} />
          <ReadinessBar label="Overall Completeness" score={completeness} color={completeness >= 80 ? "#16a34a" : "#eab308"} />
        </div>
      </Collapsible>

      {/* ── 6. PRODUCT OVERVIEW + BUSINESS STRATEGY ───────── */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <SectionHeader label="Product Overview" />
          {[
            { l: "Name", v: data.productName || "—" },
            { l: "Brand", v: data.brandName || "—" },
            { l: "Category", v: data.category || "—" },
            { l: "Industry", v: data.industry || "—" },
            { l: "Model", v: W_BIZ_MODELS.find(m => m.id === data.businessModel)?.label || "—" },
            { l: "Country", v: data.targetCountry },
          ].map(r => <Row key={r.l} label={r.l} value={r.v} />)}
        </Card>

        <Card>
          <SectionHeader label="Business Strategy" />
          {[
            { l: "Budget", v: data.budget ? fmtCr(Number(data.budget)) : "—" },
            { l: "Timeline", v: data.launchTimeline || "—" },
            { l: "Risk", v: data.riskPreference },
            { l: "Region", v: data.manufacturingRegion || "Any" },
            { l: "MOQ", v: data.moq ? `${data.moq} units` : "—" },
            { l: "Suppliers", v: data.supplierCount || "—" },
          ].map(r => <Row key={r.l} label={r.l} value={r.v} />)}
          {data.priorities.length > 0 && (
            <div className="mt-2 pt-2 border-t border-[rgba(208,198,174,0.1)]">
              <p className="text-[10px] font-bold uppercase text-[#4d4634] mb-1.5 tracking-[0.5px]"
                style={{ fontFamily: I }}>Top Priorities</p>
              <div className="flex flex-wrap gap-1">
                {data.priorities.slice(0, 3).map((id, i) => {
                  const p = W_PRIORITIES.find(x => x.id === id);
                  return (
                    <span key={id} className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-[#efeded] text-[#1b1c1c]"
                      style={{ fontFamily: I }}>
                      {NUMS[i]} {p?.label}
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* ── 7. COST SUMMARY ───────────────────────────────── */}
      <Collapsible title="Cost Summary" icon={DollarSign} iconColor="#1d4ed8" defaultOpen={true}>
        <div className="grid grid-cols-2 gap-4">
          {/* Breakdown bars */}
          <div className="flex flex-col gap-3">
            {bp.costs.map(c => (
              <div key={c.label}>
                <div className="flex justify-between mb-1">
                  <span className="text-[12px] text-[#1b1c1c]" style={{ fontFamily: I }}>{c.label}</span>
                  <div className="flex items-center gap-2">
                    {totalBudgetNum > 0 && (
                      <span className="text-[11px] text-[#4d4634]" style={{ fontFamily: JM }}>
                        {fmtCr(Math.round(totalBudgetNum * c.value / totalWeightPct))}
                      </span>
                    )}
                    <span className="text-[11px] font-bold text-[#1b1c1c]" style={{ fontFamily: JM }}>{c.value}%</span>
                  </div>
                </div>
                <div className="h-1.5 rounded-full bg-[#efeded] overflow-hidden">
                  <div className="h-full rounded-full"
                    style={{
                      width: `${(c.value / totalWeightPct) * 100}%`,
                      background: c.value >= 30 ? "#3b82f6" : c.value >= 15 ? "#f97316" : "#16a34a",
                    }} />
                </div>
              </div>
            ))}
          </div>
          {/* Summary box */}
          <div className="bg-[#f4f2ed] rounded-xl p-4 flex flex-col gap-3">
            <Row label="Total Budget" value={data.budget ? fmtCr(Number(data.budget)) : "—"} color="#1b1c1c" />
            <Row label="Est. Revenue" value={bp.estimatedRevenue} color="#16a34a" />
            <Row label="Expected ROI" value={bp.roi} color="#16a34a" />
            <Row label="Supply Chain Cost" value="~68% of budget" color="#4d4634" />
            <Row label="Time to Market" value={`${totalWeeks} weeks`} color="#4d4634" />
            {bp.savings?.length > 0 && (
              <div className="pt-2 border-t border-[rgba(208,198,174,0.15)]">
                <p className="text-[10px] font-bold text-[#16a34a] uppercase tracking-[0.4px] mb-1"
                  style={{ fontFamily: I }}>Savings Opportunities</p>
                {bp.savings.map((s, i) => (
                  <Row key={i} label={s.opp} value={s.amount} color="#16a34a" />
                ))}
              </div>
            )}
          </div>
        </div>
      </Collapsible>

      {/* ── 8. TIMELINE SUMMARY ───────────────────────────── */}
      <Collapsible title="Timeline Summary" icon={Clock} iconColor="#7c3aed" defaultOpen={true}>
        <div className="flex flex-col gap-3">
          {/* Gantt-style bars */}
          <div className="flex gap-1 h-8 rounded-xl overflow-hidden">
            {bp.timeline.map(t => (
              <div key={t.phase}
                className="h-full flex items-center justify-center"
                style={{
                  width: `${(t.weeks / totalWeeks) * 100}%`,
                  background: t.color,
                  minWidth: 2,
                }}>
                <span className="text-white text-[9px] font-bold px-1 truncate hidden sm:block"
                  style={{ fontFamily: I }}>{t.weeks}w</span>
              </div>
            ))}
          </div>
          {/* Phase list */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-1">
            {bp.timeline.map((t, i) => (
              <div key={t.phase} className="flex items-center gap-2 p-2.5 rounded-xl"
                style={{ background: `${t.color}10`, border: `1px solid ${t.color}25` }}>
                <div className="size-2.5 rounded-full shrink-0" style={{ background: t.color }} />
                <div>
                  <p className="text-[11px] font-bold text-[#1b1c1c]" style={{ fontFamily: I }}>{t.phase}</p>
                  <p className="text-[10px] text-[#4d4634]" style={{ fontFamily: I }}>
                    Week {bp.timeline.slice(0, i).reduce((s, x) => s + x.weeks, 1)}–{bp.timeline.slice(0, i + 1).reduce((s, x) => s + x.weeks, 0)} · {t.weeks}w
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-[rgba(208,198,174,0.1)]">
            <span className="text-[12px] text-[#4d4634]" style={{ fontFamily: I }}>Total time to market</span>
            <span className="text-[13px] font-bold text-[#7c3aed]" style={{ fontFamily: M }}>{totalWeeks} weeks</span>
          </div>
        </div>
      </Collapsible>

      {/* ── 9. RISK SUMMARY ───────────────────────────────── */}
      <Collapsible
        title="Risk Summary"
        icon={AlertTriangle}
        iconColor={bp.risks.some(r => r.severity === "high") ? "#ba1a1a" : "#eab308"}
        badge={`${bp.risks.length} risks`}
        defaultOpen={true}
      >
        <div className="grid grid-cols-3 gap-3">
          {bp.risks.map(r => {
            const rc = RC[r.severity];
            return (
              <div key={r.risk} className="p-3 rounded-xl border"
                style={{ borderColor: `${rc}2a`, background: `${rc}08` }}>
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="size-1.5 rounded-full" style={{ background: rc }} />
                  <span className="text-[10px] font-bold uppercase tracking-[0.4px]"
                    style={{ fontFamily: I, color: rc }}>{r.severity} risk</span>
                </div>
                <p className="text-[12px] font-semibold text-[#1b1c1c] leading-snug"
                  style={{ fontFamily: I }}>{r.risk}</p>
                <div className="flex items-start gap-1.5 mt-1.5">
                  <ShieldCheck size={11} className="shrink-0 mt-0.5" style={{ color: "#16a34a" }} />
                  <p className="text-[11px] text-[#4d4634] leading-snug"
                    style={{ fontFamily: I }}>{r.fix}</p>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-3 grid grid-cols-3 gap-3">
          {(["high", "medium", "low"]).map(sev => {
            const count = bp.risks.filter(r => r.severity === sev).length;
            return (
              <div key={sev} className="flex items-center justify-between p-2.5 rounded-xl"
                style={{ background: `${RC[sev]}08`, border: `1px solid ${RC[sev]}20` }}>
                <span className="text-[11px] font-semibold capitalize" style={{ fontFamily: I, color: RC[sev] }}>
                  {sev} risk
                </span>
                <span className="text-[14px] font-extrabold" style={{ fontFamily: M, color: RC[sev] }}>
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </Collapsible>

      {/* ── 10. RECOMMENDED PARTNERS ──────────────────────── */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <SectionHeader label="Recommended Manufacturers" />
          <div className="flex flex-col gap-2.5">
            {bp.manufacturers.slice(0, 3).map(m => (
              <div key={m.name} className="flex items-center gap-3 p-2.5 rounded-xl bg-[#fbf9f9] border border-[rgba(208,198,174,0.15)]">
                <div className="size-7 rounded-lg bg-[#efeded] flex items-center justify-center shrink-0">
                  <Factory size={13} className="text-[#4d4634]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-bold text-[#1b1c1c] truncate" style={{ fontFamily: M }}>{m.name}</p>
                  <p className="text-[11px] text-[#4d4634]" style={{ fontFamily: I }}>{m.city} · {m.lead}</p>
                </div>
                <div className="shrink-0 text-right">
                  <span className="text-[11px] font-bold text-[#16a34a]" style={{ fontFamily: M }}>{m.match}%</span>
                  <p className="text-[10px] text-[#4d4634]" style={{ fontFamily: I }}>{m.price}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <SectionHeader label="Recommended Suppliers" />
          <div className="flex flex-col gap-2.5">
            {bp.suppliers.slice(0, 3).map(s => (
              <div key={s.name} className="flex items-center gap-3 p-2.5 rounded-xl bg-[#fbf9f9] border border-[rgba(208,198,174,0.15)]">
                <div className="size-7 rounded-lg bg-[#efeded] flex items-center justify-center shrink-0">
                  <Package size={13} className="text-[#4d4634]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-bold text-[#1b1c1c] truncate" style={{ fontFamily: M }}>{s.name}</p>
                  <p className="text-[11px] text-[#4d4634]" style={{ fontFamily: I }}>{s.category} · {s.lead}</p>
                </div>
                <span className="text-[11px] font-bold text-[#16a34a] shrink-0" style={{ fontFamily: M }}>
                  ⭐ {s.rating}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* ── 11. SUPPLY CHAIN SNAPSHOT ─────────────────────── */}
      <Collapsible title="Supply Chain Readiness" icon={Truck} iconColor="#0891b2" defaultOpen={false}>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            {[
              { l: "Raw Materials", v: data.rawMaterials || "—" },
              { l: "Packaging", v: data.packagingType || "—" },
              { l: "Warehouse City", v: data.warehouseCity || "—" },
              { l: "Storage Conditions", v: data.storageConditions || "Ambient" },
              { l: "Transport Modes", v: data.transport.length ? data.transport.join(", ") : "—" },
              { l: "MOQ", v: data.moq ? `${data.moq} ${data.productionUnit}` : "—" },
              { l: "Monthly Production", v: data.monthlyProduction ? `${data.monthlyProduction} ${data.productionUnit}` : "—" },
            ].map(r => <Row key={r.l} label={r.l} value={r.v} />)}
          </div>
          <div className="flex flex-col gap-2">
            {[
              { label: "Cold Chain Required", active: data.coldChain, icon: "❄️" },
              { label: "Import / Export", active: data.importExport, icon: "🌐" },
              { label: "Quality Labs", active: data.qualityLabs, icon: "🧪" },
            ].map(f => (
              <div key={f.label} className="flex items-center justify-between p-3 rounded-xl"
                style={{ background: f.active ? "#f0fdf4" : "#fafafa", border: `1px solid ${f.active ? "#16a34a25" : "#efeded"}` }}>
                <div className="flex items-center gap-2">
                  <span className="text-[13px]">{f.icon}</span>
                  <p className="text-[12px] font-semibold text-[#1b1c1c]" style={{ fontFamily: I }}>{f.label}</p>
                </div>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md"
                  style={{
                    background: f.active ? "#16a34a18" : "#efeded",
                    color: f.active ? "#16a34a" : "#4d4634",
                    fontFamily: I,
                  }}>
                  {f.active ? "Yes" : "No"}
                </span>
              </div>
            ))}
            {data.certifications?.length > 0 && (
              <div className="p-3 rounded-xl bg-[#eff6ff] border border-[#1d4ed825]">
                <p className="text-[10px] font-bold text-[#1d4ed8] uppercase tracking-[0.4px] mb-1.5"
                  style={{ fontFamily: I }}>Certifications Required</p>
                <div className="flex flex-wrap gap-1">
                  {data.certifications.map(c => (
                    <span key={c} className="text-[10px] px-1.5 py-0.5 rounded-md bg-[#1d4ed818] text-[#1d4ed8] font-semibold"
                      style={{ fontFamily: I }}>{c}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </Collapsible>

      {/* ── 12. PRODUCT CREATION CONFIRMATION ────────────── */}
      <div className="bg-[#303031] rounded-2xl p-5 border border-[rgba(255,213,74,0.15)]">
        <div className="flex items-start gap-4">
          <div className="size-10 rounded-full bg-[rgba(255,213,74,0.12)] flex items-center justify-center shrink-0 mt-0.5">
            <Sparkles size={18} className="text-[#ffd54a]" />
          </div>
          <div className="flex-1">
            <p className="text-white font-bold text-[15px]" style={{ fontFamily: M }}>
              Ready to Create Product Workspace
            </p>
            <p className="text-white/50 text-[12px] mt-1 leading-relaxed" style={{ fontFamily: I }}>
              Clicking <strong className="text-white/70">Create Product Workspace</strong> will:
            </p>
            <div className="mt-2.5 flex flex-col gap-1.5">
              {[
                "Initialise a dedicated AI-monitored product workspace",
                "Activate supplier & manufacturer match tracking",
                "Set up cost and timeline dashboards with live data",
                "Enable document management and compliance workflows",
                "Queue Django API calls to persist product, blueprint & team assignments",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2">
                  <div className="size-1.5 rounded-full bg-[#ffd54a] mt-1.5 shrink-0" />
                  <p className="text-white/60 text-[12px]" style={{ fontFamily: I }}>{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-[rgba(255,255,255,0.06)] grid grid-cols-3 gap-3">
          {[
            { label: "Blueprint Health", value: `${bp.health ?? 87}%`, color: "#ffd54a" },
            { label: "AI Confidence", value: `${bp.confidence}%`, color: "#16a34a" },
            { label: "Form Completeness", value: `${completeness}%`, color: "#0891b2" },
          ].map(s => (
            <div key={s.label} className="flex flex-col gap-0.5">
              <p className="text-[11px] text-white/40" style={{ fontFamily: I }}>{s.label}</p>
              <p className="text-[18px] font-extrabold" style={{ fontFamily: M, color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="h-4" />
    </div>
  );
}
/* ── AI Side Panel ── */
