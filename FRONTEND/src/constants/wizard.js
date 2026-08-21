import { TrendingUp, Factory, CheckCircle, Package, Truck, Shield, Activity, DollarSign, Building2, ScrollText, Sparkles, Globe, Zap } from "lucide-react";

export const WIZARD_DEFAULTS = {
    productName: "", brandName: "", category: "", industry: "",
    description: "", targetCountry: "India", businessModel: "",
    budget: "", monthlyProduction: "", productionUnit: "units",
    launchTimeline: "", priorities: [],
    targetMarket: [], manufacturingRegion: "",
    certifications: [], riskPreference: "Medium",
    rawMaterials: "", packagingType: "",
    warehouseCity: "", transport: [],
    coldChain: false, importExport: false, qualityLabs: false,
    moq: "", supplierCount: "", storageConditions: "Ambient",
};

export const W_STEPS = [
    { n: 1, label: "Product Details", Icon: Package },
    { n: 2, label: "Business Strategy", Icon: TrendingUp },
    { n: 3, label: "Supply Chain", Icon: Truck },
    { n: 4, label: "AI Blueprint", Icon: Sparkles },
    { n: 5, label: "Review & Create", Icon: CheckCircle },
];

export const W_PRIORITIES = [
    { id: "quality", label: "Premium Quality", desc: "High-grade materials & strict QC", Icon: Shield },
    { id: "speed", label: "Fast Launch", desc: "Minimise time to market", Icon: Zap },
    { id: "cost", label: "Lowest Cost", desc: "Optimise for unit economics", Icon: DollarSign },
    { id: "profit", label: "Maximum Profit", desc: "Highest margin positioning", Icon: TrendingUp },
    { id: "reliability", label: "Supply Reliability", desc: "Consistent, uninterrupted supply", Icon: Shield },
    { id: "scale", label: "Scalability", desc: "Grow production quickly", Icon: Activity },
    { id: "sustain", label: "Sustainability", desc: "Eco-friendly, responsible sourcing", Icon: Globe },
];

export const W_BIZ_MODELS = [
    { id: "own", label: "Own Manufacturing", desc: "You control the entire manufacturing process in-house.", Icon: Factory },
    { id: "private", label: "Private Label", desc: "Pre-made products branded under your label.", Icon: Building2 },
    { id: "contract", label: "Contract Manufacturing", desc: "Third party manufactures to your exact specifications.", Icon: ScrollText },
    { id: "third", label: "Third Party", desc: "Full outsourcing of all manufacturing operations.", Icon: Globe },
];

export const MOCK_BP = {
    confidence: 91, health: 87, estimatedRevenue: "₹8.5L", roi: "170%",
    manufacturers: [
        { name: "Nutraceutix Labs", city: "Pune, MH", match: 96, price: "₹180/kg", lead: "28 days" },
        { name: "BioSynth India", city: "Hyderabad, TS", match: 88, price: "₹165/kg", lead: "35 days" },
        { name: "PharmaForm Co.", city: "Ahmedabad, GJ", match: 82, price: "₹195/kg", lead: "21 days" },
    ],
    suppliers: [
        { name: "Alpha Packaging Corp", category: "Packaging", rating: 4.8, lead: "7 days" },
        { name: "Global Ingredients", category: "Raw Material", rating: 4.6, lead: "14 days" },
        { name: "AgroSource India", category: "Ingredients", rating: 4.5, lead: "10 days" },
    ],
    costs: [
        { label: "Raw Materials", value: 40 }, { label: "Manufacturing", value: 25 },
        { label: "Packaging", value: 12 }, { label: "Logistics", value: 10 },
        { label: "Quality & Lab", value: 8 }, { label: "Buffer", value: 5 },
    ],
    timeline: [
        { phase: "Supplier Selection", weeks: 2, color: "#3b82f6" },
        { phase: "Manufacturing", weeks: 6, color: "#f97316" },
        { phase: "Packaging", weeks: 2, color: "#14b8a6" },
        { phase: "QC & Testing", weeks: 2, color: "#a855f7" },
        { phase: "Logistics", weeks: 1, color: "#16a34a" },
    ],
    risks: [
        { risk: "Raw material price volatility", severity: "medium", fix: "Lock in 6-month contracts" },
        { risk: "Regulatory clearance delay", severity: "low", fix: "File applications early" },
        { risk: "Supply disruption risk", severity: "low", fix: "Dual-source key materials" },
    ],
    savings: [
        { opp: "Consolidate freight with PO-8921", amount: "₹45K", conf: 88 },
        { opp: "Bulk material discount at 500kg", amount: "₹18K", conf: 92 },
    ],
};
/* ── Primitive field wrappers ── */
