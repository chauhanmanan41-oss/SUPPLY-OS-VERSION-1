import { Plus, Brain, Factory, FileText, ShoppingBag, BarChart2, Clock, Package, Truck, Users, DollarSign, MapPin, ScrollText, Sparkles } from "lucide-react";

export const PRODUCTS = [
    {
        emoji: "💪", name: "Protein Powder", stage: "Planning", stageColor: "#3b82f6", stageBg: "rgba(59,130,246,0.1)",
        progress: 34, health: 92, healthColor: "#16a34a", budget: "₹50L", budgetUsed: 32,
        launch: "45 Days", risk: "low", riskLabel: "Low Risk",
        milestone: "Supplier Shortlist", sparkData: [20, 30, 28, 40, 34, 38, 34]
    },
    {
        emoji: "☕", name: "Coffee Brand", stage: "Manufacturing", stageColor: "#a855f7", stageBg: "rgba(168,85,247,0.1)",
        progress: 74, health: 84, healthColor: "#16a34a", budget: "₹1.2Cr", budgetUsed: 68,
        launch: "Nov 2024", risk: "medium", riskLabel: "Minor Delay",
        milestone: "Quality Audit", sparkData: [55, 60, 68, 72, 70, 74, 74]
    },
    {
        emoji: "🧴", name: "Skin Serum", stage: "Research", stageColor: "#eab308", stageBg: "rgba(234,179,8,0.1)",
        progress: 12, health: 78, healthColor: "#eab308", budget: "₹30L", budgetUsed: 8,
        launch: "Q2 2025", risk: "low", riskLabel: "On Track",
        milestone: "Market Research", sparkData: [5, 8, 10, 9, 11, 12, 12]
    },
];

export const KPIS = [
    {
        label: "Active Projects", value: "3", trend: 12, up: true, note: "1 in Planning",
        spark: [2, 2, 3, 2, 3, 3, 3], color: "#16a34a", borderColor: "rgba(208,198,174,0.2)"
    },
    {
        label: "Budget Utilized", value: "68%", trend: 4, up: false, note: "₹5.2L over target",
        spark: [55, 58, 60, 63, 66, 68, 68], color: "#eab308", borderColor: "rgba(234,179,8,0.3)"
    },
    {
        label: "Inventory Health", value: "82%", trend: 3, up: true, note: "Optimum levels",
        spark: [72, 75, 77, 79, 80, 81, 82], color: "#16a34a", borderColor: "rgba(208,198,174,0.2)"
    },
    {
        label: "Pending RFQs", value: "12", trend: 8, up: false, note: "Requires review",
        spark: [6, 8, 9, 10, 11, 12, 12], color: "#ff8a73", borderColor: "rgba(255,213,74,0.3)"
    },
];

export const HEALTH_METRICS = [
    { label: "Finance", value: 74, color: "#eab308" },
    { label: "Manufacturing", value: 84, color: "#16a34a" },
    { label: "Supply Chain", value: 68, color: "#ff8a73" },
    { label: "Logistics", value: 58, color: "#ba1a1a" },
    { label: "Inventory", value: 82, color: "#16a34a" },
];

export const ACTIVITIES = [
    { type: "rfq", icon: FileText, color: "#3b82f6", bg: "rgba(59,130,246,0.1)", label: "RFQ Submitted", detail: "Whey Protein · Alpha Packaging Corp", time: "2m ago" },
    { type: "ai", icon: Brain, color: "#ffd54a", bg: "rgba(255,213,74,0.1)", label: "AI Recommendation", detail: "Consolidate PO-8921 & PO-8922 — save ₹45,000", time: "18m ago" },
    { type: "shipment", icon: Truck, color: "#a855f7", bg: "rgba(168,85,247,0.1)", label: "Shipment Alert", detail: "PO-8915 delayed · Swift Logistics Co.", time: "1h ago" },
    { type: "order", icon: Package, color: "#16a34a", bg: "rgba(22,163,74,0.1)", label: "Order Confirmed", detail: "PO-8919 · Global Ingredients Ltd", time: "3h ago" },
    { type: "supplier", icon: Users, color: "#4d4634", bg: "rgba(77,70,52,0.08)", label: "Supplier Response", detail: "BioSynth India accepted RFQ-2241", time: "5h ago" },
    { type: "contract", icon: ScrollText, color: "#ba1a1a", bg: "rgba(186,26,26,0.1)", label: "Contract Expiring", detail: "Alpha Packaging · Expires in 24h", time: "6h ago" },
];

export const TIMELINE = [
    { type: "delivery", label: "PO-8921 Delivery", detail: "Alpha Packaging Corp", date: "Oct 24", color: "#16a34a", icon: Package },
    { type: "payment", label: "Payment Due", detail: "Global Ingredients Ltd · ₹34,10,000", date: "Oct 28", color: "#eab308", icon: DollarSign },
    { type: "launch", label: "Coffee Brand Launch", detail: "Manufacturing phase completion", date: "Nov 02", color: "#a855f7", icon: Sparkles },
    { type: "visit", label: "Factory Visit", detail: "Nutraceutix Labs · Pune", date: "Nov 08", color: "#3b82f6", icon: MapPin },
    { type: "deadline", label: "RFQ Deadline", detail: "Skin Serum · 3 suppliers", date: "Nov 15", color: "#ff8a73", icon: Clock },
];

export const DECISIONS = [
    {
        category: "Immediate Risks", color: "#ba1a1a", bg: "rgba(186,26,26,0.06)", borderColor: "rgba(186,26,26,0.15)",
        items: [
            { title: "Supplier quotation expires tomorrow", detail: "Alpha Packaging's Q3 rates for 'Whey Series' expire in 24h", impact: "5% rate hike", impactDetail: "Potential ₹62,000 increase", cta: "Review Quote" },
            { title: "PO-8915 critically delayed", detail: "Swift Logistics shipment delayed by 4 days, affecting production", impact: "4-day halt", impactDetail: "₹1.2L production loss", cta: "Re-route Now" },
        ]
    },
    {
        category: "Savings Opportunities", color: "#ffd54a", textColor: "#735c00", bg: "rgba(255,213,74,0.06)", borderColor: "rgba(255,213,74,0.25)",
        items: [
            { title: "Consolidate Shipments", detail: "PO-8921 and PO-8922 can share freight to reduce cost", impact: "₹45,000", impactDetail: "88% confidence", cta: "Apply Now" },
            { title: "Bulk material discount", detail: "Order 20% more Whey Isolate to trigger volume pricing", impact: "₹18,000", impactDetail: "92% confidence", cta: "Review" },
        ]
    },
    {
        category: "Growth Opportunities", color: "#16a34a", bg: "rgba(22,163,74,0.06)", borderColor: "rgba(22,163,74,0.15)",
        items: [
            { title: "New supplier available", detail: "BioSynth India offers 12% lower pricing for Whey Protein", impact: "+₹2.3L/yr", impactDetail: "Savings if switched", cta: "Compare" },
        ]
    },
    {
        category: "Inventory Alerts", color: "#eab308", bg: "rgba(234,179,8,0.06)", borderColor: "rgba(234,179,8,0.2)",
        items: [
            { title: "Budget exceeded by 4%", detail: "Manufacturing phase for 'Whey Series' is trending over budget", impact: "₹2L over", impactDetail: "Action required", cta: "View Analysis" },
        ]
    },
    {
        category: "Contract Renewals", color: "#3b82f6", bg: "rgba(59,130,246,0.06)", borderColor: "rgba(59,130,246,0.15)",
        items: [
            { title: "Alpha Packaging renewal due", detail: "Current contract valid until Dec 31. Lock rates before Q4 hike.", impact: "Expiring soon", impactDetail: "30 days remaining", cta: "Renew" },
        ]
    },
];

export const PROCUREMENT_ROWS = [
    { po: "PO-8921", supplier: "Alpha Packaging Corp", project: "Whey Series", status: "LOGISTICS", statusColor: "#16a34a", statusBg: "rgba(22,163,74,0.1)", value: "₹12,45,000", date: "Oct 24, 2024", risk: "#16a34a", hasRec: true },
    { po: "PO-8919", supplier: "Global Ingredients Ltd", project: "Premium Roast", status: "PROCUREMENT", statusColor: "#eab308", statusBg: "rgba(234,179,8,0.1)", value: "₹34,10,000", date: "Nov 02, 2024", risk: "#eab308", hasRec: false },
    { po: "PO-8915", supplier: "Swift Logistics Co", project: "Whey Series", status: "DELAYED", statusColor: "#ba1a1a", statusBg: "rgba(186,26,26,0.1)", value: "₹2,80,000", date: "Oct 20, 2024", risk: "#ba1a1a", hasRec: true },
];

export const SEARCH_FILTERS = ["All", "Products", "Suppliers", "Manufacturers", "Orders", "POs", "Companies", "RFQs"];

export const ACTIONS = [
    { icon: Plus, label: "Create Product", desc: "Launch a new product workspace", color: "#1b1c1c", bg: "#1b1c1c", textColor: "white", action: "create-product" },
    { icon: Brain, label: "Generate AI Strategy", desc: "AI-powered market recommendations", color: "#735c00", bg: "#ffd54a", textColor: "#735c00", action: "ai-strategy" },
    { icon: Factory, label: "Find Manufacturer", desc: "Browse verified manufacturers", color: "#3b82f6", bg: "rgba(59,130,246,0.08)", textColor: "#3b82f6", action: "find-manufacturer" },
    { icon: FileText, label: "Create RFQ", desc: "Request quotes from suppliers", color: "#a855f7", bg: "rgba(168,85,247,0.08)", textColor: "#a855f7", action: "create-rfq" },
    { icon: ShoppingBag, label: "Marketplace", desc: "Browse 2,400+ verified suppliers", color: "#16a34a", bg: "rgba(22,163,74,0.08)", textColor: "#16a34a", action: "marketplace" },
    { icon: BarChart2, label: "Analytics", desc: "Business performance insights", color: "#4d4634", bg: "rgba(77,70,52,0.07)", textColor: "#4d4634", action: "analytics" },
];
