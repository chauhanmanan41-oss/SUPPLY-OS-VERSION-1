import React from "react";
import { ShieldCheck, Zap, Award, Clock } from "lucide-react";
import { I, M } from "../../constants/fonts";

export function AICompare({ comparisonData }) {
    if (!comparisonData || !comparisonData.results || comparisonData.results.length === 0) return null;

    const partners = comparisonData.results;
    const highlights = comparisonData.comparison_highlights || {};

    return (
        <div className="pl-12 pr-4 my-3 overflow-x-auto" style={{ scrollbarWidth: "thin" }}>
            <div className="bg-[#fffefb] border border-[rgba(208,198,174,0.4)] rounded-2xl p-4 shadow-sm min-w-[500px]">
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-[rgba(208,198,174,0.2)]">
                    <span className="text-[13px] font-extrabold text-[#1a1b1b] flex items-center gap-1.5" style={{ fontFamily: M }}>
                        ⚖️ Side-by-Side Competitive Matrix
                    </span>
                    <span className="text-[11.5px] font-bold text-[#735c00] bg-[#fff8e1] px-2.5 py-0.5 rounded-full border border-[#ffe082]">
                        {partners.length} Companies Evaluated
                    </span>
                </div>

                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-[rgba(208,198,174,0.25)] text-[11.5px] text-[#6b6248] uppercase font-bold" style={{ fontFamily: M }}>
                            <th className="pb-2 pl-2">Attribute</th>
                            {partners.map((p, i) => (
                                <th key={i} className="pb-2 px-3 text-center min-w-[140px]">
                                    <div className="text-[13px] font-black text-[#1b1c1c] truncate">{p.name}</div>
                                    <div className="text-[11px] font-normal text-[#6b6248] capitalize">{p.location}</div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[rgba(208,198,174,0.15)] text-[12.5px]" style={{ fontFamily: I }}>
                        <tr>
                            <td className="py-2.5 pl-2 font-bold text-[#453e2d] flex items-center gap-1.5">
                                <Star size={13} className="text-[#eab308] fill-[#eab308]" /> Rating & Match
                            </td>
                            {partners.map((p, i) => (
                                <td key={i} className="py-2.5 px-3 text-center font-bold text-[#1b1c1c]">
                                    <div className="bg-[#fffbeb] text-[#92400e] rounded-lg py-1 px-2 border border-[#fde68a] inline-block">
                                        {p.rating}★ ({p.ai_score}% Match)
                                    </div>
                                </td>
                            ))}
                        </tr>
                        <tr>
                            <td className="py-2.5 pl-2 font-bold text-[#453e2d]">⏱️ Est. Lead Time</td>
                            {partners.map((p, i) => {
                                const isFastest = p.name === highlights?.fastest_lead_time;
                                return (
                                    <td key={i} className={`py-2.5 px-3 text-center font-semibold ${isFastest ? "text-[#16a34a] font-extrabold bg-[#16a34a]/5 rounded-lg" : "text-[#3d3727]"}`}>
                                        {p.lead_time_days} Days {isFastest && "⚡ Fastest"}
                                    </td>
                                );
                            })}
                        </tr>
                        <tr>
                            <td className="py-2.5 pl-2 font-bold text-[#453e2d]">📦 Minimum Order</td>
                            {partners.map((p, i) => (
                                <td key={i} className="py-2.5 px-3 text-center font-mono text-[#3b82f6] font-bold">
                                    {p.moq}
                                </td>
                            ))}
                        </tr>
                        <tr>
                            <td className="py-2.5 pl-2 font-bold text-[#453e2d]">📜 Certifications</td>
                            {partners.map((p, i) => (
                                <td key={i} className="py-2.5 px-3 text-center">
                                    <div className="flex flex-wrap justify-center gap-1">
                                        {(p.certifications || ["ISO 9001"]).slice(0, 2).map((c, idx) => (
                                            <span key={idx} className="text-[10.5px] bg-[#f2efe7] px-2 py-0.5 rounded text-[#524a35]">
                                                {c}
                                            </span>
                                        ))}
                                    </div>
                                </td>
                            ))}
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
