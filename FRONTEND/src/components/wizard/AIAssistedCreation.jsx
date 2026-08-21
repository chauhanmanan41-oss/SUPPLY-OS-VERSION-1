import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import {
  Sparkles, ArrowLeft, Send, Check, X, Package, Layers,
  ShieldCheck, Truck, Database, ChevronRight, Loader2,
  Bot, User, CheckCircle2, AlertCircle, Zap, Plus, CheckSquare, Square
} from "lucide-react";
import { startArchitectSession, sendArchitectMessage, createArchitectWorkspace } from "../../services/aiService";
import { I, M } from "../../constants/fonts";

function SpecBadge({ label, value }) {
  if (!value || value === "N/A" || value === "") return null;
  return (
    <div className="flex items-center gap-1.5 bg-[#1b1c1c]/5 rounded-lg px-2.5 py-1.5 text-xs">
      <span className="text-gray-500 font-medium">{label}:</span>
      <span className="text-[#1b1c1c] font-semibold truncate max-w-[150px]">{String(value)}</span>
    </div>
  );
}

export function AIAssistedCreation({ onBack, onClose }) {
  const navigate = useNavigate();
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [starting, setStarting] = useState(true);
  const [specs, setSpecs] = useState({});
  const [phase, setPhase] = useState("greeting");
  const [isComplete, setIsComplete] = useState(false);
  const [confidence, setConfidence] = useState(0);
  const [creatingWorkspace, setCreatingWorkspace] = useState(false);
  
  // State for interactive checkbox module selection
  const [selectedChips, setSelectedChips] = useState([]);

  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (!loading && !starting) inputRef.current?.focus();
  }, [loading, starting]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await startArchitectSession();
        if (cancelled) return;
        setSessionId(res.session_id);
        setMessages([{
          role: "ai",
          content: res.message,
          selectable_modules: res.selectable_modules,
          default_selected: res.default_selected,
          action_buttons: res.action_buttons
        }]);
        setPhase(res.phase || "product_basics");
        if (res.default_selected) setSelectedChips(res.default_selected);
      } catch (e) {
        toast.error("Failed to start AI Architect session.");
        console.error(e);
      } finally {
        if (!cancelled) setStarting(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const handleSend = async (customText = null) => {
    const text = (customText != null ? customText : input).trim();
    if (!text || loading || !sessionId) return;

    if (customText == null) setInput("");
    setMessages(prev => [...prev, { role: "user", content: text }]);
    setLoading(true);

    try {
      const res = await sendArchitectMessage(sessionId, text);
      setMessages(prev => [...prev, {
        role: "ai",
        content: res.message,
        selectable_modules: res.selectable_modules,
        default_selected: res.default_selected,
        action_buttons: res.action_buttons
      }]);
      if (res.collected_specs) setSpecs(res.collected_specs);
      if (res.phase) setPhase(res.phase);
      if (res.confidence != null) setConfidence(res.confidence);
      if (res.is_complete) setIsComplete(true);
      if (res.default_selected) {
        setSelectedChips(res.default_selected);
      } else if (res.collected_specs?.selected_modules) {
        setSelectedChips(res.collected_specs.selected_modules);
      }
    } catch (e) {
      toast.error("Failed to send message. Please try again.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWorkspace = async () => {
    if (!sessionId) return;
    setCreatingWorkspace(true);
    try {
      const res = await createArchitectWorkspace(sessionId);
      toast.success(`Workspace "${res.workspace?.name || 'Product'}" created!`);
      if (res.product_id) {
        navigate(`/workspace/${res.product_id}`);
      }
      if (onClose) onClose();
    } catch (e) {
      toast.error("Failed to create workspace. Please try again.");
      console.error(e);
    } finally {
      setCreatingWorkspace(false);
    }
  };

  const toggleChip = (modName) => {
    setSelectedChips(prev => 
      prev.includes(modName) ? prev.filter(x => x !== modName) : [...prev, modName]
    );
  };

  const suggestions = [
    "Whey Protein Isolate Powder",
    "5G OLED Android Smartphone",
    "100% Organic Cotton T-Shirt",
    "Sulfate-Free Botanical Shampoo",
    "Solid Teak Hardwood Chair"
  ];

  const specKeys = Object.entries(specs).filter(([k, v]) => v && v !== "" && v !== "N/A" && k !== "selected_modules");
  const selectedModulesList = specs.selected_modules || [];

  const specLabels = {
    product_name: "Product",
    category: "Category",
    subcategory: "Sub-Category",
    target_market: "Market",
    monthly_production: "Volume",
    budget: "Budget",
    certifications: "Certs",
    packaging: "Packaging",
    country: "Country",
    priority: "Priority",
    description: "Description",
    industry: "Industry",
    shelf_life: "Shelf Life",
    storage: "Storage",
  };

  return (
    <div className="flex flex-col h-screen bg-[#f7f5ef] text-[#1b1c1c]">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="bg-[#1b1c1c] text-white px-6 py-4 flex items-center justify-between shrink-0 shadow-md">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="size-9 rounded-full bg-white/10 hover:bg-white/20 transition flex items-center justify-center"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-gradient-to-br from-[#ffd54a] to-[#e5b300] flex items-center justify-center shadow-inner">
              <Sparkles size={22} className="text-[#1b1c1c]" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold tracking-tight" style={{ fontFamily: M }}>
                AI Product Architect & Consultant
              </h2>
              <p className="text-xs text-[#ffd54a] font-semibold" style={{ fontFamily: I }}>
                {phase === "review" ? "Review & Finalize Modular Workspace" : "Requirement Discovery & B2B Analysis"}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {confidence > 0 && (
            <div className="flex items-center gap-2 bg-white/10 rounded-full px-3 py-1.5 border border-white/10">
              <Zap size={14} className="text-[#ffd54a]" />
              <span className="text-xs font-bold" style={{ fontFamily: M }}>
                {Math.round(confidence * 100)}% Readiness
              </span>
            </div>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="size-9 rounded-full bg-white/10 hover:bg-white/20 transition flex items-center justify-center"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {/* ── Main body ──────────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">
        {/* ── Chat Panel ───────────────────────────────────────────────── */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
            {starting && (
              <div className="flex items-center justify-center py-20">
                <Loader2 size={32} className="animate-spin text-[#e5b300]" />
                <span className="ml-3 text-sm text-gray-500 font-medium">Initializing Senior Manufacturing Consultant...</span>
              </div>
            )}

            {messages.map((msg, i) => {
              const isLastMessage = (i === messages.length - 1);
              return (
                <div key={i} className="space-y-3">
                  <div className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    {msg.role === "ai" && (
                      <div className="size-8 rounded-full bg-gradient-to-br from-[#ffd54a] to-[#e5b300] flex items-center justify-center shrink-0 mt-1 shadow">
                        <Bot size={16} className="text-[#1b1c1c]" />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] rounded-2xl px-5 py-4 text-sm leading-relaxed shadow-sm ${
                        msg.role === "user"
                          ? "bg-[#1b1c1c] text-white rounded-br-md font-medium"
                          : "bg-white border border-[rgba(208,198,174,0.4)] text-[#1b1c1c] rounded-bl-md"
                      }`}
                      style={{ fontFamily: I, whiteSpace: "pre-wrap" }}
                    >
                      {msg.content}

                      {/* Render Interactive Module Chips for AI message */}
                      {msg.role === "ai" && msg.selectable_modules && isLastMessage && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <p className="text-xs font-bold text-gray-600 mb-3" style={{ fontFamily: M }}>
                            Select the supply chain modules your workspace requires:
                          </p>
                          <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto p-1 bg-gray-50 rounded-xl border border-gray-200">
                            {msg.selectable_modules.map((mod) => {
                              const checked = selectedChips.includes(mod);
                              return (
                                <button
                                  key={mod}
                                  type="button"
                                  onClick={() => toggleChip(mod)}
                                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-left transition ${
                                    checked
                                      ? "bg-[#1b1c1c] text-white shadow"
                                      : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                                  }`}
                                >
                                  {checked ? <CheckSquare size={14} className="text-[#ffd54a] shrink-0" /> : <Square size={14} className="text-gray-400 shrink-0" />}
                                  <span className="truncate">{mod}</span>
                                </button>
                              );
                            })}
                          </div>
                          <div className="flex gap-2 mt-3">
                            <button
                              type="button"
                              onClick={() => setSelectedChips([...msg.selectable_modules])}
                              className="text-xs font-semibold text-gray-500 hover:text-[#1b1c1c] underline"
                            >
                              Select All
                            </button>
                            <span className="text-gray-300">|</span>
                            <button
                              type="button"
                              onClick={() => setSelectedChips(["Raw Material Suppliers", "Contract Manufacturer", "Packaging Supplier"])}
                              className="text-xs font-semibold text-gray-500 hover:text-[#1b1c1c] underline"
                            >
                              Reset Defaults
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Render Action Buttons / Quick Replies */}
                      {msg.role === "ai" && msg.action_buttons && isLastMessage && (
                        <div className="mt-4 pt-3 border-t border-gray-100 flex flex-wrap gap-2">
                          {msg.action_buttons.map((btn, btnIdx) => (
                            <button
                              key={btnIdx}
                              type="button"
                              onClick={() => {
                                if (btn === "Submit Selected Modules" || btn.includes("Submit Selected")) {
                                  handleSend(selectedChips.join(", "));
                                } else if (btn === "Select All Modules") {
                                  if (msg.selectable_modules) setSelectedChips([...msg.selectable_modules]);
                                  handleSend("Select All Modules");
                                } else if (btn === "Create Workspace Now" || btn === "1. Create Workspace") {
                                  handleCreateWorkspace();
                                } else {
                                  handleSend(btn);
                                }
                              }}
                              className={`px-4 py-2 rounded-xl text-xs font-extrabold shadow transition flex items-center gap-1.5 ${
                                btn.includes("Create Workspace") || btn.includes("Yes") || btn.includes("Continue") || btn.includes("Submit") || btn.includes("Select All")
                                  ? "bg-gradient-to-r from-[#e5b300] to-[#ffd54a] text-[#1b1c1c] hover:opacity-90"
                                  : "bg-[#1b1c1c]/5 hover:bg-[#1b1c1c]/10 text-[#1b1c1c] border border-[rgba(208,198,174,0.5)]"
                              }`}
                              style={{ fontFamily: M }}
                            >
                              {btn.includes("Create Workspace") && <Sparkles size={13} />}
                              {btn}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    {msg.role === "user" && (
                      <div className="size-8 rounded-full bg-[#1b1c1c] flex items-center justify-center shrink-0 mt-1">
                        <User size={16} className="text-white" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {loading && (
              <div className="flex gap-3 justify-start">
                <div className="size-8 rounded-full bg-gradient-to-br from-[#ffd54a] to-[#e5b300] flex items-center justify-center shrink-0 mt-1">
                  <Bot size={16} className="text-[#1b1c1c]" />
                </div>
                <div className="bg-white border border-[rgba(208,198,174,0.3)] rounded-2xl rounded-bl-md px-5 py-3.5 shadow-sm">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <span className="size-2 bg-[#e5b300] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="size-2 bg-[#e5b300] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="size-2 bg-[#e5b300] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                    <span className="text-xs text-gray-400 font-medium ml-2">Consultant is analyzing market intelligence...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Quick suggestions */}
          {messages.length <= 1 && !loading && !starting && (
            <div className="px-6 pb-3">
              <p className="text-xs text-gray-400 mb-2 font-medium" style={{ fontFamily: I }}>Domain inspiration options:</p>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => { setInput(s); }}
                    className="text-xs bg-white border border-[rgba(208,198,174,0.4)] rounded-full px-3.5 py-1.5 text-gray-700 hover:bg-[#1b1c1c] hover:text-white hover:border-transparent transition font-semibold shadow-2xs"
                    style={{ fontFamily: I }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input bar */}
          <div className="border-t border-[rgba(208,198,174,0.3)] bg-white px-6 py-4 shrink-0 shadow-lg">
            {isComplete && !creatingWorkspace ? (
              <div className="flex gap-3">
                <button
                  onClick={handleCreateWorkspace}
                  className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-[#e5b300] to-[#ffd54a] text-[#1b1c1c] rounded-xl py-3.5 font-extrabold text-sm hover:shadow-lg transition"
                  style={{ fontFamily: M }}
                >
                  <Sparkles size={18} />
                  Create Modular Workspace Now
                </button>
                <button
                  onClick={() => { setIsComplete(false); }}
                  className="px-5 py-3.5 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition"
                  style={{ fontFamily: M }}
                >
                  Continue Editing
                </button>
              </div>
            ) : creatingWorkspace ? (
              <div className="flex items-center justify-center gap-3 py-3">
                <Loader2 size={20} className="animate-spin text-[#e5b300]" />
                <span className="text-sm font-bold text-gray-600" style={{ fontFamily: M }}>
                  Building your modular manufacturing workspace...
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                  placeholder="Reply or click action buttons above..."
                  disabled={loading || starting}
                  className="flex-1 bg-[#f7f5ef] border border-[rgba(208,198,174,0.4)] rounded-xl px-4 py-3 text-sm font-medium placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#e5b300]/30 focus:border-[#e5b300] transition disabled:opacity-50"
                  style={{ fontFamily: I }}
                />
                <button
                  onClick={() => handleSend()}
                  disabled={!input.trim() || loading || starting}
                  className="size-11 rounded-xl bg-[#1b1c1c] hover:bg-[#e5b300] text-white hover:text-[#1b1c1c] flex items-center justify-center transition disabled:opacity-30 disabled:hover:bg-[#1b1c1c] disabled:hover:text-white"
                >
                  <Send size={18} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── Specs Sidebar ────────────────────────────────────────────── */}
        <div className="w-80 border-l border-[rgba(208,198,174,0.3)] bg-white overflow-y-auto shrink-0 hidden lg:block">
          <div className="p-5">
            <h3 className="text-sm font-extrabold text-[#1b1c1c] mb-4 flex items-center gap-2" style={{ fontFamily: M }}>
              <Database size={16} className="text-[#e5b300]" />
              Discovered Requirements
            </h3>

            {specKeys.length === 0 ? (
              <div className="text-center py-8">
                <div className="size-12 rounded-xl bg-[#f7f5ef] flex items-center justify-center mx-auto mb-3 border border-dashed border-gray-300">
                  <Package size={24} className="text-gray-300" />
                </div>
                <p className="text-xs text-gray-400 font-medium" style={{ fontFamily: I }}>
                  Specifications will appear here as the consultant analyzes your responses.
                </p>
              </div>
            ) : (
              <div className="space-y-2 mb-6">
                {specKeys.map(([key, val]) => (
                  <SpecBadge
                    key={key}
                    label={specLabels[key] || key.replace(/_/g, " ")}
                    value={Array.isArray(val) ? val.join(", ") : val}
                  />
                ))}
              </div>
            )}

            {/* Selected Modules Display */}
            {selectedModulesList.length > 0 && (
              <div className="mb-6 pt-4 border-t border-gray-100">
                <h4 className="text-xs font-extrabold text-gray-600 uppercase tracking-wider mb-2.5 flex items-center gap-1.5" style={{ fontFamily: M }}>
                  <Layers size={13} className="text-[#e5b300]" />
                  Active Modules ({selectedModulesList.length})
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedModulesList.map((mod) => (
                    <span key={mod} className="bg-green-50 border border-green-200 text-green-800 text-[11px] font-semibold px-2 py-1 rounded-md">
                      ✓ {mod}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Phase indicator */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3" style={{ fontFamily: M }}>
                Consultation Roadmap
              </h4>
              <div className="space-y-2">
                {[
                  { key: "product_basics", label: "Product Basics", icon: Package },
                  { key: "select_modules", label: "Service Selection", icon: Layers },
                  { key: "check_missing", label: "Compliance Check", icon: ShieldCheck },
                  { key: "domain_questions", label: "Domain Parameters", icon: Database },
                  { key: "requirement_summary", label: "Specification Approval", icon: CheckCircle2 },
                  { key: "marketplace_analysis", label: "B2B Market Scan", icon: Truck },
                  { key: "review", label: "Review & Create", icon: CheckCircle2 },
                ].map(({ key, label }) => {
                  const phases = ["product_basics", "select_modules", "check_missing", "domain_questions", "requirement_summary", "marketplace_analysis", "review"];
                  const currentIdx = phases.indexOf(phase);
                  const itemIdx = phases.indexOf(key);
                  const isDone = itemIdx < currentIdx && itemIdx !== -1;
                  const isCurrent = key === phase;

                  if (itemIdx === -1 && key !== "review") return null;

                  return (
                    <div
                      key={key}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition ${
                        isCurrent
                          ? "bg-[#ffd54a]/15 text-[#b38600] border border-[#e5b300]/30 shadow-2xs"
                          : isDone
                          ? "text-green-700 bg-green-50"
                          : "text-gray-400"
                      }`}
                    >
                      {isDone ? (
                        <CheckCircle2 size={14} className="text-green-500 shrink-0" />
                      ) : isCurrent ? (
                        <div className="size-3.5 rounded-full border-2 border-[#e5b300] bg-[#ffd54a] animate-pulse shrink-0" />
                      ) : (
                        <div className="size-3.5 rounded-full border border-gray-300 shrink-0" />
                      )}
                      <span style={{ fontFamily: I }}>{label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Confidence meter */}
            {confidence > 0 && (
              <div className="mt-6 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-bold text-gray-500" style={{ fontFamily: M }}>Workspace Readiness</span>
                  <span className="font-extrabold text-[#b38600]" style={{ fontFamily: M }}>
                    {Math.round(confidence * 100)}%
                  </span>
                </div>
                <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
                  <div
                    className="h-full bg-gradient-to-r from-[#e5b300] to-[#ffd54a] rounded-full transition-all duration-700 shadow-inner"
                    style={{ width: `${Math.min(confidence * 100, 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AIAssistedCreation;
