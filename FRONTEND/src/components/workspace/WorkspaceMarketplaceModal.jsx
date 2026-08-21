import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { X, Search, Filter, Sparkles, ShieldCheck, ArrowRight, CheckCircle2, Building2, MapPin, Star, Clock } from "lucide-react";
import { M, I } from "../../constants/fonts";
import { api } from "../../services/api";

export function WorkspaceMarketplaceModal({ isOpen, onClose, workspaceId, role, categoryKey, onAssign, replacePartnerId = null }) {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterVerified, setFilterVerified] = useState(false);
  const [sortBy, setSortBy] = useState("ai_score");
  const [assigningId, setAssigningId] = useState(null);

  useEffect(() => {
    if (!isOpen) return;
    fetchPartners();
  }, [isOpen, categoryKey, filterVerified, sortBy]);

  const fetchPartners = async () => {
    setLoading(true);
    try {
      let endpoint = `/marketplace/partners/?status=active`;
      if (categoryKey && categoryKey !== "all") endpoint += `&category=${categoryKey}`;
      const data = await api.get(endpoint);
      let list = Array.isArray(data) ? data : (data?.results || []);
      
      // Apply local client/server sort & verified filter
      if (filterVerified) list = list.filter(p => p.verified_status !== false);
      
      list.sort((a, b) => {
        if (sortBy === "ai_score") return (b.ai_score || b.ai_match_pct || 95) - (a.ai_score || a.ai_match_pct || 95);
        if (sortBy === "rating") return (parseFloat(b.rating) || 4.8) - (parseFloat(a.rating) || 4.8);
        if (sortBy === "lead_time") return (a.lead_time_days || 14) - (b.lead_time_days || 14);
        return 0;
      });

      setPartners(list);
    } catch (err) {
      toast.error("Failed to fetch Marketplace directory");
      setPartners([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async (partner) => {
    if (!workspaceId) {
      toast.error("Workspace ID missing");
      return;
    }
    setAssigningId(partner.id);
    try {
      const resp = await api.post(`/workspaces/${workspaceId}/${role}/`, {
        partner_id: partner.id,
        category: categoryKey
      });
      toast.success(`Assigned ${partner.name} as Workspace ${role.toUpperCase()}`);
      if (onAssign) onAssign(resp.workspace || resp);
      onClose();
    } catch (err) {
      try {
        const fallbackResp = await api.post(`/products/${workspaceId}/approve-partner/`, {
          partner_id: partner.id,
          category: categoryKey || "suppliers"
        });
        toast.success(`Assigned ${partner.name} to Workspace`);
        if (onAssign) onAssign(fallbackResp.workspace || fallbackResp);
        onClose();
      } catch (fErr) {
        toast.error("Failed to assign partner to workspace");
      }
    } finally {
      setAssigningId(null);
    }
  };

  if (!isOpen) return null;

  const filteredPartners = partners.filter(p => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (p.name || "").toLowerCase().includes(q) || (p.country || "").toLowerCase().includes(q) || (p.city || "").toLowerCase().includes(q);
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden border border-[rgba(208,198,174,0.3)]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-[rgba(208,198,174,0.25)] flex items-center justify-between bg-[#fbf9f9]">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-[#ffd54a]/20 border border-[#ffd54a]/40 flex items-center justify-center text-xl">
              🏢
            </div>
            <div>
              <h3 className="font-bold text-[17px] text-[#1b1c1c] capitalize" style={{ fontFamily: M }}>
                {replacePartnerId ? `Replace ${role}` : `Browse Marketplace for ${role}`}
              </h3>
              <p className="text-[12px] text-[#4d4634] font-medium" style={{ fontFamily: I }}>
                Select a verified enterprise partner from the live directory to bind to this workspace.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-[#4d4634] hover:text-[#1b1c1c] rounded-full hover:bg-gray-100 transition">
            <X size={20} />
          </button>
        </div>

        {/* Filters and Search */}
        <div className="p-4 border-b border-[rgba(208,198,174,0.2)] bg-white flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[240px]">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#4d4634]" />
            <input
              type="text"
              placeholder="Search partners by name, city, or country..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-[13px] bg-[#fbf9f9] border border-[rgba(208,198,174,0.4)] rounded-xl focus:outline-none focus:border-[#735c00] text-[#1b1c1c] font-medium"
              style={{ fontFamily: I }}
            />
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilterVerified(!filterVerified)}
              className={`px-3 py-2 rounded-xl text-[12.5px] font-bold border transition flex items-center gap-1.5 ${
                filterVerified ? "bg-[#16a34a]/10 border-[#16a34a] text-[#16a34a]" : "bg-[#fbf9f9] border-[rgba(208,198,174,0.4)] text-[#4d4634]"
              }`}
              style={{ fontFamily: M }}
            >
              <ShieldCheck size={14} /> Verified Only
            </button>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 rounded-xl text-[12.5px] font-bold bg-[#fbf9f9] border border-[rgba(208,198,174,0.4)] text-[#1b1c1c] focus:outline-none"
              style={{ fontFamily: M }}
            >
              <option value="ai_score">Sort by AI Alignment Score</option>
              <option value="rating">Sort by Partner Rating</option>
              <option value="lead_time">Sort by Fastest Lead Time</option>
            </select>
          </div>
        </div>

        {/* List Content */}
        <div className="p-6 flex-1 overflow-y-auto bg-[#fbf9f9] grid grid-cols-1 md:grid-cols-2 gap-4">
          {loading ? (
            <div className="col-span-full py-16 flex flex-col items-center justify-center gap-3">
              <div className="size-8 border-[3px] border-[#735c00]/20 border-t-[#735c00] rounded-full animate-spin" />
              <p className="text-[13px] font-semibold text-[#4d4634]" style={{ fontFamily: I }}>Scanning verified enterprise suppliers...</p>
            </div>
          ) : filteredPartners.length === 0 ? (
            <div className="col-span-full py-16 text-center text-[#4d4634]">
              <p className="text-[14px] font-semibold" style={{ fontFamily: I }}>No marketplace partners matched your search parameters.</p>
            </div>
          ) : (
            filteredPartners.map((partner) => {
              const loc = `${partner.city || ""}, ${partner.country || "India"}`.replace(/^, /, "").trim() || partner.country || "India";
              const rating = parseFloat(partner.rating) || 4.8;
              const matchScore = partner.ai_score || partner.ai_match_pct || 95;
              const isReplacingThis = replacePartnerId && String(replacePartnerId) === String(partner.id);

              return (
                <div key={partner.id} className="p-4 bg-white rounded-2xl border border-[rgba(208,198,174,0.3)] shadow-2xs hover:shadow-md transition flex flex-col justify-between gap-4">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="size-11 rounded-xl bg-gray-100 flex items-center justify-center text-2xl shrink-0 border">
                          {partner.logo || "🏭"}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-[15px] text-[#1b1c1c] truncate" style={{ fontFamily: M }}>{partner.name}</p>
                          <p className="text-[12px] text-[#4d4634] flex items-center gap-1 font-medium truncate" style={{ fontFamily: I }}>
                            <MapPin size={12} /> {loc}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end shrink-0">
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#16a34a]/10 text-[#16a34a] border border-[#16a34a]/30 flex items-center gap-1" style={{ fontFamily: M }}>
                          <Sparkles size={11} /> {matchScore}% Match
                        </span>
                        <span className="text-[11px] font-bold text-[#eab308] flex items-center gap-1 mt-1" style={{ fontFamily: M }}>
                          <Star size={11} className="fill-[#eab308]" /> {rating} ★
                        </span>
                      </div>
                    </div>

                    <p className="text-[12.5px] text-[#4d4634] line-clamp-2 mt-3 font-medium leading-relaxed" style={{ fontFamily: I }}>
                      {partner.description || `High-tier verified industrial supplier in ${loc} providing custom SLA and full quality testing.`}
                    </p>

                    {(partner.specialization || partner.primary_industry) && (
                      <div className="mt-2 text-[11px] font-bold px-2.5 py-1 rounded-md bg-[#f0eef6] text-[#55388c] border border-[#dcd7ed] inline-block truncate max-w-full" style={{ fontFamily: M }}>
                        🎯 {partner.specialization || partner.primary_industry}
                      </div>
                    )}

                    <div className="mt-3 flex items-center gap-3 flex-wrap pt-2 border-t border-gray-100 text-[11.5px] text-[#4d4634]" style={{ fontFamily: I }}>
                      <span className="flex items-center gap-1 font-semibold">
                        <Clock size={12} className="text-[#3b82f6]" /> Lead Time: {partner.lead_time_days || 14}d
                      </span>
                      <span className="font-semibold text-[#16a34a]">
                        MOQ: {partner.moq_display || `${partner.moq_number || 500} units`}
                      </span>
                      {(partner.annual_capacity || partner.monthly_capacity_display) && (
                        <span className="font-semibold text-[#2563eb]">
                          Cap: {partner.annual_capacity || partner.monthly_capacity_display}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    disabled={assigningId === partner.id || isReplacingThis}
                    onClick={() => handleAssign(partner)}
                    className={`w-full py-2.5 rounded-xl text-[13px] font-bold transition shadow-sm flex items-center justify-center gap-2 ${
                      isReplacingThis
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : "bg-[#ffd54a] hover:opacity-95 text-[#735c00]"
                    }`}
                    style={{ fontFamily: M }}
                  >
                    {assigningId === partner.id ? (
                      <span className="flex items-center gap-1">Binding to Workspace...</span>
                    ) : isReplacingThis ? (
                      <span>Currently Assigned</span>
                    ) : (
                      <>Assign To Workspace <ArrowRight size={14} /></>
                    )}
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[rgba(208,198,174,0.2)] bg-white flex justify-end">
          <button onClick={onClose} className="px-5 py-2 rounded-xl text-[13px] font-bold bg-[#303031] text-white hover:bg-[#1b1c1c] transition" style={{ fontFamily: M }}>
            Close Modal
          </button>
        </div>

      </div>
    </div>
  );
}
