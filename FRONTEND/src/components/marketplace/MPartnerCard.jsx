import { useState } from "react";
import { toast } from "sonner";
import { motion } from "motion/react";
import { Brain, CheckCircle, Shield, MapPin, Heart, Package, Truck, Building2, FlaskConical, Award, Cog, Globe, DollarSign, Activity } from "lucide-react";
import { MAIRing } from "./MAIRing";
import { MStars } from "./MStars";
import { I, M } from "../../constants/fonts";

export function MPartnerCard({ p = {}, sel, onCompare, onRFQ, onProfile }) {
    const [saved, setSaved] = useState(false);
    const availStr = String(p.avail || "Available Now");
    const ratingNum = typeof p.rating === "number" ? p.rating : (parseFloat(p.rating) || 4.5);
    const projectsNum = typeof p.projects === "number" ? p.projects : (parseInt(p.projects) || 0);
    const certsList = Array.isArray(p.certs) && p.certs.length > 0 ? p.certs : ["ISO 9001:2015", "Verified Enterprise"];
    const reasonsList = Array.isArray(p.reasons) && p.reasons.length > 0 ? p.reasons : ["AI high confidence recommendation"];
    const categoryCodes = Array.isArray(p.categoryCodes) ? p.categoryCodes : [];
    const badges = Array.isArray(p.badges) ? p.badges : [];

    // Domain-Specific Customization
    const isWarehouse = categoryCodes.includes("warehouses") || p.type === "Warehouses";
    const isLogistics = categoryCodes.includes("logistics") || categoryCodes.includes("import_export") || p.type === "Logistics";
    const isManufacturer = categoryCodes.includes("manufacturers") || categoryCodes.includes("machinery") || p.type === "Manufacturers";
    const isLabOrCert = categoryCodes.includes("quality_labs") || categoryCodes.includes("certifications") || p.type === "Quality Testing Labs";

    // Build specialized 4-metric stat strip with rich manufacturing intelligence
    let statStrip = [
        { l: "Rating", v: ratingNum.toFixed(1), sub: <MStars r={ratingNum}/> },
        { l: "Annual Capacity", v: p.annualCapacity || p.capacity || "High Volume", sub: <span className="text-[10px] text-[#16a34a] font-bold" style={{ fontFamily: I }}>{p.dailyCapacity || "Daily batch execution"}</span> },
        { l: "Factory Bandwidth", v: `${100 - (p.utilizationPct || 75)}% Available`, sub: <span className="text-[10px] text-[#4d4634]" style={{ fontFamily: I }}>{p.utilizationPct || 75}% line utilization</span> },
        { l: "Lead Time", v: p.lead || "14 days", sub: <span className="text-[10px] text-[#3b82f6] font-semibold" style={{ fontFamily: I }}>doorstep fulfillment</span> },
    ];

    if (isWarehouse) {
        statStrip = [
            { l: "Rating", v: ratingNum.toFixed(1), sub: <MStars r={ratingNum}/> },
            { l: "Storage Area", v: p.storageCapacitySqft ? `${p.storageCapacitySqft.toLocaleString()} sq.ft` : p.capacity || "150,000 sq.ft", sub: <span className="text-[10px] text-[#f97316] font-bold" style={{ fontFamily: I }}>Grade-A Facility</span> },
            { l: "Facility Type", v: p.hasColdStorage ? "❄️ Cold + Dry" : "🏢 Dry Storage", sub: <span className="text-[10px] text-[#4d4634]" style={{ fontFamily: I }}>climate controlled</span> },
            { l: "Customs Bonded", v: p.isBondedWarehouse ? "🏛️ Bonded License" : "📦 Standard 3PL", sub: <span className="text-[10px] text-[#16a34a] font-semibold" style={{ fontFamily: I }}>port cleared</span> },
        ];
    } else if (isLogistics) {
        statStrip = [
            { l: "Rating", v: ratingNum.toFixed(1), sub: <MStars r={ratingNum}/> },
            { l: "Active Fleet", v: p.fleetSize ? `${p.fleetSize} Trucks` : "250+ Vehicles", sub: <span className="text-[10px] text-[#14b8a6] font-bold" style={{ fontFamily: I }}>GPS & Reefer Enabled</span> },
            { l: "Express Speed", v: p.lead || "2-4 Days", sub: <span className="text-[10px] text-[#4d4634]" style={{ fontFamily: I }}>pan-India transit</span> },
            { l: "Dispatch Reply", v: p.response || "< 1 hr", sub: <span className="text-[10px] text-[#4d4634]" style={{ fontFamily: I }}>instant booking</span> },
        ];
    } else if (isManufacturer) {
        statStrip = [
            { l: "Rating", v: ratingNum.toFixed(1), sub: <MStars r={ratingNum}/> },
            { l: "Throughput", v: p.annualCapacity || "500,000 /mo", sub: <span className="text-[10px] text-[#3b82f6] font-bold" style={{ fontFamily: I }}>GMP & ISO validated</span> },
            { l: "Line Bandwidth", v: `${100 - (p.utilizationPct || 70)}% Free`, sub: <span className="text-[10px] text-[#16a34a] font-semibold" style={{ fontFamily: I }}>ready for production</span> },
            { l: "Production Lead", v: p.lead || "14–21 Days", sub: <span className="text-[10px] text-[#4d4634]" style={{ fontFamily: I }}>batch execution</span> },
        ];
    } else if (isLabOrCert) {
        statStrip = [
            { l: "Rating", v: ratingNum.toFixed(1), sub: <MStars r={ratingNum}/> },
            { l: "Accreditation", v: "NABL & FSSAI", sub: <span className="text-[10px] text-[#eab308] font-bold" style={{ fontFamily: I }}>ISO/IEC 17025</span> },
            { l: "Turnaround", v: p.lead || "5–7 Days", sub: <span className="text-[10px] text-[#4d4634]" style={{ fontFamily: I }}>certificate issuance</span> },
            { l: "Audit Scope", v: "Global Export", sub: <span className="text-[10px] text-[#16a34a] font-semibold" style={{ fontFamily: I }}>US FDA & EU CE</span> },
        ];
    }

    // Build specialized middle data metrics
    let middleMetrics = [
        { l: "Price & Scale", v: `${p.price || "$$"} (${p.revenueRange || "$5M-$15M"})` },
        { l: "Min. Order (MOQ)", v: p.moq || "500 kg" },
        { l: "Export Reach", v: p.exportMarkets || "US, EU & Pan-India" },
    ];
    if (isWarehouse) {
        middleMetrics = [
            { l: "Hub Location", v: (p.warehouseLocations && p.warehouseLocations[0]) || p.location || "Port Terminal" },
            { l: "Min. Lease Area", v: p.moq || "500 sq.ft" },
            { l: "Active Clients", v: `${projectsNum || 85}+ Enterprises` },
        ];
    } else if (isLogistics) {
        middleMetrics = [
            { l: "Transport Modes", v: (p.shippingModes && p.shippingModes.slice(0, 2).join(", ")) || "Road, Ocean & Air" },
            { l: "Min. Shipment", v: p.moq || "LTL & FTL Supported" },
            { l: "Monthly Dispatches", v: `${(projectsNum || 40) * 3}+ Cargo Runs` },
        ];
    }

    const machineryList = Array.isArray(p.machineryList) && p.machineryList.length > 0 ? p.machineryList : (Array.isArray(p.machinery) ? p.machinery : []);

    return (
        <motion.div 
            whileHover={{ y: -2, boxShadow: "0 18px 52px rgba(0,0,0,0.09)" }} 
            transition={{ duration: 0.18 }} 
            className="bg-white rounded-2xl border border-[rgba(208,198,174,0.25)] overflow-hidden transition-all hover:border-[rgba(59,130,246,0.35)]"
        >
            {/* — Header — */}
            <div className="px-6 pt-5 pb-4 flex items-start gap-4 border-b border-[rgba(208,198,174,0.12)] bg-gradient-to-r from-white via-[#fcfbfa] to-[#f8f9fc]/40">
                <div className="size-[56px] rounded-2xl flex items-center justify-center text-[28px] shrink-0 shadow-sm" style={{ background: p.bg || "rgba(59,130,246,0.1)", border: `1px solid ${p.col || "#3b82f6"}33` }}>
                    {p.logo || "🏭"}
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-bold text-[#1b1c1c] text-[17px] tracking-tight" style={{ fontFamily: M }}>{p.name || "Enterprise Partner"}</p>
                        {p.verified && (
                            <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold shadow-xs" style={{ background: "rgba(22,163,74,0.12)", color: "#16a34a", border: "1px solid rgba(22,163,74,0.2)", fontFamily: I }}>
                                <CheckCircle size={10}/> Verified Enterprise
                            </span>
                        )}
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md" style={{ background: `${p.col || "#3b82f6"}18`, color: p.col || "#3b82f6", fontFamily: M }}>
                            {p.type || "Industrial Partner"}
                        </span>
                        {p.specialization && (
                            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-[#f0eef6] text-[#55388c] border border-[#dcd7ed]" style={{ fontFamily: I }}>
                                🎯 {p.specialization}
                            </span>
                        )}
                    </div>
                    
                    <p className="text-[12.5px] text-[#4d4634] mt-1.5 line-clamp-1 leading-relaxed" style={{ fontFamily: I }}>
                        {p.description || "Leading industry supplier operating verified facilities with reliable supply chain capabilities."}
                    </p>

                    <div className="flex items-center gap-3 mt-2 text-[11.5px] text-[#4d4634] flex-wrap" style={{ fontFamily: I }}>
                        <span className="flex items-center gap-1 font-semibold text-[#1b1c1c]">
                            <Building2 size={13} style={{ color: p.col || "#3b82f6" }}/> HQ: {p.headOffice || p.location || "Global Hub"}
                        </span>
                        <span className="opacity-30">·</span>
                        <span className="text-[#565147]">Est. {p.establishedYear || 2012} ({p.years || 12} yrs Exp.)</span>
                        <span className="opacity-30">·</span>
                        <span className="flex items-center gap-1">
                            <Activity size={12} className="text-[#16a34a]"/>
                            <span style={{ color: availStr.includes("left") || availStr.includes("Low") ? "#eab308" : "#16a34a", fontWeight: 700 }}>{availStr}</span>
                        </span>
                    </div>
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0">
                    <MAIRing score={p.match || 92}/>
                    <button onClick={() => setSaved(v => !v)} className="p-1.5 hover:bg-[#f3f1eb] rounded-lg transition">
                        <Heart size={16} fill={saved ? "#ba1a1a" : "none"} stroke={saved ? "#ba1a1a" : "#4d4634"}/>
                    </button>
                </div>
            </div>

            {/* — Specialized Domain Stats Strip — */}
            <div className="grid grid-cols-4 divide-x divide-[rgba(208,198,174,0.15)] border-b border-[rgba(208,198,174,0.15)] bg-[#f9f8f5]">
                {statStrip.map((s, i) => (
                    <div key={i} className="px-4 py-3 text-center">
                        <p className="font-extrabold text-[14px] text-[#1b1c1c]" style={{ fontFamily: M }}>{s.v}</p>
                        <div className="flex justify-center mt-0.5">{s.sub}</div>
                    </div>
                ))}
            </div>

            {/* — Body — */}
            <div className="px-6 py-4 flex gap-6 items-start">
                <div className="flex-1 min-w-0 flex flex-col gap-3.5">
                    {/* Domain Metrics */}
                    <div className="flex items-start gap-6 flex-wrap pb-1 border-b border-dashed border-[rgba(208,198,174,0.2)]">
                        {middleMetrics.map((m, i) => (
                            <div key={i} className={i > 0 ? "border-l border-[rgba(208,198,174,0.25)] pl-6" : ""}>
                                <p className="text-[10px] font-bold text-[#6f6a5b] uppercase tracking-wider mb-0.5" style={{ fontFamily: M }}>{m.l}</p>
                                <p className="font-bold text-[14.5px] text-[#1b1c1c]" style={{ fontFamily: M }}>{m.v}</p>
                            </div>
                        ))}
                    </div>

                    {/* B2B Enterprise Capability Badges */}
                    <div className="flex flex-wrap gap-2 items-center">
                        {p.customMfg && <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-[#e8f5e9] text-[#2e7d32] border border-[#c8e6c9]">✓ Custom Manufacturing</span>}
                        {p.whiteLabel && <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-[#e3f2fd] text-[#1565c0] border border-[#bbdefb]">✓ White-Label / ODM</span>}
                        {p.exportReady && <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-[#fff3e0] text-[#e65100] border border-[#ffe0b2]">🌐 Global Export Certified</span>}
                    </div>

                    {/* Specialized Domain Capabilities & Materials Badges */}
                    <div className="flex flex-wrap gap-1.5 items-center">
                        <span className="text-[11.5px] font-bold text-[#4d4634] mr-1" style={{ fontFamily: M }}>Core Offerings:</span>
                        {badges.map((b, i) => (
                            <span key={i} className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-[#f3f1eb] text-[#303031] border border-[#e5e2da]" style={{ fontFamily: I }}>
                                {b}
                            </span>
                        ))}
                    </div>

                    {/* Machinery & Processing Equipment */}
                    {machineryList.length > 0 && (
                        <div className="flex items-center gap-2 text-[11.5px] text-[#554e41] bg-[#f8f9fb] px-3 py-2 rounded-xl border border-[#e2e8f0]" style={{ fontFamily: I }}>
                            <Cog size={13} className="text-[#3b82f6] shrink-0 animate-spin-slow"/>
                            <span className="font-bold text-[#1b1c1c]" style={{ fontFamily: M }}>Processing Infrastructure:</span>
                            <span className="truncate">{machineryList.slice(0, 3).join(", ")}{machineryList.length > 3 ? " + more" : ""}</span>
                        </div>
                    )}

                    {/* Certifications & Audits */}
                    <div className="flex flex-wrap gap-1.5">
                        {certsList.slice(0, 4).map(c => (
                            <span key={c} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold border border-[rgba(208,198,174,0.3)] shadow-2xs" style={{ background: "#f5f4f0", color: "#303031", fontFamily: I }}>
                                <Shield size={11} style={{ color: "#16a34a" }}/>{c}
                            </span>
                        ))}
                    </div>

                    {/* AI Why Recommended Box */}
                    <div className="flex flex-col gap-1.5 px-4 py-3 rounded-xl mt-0.5" style={{ background: "rgba(255,213,74,0.1)", border: "1px solid rgba(255,213,74,0.35)", boxShadow: "0 2px 10px rgba(255,213,74,0.08)" }}>
                        <div className="flex items-center gap-1.5 mb-0.5">
                            <Brain size={14} style={{ color: "#735c00" }}/>
                            <span className="text-[11px] font-bold uppercase tracking-wider text-[#735c00]" style={{ fontFamily: M }}>Why AI Advisor Selected This Partner</span>
                        </div>
                        {reasonsList.map((r, i) => (
                            <div key={i} className="flex items-center gap-2">
                                <CheckCircle size={13} className="shrink-0" style={{ color: "#16a34a" }}/>
                                <span className="text-[12.5px] font-medium text-[#4d4634]" style={{ fontFamily: I }}>{r}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Action buttons */}
                <div className="flex flex-col gap-2.5 w-[155px] shrink-0 justify-center sticky top-4">
                    <button onClick={onProfile} className="w-full py-2.5 rounded-xl text-[13px] font-bold text-white hover:bg-[#1b1c1c] transition shadow-md shadow-black/10 hover:shadow-lg" style={{ background: "#303031", fontFamily: M }}>
                        View Profile
                    </button>
                    <button onClick={onRFQ} className="w-full py-2.5 rounded-xl text-[13px] font-bold hover:opacity-90 transition shadow-sm bg-gradient-to-r from-[#ffd54a] to-[#ffca28]" style={{ color: "#735c00", fontFamily: M }}>
                        Send Instant RFQ
                    </button>
                    <button onClick={() => toast.success(`${p.name} added to Supply Chain Project`)} className="w-full py-2.5 rounded-xl text-[12.5px] font-semibold border border-[rgba(208,198,174,0.35)] text-[#4d4634] hover:bg-[#efeded] transition bg-white" style={{ fontFamily: M }}>
                        + Add to Project
                    </button>
                    <button onClick={onCompare} className="w-full py-2 rounded-xl text-[12.5px] font-semibold border transition" style={{ background: sel ? "rgba(59,130,246,0.12)" : "transparent", borderColor: sel ? "#3b82f6" : "rgba(208,198,174,0.35)", color: sel ? "#2563eb" : "#4d4634", fontFamily: M }}>
                        {sel ? "✓ Selected (Compare)" : "⇄ Compare Specs"}
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
