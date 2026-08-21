import { toast } from "sonner";
import { AlertTriangle } from "lucide-react";
import { Badge } from "../common/Badge";
import { I, M } from "../../constants/fonts";
import { INV_LOW_STOCK } from "../../constants/inventory";

export function InvLowStockAlerts() {
    const priCfg = { high: { col: "#ba1a1a", bg: "rgba(186,26,26,0.05)", brd: "rgba(186,26,26,0.2)" } };
    return (<div>
      <div className="flex items-center gap-2 mb-3">
        <AlertTriangle size={15} style={{ color: "#ba1a1a" }}/>
        <p className="font-bold text-[15px] text-[#1b1c1c]" style={{ fontFamily: M }}>Low Stock Alerts</p>
        <Badge label={`${INV_LOW_STOCK.length} urgent`} color="#ba1a1a" bg="rgba(186,26,26,0.1)"/>
      </div>
      <div className="flex flex-col gap-3">
        {INV_LOW_STOCK.map((a, i) => (<div key={i} className="bg-white rounded-2xl border p-5 flex items-start gap-5" style={{ borderColor: "rgba(186,26,26,0.2)", background: "rgba(186,26,26,0.025)" }}>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-bold text-[14px] text-[#1b1c1c]" style={{ fontFamily: M }}>{a.name}</p>
                <Badge label="High Priority" color="#ba1a1a" bg="rgba(186,26,26,0.1)"/>
                {a.days === 0 && <Badge label="Out of Stock" color="#ba1a1a" bg="rgba(186,26,26,0.15)"/>}
              </div>
              <p className="text-[12px] text-[#4d4634] mb-3" style={{ fontFamily: I }}>{a.warehouse}</p>
              <div className="grid grid-cols-5 gap-3">
                {[
                { l: "Current", v: a.current },
                { l: "Minimum", v: a.minimum },
                { l: "Days Left", v: a.days === 0 ? "0 — Halt!" : a.days + " days" },
                { l: "Supplier", v: a.supplier },
                { l: "Est. Cost", v: a.cost },
            ].map((d, j) => (<div key={j}>
                    <p className="text-[10px] text-[#4d4634]" style={{ fontFamily: I }}>{d.l}</p>
                    <p className="font-semibold text-[12px]" style={{ color: d.l === "Days Left" && a.days <= 2 ? "#ba1a1a" : "#1b1c1c", fontFamily: M }}>{d.v}</p>
                  </div>))}
              </div>
            </div>
            <div className="flex flex-col gap-2 shrink-0">
              <button onClick={() => toast.success(`Reorder created for ${a.name}`)} className="px-3 py-2 rounded-xl text-[12px] font-bold hover:opacity-90 transition" style={{ background: "#ffd54a", color: "#735c00", fontFamily: M }}>Reorder Now</button>
              <button onClick={() => toast.success(`RFQ created for ${a.name}`)} className="px-3 py-2 rounded-xl text-[12px] font-bold text-white hover:bg-[#1b1c1c] transition" style={{ background: "#303031", fontFamily: M }}>Create RFQ</button>
              <button onClick={() => toast.info("Transfer dialog opening…")} className="px-3 py-2 rounded-xl text-[12px] font-semibold border border-[rgba(208,198,174,0.3)] text-[#4d4634] hover:bg-[#efeded] transition" style={{ fontFamily: M }}>Transfer</button>
            </div>
          </div>))}
      </div>
    </div>);
}
