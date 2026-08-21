import { useState } from "react";
import { toast } from "sonner";
import { Search, X, Filter, ChevronDown, Lock } from "lucide-react";
import svgPaths from "../../imports/HtmlBody/svg-whh5jpitbk";
import { SEARCH_FILTERS } from "../../constants/dashboard";
import { I, M } from "../../constants/fonts";
import { useAuth } from "../../hooks/useAuth";

export function TopBar({ searchFilter, setSearchFilter, isLocked }) {
  const { user } = useAuth();
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);

  const displayName = user?.first_name || user?.email?.split("@")[0] || "User";
  const initials = (user?.first_name?.[0] || user?.email?.[0] || "U").toUpperCase();
  const role = "Admin"; // TODO: get from organization membership

  return (
    <div
      className="fixed top-0 right-0 z-30 bg-white border-b border-[rgba(208,198,174,0.25)] shadow-[0_1px_1px_rgba(0,0,0,0.04)]"
      style={{ left: 280 }}
    >
      <div className="h-[64px] px-8 flex items-center gap-6">
        {/* Search */}
        <div className="flex-1 max-w-[520px] relative">
          <div
            className={`flex items-center gap-3 rounded-xl px-4 h-10 transition-all duration-200 ${
              focused ? "ring-2 ring-[#ffd54a] ring-offset-0" : ""
            } ${isLocked ? "opacity-50 cursor-not-allowed" : "bg-[#efeded]"}`}
            style={isLocked ? { background: "#f5f3ef", border: "1px dashed rgba(208,198,174,0.6)" } : {}}
          >
            {isLocked ? (
              <Lock size={14} className="text-[#4d4634]/50 shrink-0" />
            ) : (
              <Search size={16} className="text-[#4d4634] shrink-0" />
            )}
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => !isLocked && setFocused(true)}
              onBlur={() => setFocused(false)}
              disabled={isLocked}
              placeholder={isLocked ? "Navigation locked — finish your workflow" : "Search projects, suppliers, orders…"}
              className="flex-1 bg-transparent text-[#1b1c1c] text-sm outline-none placeholder:text-[rgba(77,70,52,0.4)]"
              style={{ fontFamily: I, cursor: isLocked ? "not-allowed" : "text" }}
            />
            {query && !isLocked && (
              <button onClick={() => setQuery("")}>
                <X size={14} className="text-[#4d4634]/60" />
              </button>
            )}
          </div>

          {/* Filter pills */}
          {focused && !isLocked && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl border border-[rgba(208,198,174,0.3)] shadow-lg p-3 flex flex-wrap gap-1.5 z-50">
              {SEARCH_FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setSearchFilter(f)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    searchFilter === f
                      ? "bg-[#1b1c1c] text-white"
                      : "bg-[#efeded] text-[#4d4634] hover:bg-[rgba(208,198,174,0.4)]"
                  }`}
                  style={{ fontFamily: I }}
                >
                  {f}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 ml-auto">
          {/* Workflow lock indicator badge */}
          {isLocked && (
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
              style={{ background: "#fffbe6", border: "1px solid #eab30830" }}
            >
              <Lock size={11} style={{ color: "#ca8a04" }} />
              <span className="text-[11px] font-bold text-[#ca8a04]" style={{ fontFamily: I }}>
                Workflow Active
              </span>
            </div>
          )}

          {/* Notifications */}
          <button
            className={`relative p-2.5 rounded-xl hover:bg-[#efeded] transition ${isLocked ? "opacity-40 pointer-events-none" : ""}`}
            onClick={() => toast.info("3 new notifications")}
          >
            <svg width="16" height="20" viewBox="0 0 16 20" fill="none">
              <path d={svgPaths.p164b49c0} fill="#4D4634" />
            </svg>
            <div className="absolute top-1.5 right-1.5 size-2.5 bg-[#ff8a73] rounded-full border-2 border-white" />
          </button>

          <button
            className={`p-2.5 rounded-xl hover:bg-[#efeded] transition ${isLocked ? "opacity-40 pointer-events-none" : ""}`}
            onClick={() => toast.info("Grid view")}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d={svgPaths.p2816f2c0} fill="#4D4634" />
            </svg>
          </button>

          {/* User */}
          <div className="flex items-center gap-2.5 pl-3 border-l border-[rgba(208,198,174,0.3)] ml-1">
            <div className="size-9 rounded-full bg-[#ffd54a] flex items-center justify-center">
              <span className="text-[#735c00] font-bold text-sm" style={{ fontFamily: I }}>{initials}</span>
            </div>
            <div>
              <p className="text-[#1b1c1c] text-sm font-semibold leading-none" style={{ fontFamily: M }}>
                {displayName}
              </p>
              <p className="text-[#4d4634] text-[11px] uppercase tracking-wider mt-0.5" style={{ fontFamily: I }}>
                {role}
              </p>
            </div>
            <ChevronDown size={12} className="text-[#4d4634]/50" />
          </div>
        </div>
      </div>
    </div>
  );
}
