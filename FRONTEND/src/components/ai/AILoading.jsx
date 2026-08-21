import React, { useState, useEffect } from "react";
import { Brain, Sparkles } from "lucide-react";
import { I, M } from "../../constants/fonts";

const STEPS = [
    "Interpreting procurement intent...",
    "Querying organization Postgres records...",
    "Applying multi-tenant isolation rules...",
    "Consulting Google Gemini model...",
    "Structuring factual recommendations..."
];

export function AILoading() {
    const [stepIndex, setStepIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setStepIndex((prev) => (prev + 1) % STEPS.length);
        }, 1800);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="flex items-start gap-3 p-4 rounded-2xl bg-[#f9f8f4] border border-[rgba(208,198,174,0.25)] shadow-sm animate-pulse">
            <div className="size-9 rounded-xl flex items-center justify-center shrink-0 shadow-xs" style={{ background: "linear-gradient(135deg, rgba(59,130,246,0.15) 0%, rgba(168,85,247,0.15) 100%)", border: "1px solid rgba(168,85,247,0.3)" }}>
                <Sparkles size={18} className="text-[#9333ea] animate-spin" style={{ animationDuration: "3s" }} />
            </div>
            <div className="flex-1 min-w-0 py-1">
                <p className="text-[13.5px] font-bold text-[#1b1c1c] flex items-center gap-2" style={{ fontFamily: M }}>
                    SupplyOS Copilot Reasoning
                </p>
                <p className="text-[12px] text-[#5e543c] font-medium mt-1 transition-all duration-300" style={{ fontFamily: I }}>
                    ⚡ {STEPS[stepIndex]}
                </p>
            </div>
        </div>
    );
}
