import React from "react";
import { X, ShieldCheck, Star, MapPin, Building2, Phone, Mail, CheckCircle2, Sparkles, Award } from "lucide-react";
import { M, I } from "../../constants/fonts";

export function PartnerProfileModal({ isOpen, onClose, partner }) {
  if (!isOpen || !partner) return null;

  const loc = `${partner.city || ""}, ${partner.country || "India"}`.replace(/^, /, "").trim() || partner.country || "India";
  const rating = parseFloat(partner.rating) || 4.8;
  const matchScore = partner.ai_score || partner.ai_match_pct || 95;
  const certifications = Array.isArray(partner.certifications) ? partner.certifications : ["ISO 9001:2015", "WHO-GMP Certified", "CE Compliance"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden border border-[rgba(208,198,174,0.3)]">
        
        {/* Header Banner */}
        <div className="p-6 bg-gradient-to-r from-[#303031] to-[#1b1c1c] text-white flex items-start justify-between relative">
          <div className="flex items-center gap-4">
            <div className="size-16 rounded-2xl bg-white text-[#1b1c1c] flex items-center justify-center text-4xl shrink-0 shadow-lg">
              {partner.logo || "🏭"}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-[#ffd54a] text-[#735c00]" style={{ fontFamily: M }}>
                  Verified Partner
                </span>
                <span className="text-[12px] font-bold text-[#ffd54a] flex items-center gap-1" style={{ fontFamily: M }}>
                  <Sparkles size={12} /> {matchScore}% AI Match
                </span>
              </div>
              <h3 className="text-2xl font-bold tracking-tight" style={{ fontFamily: M }}>{partner.name}</h3>
              <p className="text-[13px] text-white/80 flex items-center gap-1 mt-1" style={{ fontFamily: I }}>
                <MapPin size={14} className="text-[#ffd54a]" /> {loc} • {partner.price_tier || "$$$"}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-white/70 hover:text-white rounded-full transition bg-white/10 hover:bg-white/20">
            <X size={20} />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-[#fbf9f9]">
          
          <div>
            <h4 className="text-[13px] font-bold text-[#4d4634] uppercase tracking-wider mb-2" style={{ fontFamily: M }}>
              Corporate Overview & Capabilities
            </h4>
            <p className="text-[14px] text-[#1b1c1c] leading-relaxed bg-white p-4 rounded-xl border border-[rgba(208,198,174,0.3)] shadow-2xs font-medium" style={{ fontFamily: I }}>
              {partner.description || `${partner.name} is a high-reliability industrial manufacturing and logistics enterprise located in ${loc}. Providing rigorous SLA compliance, rapid prototyping, and end-to-end supply chain integration.`}
            </p>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3.5 bg-white rounded-xl border border-[rgba(208,198,174,0.3)] shadow-2xs text-center">
              <span className="text-[11.5px] text-[#4d4634] font-medium block" style={{ fontFamily: I }}>Quality Rating</span>
              <span className="text-lg font-bold text-[#1b1c1c] flex items-center justify-center gap-1 mt-0.5" style={{ fontFamily: M }}>
                {rating} <Star size={14} className="fill-[#eab308] text-[#eab308]" />
              </span>
            </div>
            <div className="p-3.5 bg-white rounded-xl border border-[rgba(208,198,174,0.3)] shadow-2xs text-center">
              <span className="text-[11.5px] text-[#4d4634] font-medium block" style={{ fontFamily: I }}>Standard Lead Time</span>
              <span className="text-lg font-bold text-[#3b82f6] mt-0.5 block" style={{ fontFamily: M }}>
                {partner.lead_time_days || 14} Days
              </span>
            </div>
            <div className="p-3.5 bg-white rounded-xl border border-[rgba(208,198,174,0.3)] shadow-2xs text-center">
              <span className="text-[11.5px] text-[#4d4634] font-medium block" style={{ fontFamily: I }}>Minimum Order (MOQ)</span>
              <span className="text-lg font-bold text-[#16a34a] mt-0.5 block" style={{ fontFamily: M }}>
                {partner.moq_display || `${partner.moq_number || 500} units`}
              </span>
            </div>
          </div>

          {/* Certifications */}
          <div>
            <h4 className="text-[13px] font-bold text-[#4d4634] uppercase tracking-wider mb-2 flex items-center gap-1.5" style={{ fontFamily: M }}>
              <Award size={15} className="text-[#eab308]" /> Active Certifications & Compliance
            </h4>
            <div className="flex flex-wrap gap-2">
              {certifications.map((cert, idx) => (
                <div key={idx} className="px-3 py-1.5 rounded-xl bg-white border border-[rgba(208,198,174,0.3)] shadow-2xs flex items-center gap-1.5 text-[12.5px] font-bold text-[#1b1c1c]" style={{ fontFamily: M }}>
                  <ShieldCheck size={14} className="text-[#16a34a]" /> {cert}
                </div>
              ))}
            </div>
          </div>

          {/* Contact Details */}
          <div className="p-4 bg-white rounded-xl border border-[rgba(208,198,174,0.3)] shadow-2xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-[#16a34a]/10 text-[#16a34a] flex items-center justify-center">
                <Building2 size={18} />
              </div>
              <div>
                <p className="text-[13.5px] font-bold text-[#1b1c1c]" style={{ fontFamily: M }}>Enterprise Procurement Desk</p>
                <p className="text-[12px] text-[#4d4634]" style={{ fontFamily: I }}>Direct communication portal active via SupplyOS EDI</p>
              </div>
            </div>
            <button onClick={() => alert("Connecting to EDI secure messaging room...")} className="px-4 py-2 rounded-xl bg-[#f97316] text-white font-bold text-[12.5px] hover:opacity-90 transition shadow-sm" style={{ fontFamily: M }}>
              Contact Partner
            </button>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[rgba(208,198,174,0.2)] bg-white flex justify-end">
          <button onClick={onClose} className="px-6 py-2 rounded-xl text-[13px] font-bold bg-[#303031] text-white hover:bg-[#1b1c1c] transition" style={{ fontFamily: M }}>
            Close Profile
          </button>
        </div>

      </div>
    </div>
  );
}
