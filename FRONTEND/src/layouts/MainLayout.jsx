import { SideNav } from "../components/navigation/SideNav";
import { TopBar } from "../components/navigation/TopBar";

export function MainLayout({
  activeNav,
  safeNavigate,
  isLocked,
  searchFilter,
  setSearchFilter,
  children,
  overlays,
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-[#fbf9f9]">
      {/* Sidebar */}
      <SideNav
        activeNav={activeNav}
        safeNavigate={safeNavigate}
        isLocked={isLocked}
      />

      {/* Main area */}
      <div className="flex-1 flex flex-col overflow-hidden" style={{ marginLeft: 280 }}>
        <TopBar
          searchFilter={searchFilter}
          setSearchFilter={setSearchFilter}
          isLocked={isLocked}
        />

        {/* Content row */}
        <div className="flex flex-1 overflow-hidden pt-[64px]">
          {children}
        </div>
      </div>

      {overlays}
    </div>
  );
}
