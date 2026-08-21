import React, { useState, useEffect, useRef } from "react";
import { X, Send, Sparkles, RefreshCw, Brain, MessageSquare, ArrowRight, ShieldAlert, Cpu } from "lucide-react";
import { I, M } from "../../constants/fonts";
import { askCopilot } from "../../services/aiService";
import { AIMessage } from "./AIMessage";
import { AILoading } from "./AILoading";
import { AIRecommendation } from "./AIRecommendation";
import { AICompare } from "./AICompare";
import { AIProcurementPlan } from "./AIProcurementPlan";
import { AIDocumentPreview } from "./AIDocumentPreview";

const INITIAL_SUGGESTIONS = [
    "Find whey protein raw material suppliers.",
    "Compare the top manufacturers by lead time.",
    "Build a procurement plan for an organic protein bar.",
    "Recommend eco-friendly packaging suppliers.",
    "Find NABL accredited testing labs.",
    "Generate a Bill of Materials (BOM) for whey isolate."
];

export function AIChat({ isOpen, onClose, module = "copilot", initialContext = {} }) {
    const [messages, setMessages] = useState([
        {
            id: 1,
            sender: "ai",
            text: "### 👋 Welcome to SupplyOS Enterprise AI Copilot V2\nI'm your intelligent supply chain partner and operations architect. Powered by Google Gemini and real-time database intelligence, I can:\n\n* 🔍 **Search & Compare** verified marketplace partners across all categories\n* 📊 **Build Procurement Plans** with risk mitigation and timelines\n* 📄 **Generate Business Documents** (RFQs, BOMs, technical spec sheets, QC checklists)\n* 🛡️ **Validate Specifications** against regulatory & GMP compliance\n\nWhat would you like to build or analyze today?",
            execution_time_ms: 12,
            model_version: "v2-copilot"
        }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [lastQuery, setLastQuery] = useState("");
    const [error, setError] = useState(null);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
       // messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [isOpen, messages, loading]);

    if (!isOpen) return null;

    const handleSend = async (questionText) => {
        const q = questionText || input;
        if (!q.trim() || loading) return;

        setError(null);
        setLastQuery(q);
        setInput("");

        const userMsg = { id: Date.now(), sender: "user", text: q };
        setMessages((prev) => [...prev, userMsg]);
        setLoading(true);

        try {
            const data = await askCopilot({ 
                question: q, 
                module: module || "copilot",
                context: initialContext || {} 
            });

            const aiMsg = {
                id: Date.now() + 1,
                sender: "ai",
                text: data?.answer || "I processed your inquiry against the organization directory.",
                tool_called: data?.tool_called,
                response_type: data?.response_type,
                intent: data?.intent,
                records_used: data?.records_used || [],
                comparison_data: data?.comparison_data,
                rfq_data: data?.rfq_data,
                plan: data?.plan,
                timeline: data?.timeline,
                risks: data?.risks,
                execution_time_ms: data?.execution_time_ms,
                model_version: data?.model_version,
                suggested_follow_ups: data?.suggested_follow_ups || []
            };

            setMessages((prev) => [...prev, aiMsg]);
        } catch (err) {
            console.error("AI Copilot request failed:", err);
            setError("Unable to complete request due to network or server timeout.");
            setMessages((prev) => [
                ...prev,
                {
                    id: Date.now() + 1,
                    sender: "ai",
                    text: "⚠️ **Connection Error**: I could not connect to the SupplyOS Copilot engine. Please verify your connection or retry shortly."
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const latestMessage = messages[messages.length - 1];
    const followUps = latestMessage?.suggested_follow_ups || (messages.length === 1 ? INITIAL_SUGGESTIONS : []);

    return (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs transition-opacity duration-300">
            <div className="w-full max-w-3xl bg-[#f8f7f2] h-full shadow-2xl flex flex-col border-l border-[rgba(208,198,174,0.4)] animate-in slide-in-from-right duration-300">
                
                {/* Drawer Header */}
                <div className="px-6 py-4 bg-[#fffefb] border-b border-[rgba(208,198,174,0.35)] flex items-center justify-between shadow-xs">
                    <div className="flex items-center gap-3">
                        <div className="size-11 rounded-2xl flex items-center justify-center border border-[rgba(255,213,74,0.6)] shadow-sm bg-[linear-gradient(135deg,#1b1c1c,#272828)] text-[#ffd54a]">
                            <Cpu size={22} />
                        </div>
                        <div>
                            <h2 className="text-[17px] font-black text-[#1a1a1b] flex items-center gap-2" style={{ fontFamily: M }}>
                                HELLO WORLD <span className="text-[11px] font-black bg-[linear-gradient(135deg,#ffd54a,#f59e0b)] text-[#1b1c1c] px-2.5 py-0.5 rounded-full uppercase shadow-2xs">V2 PRO</span>
                            </h2>
                            <p className="text-[12px] text-[#5e543c] font-medium flex items-center gap-1.5" style={{ fontFamily: I }}>
                                <span>Zero-Hallucination DB Scoping</span> • <span>Google Gemini Engine</span>
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="size-9 rounded-xl hover:bg-[#e8e4d8] text-[#544d3a] flex items-center justify-center transition duration-150 cursor-pointer"
                        title="Close AI Copilot"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Messages Feed */}
                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4" style={{ scrollbarWidth: "thin" }}>
                    {messages.map((msg) => {
                        const isPlan = msg.response_type === "procurement_plan" || (msg.plan && Object.keys(msg.plan).length > 0);
                        const isDoc = msg.response_type === "document" && msg.text && msg.sender === "ai" && msg.id !== 1;
                        const isCompare = msg.comparison_data;
                        const hasPartners = !isCompare && !isPlan && !isDoc && msg.records_used && msg.records_used.length > 0;

                        return (
                            <div key={msg.id} className="space-y-3">
                                {/* Base text message */}
                                <AIMessage message={msg} />
                                
                                {/* Render Procurement Plan if applicable */}
                                {isPlan && (
                                    <AIProcurementPlan planData={msg} />
                                )}

                                {/* Render Document Preview if applicable */}
                                {isDoc && (
                                    <AIDocumentPreview content={msg.text} documentType={msg.intent} title="Generated Industrial Document" />
                                )}

                                {/* Render comparative matrix if available */}
                                {isCompare && (
                                    <AICompare comparisonData={msg.comparison_data} />
                                )}

                                {/* Render partner cards if records exist */}
                                {hasPartners && (
                                    <AIRecommendation records={msg.records_used} />
                                )}
                            </div>
                        );
                    })}

                    {loading && (
                        <div className="my-4 pr-6">
                            <AILoading />
                        </div>
                    )}

                    {error && (
                        <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#fff0f0] border border-[#ffccd2] text-[#b91c1c] my-3">
                            <span className="text-[13px] font-semibold flex items-center gap-2" style={{ fontFamily: I }}>
                                <ShieldAlert size={16} /> Request failed. Check server status.
                            </span>
                            <button
                                onClick={() => handleSend(lastQuery)}
                                className="px-3 py-1 bg-white text-[#b91c1c] text-[12px] font-bold rounded-lg border border-[#ffccd2] shadow-xs flex items-center gap-1 hover:bg-[#ffe3e6] transition"
                            >
                                <RefreshCw size={12} className="animate-spin" /> Retry
                            </button>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Suggested Prompt Chips */}
                {followUps.length > 0 && !loading && (
                    <div className="px-6 py-3 bg-[#f5f2eb]/90 border-t border-[rgba(208,198,174,0.3)] flex flex-wrap gap-2">
                        <span className="text-[11.5px] font-bold text-[#6a6147] w-full flex items-center gap-1 mb-0.5" style={{ fontFamily: M }}>
                            💡 Suggested AI Actions & Inquiries:
                        </span>
                        {followUps.map((suggestion, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleSend(suggestion)}
                                className="text-[12px] font-medium text-[#3b82f6] bg-[#fffcf5] border border-[rgba(208,198,174,0.4)] px-3 py-1.5 rounded-xl hover:border-[#3b82f6] hover:bg-[#eff6ff] transition flex items-center gap-1 shadow-2xs cursor-pointer"
                                style={{ fontFamily: I }}
                            >
                                <span>{suggestion}</span>
                                <ArrowRight size={12} className="text-[#3b82f6]/70" />
                            </button>
                        ))}
                    </div>
                )}

                {/* Input Bar */}
                <div className="p-4 bg-[#fffefb] border-t border-[rgba(208,198,174,0.35)]">
                    <div className="flex items-center gap-2 max-w-full bg-[#f9f8f4] rounded-2xl border border-[rgba(208,198,174,0.5)] px-4 py-2.5 shadow-inner focus-within:border-[#ffd54a] focus-within:ring-2 focus-within:ring-[#ffd54a]/30 transition">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Ask Copilot to build procurement plans, compare partners, or draft BOMs..."
                            className="flex-1 bg-transparent border-none text-[13.5px] text-[#1b1b1b] placeholder:text-[#8c826b] focus:outline-hidden"
                            style={{ fontFamily: I }}
                        />
                        <button
                            onClick={() => handleSend()}
                            disabled={!input.trim() || loading}
                            className={`size-10 rounded-xl flex items-center justify-center shrink-0 transition duration-200 shadow-sm ${
                                input.trim() && !loading
                                    ? "bg-[linear-gradient(135deg,#1b1c1c,#303031)] hover:brightness-110 text-[#ffd54a] cursor-pointer"
                                    : "bg-[#e2ddd1] text-[#9a907a] cursor-not-allowed"
                            }`}
                        >
                            <Send size={16} />
                        </button>
                    </div>
                    <p className="text-[11px] text-center text-[#8e846d] mt-2 font-medium" style={{ fontFamily: I }}>
                        🔒 Enterprise AI Copilot is organization-scoped. All actions interact exclusively with your tenant's master data.
                    </p>
                </div>
            </div>
        </div>
    );
}
