import React, { useState } from "react";
import { Truck, Factory, Package, Building2, ShieldCheck, TestTube, AlertTriangle, Calendar, ChevronRight, CheckCircle2, Award } from "lucide-react";
import { motion } from "motion/react";
import { I, M } from "../../constants/fonts";

export function AIProcurementPlan({ planData }) {
    const [selectedCategory, setSelectedCategory] = useState("all");

    if (!planData || (!planData.plan && !planData.timeline)) {
        return (
            <div className="p-8 text-center text-[#4d4634]/60 font-medium text-[13px]">
                No active procurement strategy data generated yet. Request AI to draft your supply chain plan.
            </div>
        );
    }

    const plan = planData.plan || {};
    const timeline = planData.timeline || [];
    const risks = planData.risks || [];
    const commentary = planData.ai_commentary || "";

    const categoryConfig = [
        { key: "raw_material_suppliers", label: "Raw Materials", icon: Package, color: "bg-blue-500/10 text-blue-700 border-blue-200" },
        { key: "manufacturers", label: "Manufacturers", icon: Factory, color: "bg-amber-500/10 text-amber-700 border-amber-200" },
        { key: "packaging_companies", label: "Packaging", icon: Package, color: "bg-purple-500/10 text-purple-700 border-purple-200" },
        { key: "warehouses", label: "Warehouses", icon: Building2, color: "bg-emerald-500/10 text-emerald-700 border-emerald-200" },
        { key: "logistics_providers", label: "Logistics", icon: Truck, color: "bg-orange-500/10 text-orange-700 border-orange-200" },
        { key: "testing_labs", label: "Testing Labs", icon: TestTube, color: "bg-cyan-500/10 text-cyan-700 border-cyan-200" },
        { key: "certification_agencies", label: "Certifications", icon: Award, color: "bg-rose-500/10 text-rose-700 border-rose-200" },
    ];

    const totalWeeks = timeline.find(t => t.phase === "TOTAL ESTIMATED")?.weeks || timeline.reduce((acc, curr) => curr.phase !== "TOTAL ESTIMATED" ? acc + curr.weeks : acc, 0);

    return (
        <div className="space-y-6 my-4">
            {/* Top Overview Bar */}
            <div className="p-6 rounded-2xl bg-[linear-gradient(135deg,#1b1c1c,#2e2f30)] text-white shadow-md border border-[#ffd54a]/30">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="size-10 rounded-xl bg-[#ffd54a] flex items-center justify-center text-[#1b1c1c] font-black">
                            <Truck size={22} />
                        </div>
                        <div>
                            <h3 className="text-[17px] font-bold tracking-tight" style={{ fontFamily: M }}>
                                Master Procurement & Supply Chain Roadmap
                            </h3>
                            <p className="text-[#d0c6ae] text-[12px]" style={{ fontFamily: I }}>
                                Synchronized across your organization's verified partner network and operational capacities.
                            </p>
                        </div>
                    </div>
                    <div className="text-right">
                        <span className="text-[11px] text-[#ffd54a] uppercase font-bold tracking-wider block">Estimated Duration</span>
                        <span className="text-[22px] font-black text-white" style={{ fontFamily: M }}>~{totalWeeks} Weeks</span>
                    </div>
                </div>

                {commentary && (
                    <div className="p-3.5 bg-white/10 rounded-xl text-[12px] text-white/90 leading-relaxed border border-white/10" style={{ fontFamily: I }}>
                        {commentary}
                    </div>
                )}
            </div>

            {/* Timeline Breakdown */}
            {timeline.length > 0 && (
                <div className="p-5 rounded-2xl bg-white border border-[rgba(208,198,174,0.3)] shadow-sm">
                    <div className="flex items-center gap-2 mb-4 text-[#1b1c1c] font-bold text-[14px]" style={{ fontFamily: M }}>
                        <Calendar size={18} className="text-[#735c00]" />
                        <span>Execution Timeline & Milestones</span>
                    </div>
                    <div className="space-y-3">
                        {timeline.filter(t => t.phase !== "TOTAL ESTIMATED").map((item, index) => {
                            const pct = Math.min(100, Math.round((item.weeks / (totalWeeks || 1)) * 100));
                            return (
                                <div key={index} className="space-y-1">
                                    <div className="flex justify-between text-[12px]">
                                        <span className="font-semibold text-[#1b1c1c]" style={{ fontFamily: M }}>{item.phase}</span>
                                        <span className="font-bold text-[#735c00]">{item.weeks} Weeks</span>
                                    </div>
                                    <div className="w-full bg-[#efeded] h-2 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${pct}%` }}
                                            transition={{ duration: 0.6, delay: index * 0.1 }}
                                            className="h-full bg-[linear-gradient(90deg,#ffd54a,#eab308)] rounded-full"
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Partner Network Grid */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h4 className="font-bold text-[15px] text-[#1b1c1c]" style={{ fontFamily: M }}>
                        Verified Partner Network
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                        <button
                            onClick={() => setSelectedCategory("all")}
                            className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all ${
                                selectedCategory === "all" ? "bg-[#303031] text-white" : "bg-[#efeded] text-[#4d4634] hover:bg-[#e4e1db]"
                            }`}
                            style={{ fontFamily: M }}
                        >
                            All Categories
                        </button>
                        {categoryConfig.map(cat => (
                            <button
                                key={cat.key}
                                onClick={() => setSelectedCategory(cat.key)}
                                className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 ${
                                    selectedCategory === cat.key ? "bg-[#303031] text-white" : "bg-[#efeded] text-[#4d4634] hover:bg-[#e4e1db]"
                                }`}
                                style={{ fontFamily: M }}
                            >
                                <span>{cat.label}</span>
                                <span className="px-1.5 py-0.2 rounded bg-black/10 text-[9px]">
                                    {(plan[cat.key] || []).length}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categoryConfig
                        .filter(c => selectedCategory === "all" || selectedCategory === c.key)
                        .map(cat => {
                            const partners = plan[cat.key] || [];
                            if (partners.length === 0) return null;
                            const IconComp = cat.icon;
                            return partners.map((partner, pIdx) => (
                                <div
                                    key={`${cat.key}-${pIdx}`}
                                    className="p-4 rounded-xl bg-white border border-[rgba(208,198,174,0.35)] hover:border-[#303031] transition-all shadow-sm flex flex-col justify-between"
                                >
                                    <div>
                                        <div className="flex items-center justify-between gap-2 mb-2">
                                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border flex items-center gap-1 ${cat.color}`}>
                                                <IconComp size={12} />
                                                <span>{cat.label}</span>
                                            </span>
                                            {partner.ai_score && (
                                                <span className="px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 rounded-md font-black text-[11px]">
                                                    {partner.ai_score}% Match
                                                </span>
                                            )}
                                        </div>
                                        <h5 className="font-bold text-[14px] text-[#1b1c1c] leading-snug mb-1" style={{ fontFamily: M }}>
                                            {partner.name}
                                        </h5>
                                        <p className="text-[#4d4634] text-[12px] mb-3" style={{ fontFamily: I }}>
                                            📍 {partner.location || "India"} • ⭐ {partner.rating || "4.5"}
                                        </p>
                                        <div className="space-y-1 text-[11px] text-[#4d4634]/80 bg-[#fbf9f9] p-2.5 rounded-lg border border-[#efeded]">
                                            <div className="flex justify-between">
                                                <span>Lead Time:</span>
                                                <span className="font-bold text-[#1b1c1c]">{partner.lead_time_days || "14"} Days</span>
                                            </div>
                                            {partner.moq && (
                                                <div className="flex justify-between">
                                                    <span>MOQ:</span>
                                                    <span className="font-bold text-[#1b1c1c]">{partner.moq}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => alert(`Initiating workflow with ${partner.name}...`)}
                                        className="mt-3 w-full py-1.5 bg-[#efeded] hover:bg-[#ffd54a] hover:text-[#1b1c1c] text-[#303031] font-bold text-[11px] rounded-lg transition-all flex items-center justify-center gap-1"
                                        style={{ fontFamily: M }}
                                    >
                                        <span>Engage Partner</span>
                                        <ChevronRight size={13} />
                                    </button>
                                </div>
                            ));
                        })}
                </div>
            </div>

            {/* Risk Assessment Matrix */}
            {risks.length > 0 && (
                <div className="p-5 rounded-2xl bg-white border border-[rgba(208,198,174,0.3)] shadow-sm">
                    <div className="flex items-center gap-2 mb-3 text-[#1b1c1c] font-bold text-[14px]" style={{ fontFamily: M }}>
                        <AlertTriangle size={18} className="text-amber-500" />
                        <span>Supply Chain Risk Mitigation & Contingency Matrix</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {risks.map((risk, idx) => (
                            <div key={idx} className="p-3.5 rounded-xl border bg-[#fbf9f9] border-[rgba(208,198,174,0.25)] flex flex-col justify-between">
                                <div className="flex items-start justify-between gap-2 mb-1.5">
                                    <span className="font-bold text-[12px] text-[#1b1c1c]" style={{ fontFamily: M }}>{risk.risk}</span>
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider shrink-0 ${
                                        risk.severity === "high" ? "bg-red-100 text-red-700 border border-red-300" :
                                        risk.severity === "medium" ? "bg-amber-100 text-amber-700 border border-amber-300" :
                                        "bg-blue-100 text-blue-700 border border-blue-300"
                                    }`}>
                                        {risk.severity || "Low"} Severity
                                    </span>
                                </div>
                                <p className="text-[11px] text-[#4d4634] mt-1 pt-1.5 border-t border-[rgba(208,198,174,0.15)]" style={{ fontFamily: I }}>
                                    💡 <strong>Mitigation:</strong> {risk.mitigation || "Monitor partner lead times closely during initial production run."}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
