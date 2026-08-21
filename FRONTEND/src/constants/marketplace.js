export const MKT_CATS = [
    { id: "raw", label: "Raw Material Suppliers", emoji: "🧪", count: "4,200+", desc: "Ingredients, chemicals & bulk materials", color: "#16a34a", bg: "rgba(22,163,74,0.08)" },
    { id: "mfg", label: "Manufacturers", emoji: "🏭", count: "1,800+", desc: "GMP-certified contract & private label", color: "#3b82f6", bg: "rgba(59,130,246,0.08)" },
    { id: "pkg", label: "Packaging Suppliers", emoji: "📦", count: "2,100+", desc: "Bottles, pouches, boxes & labels", color: "#a855f7", bg: "rgba(168,85,247,0.08)" },
    { id: "wh", label: "Warehouse Providers", emoji: "🏪", count: "680+", desc: "Dry, cold & bonded storage nationwide", color: "#f97316", bg: "rgba(249,115,22,0.08)" },
    { id: "lgx", label: "Transport & Logistics", emoji: "🚚", count: "3,400+", desc: "Pan-India freight & last-mile delivery", color: "#14b8a6", bg: "rgba(20,184,166,0.08)" },
    { id: "lab", label: "Quality Testing Labs", emoji: "🧫", count: "420+", desc: "NABL accredited labs & compliance", color: "#eab308", bg: "rgba(234,179,8,0.08)" },
    { id: "cert", label: "Certification Agencies", emoji: "🏅", count: "90+", desc: "GMP, FSSAI, ISO & export certifications", color: "#ff8a73", bg: "rgba(255,138,115,0.08)" },
    { id: "mach", label: "Machinery Suppliers", emoji: "⚙️", count: "560+", desc: "Manufacturing & processing equipment", color: "#6b7280", bg: "rgba(107,114,128,0.08)" },
    { id: "imp", label: "Import / Export Services", emoji: "🌐", count: "310+", desc: "Customs, freight forwarding & trade", color: "#3b82f6", bg: "rgba(59,130,246,0.08)" },
    { id: "cons", label: "Business Consultants", emoji: "💼", count: "180+", desc: "Strategy, regulatory & supply chain", color: "#a855f7", bg: "rgba(168,85,247,0.08)" },
];

export const MKT_PARTNERS = [
    {
        id: "P1", logo: "🧪", name: "BioSynth India", verified: true, type: "Raw Material Supplier",
        location: "Pune, Maharashtra", years: 12, rating: 4.9, reviews: 342, projects: 187,
        response: "4 hrs", capacity: "500 MT/month", moq: "100 kg", price: "₹380–₹520/kg", lead: "7 days",
        certs: ["GMP", "ISO 9001", "FSSAI", "Organic"], avail: "Available", match: 96,
        reasons: ["Matches your exact budget range", "GMP certified for nutraceuticals", "40km from your warehouse", "Private label fully supported"],
        col: "#16a34a", bg: "rgba(22,163,74,0.1)"
    },
    {
        id: "P2", logo: "📦", name: "Alpha Packaging Corp", verified: true, type: "Packaging Supplier",
        location: "Mumbai, Maharashtra", years: 18, rating: 4.7, reviews: 218, projects: 412,
        response: "2 hrs", capacity: "2M units/month", moq: "5,000 pcs", price: "₹7–₹12/unit", lead: "5 days",
        certs: ["ISO 9001", "BIS", "Export Ready"], avail: "Available", match: 91,
        reasons: ["Current supplier — 5% renewal discount", "Fastest delivery in packaging category", "Bulk pricing at 50K+ units"],
        col: "#3b82f6", bg: "rgba(59,130,246,0.1)"
    },
    {
        id: "P3", logo: "🏭", name: "Nutraceutix Labs", verified: true, type: "GMP Manufacturer",
        location: "Ahmedabad, Gujarat", years: 9, rating: 4.8, reviews: 156, projects: 94,
        response: "6 hrs", capacity: "200 MT/month", moq: "500 kg", price: "₹1,200–₹2,400/kg", lead: "21 days",
        certs: ["GMP", "ISO 22000", "FSSAI", "FDA"], avail: "Available", match: 94,
        reasons: ["GMP certified — required for protein powder", "12 similar product profiles", "Strong quality audit record", "Private label supported"],
        col: "#a855f7", bg: "rgba(168,85,247,0.1)"
    },
    {
        id: "P4", logo: "🚚", name: "VRL Logistics Network", verified: true, type: "Logistics Partner",
        location: "Bangalore, Karnataka", years: 22, rating: 4.6, reviews: 891, projects: 12400,
        response: "1 hr", capacity: "Pan-India", moq: "No minimum", price: "₹45–₹90/kg", lead: "2–5 days",
        certs: ["ISO 9001", "GDP", "GST Compliant"], avail: "Available", match: 88,
        reasons: ["Pan-India network matches distribution plan", "Cold chain capability available", "Most competitive freight rates"],
        col: "#f97316", bg: "rgba(249,115,22,0.1)"
    },
    {
        id: "P5", logo: "🧫", name: "PharmaForm Analytical", verified: true, type: "Testing Laboratory",
        location: "Hyderabad, Telangana", years: 14, rating: 4.9, reviews: 203, projects: 1840,
        response: "12 hrs", capacity: "500 tests/mo", moq: "1 batch", price: "₹15K–₹80K/test", lead: "10–14 days",
        certs: ["NABL", "FSSAI", "ISO 17025", "FDA"], avail: "Available", match: 89,
        reasons: ["NABL accredited — required for regulatory clearance", "Fastest turnaround in Hyderabad", "Handles all nutritional panels"],
        col: "#14b8a6", bg: "rgba(20,184,166,0.1)"
    },
    {
        id: "P6", logo: "🏪", name: "ColdSpace Warehousing", verified: true, type: "Warehouse Provider",
        location: "Delhi NCR", years: 7, rating: 4.5, reviews: 67, projects: 230,
        response: "8 hrs", capacity: "50,000 sq.ft", moq: "100 sq.ft", price: "₹18–₹32/sq.ft/mo", lead: "Immediate",
        certs: ["ISO 9001", "FSSAI", "Cold Chain"], avail: "2 slots left", match: 82,
        reasons: ["Cold storage meets supplement requirements", "Near your primary market", "Short-term contracts available"],
        col: "#eab308", bg: "rgba(234,179,8,0.1)"
    },
];

export const MKT_SC = [
    { label: "Whey Protein Supplier", type: "Raw Material", done: true },
    { label: "Flavor & Sweetener Supplier", type: "Raw Material", done: false },
    { label: "Container / Jar Manufacturer", type: "Packaging", done: false },
    { label: "Label Printing Partner", type: "Packaging", done: true },
    { label: "GMP Manufacturer", type: "Manufacturing", done: true },
    { label: "Testing Laboratory", type: "Quality", done: false },
    { label: "Warehouse Provider", type: "Logistics", done: false },
    { label: "Logistics Partner", type: "Logistics", done: true },
    { label: "Distributor Network", type: "Distribution", done: false },
    { label: "Certification Agency", type: "Compliance", done: false },
];

export const MKT_TRENDING_SEARCHES = ["Protein Manufacturer", "Private Label Cosmetics", "Plastic Bottle Supplier", "Cold Storage Warehouse", "Export Logistics", "FSSAI Certified Lab"];

export const MKT_ANALYTICS = {
    pricing: [
        { name: "Raw Materials", avg: 420 }, { name: "Packaging", avg: 9 },
        { name: "Manufacturing", avg: 1800 }, { name: "Logistics", avg: 65 },
        { name: "Testing", avg: 45 }, { name: "Warehousing", avg: 25 },
    ],
    categories: [
        { name: "Manufacturers", value: 31 }, { name: "Raw Materials", value: 24 },
        { name: "Packaging", value: 19 }, { name: "Logistics", value: 13 },
        { name: "Labs", value: 8 }, { name: "Others", value: 5 },
    ],
    growth: [
        { name: "Jan", value: 210 }, { name: "Feb", value: 240 }, { name: "Mar", value: 290 },
        { name: "Apr", value: 320 }, { name: "May", value: 380 }, { name: "Jun", value: 430 },
    ],
};
