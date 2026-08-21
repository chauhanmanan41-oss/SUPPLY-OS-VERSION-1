import React from "react";
import { Building2, ShieldCheck, MapPin, Star, ArrowUpRight, CheckCircle } from "lucide-react";
import { I, M } from "../../constants/fonts";

export function AIRecommendation({ records = [], onSelectPartner }) {
    if (!records || records.length === 0) return null;

    return (
        <div className="pl-12 pr-4 my-2 grid grid-cols-1 gap-3">
            {records.map((partner, idx) => {
                const isTop = idx === 0;
                const aiScore = partner.ai_score || 95;
                const rating = partner.rating || 4.8;
                const badges = partner.certifications || partner.capabilities || ["WHO-GMP", "ISO 9001"];

                return (
                    <div key={partner.id || idx} className="bg-[#fffdf8] border border-[rgba(208,198,174,0.35)] rounded-2xl p-4 shadow-xs hover:border-[#3b82f6]/40 transition duration-200">
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-2.5 min-w-0">
                                <div className="size-10 rounded-xl flex items-center justify-center text-[20px] bg-[#e6e1d6] shrink-0 border border-[rgba(208,198,174,0.4)]">
                                    🏭
                                </div>
                                <div className="min-w-0">
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                        <h5 className="font-extrabold text-[14px] text-[#1a1b1b] truncate" style={{ fontFamily: M }}>
                                            {partner.name}
                                        </h5>
                                        {isTop && (
                                            <span className="text-[10px] font-bold bg-[#16a34a]/15 text-[#16a34a] px-2 py-0.5 rounded-full flex items-center gap-1">
                                                <CheckCircle size={10} className="fill-[#16a34a] text-white" /> Top Recommended
                                            </span>
                                        )}
                                        {(partner.specialization || partner.primary_industry) && (
                                            <span className="text-[10px] font-semibold bg-[#f0eef6] text-[#55388c] px-2 py-0.5 rounded-md border border-[#dcd7ed]" style={{ fontFamily: I }}>
                                                🎯 {partner.specialization || partner.primary_industry}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-[11.5px] text-[#635a42] flex items-center gap-1 mt-1" style={{ fontFamily: I }}>
                                        <MapPin size={12} className="text-[#3b82f6]" /> {partner.city ? `${partner.city}, ${partner.country || "India"}` : partner.location || "Gujarat, India"} • {partner.lead_time_days || 14}d Lead Time
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col items-end shrink-0">
                                <div className="flex items-center gap-1 bg-[#fffbe6] px-2 py-0.5 rounded-full border border-[#f5e1a4]">
                                    <Star size={11} className="fill-[#eab308] text-[#eab308]" />
                                    <span className="text-[11.5px] font-extrabold text-[#735c00]" style={{ fontFamily: M }}>{rating}</span>
                                </div>
                                <span className="text-[10.5px] font-bold text-[#16a34a] mt-1" style={{ fontFamily: I }}>
                                    {aiScore}% AI Match
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-2 border-t border-[rgba(208,198,174,0.15)]">
                            {badges.slice(0, 3).map((badge, bIndex) => (
                                <span key={bIndex} className="text-[11px] font-semibold text-[#4e4632] bg-[#f0eee6] px-2.5 py-0.5 rounded-lg border border-[rgba(208,198,174,0.3)]">
                                    {badge}
                                </span>
                            ))}
                            {(partner.annual_capacity || partner.monthly_capacity_display) && (
                                <span className="text-[11px] font-bold text-[#2563eb] bg-[#2563eb]/10 px-2 py-0.5 rounded-lg border border-[#2563eb]/20 ml-auto" style={{ fontFamily: I }}>
                                    ⚡ {partner.annual_capacity || partner.monthly_capacity_display}
                                </span>
                            )}
                            {(partner.moq_display || partner.moq || partner.moq_number) && (
                                <span className="text-[11px] font-mono text-[#3b82f6] font-semibold bg-[#3b82f6]/10 px-2 py-0.5 rounded-lg">
                                    MOQ: {partner.moq_display || partner.moq || `${partner.moq_number} units`}
                                </span>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
