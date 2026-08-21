import { CheckCircle } from "lucide-react";
import { I, M } from "../../constants/fonts";

export function MFilterPanel({ filters = {}, setFilters, selectedCategory = "all", setSelectedCategory, categories = [] }) {
    const toggleCert = (c) => {
        setFilters(prev => {
            const current = Array.isArray(prev.certifications) ? prev.certifications : [];
            const next = current.includes(c) ? current.filter(x => x !== c) : [...current, c];
            return { ...prev, certifications: next, page: 1 };
        });
    };

    const handleClear = () => {
        setFilters({
            verifiedOnly: false,
            exportReady: false,
            customMfg: false,
            whiteLabel: false,
            qualityLab: false,
            cleanRoom: false,
            matchMin: 80,
            minRating: "",
            location: "",
            certifications: [],
            businessType: "",
            leadTime: "",
            warehouseType: "",
            transportType: "",
            sort: "-rating",
            page: 1
        });
        if (setSelectedCategory) setSelectedCategory("all");
    };

    const certsList = [
        "GMP Certified", "ISO 9001:2015", "FSSAI", "FDA Approved", 
        "NABL Accredited", "WHO-GMP", "Organic", "CE Certified", "AEO Certified"
    ];

    return (
        <div className="w-[240px] shrink-0 h-full overflow-y-auto border-r border-[rgba(208,198,174,0.2)] bg-white" style={{ scrollbarWidth: "none" }}>
            <div className="px-5 py-6 flex flex-col gap-6">
                <div className="flex items-center justify-between">
                    <p className="font-bold text-[15px] text-[#1b1c1c]" style={{ fontFamily: M }}>Enterprise Filters</p>
                    <button onClick={handleClear} className="text-[12px] font-bold text-[#3b82f6] hover:underline" style={{ fontFamily: M }}>
                        Clear All
                    </button>
                </div>

                {/* Category Picker */}
                {setSelectedCategory && (
                    <div>
                        <p className="text-[11px] font-bold text-[#4d4634] uppercase tracking-wide mb-2" style={{ fontFamily: M }}>Directory Sector</p>
                        <select 
                            value={selectedCategory} 
                            onChange={e => setSelectedCategory(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-[rgba(208,198,174,0.3)] text-[12px] font-bold bg-[#fbf9f9] text-[#1b1c1c] outline-none cursor-pointer"
                            style={{ fontFamily: M }}
                        >
                            <option value="all">🌐 All 10 Categories (490)</option>
                            {categories.map(cat => (
                                <option key={cat.code || cat.id} value={cat.code || cat.id}>
                                    {cat.emoji} {cat.label}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Verified Only Switch */}
                <div className="flex items-center justify-between pt-2 border-t border-[rgba(208,198,174,0.15)]">
                    <span className="text-[13px] font-semibold text-[#1b1c1c]" style={{ fontFamily: I }}>Verified Partners Only</span>
                    <button 
                        onClick={() => setFilters(p => ({ ...p, verifiedOnly: !p.verifiedOnly, page: 1 }))} 
                        className="w-9 h-5 rounded-full relative transition-colors" 
                        style={{ background: filters.verifiedOnly ? "#16a34a" : "#efeded" }}
                    >
                        <div 
                            className="size-3.5 bg-white rounded-full absolute top-[3px] transition-all" 
                            style={{ left: filters.verifiedOnly ? "calc(100% - 17px)" : "3px", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }}
                        />
                    </button>
                </div>

                {/* Enterprise B2B Capability Toggles */}
                <div className="pt-2 border-t border-[rgba(208,198,174,0.15)] flex flex-col gap-2.5">
                    <p className="text-[11px] font-bold text-[#3b82f6] uppercase tracking-wide" style={{ fontFamily: M }}>B2B Readiness Shields</p>
                    {[
                        { key: "exportReady", label: "🌐 Global Export Ready" },
                        { key: "customMfg", label: "✓ Custom Manufacturing" },
                        { key: "whiteLabel", label: "🏷️ White Label / ODM" },
                        { key: "qualityLab", label: "🔬 On-site Quality Lab" },
                        { key: "cleanRoom", label: "🏥 Cleanroom Facility" },
                    ].map(f => (
                        <div key={f.key} className="flex items-center justify-between">
                            <span className="text-[12px] font-medium text-[#4d4634]" style={{ fontFamily: I }}>{f.label}</span>
                            <button 
                                onClick={() => setFilters(p => ({ ...p, [f.key]: !p[f.key], page: 1 }))} 
                                className="w-8 h-4.5 rounded-full relative transition-colors" 
                                style={{ background: filters[f.key] ? "#3b82f6" : "#e2e8f0" }}
                            >
                                <div 
                                    className="size-3 bg-white rounded-full absolute top-[3px] transition-all" 
                                    style={{ left: filters[f.key] ? "calc(100% - 15px)" : "3px", boxShadow: "0 1px 2px rgba(0,0,0,0.2)" }}
                                />
                            </button>
                        </div>
                    ))}
                </div>

                {/* AI Match Score */}
                <div className="pt-2 border-t border-[rgba(208,198,174,0.15)]">
                    <p className="text-[11px] font-bold text-[#4d4634] uppercase tracking-wide mb-2" style={{ fontFamily: M }}>Min AI Confidence</p>
                    {[80, 88, 92, 95].map(v => (
                        <button 
                            key={v} 
                            onClick={() => setFilters(p => ({ ...p, matchMin: p.matchMin === v ? 0 : v, page: 1 }))} 
                            className="flex items-center gap-2 w-full px-2.5 py-1.5 rounded-lg text-[12px] font-semibold transition mb-0.5" 
                            style={{ background: filters.matchMin === v ? "rgba(59,130,246,0.1)" : "transparent", color: filters.matchMin === v ? "#3b82f6" : "#4d4634", fontFamily: I }}
                        >
                            <div className="size-3.5 rounded-full border-2 flex items-center justify-center shrink-0" style={{ borderColor: filters.matchMin === v ? "#3b82f6" : "rgba(208,198,174,0.5)" }}>
                                {filters.matchMin === v && <div className="size-2 rounded-full bg-[#3b82f6]"/>}
                            </div>
                            {v}%+ AI Match Rating
                        </button>
                    ))}
                </div>

                {/* Location */}
                <div className="pt-2 border-t border-[rgba(208,198,174,0.15)]">
                    <p className="text-[11px] font-bold text-[#4d4634] uppercase tracking-wide mb-2" style={{ fontFamily: M }}>Location / State</p>
                    <input 
                        type="text" 
                        placeholder="e.g. Ahmedabad, Maharashtra..." 
                        value={filters.location || ""}
                        onChange={e => setFilters(p => ({ ...p, location: e.target.value, page: 1 }))}
                        className="w-full px-3 py-2 rounded-xl border border-[rgba(208,198,174,0.3)] text-[12px] font-semibold bg-[#fbf9f9] text-[#1b1c1c] outline-none" 
                        style={{ fontFamily: I }}
                    />
                </div>

                {/* Lead Time */}
                <div className="pt-2 border-t border-[rgba(208,198,174,0.15)]">
                    <p className="text-[11px] font-bold text-[#4d4634] uppercase tracking-wide mb-2" style={{ fontFamily: M }}>Max Lead Time</p>
                    {["Under 7 days", "7–14 days", "14–30 days"].map(t => (
                        <button 
                            key={t} 
                            onClick={() => setFilters(p => ({ ...p, leadTime: p.leadTime === t ? "" : t, page: 1 }))} 
                            className="flex items-center gap-2 w-full text-[12px] font-semibold text-[#4d4634] mb-2 text-left" 
                            style={{ fontFamily: I, color: filters.leadTime === t ? "#3b82f6" : "#4d4634" }}
                        >
                            <div className="size-3.5 rounded border flex items-center justify-center shrink-0" style={{ background: filters.leadTime === t ? "#3b82f6" : "transparent", borderColor: filters.leadTime === t ? "#3b82f6" : "rgba(208,198,174,0.5)" }}>
                                {filters.leadTime === t && <CheckCircle size={10} style={{ color: "white" }}/>}
                            </div>
                            {t}
                        </button>
                    ))}
                </div>

                {/* Certifications - Shown for manufacturers, materials, packaging, labs, audits */}
                {["all", "raw_materials", "manufacturers", "packaging", "quality_labs", "certifications", "machinery"].includes(selectedCategory) && (
                    <div className="pt-2 border-t border-[rgba(208,198,174,0.15)]">
                        <p className="text-[11px] font-bold text-[#4d4634] uppercase tracking-wide mb-2" style={{ fontFamily: M }}>Certifications</p>
                        {certsList.map(c => (
                            <button 
                                key={c} 
                                onClick={() => toggleCert(c)} 
                                className="flex items-center gap-2 w-full text-[12px] text-[#4d4634] mb-2 text-left" 
                                style={{ fontFamily: I }}
                            >
                                <div className="size-3.5 rounded border flex items-center justify-center shrink-0 transition-colors" style={{ background: (filters.certifications || []).includes(c) ? "#303031" : "transparent", borderColor: (filters.certifications || []).includes(c) ? "#303031" : "rgba(208,198,174,0.5)" }}>
                                    {(filters.certifications || []).includes(c) && <CheckCircle size={10} style={{ color: "white" }}/>}
                                </div>
                                {c}
                            </button>
                        ))}
                    </div>
                )}

                {/* Business Type / Capabilities */}
                {["all", "manufacturers", "packaging", "machinery"].includes(selectedCategory) && (
                    <div className="pt-2 border-t border-[rgba(208,198,174,0.15)]">
                        <p className="text-[11px] font-bold text-[#4d4634] uppercase tracking-wide mb-2" style={{ fontFamily: M }}>Manufacturing Mode</p>
                        {["OEM Available", "ODM Available", "Private Label", "Cleanroom"].map(b => (
                            <button 
                                key={b} 
                                onClick={() => setFilters(p => ({ ...p, businessType: p.businessType === b ? "" : b, page: 1 }))}
                                className="flex items-center gap-2 w-full text-[12px] font-semibold mb-2 text-left" 
                                style={{ fontFamily: I, color: filters.businessType === b ? "#3b82f6" : "#4d4634" }}
                            >
                                <div className="size-3.5 rounded border flex items-center justify-center shrink-0" style={{ background: filters.businessType === b ? "#3b82f6" : "transparent", borderColor: filters.businessType === b ? "#3b82f6" : "rgba(208,198,174,0.5)" }}>
                                    {filters.businessType === b && <CheckCircle size={10} style={{ color: "white" }}/>}
                                </div>
                                {b}
                            </button>
                        ))}
                    </div>
                )}

                {/* Warehouse Specialized Filters */}
                {["all", "warehouses"].includes(selectedCategory) && (
                    <div className="pt-2 border-t border-[rgba(208,198,174,0.15)]">
                        <p className="text-[11px] font-bold text-[#f97316] uppercase tracking-wide mb-2" style={{ fontFamily: M }}>Warehouse Features</p>
                        {["Cold Storage", "Bonded"].map(w => (
                            <button 
                                key={w} 
                                onClick={() => setFilters(p => ({ ...p, warehouseType: p.warehouseType === w ? "" : w, page: 1 }))}
                                className="flex items-center gap-2 w-full text-[12px] font-semibold mb-2 text-left" 
                                style={{ fontFamily: I, color: filters.warehouseType === w ? "#f97316" : "#4d4634" }}
                            >
                                <div className="size-3.5 rounded border flex items-center justify-center shrink-0" style={{ background: filters.warehouseType === w ? "#f97316" : "transparent", borderColor: filters.warehouseType === w ? "#f97316" : "rgba(208,198,174,0.5)" }}>
                                    {filters.warehouseType === w && <CheckCircle size={10} style={{ color: "white" }}/>}
                                </div>
                                {w === "Cold" ? "❄️ Reefer / Cold Chain" : "🏛️ Customs Bonded License"}
                            </button>
                        ))}
                    </div>
                )}

                {/* Logistics & Trade Specialized Filters */}
                {["all", "logistics", "import_export"].includes(selectedCategory) && (
                    <div className="pt-2 border-t border-[rgba(208,198,174,0.15)]">
                        <p className="text-[11px] font-bold text-[#14b8a6] uppercase tracking-wide mb-2" style={{ fontFamily: M }}>Transport & Cargo Mode</p>
                        {["Road", "Air", "Ocean", "Reefer"].map(t => (
                            <button 
                                key={t} 
                                onClick={() => setFilters(p => ({ ...p, transportType: p.transportType === t ? "" : t, page: 1 }))}
                                className="flex items-center gap-2 w-full text-[12px] font-semibold mb-2 text-left" 
                                style={{ fontFamily: I, color: filters.transportType === t ? "#14b8a6" : "#4d4634" }}
                            >
                                <div className="size-3.5 rounded border flex items-center justify-center shrink-0" style={{ background: filters.transportType === t ? "#14b8a6" : "transparent", borderColor: filters.transportType === t ? "#14b8a6" : "rgba(208,198,174,0.5)" }}>
                                    {filters.transportType === t && <CheckCircle size={10} style={{ color: "white" }}/>}
                                </div>
                                {t === "Road" ? "🚛 FTL / LTL Road" : t === "Air" ? "✈️ Air Express" : t === "Ocean" ? "🚢 Ocean FCL / LCL" : "❄️ Cold Chain Trucking"}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
