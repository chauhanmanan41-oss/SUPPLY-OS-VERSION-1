import { toast } from "sonner";
import { ChevronDown, Lock, Settings } from "lucide-react";
import svgPaths from "../../imports/HtmlBody/svg-whh5jpitbk";
import { I, M } from "../../constants/fonts";
import { NAV_ITEMS } from "../../constants/nav";
import { useAuth } from "../../hooks/useAuth";

const NAV_PATHS = {
  Dashboard: "/",
  Projects: "/projects",
  Marketplace: "/marketplace",
  Procurement: "/procurement",
  Orders: "/orders",
  Inventory: "/inventory",
  Production: "/production",
  Quality: "/quality",
  Logistics: "/logistics",
  Suppliers: "/suppliers",
  Manufacturers: "/manufacturers",
  Materials: "/materials",
  Warehouses: "/warehouses",
};

export function SideNav({ activeNav, safeNavigate, isLocked }) {
  const { user } = useAuth();

  const displayName = user?.first_name || user?.email?.split("@")[0] || "User";
  const initials = (user?.first_name?.[0] || user?.email?.[0] || "U").toUpperCase();
  const role = "Admin"; 

  // Group nav items
  const mainGroup = NAV_ITEMS.slice(0, 3);
  const opsGroup = NAV_ITEMS.slice(3, 9);
  const masterDataGroup = NAV_ITEMS.slice(9);

  const renderNavGroup = (items, label) => (
    <div className="mb-4">
      <p className="px-4 text-[10px] uppercase font-bold text-white/30 mb-2 tracking-wider" style={{ fontFamily: I }}>{label}</p>
      {items.map((item) => {
        const isActive = activeNav === item.label;
        const path = NAV_PATHS[item.label] || "/";
        const Icon = item.icon;
        return (
          <button
            key={item.label}
            onClick={() => {
              safeNavigate(path);
              if (!isActive && !isLocked) toast.info(`Navigating to ${item.label}…`);
            }}
            title={isLocked ? "Complete your current workflow to navigate here" : item.label}
            className={`
              w-full flex items-center gap-4 px-4 py-2.5 rounded-xl text-left transition-all duration-150
              ${isActive ? "bg-white/10" : "hover:bg-white/6"}
              ${isLocked && !isActive ? "opacity-40 cursor-not-allowed" : ""}
            `}
            style={{ boxShadow: isActive ? "inset 4px 0 0 #ffd54a" : "none" }}
          >
            {Icon && <Icon size={18} color={isActive ? "#ffd54a" : "rgba(255,255,255,0.6)"} />}
            <span
              className="text-[14px] flex-1"
              style={{
                fontFamily: I,
                color: isActive ? "#ffd54a" : "rgba(255,255,255,0.7)",
                fontWeight: isActive ? 700 : 400,
              }}
            >
              {item.label}
            </span>
            {isLocked && !isActive && <Lock size={11} className="text-white/30 shrink-0" />}
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="fixed left-0 top-0 h-full w-[280px] bg-[#303031] flex flex-col py-6 px-4 z-40">
      <div className="flex items-center gap-3 px-2 pb-6">
        <div className="size-10 bg-[#ffd54a] rounded-xl flex items-center justify-center shrink-0">
          <svg width="20" height="20" viewBox="0 0 19.3 19.3" fill="none">
            <path d={svgPaths.p36460600} fill="#735C00" />
          </svg>
        </div>
        <div>
          <p className="text-white font-bold text-base leading-tight" style={{ fontFamily: M }}>SupplyOS</p>
          <p className="text-white/50 text-[11px] tracking-wider uppercase" style={{ fontFamily: I }}>Command Center</p>
        </div>
      </div>

      {isLocked && (
        <div className="mx-0 mb-4 rounded-xl px-3.5 py-2.5 flex items-center gap-2.5" style={{ background: "rgba(255,213,74,0.1)", border: "1px solid rgba(255,213,74,0.2)" }}>
          <Lock size={12} className="text-[#ffd54a] shrink-0" />
          <p className="text-[11px] text-[#ffd54a] font-semibold leading-snug" style={{ fontFamily: I }}>Navigation locked — complete workflow.</p>
        </div>
      )}

      <nav className="flex flex-col flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
        {renderNavGroup(mainGroup, "General")}
        {renderNavGroup(opsGroup, "Operations")}
        {renderNavGroup(masterDataGroup, "Master Data")}
      </nav>

      <div className="mt-4 flex flex-col gap-1">
        <button
          onClick={() => safeNavigate("/settings")}
          className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-white/6 transition ${activeNav === "Settings" ? "bg-white/10" : ""}`}
        >
          <Settings size={18} className={activeNav === "Settings" ? "text-[#ffd54a]" : "text-white/50"} />
          <span className="text-[14px]" style={{ fontFamily: I, color: activeNav === "Settings" ? "#ffd54a" : "rgba(255,255,255,0.5)", fontWeight: activeNav === "Settings" ? 700 : 400 }}>Settings</span>
        </button>
      </div>

      <div className="mt-3 pt-3 border-t border-white/10 flex items-center gap-3 px-2">
        <div className="size-9 rounded-full bg-[#ffd54a] flex items-center justify-center shrink-0">
          <span className="text-[#735c00] font-bold text-sm" style={{ fontFamily: I }}>{initials}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white text-sm font-semibold leading-none truncate" style={{ fontFamily: M }}>{displayName}</p>
          <p className="text-white/40 text-[11px] uppercase tracking-wider mt-0.5" style={{ fontFamily: I }}>{role}</p>
        </div>
        <ChevronDown size={14} className="text-white/30 shrink-0" />
      </div>
    </div>
  );
}
