import { useMemo } from "react";
import { toast } from "sonner";
import { Brain, ArrowUpRight, ShieldCheck, Zap } from "lucide-react";
import { Badge } from "../common/Badge";
import { I, M } from "../../constants/fonts";
import { useApi } from "../../hooks/useApi";

export function MAIAdvisor({ query = "", category = "all", filters = {}, onSelectPartner }) {
    const aiUrl = useMemo(() => {
        const params = new URLSearchParams();
        if (query) params.append("q", query);
        if (category && category !== "all") params.append("category", category);
        return `/marketplace/ai-advisor/?${params.toString()}`;
    }, [query, category]);

    const { data: aiData, loading } = useApi(aiUrl);

    // Resolve top recommendation & alternatives from live backend API or fallback
    const topRec = aiData?.top_recommendation;
    const topPartner = topRec?.partner;
    const altRec = aiData?.alternative_partner;
    const altPartner = altRec?.partner;
    const activeContext = aiData?.active_context || {
        current_product: query || "Industrial Supply Chain",
        priority: "Premium Quality & Delivery",
        target_category: category === "all" ? "Cross-Domain Directory" : category,
        recommended_action: "Initiate RFQ to optimize procurement costs."
    };
    const healthBars = aiData?.supply_chain_health || [
        { label: "Raw Materials", value: 94, color: "#16a34a" },
        { label: "Manufacturing", value: 89, color: "#3b82f6" },
        { label: "Packaging", value: 91, color: "#a855f7" },
        { label: "Logistics", value: 88, color: "#f97316" },
        { label: "Quality / Lab", value: 95, color: "#eab308" }
    ];

    return (
        <div className="w-[320px] shrink-0 h-full overflow-y-auto border-l border-[rgba(208,198,174,0.2)] bg-white shadow-lg" style={{ scrollbarWidth: "none" }}>
            <div className="px-5 py-6 flex flex-col gap-6">

                <div className="flex items-center gap-3">
                    <div className="size-9 rounded-2xl flex items-center justify-center shrink-0 shadow-sm" style={{ background: "rgba(255,213,74,0.2)", border: "1px solid rgba(255,213,74,0.4)" }}>
                        <Brain size={18} style={{ color: "#735c00" }}/>
                    </div>
                    <div>
                        <p className="font-bold text-[15px] text-[#1b1c1c]" style={{ fontFamily: M }}>AI Procurement Advisor</p>
                        <p className="text-[11.5px] font-semibold text-[#16a34a] flex items-center gap-1" style={{ fontFamily: I }}>
                            <Zap size={11} className="fill-[#16a34a]"/> SupplyOS Engine Active
                        </p>
                    </div>
                </div>

                {loading ? (
                    <div className="py-12 flex flex-col items-center justify-center gap-2">
                        <div className="size-7 border-[3px] border-[#735c00]/20 border-t-[#735c00] rounded-full animate-spin" />
                        <p className="text-[12px] text-[#4d4634] font-semibold" style={{ fontFamily: I }}>Synthesizing partner scores…</p>
                    </div>
                ) : (
                    <>
                        {/* Context card */}
                        <div className="p-4 rounded-xl shadow-sm" style={{ background: "rgba(255,213,74,0.08)", border: "1px solid rgba(255,213,74,0.3)" }}>
                            <p className="text-[10.5px] font-bold text-[#735c00] uppercase tracking-wide mb-3 flex items-center gap-1.5" style={{ fontFamily: M }}>
                                <ShieldCheck size={13} style={{ color: "#735c00" }}/> Active Strategic Context
                            </p>
                            <div className="flex flex-col gap-2">
                                <div className="flex justify-between items-center text-[12.5px]">
                                    <span className="text-[#4d4634]" style={{ fontFamily: I }}>Target Domain</span>
                                    <span className="font-bold text-[#1b1c1c] max-w-[150px] truncate" style={{ fontFamily: M }}>{activeContext.target_category}</span>
                                </div>
                                <div className="flex justify-between items-center text-[12.5px]">
                                    <span className="text-[#4d4634]" style={{ fontFamily: I }}>AI Objective</span>
                                    <span className="font-bold text-[#1b1c1c] max-w-[150px] truncate" style={{ fontFamily: M }}>{activeContext.priority}</span>
                                </div>
                                <div className="pt-2 border-t border-[rgba(255,213,74,0.4)] text-[12px] text-[#735c00] font-semibold italic leading-snug" style={{ fontFamily: I }}>
                                    "{activeContext.recommended_action}"
                                </div>
                            </div>
                        </div>

                        {/* Top recommendation */}
                        <div>
                            <p className="text-[11px] font-bold text-[#4d4634] uppercase tracking-wide mb-3" style={{ fontFamily: M }}>Optimal Enterprise Match</p>
                            {topPartner ? (
                                <div className="p-4 rounded-xl border shadow-sm transition hover:shadow-md" style={{ background: "rgba(22,163,74,0.04)", borderColor: "rgba(22,163,74,0.25)" }}>
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2 min-w-0">
                                            <span className="text-xl">{topPartner.logo || "🏆"}</span>
                                            <p className="font-bold text-[15px] text-[#1b1c1c] truncate" style={{ fontFamily: M }}>{topPartner.name}</p>
                                        </div>
                                        <Badge label={`${topRec.confidence_score}% Match`} color="#16a34a" bg="rgba(22,163,74,0.12)"/>
                                    </div>
                                    <p className="text-[12.5px] text-[#4d4634] leading-relaxed mb-3.5 font-medium" style={{ fontFamily: I }}>
                                        {topRec.reasoning_summary}
                                    </p>
                                    <div className="flex flex-col gap-2 p-2.5 rounded-lg bg-white/70 border border-[rgba(22,163,74,0.15)] mb-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-[12px] text-[#4d4634]" style={{ fontFamily: I }}>Expected Cost Savings</span>
                                            <span className="font-bold text-[13px] text-[#16a34a]" style={{ fontFamily: M }}>{topRec.expected_savings}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-[12px] text-[#4d4634]" style={{ fontFamily: I }}>Speed Advantage</span>
                                            <span className="font-bold text-[13px] text-[#3b82f6]" style={{ fontFamily: M }}>{topRec.delivery_improvement}</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => onSelectPartner ? onSelectPartner(topPartner) : toast.info(`Viewing ${topPartner.name} profile`)} 
                                            className="flex-1 py-2 rounded-xl text-[12.5px] font-bold text-white bg-[#303031] hover:bg-[#1b1c1c] transition flex items-center justify-center gap-1"
                                            style={{ fontFamily: M }}
                                        >
                                            Inspect Profile <ArrowUpRight size={13}/>
                                        </button>
                                        <button 
                                            onClick={() => toast.success(`Instant RFQ drafted for ${topPartner.name}`)} 
                                            className="px-3 py-2 rounded-xl text-[12.5px] font-bold hover:opacity-90 transition" 
                                            style={{ background: "#ffd54a", color: "#735c00", fontFamily: M }}
                                        >
                                            Draft RFQ
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-4 rounded-xl border border-[rgba(208,198,174,0.3)] bg-[#fbf9f9] text-center text-[12.5px] text-[#4d4634]" style={{ fontFamily: I }}>
                                    Adjust search parameters to unlock AI recommendations.
                                </div>
                            )}
                        </div>

                        {/* Alternative Partner */}
                        {altPartner && (
                            <div>
                                <p className="text-[11px] font-bold text-[#4d4634] uppercase tracking-wide mb-2" style={{ fontFamily: M }}>Recommended Alternative</p>
                                <div 
                                    onClick={() => onSelectPartner && onSelectPartner(altPartner)}
                                    className="p-3.5 rounded-xl border border-[rgba(208,198,174,0.25)] bg-[#fbf9f9] flex items-center gap-3 hover:bg-white cursor-pointer transition shadow-2xs"
                                >
                                    <div className="size-10 rounded-xl flex items-center justify-center text-xl shrink-0" style={{ background: altPartner.bg_theme || "rgba(168,85,247,0.1)" }}>
                                        {altPartner.logo || "🏢"}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-[13.5px] text-[#1b1c1c] truncate" style={{ fontFamily: M }}>{altPartner.name}</p>
                                        <p className="text-[11.5px] text-[#4d4634] truncate" style={{ fontFamily: I }}>
                                            {altRec.summary || `${altRec.confidence_score}% Match in ${altPartner.city}`}
                                        </p>
                                    </div>
                                    <span className="text-[12px] font-bold px-2 py-1 rounded-md" style={{ background: "rgba(168,85,247,0.12)", color: "#a855f7", fontFamily: M }}>
                                        {altRec.confidence_score}%
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Supply chain health */}
                        <div className="pt-2 border-t border-[rgba(208,198,174,0.2)]">
                            <p className="text-[11px] font-bold text-[#4d4634] uppercase tracking-wide mb-3" style={{ fontFamily: M }}>Supply Chain Domain Health</p>
                            {healthBars.map((h, i) => (
                                <div key={i} className="flex items-center gap-3 mb-3 last:mb-0">
                                    <span className="text-[11.5px] font-semibold text-[#4d4634] shrink-0 w-[95px] truncate" style={{ fontFamily: I }}>
                                        {h.label}
                                    </span>
                                    <div className="flex-1 h-2 rounded-full bg-[#efeded] overflow-hidden">
                                        <div 
                                            className="h-full rounded-full transition-all duration-700" 
                                            style={{ width: `${h.value}%`, background: h.color }}
                                        />
                                    </div>
                                    <span className="text-[11.5px] font-bold w-8 text-right shrink-0" style={{ color: h.color, fontFamily: M }}>
                                        {h.value}%
                                    </span>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                <button 
                    onClick={() => toast.success("AI Procurement Agent engaged", { description: "Analyzing supplier contracts across 10 categories" })} 
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-[14px] hover:opacity-95 transition shadow-sm" 
                    style={{ background: "#ffd54a", color: "#735c00", fontFamily: M }}
                >
                    <Brain size={16}/> Engage Deep AI Agent
                </button>
            </div>
        </div>
    );
}
