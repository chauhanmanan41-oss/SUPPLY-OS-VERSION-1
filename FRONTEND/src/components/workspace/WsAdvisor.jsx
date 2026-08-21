import { toast } from "sonner";
import { Brain, FileText, Package, Truck, Users, ScrollText } from "lucide-react";
import { ProgressRing } from "../common/ProgressRing";
import { I, M } from "../../constants/fonts";

export function WsAdvisor({ onClose }) {
    return (<div className="w-[285px] shrink-0 h-full overflow-y-auto border-l border-[rgba(208,198,174,0.2)] bg-white flex flex-col" style={{ scrollbarWidth: "none" }}>
      <div className="px-5 py-5 flex flex-col gap-5">
        <div className="flex items-center gap-2.5">
          <div className="size-8 rounded-xl flex items-center justify-center" style={{ background: "rgba(255,213,74,0.15)" }}>
            <Brain size={15} style={{ color: "#735c00" }}/>
          </div>
          <div>
            <p className="font-bold text-[14px] text-[#1b1c1c]" style={{ fontFamily: M }}>AI Product Advisor</p>
            <p className="text-[11px] text-[#4d4634]" style={{ fontFamily: I }}>SupplyOS Intelligence</p>
          </div>
        </div>

        {/* Health */}
        <div className="flex items-center gap-4 p-4 rounded-xl" style={{ background: "rgba(22,163,74,0.05)", border: "1px solid rgba(22,163,74,0.2)" }}>
          <ProgressRing value={96} color="#16a34a" size={56} sw={5}>
            <p className="font-bold text-[13px] text-[#16a34a]" style={{ fontFamily: M }}>96%</p>
          </ProgressRing>
          <div>
            <p className="font-bold text-[14px] text-[#1b1c1c]" style={{ fontFamily: M }}>Product Health</p>
            <p className="text-[11px] text-[#16a34a] font-semibold mt-0.5" style={{ fontFamily: I }}>On Track</p>
          </div>
        </div>

        {/* Summary metrics */}
        <div className="p-4 rounded-xl" style={{ background: "rgba(255,213,74,0.06)", border: "1px solid rgba(255,213,74,0.2)" }}>
          <p className="text-[10px] font-bold text-[#735c00] uppercase tracking-wide mb-3" style={{ fontFamily: M }}>Current Status</p>
          {[
            { l: "Stage", v: "Manufacturing", col: "#a855f7" },
            { l: "Risk Level", v: "Low", col: "#16a34a" },
            { l: "Inventory Health", v: "87%", col: "#16a34a" },
            { l: "Procurement Health", v: "82%", col: "#eab308" },
            { l: "Order Health", v: "94%", col: "#16a34a" },
            { l: "Supplier Score", v: "91%", col: "#16a34a" },
            { l: "Savings Opportunity", v: "₹4.2L", col: "#16a34a" },
        ].map((r, i) => (<div key={i} className="flex justify-between items-center mb-1.5 last:mb-0">
              <span className="text-[12px] text-[#4d4634]" style={{ fontFamily: I }}>{r.l}</span>
              <span className="font-bold text-[12px]" style={{ color: r.col, fontFamily: M }}>{r.v}</span>
            </div>))}
        </div>

        {/* AI rec */}
        <div className="p-4 rounded-xl" style={{ background: "rgba(59,130,246,0.05)", border: "1px solid rgba(59,130,246,0.2)" }}>
          <p className="text-[10px] font-bold text-[#3b82f6] uppercase tracking-wide mb-2" style={{ fontFamily: M }}>Next Recommended Action</p>
          <p className="text-[12px] text-[#4d4634] leading-relaxed" style={{ fontFamily: I }}>
            Approve <strong>Packaging Artwork</strong> by Jan 20 to prevent a 3-day delay on the manufacturing start date.
          </p>
          <div className="flex justify-between mt-2">
            <span className="text-[10px] text-[#4d4634]" style={{ fontFamily: I }}>Confidence</span>
            <span className="font-bold text-[11px] text-[#3b82f6]" style={{ fontFamily: M }}>97%</span>
          </div>
        </div>

        {/* Quick actions */}
        <div>
          <p className="text-[10px] font-bold text-[#4d4634] uppercase tracking-wide mb-2" style={{ fontFamily: M }}>Quick Actions</p>
          <div className="grid grid-cols-2 gap-2">
            {[
            { l: "Find Suppliers", Ic: Users },
            { l: "Create RFQ", Ic: FileText },
            { l: "Add Inventory", Ic: Package },
            { l: "Track Shipment", Ic: Truck },
            { l: "Invite Team", Ic: Users },
            { l: "Generate PO", Ic: ScrollText },
        ].map((a, i) => (<button key={i} onClick={() => toast.info(`${a.l}…`)} className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[rgba(208,198,174,0.3)] text-[11px] font-semibold text-[#4d4634] hover:bg-[#efeded] transition" style={{ fontFamily: M }}>
                <a.Ic size={11}/> {a.l}
              </button>))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <button onClick={() => toast.info("Generating AI strategy…")} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-[13px] hover:opacity-90 transition" style={{ background: "#ffd54a", color: "#735c00", fontFamily: M }}>
            <Brain size={14}/> Generate AI Strategy
          </button>
          <button onClick={() => toast.info("Explaining recommendation…")} className="w-full py-2.5 rounded-xl text-[13px] font-semibold border border-[rgba(208,198,174,0.3)] text-[#4d4634] hover:bg-[#efeded] transition" style={{ fontFamily: M }}>Explain Recommendation</button>
          <button onClick={() => toast.info("Generating report…")} className="w-full py-2.5 rounded-xl text-[13px] font-semibold border border-[rgba(208,198,174,0.3)] text-[#4d4634] hover:bg-[#efeded] transition" style={{ fontFamily: M }}>Generate Report</button>
        </div>
      </div>
    </div>);
}
