/**
 * AuthLayout — layout for login / register / forgot-password pages.
 * No sidebar, no topbar. Full-screen centered card.
 */

import { Sparkles } from "lucide-react";

const fontManrope = "Manrope, sans-serif";
const fontInter = "Inter, sans-serif";

export function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex" style={{ background: "#fbf9f9" }}>
      {/* ── Left branding panel ─────────────────────── */}
      <div
        className="hidden lg:flex w-[480px] flex-col justify-between p-10"
        style={{ background: "#303031" }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div
            className="size-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: "#ffd54a" }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <rect width="20" height="20" rx="4" fill="#ffd54a" />
              <text
                x="10" y="15"
                textAnchor="middle"
                fill="#735C00"
                fontSize="13"
                fontWeight="800"
                fontFamily={fontManrope}
              >
                S
              </text>
            </svg>
          </div>
          <div>
            <p className="text-white font-bold text-base leading-tight" style={{ fontFamily: fontManrope }}>
              SupplyOS
            </p>
            <p
              className="text-white/50 text-[11px] tracking-wider uppercase"
              style={{ fontFamily: fontInter }}
            >
              Command Center
            </p>
          </div>
        </div>

        {/* Tagline */}
        <div className="flex-1 flex flex-col justify-center gap-6">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-[#ffd54a]" />
            <span
              className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#ffd54a]"
              style={{ fontFamily: fontInter }}
            >
              AI-Powered ERP
            </span>
          </div>
          <h1
            className="text-white text-3xl font-bold leading-tight"
            style={{ fontFamily: fontManrope }}
          >
            Manage your entire
            <br />
            manufacturing supply chain
            <br />
            from one place.
          </h1>
          <p className="text-white/40 text-sm max-w-xs" style={{ fontFamily: fontInter }}>
            Products · Procurement · Inventory · Orders · Marketplace — all
            connected, all intelligent.
          </p>
        </div>

        {/* Bottom */}
        <p className="text-white/25 text-xs" style={{ fontFamily: fontInter }}>
          © {new Date().getFullYear()} SupplyOS. All rights reserved.
        </p>
      </div>

      {/* ── Right content area ──────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-6 overflow-y-auto">
        <div className="w-full max-w-[440px]">{children}</div>
      </div>
    </div>
  );
}
