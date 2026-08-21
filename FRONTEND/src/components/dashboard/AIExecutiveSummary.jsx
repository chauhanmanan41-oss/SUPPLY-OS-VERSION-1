import { useState } from "react";
import { toast } from "sonner";
import { TrendingUp, AlertTriangle, Shield, X, Activity } from "lucide-react";
import svgPaths from "../../imports/HtmlBody/svg-whh5jpitbk";
import { I, M } from "../../constants/fonts";

export function AIExecutiveSummary() {
    const [dismissed, setDismissed] = useState(false);
    if (dismissed)
        return null;
    return (<div className="rounded-2xl overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.12)]" style={{ background: "#303031" }}>
      {/* Gradient overlay */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 60%)" }}/>

      <div className="relative p-7">
        {/* Header row */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="px-3 py-1.5 rounded-full flex items-center gap-2 border" style={{ background: "rgba(255,255,255,0.08)", borderColor: "rgba(255,255,255,0.12)" }}>
              <div className="size-4">
                <svg viewBox="0 0 19.0118 20" fill="none" width="16" height="16">
                  <path d={svgPaths.p1f8cb380} fill="#FFD54A"/>
                </svg>
              </div>
              <span className="text-[#ffd54a] text-[11px] font-bold tracking-[0.7px] uppercase" style={{ fontFamily: I }}>AI Executive Summary</span>
            </div>
          </div>
          <button onClick={() => setDismissed(true)} className="text-white/30 hover:text-white/60 transition p-1">
            <X size={16}/>
          </button>
        </div>

        {/* Alert title */}
        <div className="mb-6">
          <h3 className="text-white font-bold text-xl leading-tight" style={{ fontFamily: M }}>
            Strategic Alert: <span style={{ color: "#ff8a73" }}>Logistics Disruption</span>
          </h3>
          <p className="text-white/60 text-sm mt-1.5 max-w-xl" style={{ fontFamily: I }}>
            Port congestion is affecting shipments from Global Ingredients Ltd. Immediate re-routing recommended.
          </p>
        </div>

        {/* Metrics grid */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: "Overall Health", value: "74%", sub: "Business Score", color: "#eab308", icon: Activity },
            { label: "Current Risk", value: "HIGH", sub: "Logistics Disruption", color: "#ff8a73", icon: AlertTriangle },
            { label: "Est. Savings", value: "₹2.3L", sub: "If action taken now", color: "#16a34a", icon: TrendingUp },
            { label: "Confidence", value: "91%", sub: "AI confidence score", color: "#ffd54a", icon: Shield },
        ].map((m) => {
            const Icon = m.icon;
            return (<div key={m.label} className="rounded-xl p-4 border" style={{ background: "rgba(255,255,255,0.06)", borderColor: "rgba(255,255,255,0.08)" }}>
                <div className="flex items-center gap-2 mb-3">
                  <Icon size={13} style={{ color: m.color }}/>
                  <span className="text-[10px] font-bold uppercase tracking-[0.6px]" style={{ fontFamily: I, color: "rgba(255,255,255,0.5)" }}>{m.label}</span>
                </div>
                <p className="font-bold text-2xl leading-none" style={{ fontFamily: M, color: m.color }}>{m.value}</p>
                <p className="text-[11px] mt-1.5" style={{ fontFamily: I, color: "rgba(255,255,255,0.4)" }}>{m.sub}</p>
              </div>);
        })}
        </div>

        {/* Confidence bar */}
        <div className="mb-6 p-4 rounded-xl" style={{ background: "rgba(0,0,0,0.2)" }}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Shield size={13} className="text-white/50"/>
              <span className="text-[11px] font-bold uppercase tracking-[0.6px] text-white/50" style={{ fontFamily: I }}>Top Recommendation · Business Impact</span>
            </div>
            <span className="text-[#ffd54a] font-bold text-sm" style={{ fontFamily: M }}>91% confidence</span>
          </div>
          <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
            <div className="h-full rounded-full bg-[#ffd54a]" style={{ width: "91%" }}/>
          </div>
          <p className="text-white/70 text-sm mt-3" style={{ fontFamily: I }}>
            Re-route PO-8921 to local supplier networks. <strong className="text-white">Avoids 4-day production halt.</strong> Estimated savings: ₹2.3 Lakh.
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button onClick={() => toast.success("Switching logistics provider…", { description: "Alternative routes found." })} className="px-6 py-3 rounded-xl font-bold text-sm transition hover:brightness-110" style={{ background: "#ffd54a", color: "#735c00", fontFamily: M }}>
            Switch Logistics Provider
          </button>
          <button onClick={() => toast("Comparing 4 alternatives…")} className="px-6 py-3 rounded-xl font-semibold text-sm border transition hover:bg-white/10" style={{ background: "rgba(255,255,255,0.08)", borderColor: "rgba(255,255,255,0.15)", color: "white", fontFamily: M }}>
            Compare Alternatives
          </button>
          <button onClick={() => toast.info("Loading full AI report…")} className="px-6 py-3 rounded-xl font-semibold text-sm border transition hover:bg-white/10" style={{ background: "transparent", borderColor: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)", fontFamily: M }}>
            View Full Analysis
          </button>
        </div>
      </div>
    </div>);
}
