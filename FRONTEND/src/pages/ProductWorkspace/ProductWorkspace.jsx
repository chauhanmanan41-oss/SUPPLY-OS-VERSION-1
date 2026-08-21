import React, { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { toast } from "sonner";
import { motion } from "motion/react";
import { TrendingUp, Brain, ChevronRight, AlertTriangle, CheckCircle, Clock, Shield, Users, Activity, DollarSign, Copy, Download, Sparkles, Globe, Package, Check, Plus, Layers, Truck, FileText, AlertCircle, RefreshCw } from "lucide-react";
import { Badge } from "../../components/common/Badge";
import { ProgressRing } from "../../components/common/ProgressRing";
import { Sparkline } from "../../components/common/Sparkline";
import { WsAdvisor } from "../../components/workspace/WsAdvisor";
import { WsFinancial } from "../../components/workspace/WsFinancial";
import { WsKanban } from "../../components/workspace/WsKanban";
import { WsMilestones } from "../../components/workspace/WsMilestones";
import { WsSupplyChain } from "../../components/workspace/WsSupplyChain";
import { useApi } from "../../hooks/useApi";
import { approveWorkspacePartner, runWorkspaceAIAction } from "../../services/productService";
import { I, M } from "../../constants/fonts";
import { WS_ACTIVITY, WS_LIFECYCLE, WS_TABS } from "../../constants/workspace";

export function ProductWorkspacePage({ productId, onClose }) {
  const { workspaceId } = useParams();
  const navigate = useNavigate();
  const targetId = productId || workspaceId;
  const { data: product, loading, error, refetch } = useApi(targetId ? `/products/${targetId}/workspace/` : null, { immediate: !!targetId });
  const [activeTab, setActiveTab] = useState("Overview");
  const [aiLoading, setAiLoading] = useState(false);

  const handleClose = () => {
    if (onClose) onClose();
    else navigate("/projects");
  };

  const handleApprovePartner = async (partnerId, category) => {
    try {
      await approveWorkspacePartner(product.id, partnerId, category);
      toast.success("Partner officially approved and aligned with this workspace!");
      if (refetch) refetch();
    } catch (err) {
      toast.error(err?.message || "Failed to approve partner.");
    }
  };

  const handleRunAIAction = async (actionName, extra = {}) => {
    setAiLoading(true);
    try {
      await runWorkspaceAIAction(product.id, actionName, extra);
      toast.success("AI intelligence execution finished!");
      if (refetch) refetch();
    } catch (err) {
      toast.error(err?.message || "AI action encountered an issue.");
    } finally {
      setAiLoading(false);
    }
  };

  if (loading || !product) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#fbf9f9]">
        <div className="flex flex-col items-center gap-4">
          <div className="size-10 border-[3px] border-[#303031]/20 border-t-[#303031] rounded-full animate-spin" />
          <p className="text-[14px] text-[#4d4634] font-semibold" style={{ fontFamily: I }}>Loading real-time workspace…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#fbf9f9]">
        <div className="flex flex-col items-center gap-4 text-center max-w-md">
          <p className="text-4xl">⚠️</p>
          <p className="text-[16px] font-bold text-[#1b1c1c]" style={{ fontFamily: M }}>Failed to load workspace</p>
          <p className="text-[13px] text-[#4d4634]" style={{ fontFamily: I }}>Could not fetch isolated database records. Please return to project explorer.</p>
          <button onClick={handleClose} className="px-5 py-2.5 bg-[#303031] text-white text-[13px] font-bold rounded-xl hover:bg-[#1b1c1c] transition" style={{ fontFamily: M }}>
            ← Back to Projects
          </button>
        </div>
      </div>
    );
  }

  // Derive display values from API data
  const stageColor = product.stage === "manufacturing" ? "#a855f7" : product.stage === "planning" || product.stage === "Planning" ? "#3b82f6" : "#eab308";
  const stageBg = product.stage === "manufacturing" ? "rgba(168,85,247,0.1)" : product.stage === "planning" || product.stage === "Planning" ? "rgba(59,130,246,0.1)" : "rgba(234,179,8,0.1)";
  const healthColor = (product.health_score ?? 0) > 80 ? "#16a34a" : (product.health_score ?? 0) > 60 ? "#eab308" : "#ba1a1a";
  const budgetUsedPct = product.budget_used_pct ?? 15;
  const progressPct = product.progress_pct ?? 25;
  const healthScore = product.health_score ?? 96;

  // Build lifecycle steps from API data or fall back to constants
  const lifecycleSteps = (product.lifecycle_steps && product.lifecycle_steps.length > 0)
    ? product.lifecycle_steps.map((s, i) => ({
        label: s.label,
        done: s.is_done,
        active: !s.is_done && (i === 0 || product.lifecycle_steps[i - 1]?.is_done),
      }))
    : WS_LIFECYCLE;

  const recs = product.marketplace_recommendations || {};
  const approved = product.approved_partners || [];
  const bomData = product.raw_materials_data || [];
  const comm = product.commercial_data || {};
  const mfg = product.manufacturing_data || {};
  const whData = product.warehouse_data || {};
  const logData = product.logistics_data || {};
  const qaData = product.quality_data || {};
  const invData = product.inventory_data || {};
  const docData = product.documents_data || [];
  const aiInsights = product.ai_insights || {};

  return (
    <div className="flex flex-1 overflow-hidden">
      <main className="flex-1 overflow-y-auto bg-[#fcfbf9]" style={{ scrollbarWidth: "none" }}>
        <div className="flex flex-col gap-0">
          
          {/* ── Product Header ── */}
          <div className="bg-white border-b border-[rgba(208,198,174,0.25)] px-8 py-6 shadow-xs">
            <div className="flex items-start justify-between gap-5">
              <div className="flex items-start gap-5">
                <div className="size-[72px] rounded-2xl flex items-center justify-center text-4xl shrink-0 border border-[rgba(208,198,174,0.2)] bg-[rgba(59,130,246,0.06)] shadow-xs">
                  {product.emoji || "📦"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <button onClick={handleClose} className="text-[12px] text-[#4d4634] hover:text-[#1b1c1c] transition font-bold flex items-center gap-1" style={{ fontFamily: I }}>
                      ← Back to Explorer
                    </button>
                    <span className="text-[#4d4634]/30">/</span>
                    <span className="text-[12px] font-mono font-semibold px-2 py-0.5 rounded bg-gray-100 text-gray-700">{product.sku || "SKU-PROD"}</span>
                    {product.creation_method === "ai_assisted" && (
                      <span className="bg-[rgba(255,213,74,0.2)] text-[#997700] px-2 py-0.5 rounded text-[11px] font-extrabold flex items-center gap-1">
                        <Sparkles size={11} /> AI GENERATED
                      </span>
                    )}
                  </div>
                  <h1 className="text-[26px] font-extrabold text-[#1b1c1c] leading-none tracking-tight" style={{ fontFamily: M }}>{product.name}</h1>
                  <div className="flex items-center gap-3 mt-2.5 flex-wrap">
                    <span className="text-[13px] text-[#4d4634] font-medium" style={{ fontFamily: I }}>Category: <strong>{product.category || "General"}</strong></span>
                    <span className="text-[#4d4634]/30">·</span>
                    <Badge label={product.stage || "Planning"} color={stageColor} bg={stageBg} />
                    <span className="text-[#4d4634]/30">·</span>
                    <span className="text-[12px] text-[#4d4634] font-medium" style={{ fontFamily: I }}>Launch Target: <strong>{product.estimated_launch || comm.timeline || "TBD"}</strong></span>
                    <span className="text-[#4d4634]/30">·</span>
                    <span className="text-[12px] font-bold" style={{ color: healthColor, fontFamily: I }}>Health Score {healthScore}%</span>
                  </div>
                </div>
              </div>

              {/* Header actions */}
              <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
                <button
                  onClick={() => handleRunAIAction("explain_risks")}
                  disabled={aiLoading}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-bold shadow-sm hover:opacity-90 transition"
                  style={{ background: "#ffd54a", color: "#735c00", fontFamily: M }}
                >
                  <Sparkles size={15} /> {aiLoading ? "AI Computing..." : "Run AI Risk Assessment"}
                </button>
                <button onClick={() => toast.success("Workspace link copied to clipboard!")} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-semibold border border-[rgba(208,198,174,0.35)] text-[#4d4634] hover:bg-[#efeded] transition bg-white" style={{ fontFamily: M }}>
                  <Copy size={14} /> Share Workspace
                </button>
              </div>
            </div>

            {/* Budget & Economics row */}
            <div className="flex items-center gap-8 mt-6 pt-5 border-t border-[rgba(208,198,174,0.2)]">
              <div className="flex items-center gap-6 text-xs text-[#4d4634]">
                <span>Total Budget: <strong className="text-[#1b1c1c] text-sm font-extrabold">₹ / $ {Number(product.budget_total || comm.budget || 500000).toLocaleString()}</strong></span>
                <span>MOQ Target: <strong className="text-[#1b1c1c] font-bold">{comm.moq || "500 units"}</strong></span>
                <span>Target Margin: <strong className="text-emerald-700 font-bold">{comm.margin || "45%"}</strong></span>
              </div>
              <div className="flex items-center gap-3 flex-1 max-w-sm ml-auto">
                <span className="text-xs font-bold text-gray-500 shrink-0">Lifecycle Progress:</span>
                <div className="flex-1 h-2 rounded-full bg-[#efeded] overflow-hidden">
                  <div className="h-full rounded-full bg-[#3b82f6] transition-all duration-500" style={{ width: `${progressPct}%` }} />
                </div>
                <span className="text-xs font-extrabold text-[#3b82f6] shrink-0" style={{ fontFamily: M }}>{progressPct}%</span>
              </div>
            </div>
          </div>

          {/* ── Lifecycle Pipeline ── */}
          <div className="bg-white border-b border-[rgba(208,198,174,0.25)] px-8 py-4">
            <div className="flex items-center gap-0 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
              {lifecycleSteps.map((step, i) => (
                <div key={i} className="flex items-center shrink-0">
                  <motion.div whileHover={{ y: -1 }} className="flex items-center gap-2 px-3.5 py-2 rounded-xl transition cursor-pointer" style={{
                    background: step.active ? "rgba(59,130,246,0.1)" : step.done ? "rgba(22,163,74,0.08)" : "transparent",
                    border: step.active ? "1px solid rgba(59,130,246,0.3)" : "1px solid transparent",
                  }} onClick={() => toast.info(`Phase: ${step.label}`)}>
                    <div className="size-4 rounded-full flex items-center justify-center shrink-0" style={{ background: step.active ? "#3b82f6" : step.done ? "#16a34a" : "rgba(208,198,174,0.4)" }}>
                      {step.done && !step.active ? <CheckCircle size={10} color="white" /> : <div className="size-1.5 rounded-full bg-white" />}
                    </div>
                    <span className="text-xs font-extrabold whitespace-nowrap" style={{ color: step.active ? "#3b82f6" : step.done ? "#16a34a" : "#4d4634", fontFamily: M }}>{step.label}</span>
                  </motion.div>
                  {i < lifecycleSteps.length - 1 && <ChevronRight size={14} className="mx-1 shrink-0 text-gray-300" />}
                </div>
              ))}
            </div>
          </div>

          {/* ── Second Nav Tabs ── */}
          <div className="sticky top-0 z-10 bg-white border-b border-[rgba(208,198,174,0.25)] px-8 shadow-xs">
            <div className="flex items-center gap-2 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
              {WS_TABS.map(t => (
                <button key={t} onClick={() => setActiveTab(t)} className="px-4 py-3.5 text-[13px] font-extrabold whitespace-nowrap border-b-2 transition-all" style={{
                  fontFamily: M,
                  color: activeTab === t ? "#1b1c1c" : "#6d6551",
                  borderBottomColor: activeTab === t ? "#1b1c1c" : "transparent",
                }}>{t}</button>
              ))}
            </div>
          </div>

          {/* ── TAB 1: OVERVIEW ── */}
          {activeTab === "Overview" && (
            <div className="flex flex-col gap-6 p-8 max-w-7xl mx-auto w-full">
              
              {/* KPI Cards */}
              <div className="grid grid-cols-4 gap-4">
                {[
                  { l: "Overall Health", v: `${healthScore}%`, sub: "AI monitored", Ic: Activity, iCol: healthColor, iBg: `${healthColor}18`, spark: [88, 90, 92, 91, 93, 94, healthScore] },
                  { l: "Lifecycle Progress", v: `${progressPct}%`, sub: product.current_milestone || "Supplier Matching", Ic: TrendingUp, iCol: "#3b82f6", iBg: "rgba(59,130,246,0.1)", spark: [0, 5, 10, 15, 20, 25, progressPct] },
                  { l: "Approved Partners", v: `${approved.length}`, sub: `${Object.values(recs).flat().length} matches in queue`, Ic: Shield, iCol: "#14b8a6", iBg: "rgba(20,184,166,0.1)", spark: [0, 1, 2, 2, 3, 3, approved.length] },
                  { l: "Risk Assessment", v: (product.risk_level || "low").toUpperCase(), sub: "Continuous audit", Ic: Globe, iCol: product.risk_level === "high" ? "#ba1a1a" : "#16a34a", iBg: "rgba(22,163,74,0.1)", spark: [10, 15, 12, 10, 8, 5, 4] },
                ].map((k, i) => (
                  <div key={i} className="bg-white rounded-2xl border border-[rgba(208,198,174,0.3)] p-5 shadow-xs flex items-center justify-between">
                    <div className="flex items-center gap-3.5">
                      <div className="size-12 rounded-2xl flex items-center justify-center shrink-0" style={{ background: k.iBg }}>
                        <k.Ic size={20} style={{ color: k.iCol }} />
                      </div>
                      <div className="min-w-0">
                        <p className="font-black text-[20px] text-[#1b1c1c] leading-none" style={{ fontFamily: M }}>{k.v}</p>
                        <p className="text-xs text-gray-500 mt-1 font-medium" style={{ fontFamily: I }}>{k.l}</p>
                        <p className="text-[11px] font-bold text-[#4d4634] mt-0.5" style={{ fontFamily: I }}>{k.sub}</p>
                      </div>
                    </div>
                    <Sparkline data={k.spark} color={k.iCol} w={48} h={22} />
                  </div>
                ))}
              </div>

              {/* AI Executive Summary */}
              <div className="bg-[#fffcf3] rounded-2xl border border-[rgba(229,179,0,0.3)] p-6 shadow-xs">
                <div className="flex items-start gap-6">
                  <div className="flex flex-col items-center gap-2 shrink-0">
                    <ProgressRing value={healthScore} color={healthColor} size={80} sw={6}>
                      <p className="font-extrabold text-[18px]" style={{ color: healthColor, fontFamily: M }}>{healthScore}%</p>
                    </ProgressRing>
                    <p className="text-[11px] font-bold text-[#997700] uppercase tracking-wider" style={{ fontFamily: I }}>AI Alignment</p>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2.5">
                      <Brain size={16} style={{ color: "#735c00" }} />
                      <p className="font-extrabold text-base text-[#1b1c1c]" style={{ fontFamily: M }}>SupplyOS Executive Intelligence Report</p>
                      <Badge label="Active Supervision" color="#735c00" bg="rgba(255,213,74,0.2)" />
                    </div>
                    {aiInsights.executive_summary ? (
                      <div className="mb-4 space-y-3">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 bg-amber-50/60 border border-amber-200/60 p-3.5 rounded-xl text-xs">
                          <div><span className="text-amber-800 font-bold block">Sector Profile:</span> <strong className="text-gray-900">{aiInsights.executive_summary.industry_classification}</strong></div>
                          <div><span className="text-amber-800 font-bold block">Top Matched Vendor:</span> <strong className="text-gray-900">{aiInsights.executive_summary.recommended_partner}</strong></div>
                          <div><span className="text-amber-800 font-bold block">Target Production Cost:</span> <strong className="text-emerald-700 font-extrabold">{aiInsights.executive_summary.estimated_cost}</strong></div>
                          <div><span className="text-amber-800 font-bold block">Estimated Cycle:</span> <strong className="text-gray-900">{aiInsights.executive_summary.production_time}</strong></div>
                        </div>
                        <p className="text-[13px] text-[#5d5644] leading-relaxed font-medium" style={{ fontFamily: I }}>
                          {aiInsights.executive_summary.risk_analysis} | Compliance Status: <strong className="text-[#1b1c1c]">{aiInsights.executive_summary.compliance_status}</strong>
                        </p>
                      </div>
                    ) : (
                      <p className="text-[13px] text-[#5d5644] leading-relaxed mb-4" style={{ fontFamily: I }}>
                        Workspace <strong style={{ color: "#1b1c1c" }}>{product.name}</strong> ({product.sku}) is operational in the <strong>{product.stage}</strong> phase. Relational Bill of Materials currently registers <strong>{bomData.length} active ingredients/components</strong> with automated inventory seeding at primary warehouse. AI matching engine has isolated <strong>{Object.values(recs).flat().length} certified supplier & manufacturer recommendations</strong> ready for one-click contract approval.
                      </p>
                    )}
                    <div className="flex gap-3">
                      <button onClick={() => setActiveTab("AI Marketplace & Partners")} className="px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-[#e5b300] transition shadow-xs" style={{ background: "#ffd54a", color: "#1b1c1c", fontFamily: M }}>
                        View & Approve Recommended Partners →
                      </button>
                      <button onClick={() => setActiveTab("BOM & Materials")} className="px-5 py-2.5 rounded-xl text-xs font-bold text-[#1b1c1c] bg-white border border-[rgba(208,198,174,0.4)] hover:bg-gray-50 transition" style={{ fontFamily: M }}>
                        Inspect Bill of Materials (BOM)
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <WsSupplyChain product={product} onUpdateProduct={refetch} />
              <WsKanban />
              <WsMilestones />
              <WsFinancial />

              <div className="h-10" />
            </div>
          )}

          {/* ── TAB 2: SPECIFICATIONS ── */}
          {activeTab === "Specifications" && (
            <div className="p-8 max-w-6xl mx-auto w-full flex flex-col gap-6">
              <h2 className="text-xl font-black text-[#1b1c1c] border-b pb-3 border-[rgba(208,198,174,0.3)]" style={{ fontFamily: M }}>
                Enterprise Product Specifications & Commercial Plan
              </h2>
              <div className="grid grid-cols-2 gap-6 text-sm">
                <div className="bg-white p-6 rounded-2xl border border-[rgba(208,198,174,0.35)] shadow-xs flex flex-col gap-3">
                  <h3 className="font-black text-[#1b1c1c] text-base flex items-center gap-2" style={{ fontFamily: M }}><Package size={18} /> Core Identification</h3>
                  <div className="space-y-2.5 text-gray-700">
                    <p className="flex justify-between border-b border-gray-100 pb-2"><span>Product Name:</span> <strong className="text-gray-900">{product.name}</strong></p>
                    <p className="flex justify-between border-b border-gray-100 pb-2"><span>SKU Identifier:</span> <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-xs font-bold">{product.sku || "N/A"}</span></p>
                    <p className="flex justify-between border-b border-gray-100 pb-2"><span>Brand Name:</span> <strong>{product.brand || "SupplyOS Brand"}</strong></p>
                    <p className="flex justify-between border-b border-gray-100 pb-2"><span>Version:</span> <strong>{product.version || "v1.0"}</strong></p>
                    <p className="flex justify-between"><span>Creation Mode:</span> <strong className="capitalize text-[#997700]">{product.creation_method}</strong></p>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-[rgba(208,198,174,0.35)] shadow-xs flex flex-col gap-3">
                  <h3 className="font-black text-[#1b1c1c] text-base flex items-center gap-2" style={{ fontFamily: M }}><TrendingUp size={18} /> Commercial Economics</h3>
                  <div className="space-y-2.5 text-gray-700">
                    <p className="flex justify-between border-b border-gray-100 pb-2"><span>Total Budget Allocated:</span> <strong className="text-emerald-700">₹ / $ {Number(product.budget_total || comm.budget || 500000).toLocaleString()}</strong></p>
                    <p className="flex justify-between border-b border-gray-100 pb-2"><span>Minimum Order Quantity:</span> <strong>{comm.moq || "500 units"}</strong></p>
                    <p className="flex justify-between border-b border-gray-100 pb-2"><span>Target Launch Timeline:</span> <strong>{product.estimated_launch || comm.timeline || "60 Days"}</strong></p>
                    <p className="flex justify-between"><span>Estimated Profit Margin:</span> <strong className="text-amber-700">{comm.margin || "45%"}</strong></p>
                  </div>
                </div>

                <div className="col-span-2 bg-white p-6 rounded-2xl border border-[rgba(208,198,174,0.35)] shadow-xs flex flex-col gap-3">
                  <h3 className="font-black text-[#1b1c1c] text-base flex items-center gap-2" style={{ fontFamily: M }}><FileText size={18} /> Detailed Description & Technical Profile</h3>
                  <p className="text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-200/60">
                    {product.description || "No extensive text specification recorded. Using verified modular defaults."}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ── TAB 3: BOM & MATERIALS ── */}
          {activeTab === "BOM & Materials" && (
            <div className="p-8 max-w-6xl mx-auto w-full flex flex-col gap-6">
              <div className="flex items-center justify-between border-b pb-4 border-[rgba(208,198,174,0.3)]">
                <div>
                  <h2 className="text-xl font-black text-[#1b1c1c]" style={{ fontFamily: M }}>Relational Bill of Materials (BOM)</h2>
                  <p className="text-xs text-gray-500">Database master list of materials linked directly to this product workspace.</p>
                </div>
                <button onClick={() => toast.success("Opening add material dialog...")} className="bg-[#1b1c1c] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm">
                  <Plus size={14} className="text-[#ffd54a]" /> Add Material Row
                </button>
              </div>

              <div className="bg-white border border-[rgba(208,198,174,0.35)] rounded-2xl overflow-hidden shadow-xs">
                <table className="w-full text-left border-collapse text-sm">
                  <thead className="bg-[#f7f5ef] border-b border-[rgba(208,198,174,0.35)] font-bold text-xs text-[#5d5644]">
                    <tr>
                      <th className="py-3.5 px-6">Material / Component Name</th>
                      <th className="py-3.5 px-6">Required Qty</th>
                      <th className="py-3.5 px-6">Unit</th>
                      <th className="py-3.5 px-6">Specified Supplier</th>
                      <th className="py-3.5 px-6">ERP Sync Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[rgba(208,198,174,0.2)]">
                    {bomData.length > 0 ? bomData.map((item, idx) => (
                      <tr key={idx} className="hover:bg-gray-50/50">
                        <td className="py-4 px-6 font-extrabold text-[#1b1c1c]">{item.material || item.name}</td>
                        <td className="py-4 px-6 text-gray-700 font-semibold">{item.quantity || 100}</td>
                        <td className="py-4 px-6 text-gray-500 font-mono text-xs uppercase">{item.unit || "kg"}</td>
                        <td className="py-4 px-6 text-gray-600">{item.supplier || "AI Verified Vendor"}</td>
                        <td className="py-4 px-6">
                          <span className="px-3 py-1 bg-emerald-50 text-emerald-700 font-extrabold text-xs rounded-lg border border-emerald-200">
                            ✓ Synchronized
                          </span>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={5} className="py-12 text-center text-gray-400 font-medium">
                          No BOM lines recorded for this workspace. Click "Add Material Row" to begin staging inventory components.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── TAB 4: AI MARKETPLACE & PARTNERS ── */}
          {activeTab === "AI Marketplace & Partners" && (
            <div className="p-8 max-w-7xl mx-auto w-full flex flex-col gap-8">
              <div className="bg-[#1b1c1c] text-white p-7 rounded-3xl shadow-xl flex items-center justify-between">
                <div>
                  <span className="text-xs font-extrabold text-[#ffd54a] uppercase tracking-wider flex items-center gap-1.5 mb-1" style={{ fontFamily: M }}>
                    <Sparkles size={16} /> Auto-Marketplace Matching Engine
                  </span>
                  <h2 className="text-2xl font-black" style={{ fontFamily: M }}>Recommended & Approved Partners</h2>
                  <p className="text-xs text-white/70 mt-1" style={{ fontFamily: I }}>
                    Real-time alignment against active suppliers and manufacturers within your organization database.
                  </p>
                </div>
                <div className="bg-white/10 px-6 py-4 rounded-2xl text-right">
                  <p className="text-[11px] uppercase text-white/60 font-bold">Approved for Workspace</p>
                  <p className="text-3xl font-black text-[#ffd54a] mt-0.5">{approved.length}</p>
                </div>
              </div>

              {/* Render Recommended Categories */}
              {["suppliers", "manufacturers", "packaging", "warehouse", "transport", "quality_labs"].map(cat => {
                const list = recs[cat] || [];
                if (list.length === 0) return null;
                const titles = {
                  suppliers: "Raw Material Suppliers",
                  manufacturers: "Contract Manufacturers & OEMs",
                  packaging: "Packaging & Printing Solutions",
                  warehouse: "Warehousing & Fulfillment Centers",
                  transport: "Express Freight & Logistics",
                  quality_labs: "Certified Quality Inspection Labs",
                };

                return (
                  <div key={cat} className="flex flex-col gap-4">
                    <h3 className="font-extrabold text-lg text-[#1b1c1c] flex items-center gap-2" style={{ fontFamily: M }}>
                      <Shield size={18} className="text-[#e5b300]" /> {titles[cat] || cat}
                      <span className="text-xs font-bold text-gray-400 font-mono ml-2">({list.length} Verified Matches)</span>
                    </h3>

                    <div className="grid grid-cols-2 gap-5">
                      {list.map((p, idx) => {
                        const isApproved = p.approved || approved.some(a => String(a.id) === String(p.id));
                        return (
                          <div key={idx} className={`bg-white border-2 rounded-2xl p-6 transition flex flex-col justify-between ${isApproved ? "border-emerald-500 bg-emerald-50/20 shadow-md" : "border-[rgba(208,198,174,0.35)] hover:border-[#1b1c1c] shadow-xs"}`}>
                            <div className="flex flex-col gap-3">
                              <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="size-12 rounded-xl bg-gray-100 flex items-center justify-center text-2xl border border-gray-200 shadow-xs">
                                    {p.logo || "🏭"}
                                  </div>
                                  <div>
                                    <h4 className="font-extrabold text-base text-[#1b1c1c]" style={{ fontFamily: M }}>{p.name}</h4>
                                    <p className="text-xs text-gray-500">📍 {p.location || "India"}</p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <span className="px-2.5 py-1 bg-[rgba(255,213,74,0.2)] text-[#997700] rounded-full text-xs font-black">
                                    {p.ai_match_pct || 95}% AI Match
                                  </span>
                                </div>
                              </div>

                              <div className="grid grid-cols-3 gap-2 py-2 border-y border-gray-100 text-xs text-gray-600">
                                <div><strong className="block text-gray-900 font-extrabold">{p.rating || 4.8} ★</strong> Rating</div>
                                <div><strong className="block text-gray-900 font-extrabold">{p.lead_time_days || 14} Days</strong> Lead Time</div>
                                <div><strong className="block text-gray-900 font-extrabold">{p.moq || "500 units"}</strong> MOQ</div>
                              </div>

                              <div className="text-xs space-y-2 bg-gray-50 p-3.5 rounded-xl border border-gray-200/60">
                                <div className="text-gray-800 font-medium">
                                  💡 <strong className="text-[#1b1c1c]">Why Recommended:</strong> {p.why_recommended}
                                </div>
                                {p.confidence && (
                                  <div className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded inline-block border border-emerald-200 mr-2">
                                    🎯 Confidence: {p.confidence}
                                  </div>
                                )}
                                {p.why_not_recommended && (
                                  <div className="text-[11px] text-amber-900 bg-amber-50 p-2 rounded-lg border border-amber-200/70 font-medium">
                                    ⚠️ <strong>Why Not Ranked #1:</strong> {p.why_not_recommended}
                                  </div>
                                )}
                                {p.alternative_companies && p.alternative_companies.length > 0 && (
                                  <div className="pt-1.5 border-t border-gray-200/80 text-[11px] text-gray-600">
                                    <strong className="text-gray-800 block mb-1">⚖️ Compared Alternatives & Trade-offs:</strong>
                                    <ul className="list-disc pl-4 space-y-0.5">
                                      {p.alternative_companies.map((alt, aidx) => (
                                        <li key={aidx}><strong className="text-gray-900">{alt.name} ({alt.match_pct})</strong> - {alt.tradeoff}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="mt-5 pt-3 flex items-center justify-end">
                              {isApproved ? (
                                <span className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-sm">
                                  <Check size={16} /> Approved for this Workspace
                                </span>
                              ) : (
                                <button
                                  onClick={() => handleApprovePartner(p.id, cat)}
                                  className="px-5 py-2 bg-[#1b1c1c] hover:bg-[#303031] text-[#ffd54a] rounded-xl font-extrabold text-xs flex items-center gap-2 shadow-sm transition"
                                >
                                  + Approve & Assign to Workspace ✓
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              {Object.values(recs).flat().length === 0 && (
                <div className="bg-white border border-gray-200 rounded-3xl p-12 text-center max-w-xl mx-auto flex flex-col gap-4 shadow-sm">
                  <div className="size-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto text-amber-600 text-2xl font-bold">🏭</div>
                  <h4 className="font-bold text-lg text-gray-800">No marketplace recommendations staged yet</h4>
                  <p className="text-sm text-gray-500">Your workspace is awaiting partner data matching. Click below to trigger a live database sweep.</p>
                  <button onClick={() => refetch()} className="bg-[#1b1c1c] text-[#ffd54a] font-bold px-6 py-3 rounded-xl shadow-md w-max mx-auto text-sm">
                    Run Auto-Matching Engine Now →
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ── TAB 5: WAREHOUSE & LOGISTICS ── */}
          {activeTab === "Warehouse & Logistics" && (
            <div className="p-8 max-w-6xl mx-auto w-full flex flex-col gap-6">
              <h2 className="text-xl font-black text-[#1b1c1c] border-b pb-3 border-[rgba(208,198,174,0.3)]" style={{ fontFamily: M }}>
                Warehousing, Stock Thresholds & Freight Logistics
              </h2>
              <div className="grid grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-[rgba(208,198,174,0.35)] shadow-xs flex flex-col gap-3">
                  <h3 className="font-bold text-[#1b1c1c] flex items-center gap-2" style={{ fontFamily: M }}><Truck size={18} /> Storage Environment</h3>
                  <p className="text-xs text-gray-500">Facility configuration and climate SLA:</p>
                  <div className="p-4 bg-gray-50 rounded-xl space-y-2 text-sm text-gray-700 font-medium border border-gray-200/60">
                    <p><strong>Type:</strong> {whData.type || "Ambient / Cleanroom"}</p>
                    <p><strong>Target Hub:</strong> {whData.location || "Regional Fulfillment Center"}</p>
                    <p><strong>Capacity:</strong> {whData.capacity || "2,500 sq.ft"}</p>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-[rgba(208,198,174,0.35)] shadow-xs flex flex-col gap-3">
                  <h3 className="font-bold text-[#1b1c1c] flex items-center gap-2" style={{ fontFamily: M }}><Activity size={18} /> Inventory Stock Limits</h3>
                  <p className="text-xs text-gray-500">Automated ERP stock monitoring thresholds:</p>
                  <div className="p-4 bg-gray-50 rounded-xl space-y-2 text-sm text-gray-700 font-medium border border-gray-200/60">
                    <p className="text-emerald-700"><strong>Initial Stock:</strong> {invData.initialStock || 1000} units</p>
                    <p className="text-amber-700"><strong>Safety Stock:</strong> {invData.safetyStock || 250} units</p>
                    <p className="text-blue-700"><strong>Reorder Threshold:</strong> {invData.reorderPoint || 350} units</p>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-[rgba(208,198,174,0.35)] shadow-xs flex flex-col gap-3">
                  <h3 className="font-bold text-[#1b1c1c] flex items-center gap-2" style={{ fontFamily: M }}><Globe size={18} /> Transport Scope</h3>
                  <p className="text-xs text-gray-500">Shipping routing & distribution targets:</p>
                  <div className="p-4 bg-gray-50 rounded-xl space-y-2 text-sm text-gray-700 font-medium border border-gray-200/60">
                    <p><strong>Scope:</strong> {logData.scope || "Domestic & Export"}</p>
                    <p><strong>Guaranteed SLA:</strong> {logData.sla || "48 Hours Guaranteed"}</p>
                    <p><strong>Insurance:</strong> ✓ Covered by AI Transit Protection</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── TAB 6: QUALITY & COMPLIANCE ── */}
          {activeTab === "Quality & Compliance" && (
            <div className="p-8 max-w-5xl mx-auto w-full flex flex-col gap-6">
              <h2 className="text-xl font-black text-[#1b1c1c] border-b pb-3 border-[rgba(208,198,174,0.3)]" style={{ fontFamily: M }}>
                Quality Assurance & Regulatory Compliance Standards
              </h2>
              <div className="bg-white p-8 rounded-2xl border border-[rgba(208,198,174,0.35)] shadow-xs flex flex-col gap-6">
                <div className="flex items-center gap-4 border-b pb-6 border-gray-100">
                  <div className="size-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-2xl">✓</div>
                  <div>
                    <h3 className="font-extrabold text-lg text-gray-900">Workspace Quality Grade: ENTERPRISE READY</h3>
                    <p className="text-xs text-gray-500">Target Shelf Life configured to <strong>{qaData.shelfLife || "24 Months"}</strong> with stability testing enabled.</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-gray-700 mb-3 uppercase tracking-wider" style={{ fontFamily: M }}>Enforced Compliance Certifications:</h4>
                  <div className="flex flex-wrap gap-3">
                    {(mfg.certifications || ["WHO-GMP", "ISO 9001:2015", "FDA Certified", "NABL Verified"]).map((c, i) => (
                      <div key={i} className="px-5 py-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl font-black text-sm flex items-center gap-2 shadow-xs">
                        ✓ {c}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── TAB 7: DOCUMENTS ── */}
          {activeTab === "Documents" && (
            <div className="p-8 max-w-6xl mx-auto w-full flex flex-col gap-6">
              <div className="flex items-center justify-between border-b pb-4 border-[rgba(208,198,174,0.3)]">
                <div>
                  <h2 className="text-xl font-black text-[#1b1c1c]" style={{ fontFamily: M }}>Workspace Documents Library</h2>
                  <p className="text-xs text-gray-500">Persistent specifications, certificates of analysis, and technical records.</p>
                </div>
                <button
                  onClick={() => handleRunAIAction("generate_document", { doc_type: "Master Specification Sheet" })}
                  disabled={aiLoading}
                  className="bg-[#1b1c1c] text-[#ffd54a] hover:bg-[#303031] px-5 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 shadow-md transition"
                  style={{ fontFamily: M }}
                >
                  <Sparkles size={15} /> {aiLoading ? "Generating Doc..." : "+ Generate AI Specification Sheet"}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-5">
                {(docData.length > 0 ? docData : [
                  { name: "Master Product Specification Sheet.pdf", type: "Specification", generated_by: "AI Copilot", content: "Comprehensive item composition and target tolerances..." },
                  { name: "Standard Certificate of Analysis (COA).doc", type: "Quality Testing", generated_by: "QA Module", content: "Lab result parameters for batch checking..." }
                ]).map((doc, idx) => (
                  <div key={idx} className="bg-white border border-[rgba(208,198,174,0.35)] rounded-2xl p-6 shadow-xs flex flex-col justify-between">
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-1 bg-amber-50 text-amber-800 rounded-lg text-[11px] font-extrabold uppercase border border-amber-200">{doc.type}</span>
                        <span className="text-xs text-gray-400 font-medium">By: {doc.generated_by}</span>
                      </div>
                      <h4 className="font-extrabold text-base text-gray-900 flex items-center gap-2" style={{ fontFamily: M }}>
                        <FileText size={18} className="text-amber-500" /> {doc.name}
                      </h4>
                      <pre className="text-xs text-gray-600 font-mono bg-gray-50 p-3.5 rounded-xl overflow-x-auto border border-gray-200/50 max-h-32">
                        {doc.content || "Document ready for preview and digital signing."}
                      </pre>
                    </div>
                    <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                      <button onClick={() => toast.success("Document downloaded to local storage!")} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-bold text-xs transition">
                        Download File
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── TAB 8: AI COPILOT & STRATEGY ── */}
          {activeTab === "AI Copilot & Strategy" && (
            <div className="p-8 max-w-5xl mx-auto w-full flex flex-col gap-6">
              <div className="bg-[#1b1c1c] text-white p-8 rounded-3xl shadow-2xl flex flex-col gap-6 border border-amber-500/30">
                <div className="flex items-center justify-between border-b pb-5 border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="size-12 rounded-2xl bg-[rgba(255,213,74,0.2)] text-[#ffd54a] flex items-center justify-center">
                      <Sparkles size={24} />
                    </div>
                    <div>
                      <h2 className="text-xl font-extrabold" style={{ fontFamily: M }}>Workspace AI Strategy Engine</h2>
                      <p className="text-xs text-[#ffd54a]" style={{ fontFamily: I }}>Continuous multi-domain evaluation for {product.name}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleRunAIAction("generate_strategy")}
                      disabled={aiLoading}
                      className="bg-[#ffd54a] hover:bg-white text-[#1b1c1c] font-black px-5 py-2.5 rounded-xl text-xs shadow-md transition flex items-center gap-1.5"
                    >
                      <RefreshCw size={14} className={aiLoading ? "animate-spin" : ""} /> Regenerate Strategy
                    </button>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-sm text-gray-200 leading-relaxed space-y-4">
                  <div className="prose prose-invert max-w-none">
                    {aiInsights.executive_summary ? (
                      <div className="space-y-4">
                        <h3 className="text-xl font-black text-[#ffd54a] border-b pb-2 border-white/10">Enterprise AI Strategy & Operational Execution for {product.name}</h3>
                        <div className="grid grid-cols-2 gap-4 text-xs bg-black/30 p-4 rounded-xl border border-amber-500/20">
                          <div><span className="text-amber-400 font-bold block mb-1">Domain Classification</span><p className="text-white text-sm font-bold">{aiInsights.executive_summary.industry_classification}</p></div>
                          <div><span className="text-amber-400 font-bold block mb-1">Estimated Economics</span><p className="text-white text-sm font-bold">{aiInsights.executive_summary.estimated_cost} over {aiInsights.executive_summary.production_time}</p></div>
                        </div>
                        <div>
                          <h4 className="text-amber-300 font-bold mb-1">🔍 Supply Chain & Technical Risk Assessment</h4>
                          <p className="text-gray-300 text-xs leading-relaxed">{aiInsights.executive_summary.risk_analysis}</p>
                        </div>
                        <div>
                          <h4 className="text-amber-300 font-bold mb-1">📋 Regulatory Compliance Readiness</h4>
                          <p className="text-gray-300 text-xs leading-relaxed">{aiInsights.executive_summary.compliance_status}</p>
                        </div>
                        <div>
                          <h4 className="text-amber-300 font-bold mb-2">🚀 Next Operational Milestones</h4>
                          <ul className="list-disc pl-5 text-xs text-gray-200 space-y-1">
                            {(aiInsights.executive_summary.next_milestones || []).map((m, idx) => (
                              <li key={idx}><strong>{m}</strong></li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ) : aiInsights.strategy || aiInsights.risk_explanation || (
                      <div className="space-y-3">
                        <h3 className="text-lg font-bold text-[#ffd54a]">Strategic Execution Recommendations for {product.name}</h3>
                        <p><strong>1. Supplier De-risking:</strong> Approve at least two raw material suppliers from the Marketplace queue to protect against seasonal pricing volatility.</p>
                        <p><strong>2. Compliance Roadmap:</strong> Factory certifications ({mfg.certifications?.join(", ") || "WHO-GMP, ISO 9001"}) should undergo formal verification prior to manufacturing phase kickoff.</p>
                        <p><strong>3. Working Capital Efficiency:</strong> Current budget of ₹/ $ {Number(product.budget_total || 500000).toLocaleString()} is well aligned with target MOQ of {comm.moq || "500 units"}. Estimated breakeven within first 90 days.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
      <WsAdvisor onClose={handleClose} />
    </div>
  );
}
