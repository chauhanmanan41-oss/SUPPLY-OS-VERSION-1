export const PRO_STAGES = [
    { id: "req", label: "Requirement", count: 3, pct: 100, col: "#6b7280" },
    { id: "rfq", label: "RFQ Created", count: 7, pct: 78, col: "#3b82f6" },
    { id: "quote", label: "Supplier Quotes", count: 5, pct: 62, col: "#a855f7" },
    { id: "ai", label: "AI Comparison", count: 4, pct: 50, col: "#eab308" },
    { id: "neg", label: "Negotiation", count: 2, pct: 38, col: "#f97316" },
    { id: "po", label: "Purchase Order", count: 6, pct: 34, col: "#14b8a6" },
    { id: "mfg", label: "Manufacturing", count: 3, pct: 28, col: "#8b5cf6" },
    { id: "disp", label: "Dispatch", count: 2, pct: 20, col: "#3b82f6" },
    { id: "wh", label: "Warehouse", count: 4, pct: 15, col: "#16a34a" },
    { id: "done", label: "Completed", count: 28, pct: 0, col: "#16a34a" },
];

export const PRO_RECORDS = [
    {
        id: "PRO-2401", product: "Whey Protein Isolate", supplier: "BioSynth India", btype: "Raw Material",
        rfqStatus: "Quotes Received", quoteCount: 4, aiRec: "BioSynth India",
        value: "₹18.4L", delivery: "Jan 28, 2025", stage: "AI Comparison", stageCol: "#eab308",
        budget: "within", risk: "low", priority: "high", progress: 50
    },
    {
        id: "PRO-2402", product: "HDPE Protein Jar 1kg", supplier: "Alpha Packaging Corp", btype: "Packaging",
        rfqStatus: "PO Raised", quoteCount: 3, aiRec: "Alpha Packaging Corp",
        value: "₹4.2L", delivery: "Jan 22, 2025", stage: "Manufacturing", stageCol: "#8b5cf6",
        budget: "within", risk: "low", priority: "high", progress: 72
    },
    {
        id: "PRO-2403", product: "Vanilla Flavoring Extract", supplier: "FlavourTech India", btype: "Raw Material",
        rfqStatus: "Negotiation", quoteCount: 5, aiRec: "NatFlavours Ltd",
        value: "₹2.8L", delivery: "Feb 5, 2025", stage: "Negotiation", stageCol: "#f97316",
        budget: "at-risk", risk: "medium", priority: "medium", progress: 38
    },
    {
        id: "PRO-2404", product: "GMP Contract Manufacturing", supplier: "Nutraceutix Labs", btype: "Manufacturing",
        rfqStatus: "PO Approved", quoteCount: 2, aiRec: "Nutraceutix Labs",
        value: "₹42.0L", delivery: "Mar 1, 2025", stage: "Manufacturing", stageCol: "#8b5cf6",
        budget: "within", risk: "low", priority: "high", progress: 25
    },
    {
        id: "PRO-2405", product: "Cold Chain Logistics Q1", supplier: "VRL Logistics", btype: "Logistics",
        rfqStatus: "RFQ Sent", quoteCount: 1, aiRec: "VRL Logistics",
        value: "₹6.8L", delivery: "Ongoing", stage: "RFQ Created", stageCol: "#3b82f6",
        budget: "within", risk: "low", priority: "medium", progress: 20
    },
    {
        id: "PRO-2406", product: "NABL Lab Testing Panel", supplier: "PharmaForm Analytical", btype: "Testing",
        rfqStatus: "Quote Pending", quoteCount: 0, aiRec: "—",
        value: "₹85K", delivery: "Feb 15, 2025", stage: "Supplier Quotes", stageCol: "#a855f7",
        budget: "within", risk: "medium", priority: "low", progress: 30
    },
];

export const PRO_POS = [
    { po: "PO-20241201", logo: "🏭", supplier: "Nutraceutix Labs", product: "GMP Contract Manufacturing", amount: "₹42.0L", approval: "Approved", delivery: "Mar 1", ship: "In Production" },
    { po: "PO-20241198", logo: "📦", supplier: "Alpha Packaging Corp", product: "HDPE Protein Jar 1kg", amount: "₹4.2L", approval: "Approved", delivery: "Jan 22", ship: "Dispatched" },
    { po: "PO-20241185", logo: "🚚", supplier: "VRL Logistics", product: "Cold Chain Freight Q1", amount: "₹6.8L", approval: "Pending", delivery: "Ongoing", ship: "Awaiting PO" },
    { po: "PO-20241179", logo: "🧪", supplier: "BioSynth India", product: "Whey Protein Isolate", amount: "₹18.4L", approval: "Pending Finance", delivery: "Jan 28", ship: "Awaiting PO" },
];

export const PRO_APPROVALS = [
    { id: "APR-001", title: "GMP Manufacturing Contract", supplier: "Nutraceutix Labs", amount: "₹42.0L", approver: "Raj Mehta", level: "Management", priority: "high", risk: "low", timeLeft: "2h 30m" },
    { id: "APR-002", title: "Whey Protein Isolate Batch", supplier: "BioSynth India", amount: "₹18.4L", approver: "Priya Shah", level: "Finance", priority: "high", risk: "low", timeLeft: "8h" },
    { id: "APR-003", title: "Cold Chain Q1 Logistics RFQ", supplier: "VRL Logistics", amount: "₹6.8L", approver: "Ops Team", level: "Operations", priority: "medium", risk: "medium", timeLeft: "1 day" },
];

export const PRO_QUOTES = [
    { supplier: "BioSynth India", price: "₹420/kg", moq: "100 kg", lead: "7 days", cap: "500 MT", rating: 4.9, transport: "₹2.1L", payment: "30 days", match: 96, risk: 8, best: true },
    { supplier: "NutriSource Global", price: "₹395/kg", moq: "250 kg", lead: "12 days", cap: "300 MT", rating: 4.5, transport: "₹2.8L", payment: "15 days", match: 84, risk: 24, best: false },
    { supplier: "PureProtein Exports", price: "₹440/kg", moq: "500 kg", lead: "5 days", cap: "800 MT", rating: 4.7, transport: "₹1.8L", payment: "45 days", match: 89, risk: 12, best: false },
];

export const PRO_ACTIVITY = [
    { icon: "📨", text: "RFQ PRO-2401 sent to 4 suppliers", time: "10 min ago", col: "#3b82f6" },
    { icon: "✅", text: "BioSynth India accepted — ₹420/kg", time: "1 hr ago", col: "#16a34a" },
    { icon: "🤖", text: "AI recommended BioSynth India (96% match)", time: "1 hr ago", col: "#eab308" },
    { icon: "📋", text: "PO-20241201 approved by Raj Mehta", time: "3 hrs ago", col: "#16a34a" },
    { icon: "🚚", text: "Alpha Packaging dispatch confirmed", time: "5 hrs ago", col: "#14b8a6" },
    { icon: "💳", text: "Invoice INV-1842 payment scheduled", time: "Yesterday", col: "#a855f7" },
];

export const PRO_SPEND_DATA = [
    { name: "Aug", value: 28 }, { name: "Sep", value: 34 }, { name: "Oct", value: 41 },
    { name: "Nov", value: 38 }, { name: "Dec", value: 52 }, { name: "Jan", value: 47 },
];

export const PRO_RISK_CFG = {
    low: { col: "#16a34a", bg: "rgba(22,163,74,0.1)", label: "Low Risk" },
    medium: { col: "#eab308", bg: "rgba(234,179,8,0.1)", label: "Med Risk" },
    high: { col: "#ba1a1a", bg: "rgba(186,26,26,0.1)", label: "High Risk" },
};

export const PRO_BUD_CFG = {
    within: { col: "#16a34a", label: "Within Budget" },
    "at-risk": { col: "#eab308", label: "At Risk" },
    over: { col: "#ba1a1a", label: "Over Budget" },
};
