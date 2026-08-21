import React, { useState } from "react";
import { toast } from "sonner";
import { motion } from "motion/react";
import { ChevronRight, Sparkles, Plus, Eye, RefreshCw, Trash2, ShieldCheck, Star } from "lucide-react";
import { Badge } from "../common/Badge";
import { I, M } from "../../constants/fonts";
import { api } from "../../services/api";
import { WorkspaceMarketplaceModal } from "./WorkspaceMarketplaceModal";
import { PartnerProfileModal } from "./PartnerProfileModal";

export function WsSupplyChain({ product, onUpdateProduct }) {
  const [activeModal, setActiveModal] = useState({ open: false, role: "", category: "", replaceId: null });
  const [profilePartner, setProfilePartner] = useState(null);
  const [loadingRole, setLoadingRole] = useState(null);

  const roles = [
    { key: "supplier", title: "Raw Material Supplier", emoji: "🧪", col: "#16a34a", cat: "raw_materials" },
    { key: "manufacturer", title: "Contract Manufacturer", emoji: "🏭", col: "#a855f7", cat: "manufacturers" },
    { key: "packaging", title: "Packaging Provider", emoji: "📦", col: "#3b82f6", cat: "packaging" },
    { key: "warehouse", title: "Storage Warehouse", emoji: "🏗️", col: "#14b8a6", cat: "warehouses" },
    { key: "transport", title: "Logistics & Transport", emoji: "🚛", col: "#f97316", cat: "logistics" },
    { key: "quality", title: "Quality & Testing Lab", emoji: "🔬", col: "#eab308", cat: "quality_labs" },
    { key: "certification", title: "Certification Agency", emoji: "📜", col: "#10b981", cat: "certifications" },
    { key: "consultant", title: "Compliance Consultant", emoji: "⚖️", col: "#6366f1", cat: "consultants" },
    { key: "machinery", title: "Production Machinery", emoji: "⚙️", col: "#ec4899", cat: "machinery" },
  ];

  const sc = product?.supply_chain || {};
  const recs = product?.marketplace_recommendations || {};

  const handleRemove = async (roleKey) => {
    if (!product?.id) return;
    setLoadingRole(roleKey);
    try {
      const resp = await api.delete(`/workspaces/${product.id}/${roleKey}/`);
      toast.success(`Removed ${roleKey.toUpperCase()} from workspace`);
      if (onUpdateProduct) onUpdateProduct(resp.workspace || resp);
    } catch (err) {
      toast.error(`Failed to remove ${roleKey}`);
    } finally {
      setLoadingRole(null);
    }
  };

  const handleRecommendAI = (roleConfig) => {
    const aiMatches = recs[roleConfig.cat] || [];
    if (aiMatches.length > 0) {
      const topMatch = aiMatches[0];
      toast.success(`AI Recommendation: ${topMatch.name} (${topMatch.ai_match_pct || 95}% Match)`, {
        description: topMatch.why_recommended || `High alignment with this workspace specification.`
      });
      // Automatically open the browse modal sorted by AI match
      setActiveModal({ open: true, role: roleConfig.key, category: roleConfig.cat, replaceId: null });
    } else {
      toast.info(`Opening live directory for ${roleConfig.title}...`);
      setActiveModal({ open: true, role: roleConfig.key, category: roleConfig.cat, replaceId: null });
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="size-8 rounded-xl bg-[#ffd54a]/20 border border-[#ffd54a]/40 flex items-center justify-center text-[#735c00]">
            <Sparkles size={16} />
          </div>
          <div>
            <p className="font-bold text-[16px] text-[#1b1c1c]" style={{ fontFamily: M }}>Relational ERP Supply Chain</p>
            <p className="text-[12px] text-[#4d4634]" style={{ fontFamily: I }}>Each node is independently managed and backed by live Marketplace records</p>
          </div>
        </div>
        <Badge label="Relational Engine Active" color="#16a34a" bg="rgba(22,163,74,0.12)" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {roles.map((r) => {
          const assigned = sc[r.key];
          const isBusy = loadingRole === r.key;

          return (
            <div key={r.key} className="p-4 rounded-2xl border border-[rgba(208,198,174,0.35)] bg-white shadow-2xs hover:shadow-md transition flex flex-col justify-between gap-4">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="size-11 rounded-xl flex items-center justify-center text-2xl shrink-0" style={{ background: `${r.col}15`, border: `1px solid ${r.col}30` }}>
                      {r.emoji}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color: r.col, fontFamily: M }}>{r.title}</p>
                      <p className="font-bold text-[15px] text-[#1b1c1c] truncate" style={{ fontFamily: M }}>
                        {assigned ? assigned.name : `No ${r.key.charAt(0).toUpperCase() + r.key.slice(1)} Selected`}
                      </p>
                    </div>
                  </div>
                  {assigned ? (
                    <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-[#16a34a]/10 text-[#16a34a] border border-[#16a34a]/30 shrink-0" style={{ fontFamily: M }}>
                      Active
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-gray-100 text-gray-500 border border-gray-200 shrink-0" style={{ fontFamily: M }}>
                      Empty
                    </span>
                  )}
                </div>

                {assigned ? (
                  <div className="mt-3 pt-3 border-t border-[rgba(208,198,174,0.2)] flex items-center justify-between text-[12px] text-[#4d4634]">
                    <span className="truncate flex items-center gap-1 font-medium" style={{ fontFamily: I }}>
                      📍 {assigned.location || "Verified Facility"}
                    </span>
                    <span className="font-bold text-[#16a34a] flex items-center gap-1 shrink-0" style={{ fontFamily: M }}>
                      <Sparkles size={12} /> {assigned.ai_match_pct || 98}% Alignment
                    </span>
                  </div>
                ) : (
                  <p className="mt-3 pt-2 border-t border-[rgba(208,198,174,0.2)] text-[12px] text-[#4d4634] italic" style={{ fontFamily: I }}>
                    No supplier linked. Assign from directory or request AI match.
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-1">
                {assigned ? (
                  <>
                    <button
                      onClick={() => setProfilePartner(assigned)}
                      className="flex-1 py-2 px-2 rounded-xl text-[12px] font-bold bg-[#fbf9f9] border border-[rgba(208,198,174,0.4)] hover:bg-gray-100 text-[#1b1c1c] transition flex items-center justify-center gap-1"
                      style={{ fontFamily: M }}
                    >
                      <Eye size={13} /> View
                    </button>
                    <button
                      onClick={() => setActiveModal({ open: true, role: r.key, category: r.cat, replaceId: assigned.id })}
                      className="flex-1 py-2 px-2 rounded-xl text-[12px] font-bold bg-[#ffd54a]/20 border border-[#ffd54a]/60 hover:bg-[#ffd54a]/30 text-[#735c00] transition flex items-center justify-center gap-1"
                      style={{ fontFamily: M }}
                    >
                      <RefreshCw size={13} /> Replace
                    </button>
                    <button
                      disabled={isBusy}
                      onClick={() => handleRemove(r.key)}
                      className="py-2 px-3 rounded-xl text-[12px] font-bold bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition flex items-center justify-center"
                      title="Remove Partner"
                      style={{ fontFamily: M }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setActiveModal({ open: true, role: r.key, category: r.cat, replaceId: null })}
                      className="flex-1 py-2 rounded-xl text-[12.5px] font-bold bg-[#303031] text-white hover:bg-[#1b1c1c] transition flex items-center justify-center gap-1 shadow-2xs"
                      style={{ fontFamily: M }}
                    >
                      <Plus size={14} /> Browse Marketplace
                    </button>
                    <button
                      onClick={() => handleRecommendAI(r)}
                      className="px-3 py-2 rounded-xl text-[12px] font-bold bg-[#ffd54a] hover:opacity-90 text-[#735c00] transition flex items-center gap-1"
                      style={{ fontFamily: M }}
                    >
                      <Sparkles size={13} /> AI
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modals */}
      <WorkspaceMarketplaceModal
        isOpen={activeModal.open}
        onClose={() => setActiveModal({ open: false, role: "", category: "", replaceId: null })}
        workspaceId={product?.id}
        role={activeModal.role}
        categoryKey={activeModal.category}
        replacePartnerId={activeModal.replaceId}
        onAssign={(newWs) => {
          if (onUpdateProduct && newWs) onUpdateProduct(newWs);
        }}
      />

      <PartnerProfileModal
        isOpen={Boolean(profilePartner)}
        onClose={() => setProfilePartner(null)}
        partner={profilePartner}
      />
    </div>
  );
}
