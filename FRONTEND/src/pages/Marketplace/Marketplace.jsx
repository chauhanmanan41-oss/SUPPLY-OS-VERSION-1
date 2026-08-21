import { useState, useMemo } from "react";
import { toast } from "sonner";
import { motion } from "motion/react";
import { Brain, Search, ChevronRight, X, LayoutGrid, Heart, Plus, Sparkles } from "lucide-react";
import { Badge } from "../../components/common/Badge";
import { MAIAdvisor } from "../../components/marketplace/MAIAdvisor";
import { MAnalytics } from "../../components/marketplace/MAnalytics";
import { MCompareModal } from "../../components/marketplace/MCompareModal";
import { MFilterPanel } from "../../components/marketplace/MFilterPanel";
import { MPartnerCard } from "../../components/marketplace/MPartnerCard";
import { MProfileModal } from "../../components/marketplace/MProfileModal";
import { MStars } from "../../components/marketplace/MStars";
import { I, M } from "../../constants/fonts";
import { MKT_CATS } from "../../constants/marketplace";
import { useApi } from "../../hooks/useApi";
import { CreatePartnerModal } from "../../components/marketplace/CreatePartnerModal";
import { MSupplyBuilder } from "../../components/marketplace/MSupplyBuilder";
import { AIChat } from "../../components/ai/AIChat";

function mapPartner(p, defaultType = "Supplier") {
    if (!p) return {};
    const ratingNum = typeof p.rating === "number" ? p.rating : (parseFloat(p.rating) || 4.5);
    const categoryCodes = Array.isArray(p.category_codes) ? p.category_codes : (p.category_code ? [p.category_code] : []);
    const categoriesInfo = Array.isArray(p.categories_info) && p.categories_info.length > 0 ? p.categories_info : [{ name: p.type || defaultType, code: "raw_materials" }];
    const primaryCategory = categoriesInfo[0]?.name || p.type || defaultType;
    
    const certsList = Array.isArray(p.certifications) && p.certifications.length > 0
        ? p.certifications
        : (Array.isArray(p.accreditations) && p.accreditations.length > 0 ? p.accreditations : ["ISO 9001:2015", "Verified B2B Partner"]);
        
    const materialsSupplied = Array.isArray(p.materials_supplied) ? p.materials_supplied : [];
    const productsOffered = Array.isArray(p.products_offered) ? p.products_offered : [];
    const capabilities = Array.isArray(p.capabilities) ? p.capabilities : [];
    const machinery = Array.isArray(p.machinery) ? p.machinery : [];
    const accreditations = Array.isArray(p.accreditations) ? p.accreditations : [];
    const testingCapabilities = Array.isArray(p.testing_capabilities) ? p.testing_capabilities : [];
    const standardsCertified = Array.isArray(p.standards_certified) ? p.standards_certified : [];
    const consultingSpecialities = Array.isArray(p.consulting_specialities) ? p.consulting_specialities : [];
    const tradeServices = Array.isArray(p.trade_services) ? p.trade_services : [];
    const shippingModes = Array.isArray(p.shipping_modes) ? p.shipping_modes : [];
    const warehouseLocations = Array.isArray(p.warehouse_locations) ? p.warehouse_locations : [];

    // Resolve badges for UI display
    let badges = [];
    if (materialsSupplied.length > 0) badges = materialsSupplied.slice(0, 3);
    else if (capabilities.length > 0) badges = capabilities.slice(0, 3);
    else if (testingCapabilities.length > 0) badges = testingCapabilities.slice(0, 3);
    else if (standardsCertified.length > 0) badges = standardsCertified.slice(0, 3);
    else if (consultingSpecialities.length > 0) badges = consultingSpecialities.slice(0, 3);
    else if (tradeServices.length > 0) badges = tradeServices.slice(0, 3);
    else badges = ["B2B Verified", "Global Delivery", "Quality Guaranteed"];

    const aiScore = typeof p.ai_score === "number" ? p.ai_score : Math.min(99, Math.round((ratingNum / 5) * 100));
    
    // Resolve color theme based on category
    let col = "#3b82f6";
    let bg = "rgba(59,130,246,0.1)";
    if (categoryCodes.includes("raw_materials") || categoryCodes.includes("quality_labs")) { col = "#16a34a"; bg = "rgba(22,163,74,0.1)"; }
    else if (categoryCodes.includes("warehouses") || categoryCodes.includes("logistics")) { col = "#f97316"; bg = "rgba(249,115,22,0.1)"; }
    else if (categoryCodes.includes("packaging") || categoryCodes.includes("consultants")) { col = "#a855f7"; bg = "rgba(168,85,247,0.1)"; }
    else if (categoryCodes.includes("certifications") || categoryCodes.includes("machinery")) { col = "#eab308"; bg = "rgba(234,179,8,0.1)"; }

    return {
        id: p.id,
        logo: p.logo || "🏭",
        banner: p.banner || "",
        bg: p.bg_theme || bg,
        col: p.color_theme || col,
        name: p.name || "Enterprise Partner",
        slug: p.slug || "",
        type: primaryCategory,
        categoryCodes: categoryCodes,
        categoriesInfo: categoriesInfo,
        match: aiScore,
        rating: ratingNum,
        verified: Boolean(p.verified_status ?? (p.preferred_supplier ?? true)),
        years: p.established_year ? (new Date().getFullYear() - p.established_year) : 10,
        establishedYear: p.established_year || 2015,
        employees: p.employees_range || "50 - 200 Employees",
        turnover: p.annual_turnover || "$5M - $20M",
        avail: p.availability_status || (p.available_capacity_units ? `${p.available_capacity_units.toLocaleString()} units left` : "Available Now"),
        response: p.response_time_display || (p.response_time_hours ? `< ${p.response_time_hours} hrs` : "< 4 hrs"),
        capacity: p.monthly_capacity_display || (p.monthly_capacity_number ? `${p.monthly_capacity_number.toLocaleString()}/mo` : "Standard Capacity"),
        lead: p.lead_time_days ? `${p.lead_time_days} days` : "14 days",
        leadDaysNum: p.lead_time_days || 14,
        price: p.price_tier || "$$",
        moq: p.moq_display || (p.moq_number ? `${p.moq_number.toLocaleString()} units` : (p.moq ? `${p.moq} units` : "Flexible")),
        moqNum: p.moq_number || p.moq || 500,
        projects: typeof p.completed_projects_count === "number" ? p.completed_projects_count : (typeof p.projects_count === "number" ? p.projects_count : 125),
        reviews: typeof p.reviews_count === "number" ? p.reviews_count : 32,
        location: p.city ? `${p.city}, ${p.country || "India"}` : (p.country || "Global Hub"),
        city: p.city || "Mumbai",
        state: p.state || "Maharashtra",
        country: p.country || "India",
        address: p.address || "",
        website: p.website || "",
        email: p.contact_email || "",
        phone: p.contact_phone || "",
        description: p.description || "Leading B2B industrial partner supplying high-grade materials and reliable supply chain services.",
        badges: badges,
        certs: certsList,
        reasons: Array.isArray(p.reasons) && p.reasons.length > 0 ? p.reasons : [
            `High AI confidence score (${aiScore}% match with ${p.quality_score || 92}/100 quality benchmark)`,
            `Verified B2B enterprise in ${p.city || "Industrial Hub"}`
        ],
        // Category specialized domain fields & enterprise B2B intelligence
        specialization: p.specialization || p.primary_industry || "Enterprise B2B Operations",
        headOffice: p.head_office || (p.city ? `${p.city}, ${p.country || "India"}` : "Mumbai, India"),
        revenueRange: p.revenue_range || p.annual_turnover || "$5M - $15M",
        dailyCapacity: p.daily_capacity || (p.monthly_capacity_number ? `${Math.round(p.monthly_capacity_number / 26).toLocaleString()} /day` : "10,000 /day"),
        annualCapacity: p.annual_capacity || (p.monthly_capacity_number ? `${(p.monthly_capacity_number * 12).toLocaleString()} /year` : "Enterprise Volume"),
        utilizationPct: typeof p.current_utilization_pct === "number" ? p.current_utilization_pct : 75,
        customMfg: Boolean(p.custom_manufacturing_support || p.oem_available),
        whiteLabel: Boolean(p.white_label_support || p.odm_available),
        exportReady: Boolean(p.export_ready ?? true),
        exportMarkets: p.export_markets || "US, EU, UK & Middle East",
        machineryList: machinery,
        servicesList: Array.isArray(p.services) && p.services.length > 0 ? p.services : capabilities,
        materialsSupplied, productsOffered, capabilities, machinery,
        oem: Boolean(p.oem_available), odm: Boolean(p.odm_available),
        storageCapacitySqft: p.storage_capacity_sqft || null,
        hasColdStorage: Boolean(p.has_cold_storage),
        isBondedWarehouse: Boolean(p.is_bonded_warehouse),
        warehouseLocations,
        fleetSize: p.fleet_size || null,
        shippingModes,
        accreditations,
        testingCapabilities,
        standardsCertified,
        consultingSpecialities,
        tradeServices,
        raw: p
    };
}

export function MarketplacePage() {
    const [view, setView] = useState("landing");
    const [query, setQuery] = useState("");
    const [searchVal, setSearchVal] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [filters, setFilters] = useState({
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

    // Build URL query string for enterprise search
    const searchUrl = useMemo(() => {
        const params = new URLSearchParams();
        if (query) params.append("q", query);
        if (selectedCategory && selectedCategory !== "all") params.append("category", selectedCategory);
        if (filters.verifiedOnly) params.append("verified_only", "true");
        if (filters.exportReady) params.append("export_ready", "true");
        if (filters.customMfg) params.append("custom_mfg", "true");
        if (filters.whiteLabel) params.append("white_label_support", "true");
        if (filters.qualityLab) params.append("has_quality_lab", "true");
        if (filters.cleanRoom) params.append("has_clean_room", "true");
        if (filters.matchMin > 0) params.append("min_match", filters.matchMin);
        if (filters.minRating) params.append("min_rating", filters.minRating);
        if (filters.location) params.append("location", filters.location);
        if (filters.certifications.length > 0) params.append("certifications", filters.certifications.join(","));
        if (filters.businessType) params.append("business_type", filters.businessType);
        if (filters.leadTime) params.append("lead_time", filters.leadTime);
        if (filters.warehouseType) params.append("warehouse_type", filters.warehouseType);
        if (filters.transportType) params.append("transport_type", filters.transportType);
        if (filters.sort) params.append("sort", filters.sort);
        if (filters.page > 1) params.append("page", filters.page);
        return `/marketplace/search/?${params.toString()}`;
    }, [query, selectedCategory, filters]);

    // Fetch dynamic data from backend APIs
    const { data: searchData, meta: searchMeta, loading: searchLoading, error: searchError, refetch } = useApi(searchUrl);
    const { data: categoriesData } = useApi("/marketplace/categories/");
    const { data: trendingData } = useApi("/marketplace/trending-searches/");

    // Merge live category counts with constants or backend listings
    const displayCategories = useMemo(() => {
        if (Array.isArray(categoriesData) && categoriesData.length > 0) {
            return categoriesData.map(c => ({
                id: c.slug,
                code: c.category_code || c.slug,
                label: c.name,
                emoji: c.icon || "🏭",
                count: `${c.companies_count || 35}+ verified`,
                desc: c.description || "Verified industrial suppliers",
                color: c.color_theme || "#3b82f6",
                bg: c.bg_theme || "rgba(59,130,246,0.08)"
            }));
        }
        return MKT_CATS.map(c => ({ ...c, code: c.id, count: c.count }));
    }, [categoriesData]);

    const results = useMemo(() => {
        if (!searchData && !searchMeta) return [];
        const items = Array.isArray(searchData) 
            ? searchData 
            : (searchData?.results || searchData?.partners || searchMeta?.results || searchMeta?.partners || []);
        return items.map(p => mapPartner(p, selectedCategory !== "all" ? selectedCategory : "Partner"));
    }, [searchData, searchMeta, selectedCategory]);

    const trendingSearches = (trendingData || []).map(t => typeof t === "string" ? t : t.query);

    const [compareSel, setCompareSel] = useState([]);
    const [compareOpen, setCompareOpen] = useState(false);
    const [profileP, setProfileP] = useState(null);
    const [featTab, setFeatTab] = useState(0);
    const [createModal, setCreateModal] = useState(false);
    const [aiChatOpen, setAiChatOpen] = useState(false);

    const goSearch = (q, categoryCode = null) => {
        if (q !== null) {
            setSearchVal(q);
            setQuery(q);
        } else {
            setSearchVal("");
            setQuery("");
        }
        if (categoryCode !== null) {
            setSelectedCategory(categoryCode);
        }
        setFilters(prev => ({ ...prev, page: 1 }));
        setView("results");
    };

    const toggleCmp = (id) => setCompareSel(s => {
        if (s.includes(id)) return s.filter(x => x !== id);
        if (s.length >= 3) {
            toast.error("Max 3 partners for comparison");
            return s;
        }
        return [...s, id];
    });

    const activeCatObj = displayCategories.find(c => c.code === selectedCategory || c.id === selectedCategory);

    return (
        <div className="flex flex-1 overflow-hidden">
            {/* Left filter — results only */}
            {view === "results" && (
                <MFilterPanel 
                    filters={filters} 
                    setFilters={setFilters} 
                    selectedCategory={selectedCategory} 
                    setSelectedCategory={setSelectedCategory}
                    categories={displayCategories}
                />
            )}

            {/* Main scroll area */}
            <main className="flex-1 overflow-y-auto bg-[#fbf9f9]" style={{ scrollbarWidth: "none" }}>
                <div className="flex flex-col gap-6 p-8">
                    {/* ── Page header ── */}
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div>
                            <h1 className="text-[26px] font-bold text-[#1b1c1c]" style={{ fontFamily: M }}>Enterprise B2B Marketplace</h1>
                            <p className="text-[14px] text-[#4d4634] mt-1 max-w-xl" style={{ fontFamily: I }}>
                                Discover verified suppliers, manufacturers, packaging houses, 3PL warehouses, testing labs and customs agents.
                            </p>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                            <button onClick={() => setCreateModal(true)} className="flex items-center gap-2 px-5 py-2.5 bg-[#303031] text-white rounded-xl font-bold text-[13px] hover:bg-[#1b1c1c] transition" style={{ fontFamily: M }}>
                                <Plus size={14}/> Add Partner
                            </button>
                            <button onClick={() => toast.info("Saved Partners List Open")} className="flex items-center gap-2 px-4 py-2.5 border border-[rgba(208,198,174,0.3)] rounded-xl text-[13px] font-semibold text-[#1b1c1c] hover:bg-[#efeded] transition" style={{ fontFamily: M }}>
                                <Heart size={14}/> Saved Partners
                            </button>
                            <button onClick={() => compareSel.length >= 2 ? setCompareOpen(true) : toast.info("Select 2+ partners to compare")} className="flex items-center gap-2 px-4 py-2.5 border rounded-xl text-[13px] font-semibold hover:bg-[#efeded] transition" style={{ fontFamily: M, borderColor: "rgba(208,198,174,0.3)", color: compareSel.length >= 2 ? "#3b82f6" : "#1b1c1c" }}>
                                <LayoutGrid size={14}/>
                                Compare {compareSel.length > 0 && `(${compareSel.length})`}
                            </button>
                        </div>
                    </div>

                    {/* ── AI Search bar ── */}
                    <div className="bg-white rounded-2xl border border-[rgba(208,198,174,0.2)] overflow-hidden" style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.05)" }}>
                        <div className="flex items-center gap-4 px-5 py-4 border-b border-[rgba(208,198,174,0.12)]">
                            <div className="size-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(255,213,74,0.15)" }}>
                                <Brain size={17} style={{ color: "#735c00" }}/>
                            </div>
                            <input 
                                type="text" 
                                placeholder='Intelligent Search: e.g. "Need GMP whey protein manufacturer in Gujarat" or "Cold storage near Mumbai"' 
                                value={searchVal} 
                                onChange={e => setSearchVal(e.target.value)} 
                                onKeyDown={e => e.key === 'Enter' && goSearch(searchVal)} 
                                className="flex-1 text-[15px] text-[#1b1c1c] bg-transparent outline-none placeholder-[#4d4634]/50" 
                                style={{ fontFamily: I }}
                            />
                            {searchVal && (
                                <button onClick={() => { setSearchVal(""); setQuery(""); setSelectedCategory("all"); setView("landing"); }} className="p-1.5 hover:bg-[#efeded] rounded-lg transition">
                                    <X size={16} style={{ color: "#4d4634" }}/>
                                </button>
                            )}
                            <button onClick={() => goSearch(searchVal)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-[13px] text-white hover:bg-[#1b1c1c] transition" style={{ background: "#303031", fontFamily: M }}>
                                <Search size={14}/> AI Search
                            </button>
                        </div>
                        <div className="px-5 py-3 flex items-center gap-2 flex-wrap">
                            <span className="text-[12px] font-semibold text-[#4d4634] shrink-0" style={{ fontFamily: I }}>Trending NLP Queries:</span>
                            {trendingSearches.map((t, index) => (
                                <button key={index} onClick={() => goSearch(t)} className="px-3 py-1 rounded-full text-[12px] font-medium transition hover:bg-[#303031] hover:text-white" style={{ background: "#efeded", color: "#4d4634", fontFamily: I }}>
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* ── LANDING VIEW ── */}
                    {view === "landing" && (
                        <>
                            {/* Category explorer */}
                            <div>
                                <p className="font-bold text-[16px] text-[#1b1c1c] mb-4" style={{ fontFamily: M }}>Browse by Business Category</p>
                                <div className="grid grid-cols-5 gap-3">
                                    {displayCategories.map(cat => (
                                        <motion.button 
                                            key={cat.id} 
                                            onClick={() => goSearch(null, cat.code)} 
                                            whileHover={{ y: -3, boxShadow: "0 10px 32px rgba(0,0,0,0.1)" }} 
                                            transition={{ duration: 0.15 }} 
                                            className="flex flex-col items-start gap-3 p-4 rounded-2xl bg-white border border-[rgba(208,198,174,0.2)] text-left"
                                        >
                                            <div className="size-10 rounded-xl flex items-center justify-center text-xl" style={{ background: cat.bg }}>
                                                {cat.emoji}
                                            </div>
                                            <div>
                                                <p className="font-bold text-[13px] text-[#1b1c1c] leading-snug" style={{ fontFamily: M }}>{cat.label}</p>
                                                <p className="text-[11px] font-bold mt-0.5" style={{ color: cat.color, fontFamily: I }}>{cat.count}</p>
                                                <p className="text-[11px] text-[#4d4634] mt-1 leading-snug" style={{ fontFamily: I }}>{cat.desc}</p>
                                            </div>
                                        </motion.button>
                                    ))}
                                </div>
                            </div>

                            {/* Supply Chain Builder */}
                            <MSupplyBuilder />

                            {/* Featured section */}
                            <div className="bg-white rounded-2xl border border-[rgba(208,198,174,0.2)] overflow-hidden">
                                <div className="flex items-center gap-1 px-5 pt-5 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
                                    {["Top Rated Partners", "GMP Manufacturers", "Packaging & Labels", "Grade-A Warehouses", "NABL Testing Labs"].map((tab, i) => (
                                        <button 
                                            key={tab} 
                                            onClick={() => setFeatTab(i)} 
                                            className="px-4 py-2 rounded-lg text-[13px] font-semibold transition whitespace-nowrap shrink-0" 
                                            style={{ background: featTab === i ? "#303031" : "transparent", color: featTab === i ? "white" : "#4d4634", fontFamily: M }}
                                        >
                                            {tab}
                                        </button>
                                    ))}
                                </div>
                                <div className="px-5 pb-5 pt-4 grid grid-cols-3 gap-4">
                                    {results.slice(featTab * 3, (featTab + 1) * 3).map((p, i) => (
                                        <motion.div key={p.id || i} whileHover={{ y: -2 }} transition={{ duration: 0.15 }} className="p-4 rounded-2xl border border-[rgba(208,198,174,0.2)] bg-[#fbf9f9] flex flex-col gap-3">
                                            <div className="flex items-center justify-between gap-2">
                                                <div className="flex items-center gap-3">
                                                    <div className="size-10 rounded-xl flex items-center justify-center text-xl" style={{ background: p.bg }}>
                                                        {p.logo}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-[14px] text-[#1b1c1c]" style={{ fontFamily: M }}>{p.name}</p>
                                                        <p className="text-[11px]" style={{ color: p.col, fontFamily: I }}>{p.type}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right shrink-0">
                                                    <p className="font-bold text-[15px]" style={{ color: p.match >= 90 ? "#16a34a" : "#3b82f6", fontFamily: M }}>{p.match}%</p>
                                                    <p className="text-[10px] text-[#4d4634]" style={{ fontFamily: I }}>AI Match</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-1.5">
                                                    <MStars r={p.rating}/>
                                                    <span className="text-[12px] font-bold text-[#1b1c1c]" style={{ fontFamily: M }}>{p.rating}</span>
                                                </div>
                                                <span className="text-[12px] font-semibold text-[#4d4634]" style={{ fontFamily: I }}>{p.lead} lead time</span>
                                            </div>
                                            <button onClick={() => setProfileP(p)} className="w-full py-2 rounded-xl text-[12px] font-bold hover:opacity-90 transition" style={{ background: "#ffd54a", color: "#735c00", fontFamily: M }}>
                                                View Complete Profile →
                                            </button>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            {/* Analytics */}
                            <MAnalytics />
                        </>
                    )}

                    {/* ── RESULTS VIEW ── */}
                    {view === "results" && (
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center justify-between bg-white px-6 py-4 rounded-2xl border border-[rgba(208,198,174,0.2)]">
                                <div className="flex items-center gap-3 flex-wrap">
                                    {activeCatObj && (
                                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl" style={{ background: activeCatObj.bg, color: activeCatObj.color }}>
                                            <span>{activeCatObj.emoji}</span>
                                            <span className="font-bold text-[13px]" style={{ fontFamily: M }}>{activeCatObj.label}</span>
                                        </div>
                                    )}
                                    <p className="font-bold text-[16px] text-[#1b1c1c]" style={{ fontFamily: M }}>
                                        {query ? `Search Results for "${query}"` : (selectedCategory === "all" ? "All B2B Partners" : `${activeCatObj?.label || "Category"} Directory`)}
                                    </p>
                                    <Badge label={`${searchMeta?.total_count ?? searchMeta?.count ?? results.length} Verified Partners Found`} color="#3b82f6" bg="rgba(59,130,246,0.1)"/>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[12px] text-[#4d4634]" style={{ fontFamily: I }}>Sort by:</span>
                                        <select 
                                            value={filters.sort} 
                                            onChange={e => setFilters(prev => ({ ...prev, sort: e.target.value }))} 
                                            className="px-3 py-1.5 rounded-xl border border-[rgba(208,198,174,0.3)] text-[12px] bg-[#fbf9f9] text-[#1b1c1c] font-semibold outline-none cursor-pointer"
                                            style={{ fontFamily: M }}
                                        >
                                            <option value="-rating">Highest Rating</option>
                                            <option value="-ai_score">Best AI Match</option>
                                            <option value="lead_time_days">Fastest Lead Time</option>
                                            <option value="-reviews_count">Most Reviewed</option>
                                        </select>
                                    </div>
                                    <button onClick={() => { setView("landing"); setQuery(""); setSearchVal(""); setSelectedCategory("all"); }} className="flex items-center gap-1.5 text-[13px] font-bold text-[#3b82f6] hover:underline transition" style={{ fontFamily: M }}>
                                        <ChevronRight size={14} className="rotate-180"/> Back to Explorer
                                    </button>
                                </div>
                            </div>

                            {searchLoading ? (
                                <div className="py-24 flex flex-col items-center justify-center gap-3">
                                    <div className="size-9 border-[3px] border-[#3b82f6]/20 border-t-[#3b82f6] rounded-full animate-spin" />
                                    <p className="text-[13px] text-[#4d4634] font-semibold" style={{ fontFamily: I }}>AI Advisor evaluating matching industrial enterprises…</p>
                                </div>
                            ) : searchError ? (
                                <div className="py-16 text-center bg-white rounded-2xl border border-[rgba(208,198,174,0.2)] p-8">
                                    <div className="text-[40px] mb-3">⚠️</div>
                                    <p className="font-bold text-[18px] text-[#ba1a1a]" style={{ fontFamily: M }}>Failed to connect to Marketplace directory</p>
                                    <p className="text-[13px] text-[#4d4634] mt-1 max-w-md mx-auto" style={{ fontFamily: I }}>
                                        We encountered an error loading partner data from the server. Please verify your connection and try again.
                                    </p>
                                    <button 
                                        onClick={() => refetch()}
                                        className="mt-5 px-6 py-2.5 rounded-xl text-[13px] font-bold text-white bg-[#303031]"
                                        style={{ fontFamily: M }}
                                    >
                                        Retry Loading Partners
                                    </button>
                                </div>
                            ) : results.length === 0 ? (
                                <div className="py-16 text-center bg-white rounded-2xl border border-[rgba(208,198,174,0.2)] p-8">
                                    <div className="text-[40px] mb-3">🔍</div>
                                    <p className="font-bold text-[18px] text-[#1b1c1c]" style={{ fontFamily: M }}>No exact partner matches found</p>
                                    <p className="text-[13px] text-[#4d4634] mt-1 max-w-md mx-auto" style={{ fontFamily: I }}>
                                        Try broadening your location filters, lowering AI match thresholds, or exploring alternative category directories.
                                    </p>
                                    <button 
                                        onClick={() => { setFilters({ verifiedOnly: false, exportReady: false, customMfg: false, whiteLabel: false, qualityLab: false, cleanRoom: false, matchMin: 80, minRating: "", location: "", certifications: [], businessType: "", leadTime: "", warehouseType: "", transportType: "", sort: "-rating", page: 1 }); setSelectedCategory("all"); setQuery(""); setSearchVal(""); }}
                                        className="mt-5 px-6 py-2.5 rounded-xl text-[13px] font-bold text-white bg-[#303031]"
                                        style={{ fontFamily: M }}
                                    >
                                        Reset All Filters
                                    </button>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-4">
                                    {results.map((p, index) => (
                                        <MPartnerCard 
                                            key={p.id || index} 
                                            p={p} 
                                            sel={compareSel.includes(p.id)} 
                                            onCompare={() => toggleCmp(p.id)} 
                                            onRFQ={() => toast.success(`RFQ sent to ${p.name}`, { description: `Expected response time: ${p.response}` })} 
                                            onProfile={() => setProfileP(p)}
                                        />
                                    ))}
                                    {/* Pagination Controls */}
                                    {searchMeta?.total_pages > 1 && (
                                        <div className="flex items-center justify-between pt-4 bg-white px-6 py-4 rounded-2xl border border-[rgba(208,198,174,0.2)]">
                                            <span className="text-[13px] text-[#4d4634]" style={{ fontFamily: I }}>
                                                Showing page {searchMeta.page || 1} of {searchMeta.total_pages} ({searchMeta.total_count} enterprises)
                                            </span>
                                            <div className="flex gap-2">
                                                <button 
                                                    disabled={(searchMeta.page || 1) <= 1} 
                                                    onClick={() => setFilters(prev => ({ ...prev, page: Math.max(1, (prev.page || 1) - 1) }))} 
                                                    className="px-4 py-2 rounded-xl text-[12px] font-bold border border-[rgba(208,198,174,0.3)] disabled:opacity-40 transition hover:bg-[#efeded]"
                                                    style={{ fontFamily: M }}
                                                >
                                                    ← Previous
                                                </button>
                                                <button 
                                                    disabled={(searchMeta.page || 1) >= searchMeta.total_pages} 
                                                    onClick={() => setFilters(prev => ({ ...prev, page: (prev.page || 1) + 1 }))} 
                                                    className="px-4 py-2 rounded-xl text-[12px] font-bold border border-[rgba(208,198,174,0.3)] disabled:opacity-40 transition hover:bg-[#efeded]"
                                                    style={{ fontFamily: M }}
                                                >
                                                    Next Page →
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    <div className="h-16"/>
                </div>
            </main>

            {/* Right AI Advisor */}
            <MAIAdvisor 
                query={query} 
                category={selectedCategory} 
                filters={filters} 
                onSelectPartner={(p) => setProfileP(mapPartner(p))} 
            />

            {/* Compare floating bar */}
            {compareSel.length >= 2 && (
                <div className="fixed bottom-0 left-[280px] right-[310px] z-40 bg-[#303031] px-8 py-4 flex items-center justify-between rounded-t-2xl shadow-2xl" style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
                    <div className="flex items-center gap-4">
                        <p className="text-white font-bold text-[14px]" style={{ fontFamily: M }}>
                            Comparing {compareSel.length} Partners:
                        </p>
                        <div className="flex items-center gap-2">
                            {results.filter(p => compareSel.includes(p.id)).map(p => (
                                <div key={p.id} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10">
                                    <span>{p.logo}</span>
                                    <span className="text-white text-[13px] font-semibold" style={{ fontFamily: M }}>{p.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={() => setCompareSel([])} className="px-4 py-2 rounded-xl text-white/60 text-[13px] font-semibold border border-white/20 hover:text-white transition" style={{ fontFamily: M }}>Clear</button>
                        <button onClick={() => setCompareOpen(true)} className="px-6 py-2.5 rounded-xl font-bold text-[13px] hover:opacity-90 transition" style={{ background: "#ffd54a", color: "#735c00", fontFamily: M }}>Compare Specifications →</button>
                    </div>
                </div>
            )}

            {/* Modals */}
            {compareOpen && (<MCompareModal selected={compareSel} partners={results} onClose={() => setCompareOpen(false)}/>)}
            {profileP && <MProfileModal p={profileP} onClose={() => setProfileP(null)} />}
            {createModal && <CreatePartnerModal onClose={() => setCreateModal(false)} onSuccess={(name) => {
                toast.success(`Partner ${name} onboarding initiated!`);
                refetch();
            }} />}

            {/* Floating AI Copilot Trigger */}
            <button
                onClick={() => setAiChatOpen(true)}
                className="fixed bottom-6 right-8 z-40 bg-[#1a1b1c] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 hover:bg-[#303031] hover:scale-105 transition-all duration-200 border border-[rgba(255,213,74,0.6)] group cursor-pointer"
                style={{ fontFamily: M }}
            >
                <div className="size-6 rounded-lg bg-[#ffd54a] flex items-center justify-center text-[#735c00] group-hover:rotate-12 transition">
                    <Sparkles size={14} className="fill-[#735c00]" />
                </div>
                <span className="font-black text-[13.5px]">AI Copilot</span>
                <span className="text-[10px] font-black bg-[linear-gradient(135deg,#ffd54a,#f59e0b)] text-[#1b1c1c] px-2 py-0.5 rounded-md uppercase tracking-wider shadow-2xs">V2 PRO</span>
            </button>

            <AIChat isOpen={aiChatOpen} onClose={() => setAiChatOpen(false)} module="marketplace" />
        </div>
    );
}
