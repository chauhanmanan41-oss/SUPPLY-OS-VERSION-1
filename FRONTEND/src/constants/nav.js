import { LayoutDashboard, FolderKanban, Store, ShoppingCart, FileText, Package, Factory, ShieldCheck, Truck, Users, Settings, Database, Warehouse, Hexagon } from "lucide-react";

export const NAV_ITEMS = [
    { label: "Dashboard", icon: LayoutDashboard, active: true },
    { label: "Projects", icon: FolderKanban, active: false },
    { label: "Marketplace", icon: Store, active: false },
    { label: "Procurement", icon: ShoppingCart, active: false },
    { label: "Orders", icon: FileText, active: false },
    { label: "Inventory", icon: Package, active: false },
    { label: "Production", icon: Factory, active: false },
    { label: "Quality", icon: ShieldCheck, active: false },
    { label: "Logistics", icon: Truck, active: false },
    { label: "Suppliers", icon: Users, active: false },
    { label: "Manufacturers", icon: Factory, active: false },
    { label: "Materials", icon: Hexagon, active: false },
    { label: "Warehouses", icon: Warehouse, active: false },
];
