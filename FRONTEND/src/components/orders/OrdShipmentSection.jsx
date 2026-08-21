import { toast } from "sonner";
import { Truck, Send } from "lucide-react";
import { I, M } from "../../constants/fonts";
import { ORD_SHIPMENTS } from "../../constants/orders";

export function OrdShipmentSection() {
    const statusCfg = {
        "In Transit": { col: "#3b82f6", bg: "rgba(59,130,246,0.1)" },
        "Out for Delivery": { col: "#16a34a", bg: "rgba(22,163,74,0.1)" },
        "Dispatched": { col: "#8b5cf6", bg: "rgba(139,92,246,0.1)" },
    };
    return (<div>
      <p className="font-bold text-[15px] text-[#1b1c1c] mb-3" style={{ fontFamily: M }}>Shipment Tracking</p>
      <div className="flex flex-col gap-3">
        {ORD_SHIPMENTS.map((s, i) => {
            const sc = statusCfg[s.status] ?? { col: "#6b7280", bg: "rgba(107,114,128,0.1)" };
            return (<div key={i} className="bg-white rounded-2xl border border-[rgba(208,198,174,0.2)] p-5 flex items-center gap-5">
              <div className="size-11 rounded-2xl flex items-center justify-center shrink-0" style={{ background: sc.bg }}>
                <Truck size={20} style={{ color: sc.col }}/>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                  <p className="font-bold text-[13px] text-[#1b1c1c]" style={{ fontFamily: M }}>{s.num}</p>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: sc.bg, color: sc.col, fontFamily: I }}>{s.status}</span>
                </div>
                <p className="text-[12px] text-[#4d4634]" style={{ fontFamily: I }}>{s.transport} · {s.location}</p>
              </div>
              <div className="grid grid-cols-4 gap-4 shrink-0">
                {[
                    { l: "Pickup", v: s.pickup },
                    { l: "ETA", v: s.eta },
                    { l: "Driver", v: s.driver },
                    { l: "Vehicle", v: s.vehicle },
                ].map((d, j) => (<div key={j} className="text-center">
                    <p className="text-[10px] text-[#4d4634]" style={{ fontFamily: I }}>{d.l}</p>
                    <p className="font-semibold text-[12px] text-[#1b1c1c]" style={{ fontFamily: M }}>{d.v}</p>
                  </div>))}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => toast.info(`Tracking ${s.num}…`)} className="px-3 py-2 rounded-xl text-[12px] font-bold text-white hover:bg-[#1b1c1c] transition" style={{ background: "#303031", fontFamily: M }}>Track</button>
                <button onClick={() => toast.info("Contacting transport…")} className="p-2 rounded-xl border border-[rgba(208,198,174,0.3)] text-[#4d4634] hover:bg-[#efeded] transition">
                  <Send size={14}/>
                </button>
              </div>
            </div>);
        })}
      </div>
    </div>);
}
