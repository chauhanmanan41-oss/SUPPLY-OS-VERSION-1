import React from "react";
import { Brain, User, Clock, Database, Zap, FileText } from "lucide-react";
import { I, M } from "../../constants/fonts";

export function AIMessage({ message }) {
    const isUser = message.sender === "user";

    // Lightweight markdown line-by-line renderer
    const renderFormattedText = (text) => {
        if (!text) return null;
        const lines = text.split("\n");
        return lines.map((line, idx) => {
            const trimmed = line.trim();
            if (!trimmed) return <div key={idx} className="h-2" />;

            if (trimmed.startsWith("### ")) {
                return (
                    <h3 key={idx} className="text-[15px] font-bold text-[#1b1c1c] mt-2 mb-1.5 flex items-center gap-1.5 border-b border-[rgba(208,198,174,0.2)] pb-1" style={{ fontFamily: M }}>
                        {trimmed.replace("### ", "")}
                    </h3>
                );
            }
            if (trimmed.startsWith("#### ")) {
                return (
                    <h4 key={idx} className="text-[14px] font-bold text-[#3d3828] mt-2 mb-1" style={{ fontFamily: M }}>
                        {trimmed.replace("#### ", "")}
                    </h4>
                );
            }
            if (trimmed.startsWith("* ") || trimmed.startsWith("- ")) {
                const content = trimmed.substring(2);
                return (
                    <div key={idx} className="flex items-start gap-2 text-[13px] text-[#3d3828] my-1 leading-relaxed pl-1" style={{ fontFamily: I }}>
                        <span className="text-[#3b82f6] font-bold mt-0.5">•</span>
                        <span>{renderInlineText(content)}</span>
                    </div>
                );
            }
            if (trimmed.startsWith("> ")) {
                return (
                    <div key={idx} className="bg-[#f0ece1]/60 border-l-4 border-[#3b82f6] px-3 py-2 my-2 rounded-r-lg text-[12.5px] text-[#544d3a] italic font-medium" style={{ fontFamily: I }}>
                        {renderInlineText(trimmed.replace("> ", ""))}
                    </div>
                );
            }
            return (
                <p key={idx} className="text-[13px] text-[#2c2b29] leading-relaxed my-1" style={{ fontFamily: I }}>
                    {renderInlineText(trimmed)}
                </p>
            );
        });
    };

    const renderInlineText = (str) => {
        // Handle simple bold **text** and code `text` formatting
        const parts = str.split(/(\*\*.*?\*\*|`.*?`)/g);
        return parts.map((part, index) => {
            if (part.startsWith("**") && part.endsWith("**")) {
                return <strong key={index} className="font-extrabold text-[#111212]" style={{ fontFamily: M }}>{part.slice(2, -2)}</strong>;
            }
            if (part.startsWith("`") && part.endsWith("`")) {
                return <code key={index} className="bg-[#edeae1] text-[#735c00] font-mono font-bold px-1.5 py-0.5 rounded text-[11.5px] border border-[rgba(208,198,174,0.35)]">{part.slice(1, -1)}</code>;
            }
            return part;
        });
    };

    if (isUser) {
        return (
            <div className="flex items-start justify-end gap-2.5 my-3 pl-10">
                <div className="bg-[#303031] text-white px-4 py-3 rounded-2xl rounded-tr-xs shadow-sm max-w-[85%]">
                    <p className="text-[13.5px] font-medium leading-relaxed text-white/95" style={{ fontFamily: I }}>
                        {message.text}
                    </p>
                </div>
                <div className="size-8 rounded-xl bg-[#e5e1d5] flex items-center justify-center shrink-0 mt-1 shadow-xs border border-[rgba(208,198,174,0.3)]">
                    <User size={15} className="text-[#4d4634]" />
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-start gap-3 my-4 pr-6">
            <div className="size-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 shadow-sm border border-[rgba(255,213,74,0.5)]" style={{ background: "linear-gradient(135deg, rgba(255,213,74,0.25) 0%, rgba(59,130,246,0.15) 100%)" }}>
                <Brain size={18} className="text-[#735c00]" />
            </div>
            <div className="flex-1 min-w-0 bg-white border border-[rgba(208,198,174,0.3)] rounded-2xl rounded-tl-xs p-4 shadow-sm">
                <div className="flex items-center justify-between border-b border-[rgba(208,198,174,0.15)] pb-2 mb-2">
                    <span className="text-[12.5px] font-extrabold text-[#1b1c1c] flex items-center gap-1.5" style={{ fontFamily: M }}>
                        <Zap size={13} className="fill-[#16a34a] text-[#16a34a]" /> SupplyOS Gemini Advisor
                    </span>
                    {message.execution_time_ms !== undefined && (
                        <span className="text-[11px] font-bold text-[#16a34a] bg-[#16a34a]/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Clock size={11} /> {message.execution_time_ms}ms
                        </span>
                    )}
                </div>

                <div className="prose prose-sm max-w-none text-[#2d2b24]">
                    {renderFormattedText(message.text)}
                </div>

                {message.records_used && message.records_used.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-[rgba(208,198,174,0.2)] flex items-center justify-between">
                        <span className="text-[11px] text-[#5e543c] font-semibold flex items-center gap-1.5" style={{ fontFamily: I }}>
                            <Database size={12} className="text-[#3b82f6]" /> {message.records_used.length} organization records evaluated
                        </span>
                        {message.tool_called && (
                            <span className="text-[11px] font-mono text-[#735c00] bg-[#fff8e7] px-2 py-0.5 rounded border border-[#ffe9b1]">
                                tool: {message.tool_called}
                            </span>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
