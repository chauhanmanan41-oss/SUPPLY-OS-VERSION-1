export const ORD_STAGES = [
    { id: "req", label: "Requirement", count: 2, pct: 100, col: "#6b7280" },
    { id: "po", label: "Purchase Order", count: 6, pct: 88, col: "#3b82f6" },
    { id: "acc", label: "Supplier Accepted", count: 5, pct: 75, col: "#a855f7" },
    { id: "mfg", label: "Manufacturing", count: 4, pct: 62, col: "#f97316" },
    { id: "qi", label: "Quality Check", count: 3, pct: 50, col: "#eab308" },
    { id: "pkg", label: "Packaging", count: 2, pct: 38, col: "#14b8a6" },
    { id: "disp", label: "Dispatch", count: 3, pct: 28, col: "#8b5cf6" },
    { id: "transit", "label": "In Transit", count: 4, pct: 20, col: "#3b82f6" },
    { id: "wh", label: "Warehouse", count: 2, pct: 10, col: "#16a34a" },
    { id: "done", label: "Completed", count: 31, pct: 0, col: "#16a34a" },
];

export const ORD_RECORDS = [
    {
        id: "ORD-4401", product: "Whey Protein Isolate 500kg", supplier: "BioSynth India", manufacturer: "Nutraceutix Labs", warehouse: "Mumbai Cold Store", transport: "VRL Logistics",
        value: "₹18.4L", stage: "Manufacturing", stageCol: "#f97316", delivery: "Jan 28, 2025", delay: "On Track", delayDays: 0, priority: "high", risk: "low", aiStatus: "Healthy", progress: 62
    },
    {
        id: "ORD-4402", product: "HDPE Protein Jars — 20,000", supplier: "Alpha Packaging Corp", manufacturer: "Alpha Packaging Corp", warehouse: "Delhi NCR Hub", transport: "BlueDart",
        value: "₹4.2L", stage: "In Transit", stageCol: "#3b82f6", delivery: "Jan 22, 2025", delay: "1 Day Late", delayDays: 1, priority: "high", risk: "medium", aiStatus: "At Risk", progress: 82
    },
    {
        id: "ORD-4403", product: "Vanilla Flavoring — 200L", supplier: "FlavourTech India", manufacturer: "FlavourTech India", warehouse: "Pune Dry Storage", transport: "Delhivery",
        value: "₹2.8L", stage: "Dispatch", stageCol: "#8b5cf6", delivery: "Feb 5, 2025", delay: "On Track", delayDays: 0, priority: "medium", risk: "low", aiStatus: "Healthy", progress: 72
    },
    {
        id: "ORD-4404", product: "GMP Manufactured Blend 1MT", supplier: "Nutraceutix Labs", manufacturer: "Nutraceutix Labs", warehouse: "Ahmedabad WH", transport: "VRL Logistics",
        value: "₹42.0L", stage: "Quality Check", stageCol: "#eab308", delivery: "Mar 1, 2025", delay: "3 Days Late", delayDays: 3, priority: "high", risk: "high", aiStatus: "Delayed", progress: 50
    },
    {
        id: "ORD-4405", product: "Shrink Wrap Packaging Roll", supplier: "PackPro Supplies", manufacturer: "PackPro Supplies", warehouse: "Mumbai Cold Store", transport: "Shadowfax",
        value: "₹92K", stage: "Supplier Accepted", stageCol: "#a855f7", delivery: "Feb 10, 2025", delay: "On Track", delayDays: 0, priority: "low", risk: "low", aiStatus: "Healthy", progress: 25
    },
    {
        id: "ORD-4406", product: "NABL Testing Lab Panel", supplier: "PharmaForm Analytical", manufacturer: "PharmaForm Analytical", warehouse: "Hyderabad Lab", transport: "FedEx India",
        value: "₹85K", stage: "Purchase Order", stageCol: "#3b82f6", delivery: "Feb 15, 2025", delay: "On Track", delayDays: 0, priority: "low", risk: "low", aiStatus: "Healthy", progress: 15
    },
];

export const ORD_MFG_CARDS = [
    { product: "Whey Protein Isolate", manufacturer: "Nutraceutix Labs", pct: 68, quality: "Passed", packaging: "Pending", completion: "Jan 25", capacity: "82%", col: "#f97316" },
    { product: "GMP Manufactured Blend", manufacturer: "Nutraceutix Labs", pct: 34, quality: "In Progress", packaging: "Not Started", completion: "Mar 1", capacity: "90%", col: "#eab308" },
    { product: "Vanilla Flavoring", manufacturer: "FlavourTech India", pct: 95, quality: "Passed", packaging: "Complete", completion: "Feb 3", capacity: "65%", col: "#16a34a" },
];

export const ORD_SHIPMENTS = [
    { num: "SHP-8821", transport: "VRL Logistics", pickup: "Jan 15", location: "Mumbai → Delhi", eta: "Jan 22", driver: "Suresh K.", vehicle: "MH-12-XY-4432", status: "In Transit", col: "#3b82f6" },
    { num: "SHP-8819", transport: "BlueDart", pickup: "Jan 14", location: "Ahmedabad Hub", eta: "Jan 22", driver: "Ramesh P.", vehicle: "GJ-05-AB-7821", status: "Out for Delivery", col: "#16a34a" },
    { num: "SHP-8815", transport: "Delhivery", pickup: "Jan 18", location: "Pune → Mumbai", eta: "Feb 5", driver: "Ankit S.", vehicle: "MH-14-KL-9012", status: "Dispatched", col: "#8b5cf6" },
];

export const ORD_DELAYED = [
    { product: "GMP Manufactured Blend", delay: "3 days", reason: "Machine maintenance at Nutraceutix Labs", supplier: "Nutraceutix Labs", loss: "₹1.2L", action: "Switch to Priority Express shipping", priority: "high" },
    { product: "HDPE Protein Jars", delay: "1 day", reason: "Port congestion at Nhava Sheva", supplier: "Alpha Packaging", loss: "₹28K", action: "Reroute via Pune distribution hub", priority: "medium" },
];

export const ORD_ACTIVITY = [
    { icon: "📋", text: "ORD-4401 Purchase Order created", time: "2 hrs ago", col: "#3b82f6" },
    { icon: "✅", text: "BioSynth India accepted ORD-4401", time: "4 hrs ago", col: "#16a34a" },
    { icon: "🏭", text: "Nutraceutix Labs production started", time: "Yesterday", col: "#f97316" },
    { icon: "🚚", text: "SHP-8821 dispatched from Mumbai", time: "Yesterday", col: "#8b5cf6" },
    { icon: "📦", text: "SHP-8819 arrived at Delhi warehouse", time: "2 days ago", col: "#16a34a" },
    { icon: "💳", text: "Invoice INV-2041 payment processed", time: "3 days ago", col: "#a855f7" },
];

export const ORD_KPI_SPARK = {
    total: [38, 42, 45, 41, 48, 52, 49, 54],
    active: [18, 22, 19, 24, 21, 26, 23, 28],
    mfg: [8, 10, 9, 11, 8, 9, 10, 4],
    transit: [6, 7, 5, 8, 6, 7, 5, 4],
    delivered: [24, 28, 31, 29, 35, 38, 36, 31],
    delayed: [4, 3, 5, 2, 4, 3, 4, 3],
};

export const ORD_ANALYTICS_STATUS = [
    { name: "Manufacturing", value: 4 }, { name: "In Transit", value: 4 },
    { name: "Dispatch", value: 3 }, { name: "Quality", value: 3 },
    { name: "Completed", value: 31 },
];
