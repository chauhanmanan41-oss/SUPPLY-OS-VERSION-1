import React, { useState, useEffect } from "react";
import { ShieldCheck, ShieldAlert, AlertTriangle, CheckCircle2, RefreshCw, ChevronRight, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { I, M } from "../../constants/fonts";
import { validateProductWithAI } from "../../services/aiService";
import { toast } from "sonner";

export function AIProductValidator({ productData, onFix }) {
    const [loading, setLoading] = useState(false);
    const [report, setReport] = useState(null);
    const [error, setError] = useState(null);

    const runValidation = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await validateProductWithAI({ product_data: productData || {} });
            if (data && data.success) {
                setReport(data);
                if (data.completeness_pct === 100) {
                    toast.success("Product specification passed 100% compliance!");
                } else {
                    toast.info(`Compliance Score: ${data.completeness_pct}%. Review items below.`);
                }
            } else {
                setError("Unable to run validation audit.");
            }
        } catch (err) {
            console.error("AI Validator error:", err);
            setError("Error communicating with AI Validator service.");
        } finally {
            setLoading(false);
        }
    };

    const score = report?.completeness_pct ?? 0;
    const issues = report?.issues || [];
    const suggestions = report?.suggestions || [];

    return (
        <div className="w-full rounded-2xl bg-white border border-[rgba(208,198,174,0.35)] shadow-sm p-6 my-4">
            <div className="flex items-center justify-between pb-4 border-b border-[rgba(208,198,174,0.2)]">
                <div className="flex items-center gap-3">
                    <div className="size-10 rounded-xl bg-[#ffd54a]/30 border border-[#ffd54a] flex items-center justify-center text-[#735c00]">
                        <ShieldCheck size={22} />
                    </div>
                    <div>
                        <h4 className="font-bold text-[15px] text-[#1b1c1c]" style={{ fontFamily: M }}>
                            AI Pre-Launch Compliance & Readiness Audit
                        </h4>
                        <p className="text-[12px] text-[#4d4634]" style={{ fontFamily: I }}>
                            Automated checking of formulation gaps, regulatory certifications, and supply chain bottlenecks.
                        </p>
                    </div>
                </div>

                <button
                    onClick={runValidation}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#303031] hover:bg-[#1b1c1c] text-white font-bold text-[12px] transition-all duration-200 shadow-md disabled:opacity-50"
                    style={{ fontFamily: M }}
                >
                    <RefreshCw size={14} className={loading ? "animate-spin text-[#ffd54a]" : "text-[#ffd54a]"} />
                    <span>{report ? "Re-Run Audit" : "Analyze Readiness"}</span>
                </button>
            </div>

            {error && (
                <div className="mt-4 p-3 rounded-xl bg-red-50 text-red-600 border border-red-200 text-[12px] font-semibold flex items-center gap-2">
                    <ShieldAlert size={16} />
                    <span>{error}</span>
                </div>
            )}

            <AnimatePresence>
                {report && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-5 overflow-hidden"
                    >
                        {/* Score Indicator */}
                        <div className="flex items-center justify-between p-4 rounded-xl bg-[#fbf9f9] border border-[rgba(208,198,174,0.25)] mb-5">
                            <div className="flex items-center gap-3">
                                <div
                                    className={`text-[18px] font-black w-14 h-14 rounded-full flex items-center justify-center border-4 ${
                                        score >= 80
                                            ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                                            : score >= 50
                                            ? "border-amber-500 bg-amber-50 text-amber-700"
                                            : "border-red-500 bg-red-50 text-red-700"
                                    }`}
                                    style={{ fontFamily: M }}
                                >
                                    {score}%
                                </div>
                                <div>
                                    <span className="font-bold text-[14px] text-[#1b1c1c] block" style={{ fontFamily: M }}>
                                        {score >= 80 ? "High Commercial Readiness" : score >= 50 ? "Moderate Readiness (Review Gaps)" : "Critical Specification Gaps Detected"}
                                    </span>
                                    <span className="text-[12px] text-[#4d4634]" style={{ fontFamily: I }}>
                                        {issues.length === 0 ? "No critical specification defects identified." : `Found ${issues.length} item(s) requiring attention before sourcing.`}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="px-3 py-1 bg-white rounded-lg border border-[rgba(208,198,174,0.3)] text-[11px] text-[#4d4634] font-semibold">
                                    {issues.filter(i => i.severity === 'error').length} Errors
                                </span>
                                <span className="px-3 py-1 bg-white rounded-lg border border-[rgba(208,198,174,0.3)] text-[11px] text-[#4d4634] font-semibold">
                                    {issues.filter(i => i.severity === 'warning').length} Warnings
                                </span>
                            </div>
                        </div>

                        {/* Issues Grid */}
                        {issues.length > 0 && (
                            <div className="mb-5">
                                <span className="text-[11px] font-bold uppercase tracking-wider text-[#4d4634] block mb-2" style={{ fontFamily: M }}>
                                    Required Actions & Specification Gaps:
                                </span>
                                <div className="space-y-2">
                                    {issues.map((item, idx) => (
                                        <div
                                            key={idx}
                                            className={`p-3.5 rounded-xl border flex items-start justify-between gap-3 ${
                                                item.severity === "error"
                                                    ? "bg-red-50/70 border-red-200 text-red-900"
                                                    : "bg-amber-50/70 border-amber-200 text-amber-900"
                                            }`}
                                        >
                                            <div className="flex items-start gap-2.5">
                                                {item.severity === "error" ? (
                                                    <ShieldAlert size={16} className="text-red-500 shrink-0 mt-0.5" />
                                                ) : (
                                                    <AlertTriangle size={16} className="text-amber-500 shrink-0 mt-0.5" />
                                                )}
                                                <div>
                                                    <span className="font-bold text-[13px] block" style={{ fontFamily: M }}>
                                                        {item.label} <span className="text-[11px] font-normal opacity-75">({item.severity.toUpperCase()})</span>
                                                    </span>
                                                    <span className="text-[12px] opacity-90 block mt-0.5" style={{ fontFamily: I }}>
                                                        {item.tip}
                                                    </span>
                                                </div>
                                            </div>

                                            {onFix && (
                                                <button
                                                    onClick={() => onFix(item.field)}
                                                    className="px-3 py-1 bg-white hover:bg-black/5 text-[#1b1c1c] text-[11px] font-bold rounded-lg border shadow-sm flex items-center gap-1 shrink-0"
                                                    style={{ fontFamily: M }}
                                                >
                                                    <span>Fix in Wizard</span>
                                                    <ChevronRight size={13} />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Suggestions */}
                        {suggestions.length > 0 && (
                            <div className="p-4 rounded-xl bg-[linear-gradient(135deg,#fffdf7,#fff8e6)] border border-[#ffd54a]/40">
                                <div className="flex items-center gap-2 mb-2 text-[#735c00] font-bold text-[12px]" style={{ fontFamily: M }}>
                                    <Sparkles size={15} />
                                    <span>AI Strategy & Compliance Recommendations:</span>
                                </div>
                                <ul className="space-y-1.5 pl-2 text-[12px] text-[#4d4634]" style={{ fontFamily: I }}>
                                    {suggestions.map((sug, i) => (
                                        <li key={i} className="flex items-start gap-2">
                                            <span className="text-[#735c00] font-bold">•</span>
                                            <span>{sug}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* AI Commentary */}
                        {report.ai_commentary && (
                            <div className="mt-4 p-4 bg-[#fbf9f9] rounded-xl border border-[rgba(208,198,174,0.2)] text-[12px] text-[#303031] leading-relaxed whitespace-pre-wrap" style={{ fontFamily: I }}>
                                {report.ai_commentary}
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
