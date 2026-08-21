export const WS_LIFECYCLE = [
    { label: "Idea", done: true },
    { label: "Planning", done: true },
    { label: "Supplier Sel.", done: true },
    { label: "Manufacturer", done: false, active: true },
    { label: "Packaging", done: false },
    { label: "Production", done: false },
    { label: "Quality Testing", done: false },
    { label: "Warehouse", done: false },
    { label: "Transport", done: false },
    { label: "Launch", done: false },
];

export const WS_TABS = ["Overview", "Specifications", "BOM & Materials", "AI Marketplace & Partners", "Warehouse & Logistics", "Quality & Compliance", "Documents", "AI Copilot & Strategy"];


export const WS_CHAIN = [
    { label: "Raw Material\nSupplier", partner: "No Supplier Selected", status: "unassigned", health: 0, pct: 0, emoji: "🧪", col: "#16a34a" },
    { label: "Manufacturer", partner: "No Manufacturer Selected", status: "unassigned", health: 0, pct: 0, emoji: "🏭", col: "#a855f7" },
    { label: "Packaging\nSupplier", partner: "No Packaging Selected", status: "unassigned", health: 0, pct: 0, emoji: "📦", col: "#3b82f6" },
    { label: "Quality Testing", partner: "No Quality Lab Selected", status: "unassigned", health: 0, pct: 0, emoji: "🔬", col: "#eab308" },
    { label: "Warehouse", partner: "No Warehouse Selected", status: "unassigned", health: 0, pct: 0, emoji: "🏗️", col: "#14b8a6" },
    { label: "Transport", partner: "No Transport Selected", status: "unassigned", health: 0, pct: 0, emoji: "🚛", col: "#f97316" },
];

export const WS_TASKS = {
    todo: [
        { id: "t1", label: "Book warehouse slot", pri: "high", due: "Jan 20" },
        { id: "t2", label: "Confirm transport route", pri: "medium", due: "Jan 22" },
        { id: "t3", label: "Arrange quality inspector", pri: "low", due: "Jan 25" },
    ],
    inprogress: [
        { id: "t4", label: "Finalize manufacturer terms", pri: "high", due: "Jan 18" },
        { id: "t5", label: "Approve packaging artwork", pri: "medium", due: "Jan 19" },
    ],
    done: [
        { id: "t6", label: "Submit RFQ to Verified Supplier", pri: "high", due: "Jan 10" },
        { id: "t7", label: "Select raw material vendor", pri: "high", due: "Jan 12" },
        { id: "t8", label: "Sign enterprise supplier NDA", pri: "medium", due: "Jan 14" },
    ],
};

export const WS_MILESTONES = [
    { label: "Packaging Approval", date: "Jan 20", col: "#eab308", done: false, active: true },
    { label: "Manufacturing Complete", date: "Feb 5", col: "#a855f7", done: false, active: false },
    { label: "Shipment Dispatch", date: "Feb 10", col: "#3b82f6", done: false, active: false },
    { label: "Warehouse Arrival", date: "Feb 18", col: "#14b8a6", done: false, active: false },
    { label: "Market Launch", date: "Sep 12", col: "#16a34a", done: false, active: false },
];

export const WS_SPEND = [
    { label: "Raw Materials", pct: 38, val: "₹10.6L", col: "#3b82f6" },
    { label: "Manufacturing", pct: 26, val: "₹7.3L", col: "#a855f7" },
    { label: "Packaging", pct: 18, val: "₹5.0L", col: "#f97316" },
    { label: "Warehouse", pct: 8, val: "₹2.2L", col: "#14b8a6" },
    { label: "Transport", pct: 6, val: "₹1.7L", col: "#eab308" },
    { label: "Marketing", pct: 4, val: "₹1.1L", col: "#16a34a" },
];

export const WS_ACTIVITY = [
    { icon: "🤖", text: "AI Copilot active on workspace parameters", time: "1 hr ago", col: "#ffd54a" },
    { icon: "🏭", text: "Manufacturing specifications reviewed", time: "3 hrs ago", col: "#a855f7" },
    { icon: "📦", text: "Packaging compliance parameters validated", time: "Yesterday", col: "#3b82f6" },
    { icon: "📋", text: "Enterprise procurement RFQ drafted", time: "2 days ago", col: "#16a34a" },
    { icon: "🚛", text: "Logistics corridor SLA estimated", time: "2 days ago", col: "#f97316" },
    { icon: "✅", text: "Workspace Relational Supply Chain initialized", time: "3 days ago", col: "#16a34a" },
];

export const priCols = {
    high: { col: "#ba1a1a", bg: "rgba(186,26,26,0.1)" },
    medium: { col: "#eab308", bg: "rgba(234,179,8,0.1)" },
    low: { col: "#6b7280", bg: "rgba(107,114,128,0.1)" },
};
