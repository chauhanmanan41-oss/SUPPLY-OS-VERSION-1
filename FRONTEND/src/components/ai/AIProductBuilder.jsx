import React, { useState } from "react";
import { Sparkles, Brain, ArrowRight, Check, RefreshCw, Layers, ShieldCheck, Cpu, AlertCircle, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { I, M } from "../../constants/fonts";
import { buildProductWithAI } from "../../services/aiService";
import { toast } from "sonner";

export function AIProductBuilder({ onApply, currentData }) {
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [applied, setApplied] = useState(false);

    const handleGenerate = async () => {
        if (!description.trim()) {
            toast.error("Please enter a brief product description to start AI synthesis.");
            return;
        }
        setLoading(true);
        setError(null);
        setApplied(false);

        try {
            const resp = await buildProductWithAI({ description });
            if (resp && resp.success && resp.data) {
                setResult(resp.data);
                toast.success("AI synthesized product specification!");
            } else {
                setError("Could not generate specification. Please refine description.");
            }
        } catch (err) {
            console.error("AI Product Builder Error:", err);
            setError("Failed to connect to AI Product Builder service.");
        } finally {
            setLoading(false);
        }
    };

    const handleApply = () => {
        if (!result) return;
        const updatePayload = {
            productName: result.productName || currentData?.productName || "",
            brandName: result.brandName || currentData?.brandName || "",
            category: result.category || currentData?.category || "",
            industry: result.industry || currentData?.industry || "",
            description: result.description || currentData?.description || "",
            targetCountry: result.targetCountry || currentData?.targetCountry || "India",
            businessModel: result.businessModel || currentData?.businessModel || "contract",
            budget: result.budget || currentData?.budget || "500000",
            monthlyProduction: result.monthlyProduction || currentData?.monthlyProduction || "5000",
            productionUnit: result.productionUnit || currentData?.productionUnit || "units",
            launchTimeline: result.launchTimeline || currentData?.launchTimeline || "3 months",
            certifications: Array.isArray(result.certifications) ? result.certifications : ["FSSAI", "WHO-GMP"],
            rawMaterials: result.rawMaterials || "",
            packagingType: result.packagingType || "",
            storageConditions: result.storageConditions || "Ambient",
        };
        onApply(updatePayload);
        setApplied(true);
        toast.success("AI specs populated into the form!");
    };

    const details = result?.ai_product_details || {};

    return (
        <div className="mb-8 rounded-2xl overflow-hidden border border-[#ffd54a]/40 shadow-[0_4px_24px_rgba(0,0,0,0.06)] bg-[linear-gradient(145deg,#1b1c1c,#272828)] text-white p-6 transition-all">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="size-10 rounded-xl bg-[linear-gradient(135deg,#ffd54a,#f59e0b)] flex items-center justify-center text-[#1b1c1c] font-black shadow-[0_2px_12px_rgba(255,213,74,0.35)]">
                        <Sparkles size={20} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="font-bold text-[16px] text-white tracking-tight" style={{ fontFamily: M }}>
                                AI Product Architect & Copilot
                            </h3>
                            <span className="px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-bold bg-[#ffd54a]/20 text-[#ffd54a] border border-[#ffd54a]/30" style={{ fontFamily: M }}>
                                V2 powered
                            </span>
                        </div>
                        <p className="text-[#d0c6ae] text-[12px]" style={{ fontFamily: I }}>
                            Describe your vision in plain English; AI will engineer formulations, compliance criteria, & BOM defaults.
                        </p>
                    </div>
                </div>
            </div>

            {/* Input Section */}
            <div className="relative mb-4">
                <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    disabled={loading}
                    placeholder="e.g. 'High-protein lactose-free whey isolate in 500g eco matte jars for India fitness consumers. Need FSSAI compliant contract manufacturer with 5,000 unit MOQ budget.'"
                    className="w-full bg-[#161617]/90 text-white text-[13px] rounded-xl p-4 pr-32 border border-white/10 focus:border-[#ffd54a] outline-none transition-all placeholder:text-[#d0c6ae]/40 leading-relaxed resize-none"
                    style={{ fontFamily: I }}
                />
                <div className="absolute right-3 bottom-3 flex items-center gap-2">
                    <button
                        onClick={handleGenerate}
                        disabled={loading || !description.trim()}
                        className="flex items-center gap-2 px-4 py-2 bg-[linear-gradient(135deg,#ffd54a,#eab308)] hover:brightness-105 active:scale-[0.98] disabled:opacity-50 text-[#1b1c1c] rounded-lg text-[12px] font-bold shadow-md transition-all duration-200"
                        style={{ fontFamily: M }}
                    >
                        {loading ? (
                            <>
                                <RefreshCw size={14} className="animate-spin" />
                                <span>Synthesizing...</span>
                            </>
                        ) : (
                            <>
                                <span>Generate Spec</span>
                                <ArrowRight size={14} />
                            </>
                        )}
                    </button>
                </div>
            </div>

            {error && (
                <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-[12px] mb-4">
                    <AlertCircle size={15} />
                    <span>{error}</span>
                </div>
            )}

            {/* Generated Specification Preview */}
            <AnimatePresence>
                {result && !loading && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="bg-black/40 rounded-xl p-5 border border-white/10 mt-4"
                    >
                        <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
                            <div className="flex items-center gap-2">
                                <Cpu size={16} className="text-[#ffd54a]" />
                                <span className="font-bold text-[14px] text-white" style={{ fontFamily: M }}>
                                    Synthesized Product Profile: <span className="text-[#ffd54a]">{result.productName}</span>
                                </span>
                            </div>
                            <button
                                onClick={handleApply}
                                className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-[12px] font-bold transition-all shadow-md ${
                                    applied
                                        ? "bg-emerald-500 text-white cursor-default"
                                        : "bg-[#ffd54a] text-[#1b1c1c] hover:bg-white"
                                }`}
                                style={{ fontFamily: M }}
                            >
                                {applied ? (
                                    <>
                                        <CheckCircle size={14} />
                                        <span>Applied to Wizard</span>
                                    </>
                                ) : (
                                    <>
                                        <Check size={14} />
                                        <span>Apply Specification to Form</span>
                                    </>
                                )}
                            </button>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mb-4 text-[12px]" style={{ fontFamily: I }}>
                            <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                                <span className="text-white/50 text-[11px] block mb-1">Category & Industry</span>
                                <span className="font-semibold text-white block">{result.category}</span>
                                <span className="text-[#ffd54a]/80 text-[11px]">{result.industry}</span>
                            </div>
                            <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                                <span className="text-white/50 text-[11px] block mb-1">Business Model</span>
                                <span className="font-semibold text-white capitalize block">{result.businessModel} Manufacturing</span>
                                <span className="text-white/70 text-[11px]">Vol: {result.monthlyProduction} {result.productionUnit}/mo</span>
                            </div>
                            <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                                <span className="text-white/50 text-[11px] block mb-1">Regulatory Standards</span>
                                <div className="flex flex-wrap gap-1 mt-1">
                                    {(result.certifications || []).map((c, idx) => (
                                        <span key={idx} className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                            {c}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Extended Formulation Details */}
                        <div className="space-y-3 pt-2 border-t border-white/10 text-[12px]" style={{ fontFamily: I }}>
                            {details.ingredients && (
                                <div>
                                    <span className="text-white/50 text-[11px] font-bold block mb-1 uppercase tracking-wider">Estimated Composition & Ingredients:</span>
                                    <div className="flex flex-wrap gap-1.5">
                                        {details.ingredients.map((ing, i) => (
                                            <span key={i} className="px-2 py-1 bg-white/10 rounded-md text-white/90 text-[11px] border border-white/5">
                                                • {ing}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {details.manufacturing_process && (
                                <div className="bg-[#ffd54a]/5 border border-[#ffd54a]/20 rounded-lg p-3">
                                    <div className="flex items-center gap-2 mb-1 text-[#ffd54a] font-bold text-[11px] uppercase tracking-wider" style={{ fontFamily: M }}>
                                        <Layers size={13} />
                                        <span>Recommended Manufacturing Workflow:</span>
                                    </div>
                                    <p className="text-white/80 text-[12px] leading-relaxed">
                                        {details.manufacturing_process}
                                    </p>
                                </div>
                            )}

                            {details.business_notes && (
                                <div className="flex items-start gap-2.5 pt-2 text-[#d0c6ae] text-[11px]">
                                    <ShieldCheck size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                                    <span><strong>Copilot Advisory:</strong> {details.business_notes}</span>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
