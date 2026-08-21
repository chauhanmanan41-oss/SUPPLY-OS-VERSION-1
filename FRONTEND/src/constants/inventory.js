export const INV_ITEMS = [
    { id: "I1", name: "Whey Protein Isolate", sku: "WPI-001", category: "Raw Materials", warehouse: "Mumbai Cold Store", available: 1840, reserved: 400, incoming: 500, outgoing: 200, minLevel: 500, maxLevel: 3000, unit: "kg", value: "₹7.7L", status: "healthy", aiRec: "Stock healthy — reorder in 12 days" },
    { id: "I2", name: "HDPE Jars 1kg", sku: "PKG-112", category: "Packaging", warehouse: "Delhi NCR Hub", available: 2100, reserved: 800, incoming: 0, outgoing: 600, minLevel: 3000, maxLevel: 15000, unit: "pcs", value: "₹2.1L", status: "low", aiRec: "Reorder 10,000 units within 3 days" },
    { id: "I3", name: "Vanilla Flavoring", sku: "FLV-044", category: "Raw Materials", warehouse: "Pune Dry Storage", available: 48, reserved: 20, incoming: 100, outgoing: 0, minLevel: 80, maxLevel: 400, unit: "L", value: "₹38K", status: "critical", aiRec: "Urgent — production halts in 2 days" },
    { id: "I4", name: "Protein Powder (Fin.)", sku: "FG-2201", category: "Finished Goods", warehouse: "Ahmedabad WH", available: 3200, reserved: 900, incoming: 0, outgoing: 1200, minLevel: 1000, maxLevel: 6000, unit: "units", value: "₹22.4L", status: "healthy", aiRec: "Dispatch 500 units to Delhi hub" },
    { id: "I5", name: "Shrink Wrap Roll", sku: "PKG-088", category: "Packaging", warehouse: "Mumbai Cold Store", available: 120, reserved: 0, incoming: 200, outgoing: 60, minLevel: 50, maxLevel: 500, unit: "rolls", value: "₹18K", status: "healthy", aiRec: "Incoming stock arriving Jan 20" },
    { id: "I6", name: "Sweetener Blend", sku: "SWT-021", category: "Raw Materials", warehouse: "Pune Dry Storage", available: 0, reserved: 0, incoming: 50, outgoing: 0, minLevel: 40, maxLevel: 300, unit: "kg", value: "₹0", status: "out", aiRec: "Incoming 50kg Jan 22 — production at risk" },
    { id: "I7", name: "Label Stock A4", sku: "PKG-204", category: "Packaging", warehouse: "Delhi NCR Hub", available: 8400, reserved: 200, incoming: 0, outgoing: 400, minLevel: 500, maxLevel: 5000, unit: "sheets", value: "₹42K", status: "overstock", aiRec: "Reduce next order — 8,400 sheets excess" },
    { id: "I8", name: "GMP Capsule Shells", sku: "PKG-317", category: "Packaging", warehouse: "Ahmedabad WH", available: 22000, reserved: 4000, incoming: 0, outgoing: 5000, minLevel: 10000, maxLevel: 30000, unit: "pcs", value: "₹1.1L", status: "healthy", aiRec: "Stock optimal for current production cycle" },
];

export const INV_WAREHOUSES = [
    { name: "Ahmedabad Warehouse", used: 72, total: "12,000 sq.ft", available: "3,360 sq.ft", value: "₹28.4L", health: "good", col: "#16a34a", items: 42 },
    { name: "Mumbai Cold Store", used: 88, total: "8,000 sq.ft", available: "960 sq.ft", value: "₹19.1L", health: "alert", col: "#eab308", items: 31 },
    { name: "Delhi NCR Hub", used: 54, total: "15,000 sq.ft", available: "6,900 sq.ft", value: "₹14.7L", health: "good", col: "#16a34a", items: 28 },
    { name: "Pune Dry Storage", used: 41, total: "6,000 sq.ft", available: "3,540 sq.ft", value: "₹8.2L", health: "good", col: "#16a34a", items: 19 },
];

export const INV_LOW_STOCK = [
    { name: "HDPE Jars 1kg", warehouse: "Delhi NCR Hub", current: "2,100 pcs", minimum: "3,000 pcs", days: 4, supplier: "Alpha Packaging Corp", cost: "₹84K", delivery: "Jan 20", priority: "high" },
    { name: "Vanilla Flavoring", warehouse: "Pune Dry Storage", current: "48 L", minimum: "80 L", days: 2, supplier: "FlavourTech India", cost: "₹22K", delivery: "Jan 18", priority: "high" },
    { name: "Sweetener Blend", warehouse: "Pune Dry Storage", current: "0 kg", minimum: "40 kg", days: 0, supplier: "NutriSource Global", cost: "₹38K", delivery: "Jan 22", priority: "high" },
];

export const INV_FORECASTS = [
    { name: "Whey Protein Isolate", rate: "153 kg/day", stockout: "Feb 3", reorder: "Jan 26", lead: "7 days", impact: "Medium", safety: "500 kg", conf: 94, col: "#3b82f6" },
    { name: "HDPE Jars 1kg", rate: "600 pcs/day", stockout: "Jan 21", reorder: "Today", lead: "5 days", impact: "High", safety: "3,000 pcs", conf: 97, col: "#ba1a1a" },
    { name: "Vanilla Flavoring", rate: "24 L/day", stockout: "Jan 19", reorder: "Today", lead: "3 days", impact: "High", safety: "80 L", conf: 99, col: "#ba1a1a" },
];

export const INV_RISKS = [
    { title: "Raw Material Shortage", severity: "high", impact: "Production halt risk", loss: "₹8.2L", rec: "Urgent reorder — Vanilla Flavoring & Sweetener Blend", col: "#ba1a1a", bg: "rgba(186,26,26,0.05)", brd: "rgba(186,26,26,0.2)" },
    { title: "Packaging Shortage", severity: "high", impact: "Packaging line will stop", loss: "₹4.1L", rec: "Reorder 10,000 HDPE Jars from Alpha Packaging Corp", col: "#ba1a1a", bg: "rgba(186,26,26,0.05)", brd: "rgba(186,26,26,0.2)" },
    { title: "Warehouse Capacity", severity: "medium", impact: "Mumbai Cold Store at 88%", loss: "₹1.2L", rec: "Transfer 300 units to Delhi NCR Hub", col: "#eab308", bg: "rgba(234,179,8,0.05)", brd: "rgba(234,179,8,0.2)" },
    { title: "Overstock Risk", severity: "low", impact: "Capital locked in excess labels", loss: "₹42K", rec: "Reduce next Label Stock order by 40%", col: "#6b7280", bg: "rgba(107,114,128,0.05)", brd: "rgba(107,114,128,0.2)" },
];

export const INV_REORDERS = [
    { item: "Vanilla Flavoring", current: "48 L", safety: "80 L", qty: "200 L", supplier: "FlavourTech India", cost: "₹1.6L", delivery: "Jan 18", conf: 99 },
    { item: "HDPE Jars 1kg", current: "2,100 pcs", safety: "3K pcs", qty: "10,000 pcs", supplier: "Alpha Packaging Corp", cost: "₹84K", delivery: "Jan 20", conf: 97 },
    { item: "Sweetener Blend", current: "0 kg", safety: "40 kg", qty: "150 kg", supplier: "NutriSource Global", cost: "₹38K", delivery: "Jan 22", conf: 95 },
    { item: "Whey Protein Isolate", current: "1,840 kg", safety: "500 kg", qty: "1,000 kg", supplier: "BioSynth India", cost: "₹4.2L", delivery: "Jan 26", conf: 88 },
];

export const INV_ACTIVITY = [
    { icon: "📥", text: "500 kg Whey Protein received — Mumbai Cold Store", time: "2 hrs ago", col: "#16a34a" },
    { icon: "🏭", text: "240 kg Whey consumed by Nutraceutix Labs", time: "4 hrs ago", col: "#f97316" },
    { icon: "↔️", text: "1,200 units transferred — Ahmedabad → Delhi", time: "6 hrs ago", col: "#3b82f6" },
    { icon: "⚠️", text: "Vanilla Flavoring crossed low-stock threshold", time: "Yesterday", col: "#eab308" },
    { icon: "📦", text: "Reorder request created — HDPE Jars 1kg", time: "Yesterday", col: "#a855f7" },
    { icon: "✅", text: "Quality check passed — GMP Capsule Shells batch", time: "2 days ago", col: "#16a34a" },
];

export const INV_KPI_SPARK = {
    value: [185, 192, 201, 198, 210, 218, 224, 240],
    raw: [62, 68, 71, 65, 74, 70, 72, 77],
    pkg: [28, 30, 26, 31, 28, 25, 29, 27],
    finished: [44, 48, 52, 49, 55, 58, 62, 66],
    whUtil: [70, 72, 75, 78, 80, 82, 84, 81],
    low: [4, 6, 3, 5, 4, 7, 5, 3],
    crit: [1, 2, 1, 2, 1, 2, 1, 3],
};

export const INV_CAT_DATA = [
    { name: "Raw Materials", value: 42 }, { name: "Packaging", value: 28 },
    { name: "Finished Goods", value: 19 }, { name: "Consumables", value: 7 }, { name: "Equipment", value: 4 },
];

export const INV_MOVE_DATA = [
    { name: "Aug", received: 48, consumed: 42 }, { name: "Sep", received: 55, consumed: 50 },
    { name: "Oct", received: 60, consumed: 56 }, { name: "Nov", received: 52, consumed: 48 },
    { name: "Dec", received: 70, consumed: 62 }, { name: "Jan", received: 58, consumed: 51 },
];

export const INV_STATUS_CFG = {
    healthy: { col: "#16a34a", bg: "rgba(22,163,74,0.1)", label: "Healthy" },
    low: { col: "#eab308", bg: "rgba(234,179,8,0.1)", label: "Low Stock" },
    critical: { col: "#ba1a1a", bg: "rgba(186,26,26,0.1)", label: "Critical" },
    out: { col: "#ba1a1a", bg: "rgba(186,26,26,0.15)", label: "Out of Stock" },
    overstock: { col: "#3b82f6", bg: "rgba(59,130,246,0.1)", label: "Overstock" },
};
