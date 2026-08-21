import svgPaths from "../../imports/HtmlBody/svg-whh5jpitbk";
import { I, M } from "../../constants/fonts";
import { useAuth } from "../../hooks/useAuth";

export function CompanyOverview({ kpis }) {
    const { user } = useAuth();
    const displayName = user?.first_name || user?.email?.split("@")[0] || "User";
    const orgName = user?.default_organization?.name || "No Organization";

    const stats = [
        { label: "ACTIVE PRODUCTS", value: kpis?.active_products ?? "0" },
        { label: "PENDING POs", value: kpis?.open_purchase_orders ?? "0" },
        { label: "PENDING SHIPMENTS", value: kpis?.pending_shipments ?? "0", valueColor: "#ffd54a" },
        { label: "AVG RATING", value: kpis?.average_supplier_rating?.toFixed(1) ?? "0", valueColor: "#3b82f6" },
    ];
    return (<div className="bg-white rounded-2xl border border-[rgba(208,198,174,0.2)] shadow-[0_1px_2px_rgba(0,0,0,0.05)] p-7 flex items-center justify-between">
      <div className="flex items-center gap-6">
        <div className="size-[52px] rounded-xl bg-[#efeded] flex items-center justify-center border border-[rgba(208,198,174,0.3)] shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)]">
          <svg width="28" height="25" viewBox="0 0 33.3333 30" fill="none">
            <path d={svgPaths.p3c41e300} fill="#4D4634"/>
          </svg>
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <p className="text-[#1b1c1c] font-bold text-xl leading-tight" style={{ fontFamily: M }}>Good Morning, {displayName} 👋</p>
          </div>
          <p className="text-[#4d4634] text-sm mt-0.5" style={{ fontFamily: I }}>{orgName} · {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}</p>
        </div>
      </div>
      <div className="flex items-center gap-8 border-l border-[rgba(208,198,174,0.3)] pl-8">
        {stats.map((s, i) => (<div key={i} className={`${i < stats.length - 1 ? "border-r border-[rgba(208,198,174,0.3)] pr-8" : ""}`}>
            <p className="text-[#4d4634] text-[10px] font-bold tracking-[0.6px] uppercase mb-1" style={{ fontFamily: I }}>{s.label}</p>
            <p className="font-bold text-xl leading-none" style={{ fontFamily: M, color: s.valueColor ?? "#1b1c1c" }}>{s.value}</p>
          </div>))}
      </div>
    </div>);
}
