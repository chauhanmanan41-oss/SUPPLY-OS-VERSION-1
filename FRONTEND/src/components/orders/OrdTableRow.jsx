import { toast } from "sonner";
import { Brain, CheckCircle, Truck, ChevronDown, List, MoreHorizontal, Download } from "lucide-react";
import { I, M } from "../../constants/fonts";

export function OrdTableRow({ r, expanded, onExpand }) {
    const priCol = r.priority === "high" ? "#ba1a1a" : r.priority === "medium" ? "#f97316" : "#6b7280";
    const riskCfg = { low: { col: "#16a34a", bg: "rgba(22,163,74,0.1)" }, medium: { col: "#eab308", bg: "rgba(234,179,8,0.1)" }, high: { col: "#ba1a1a", bg: "rgba(186,26,26,0.1)" } }[r.risk];
    const aiCfg = { Healthy: { col: "#16a34a", bg: "rgba(22,163,74,0.1)" }, "At Risk": { col: "#eab308", bg: "rgba(234,179,8,0.1)" }, Delayed: { col: "#ba1a1a", bg: "rgba(186,26,26,0.1)" } }[r.aiStatus] ?? { col: "#6b7280", bg: "rgba(107,114,128,0.1)" };
    const timelineSteps = ["PO Created", "Supplier Accepted", "Manufacturing", "Quality Check", "Packaging", "Dispatch", "In Transit", "Delivered"];
    const stageIndex = { "Purchase Order": 0, "Supplier Accepted": 1, "Manufacturing": 2, "Quality Check": 3, "Packaging": 4, "Dispatch": 5, "In Transit": 6, "Completed": 7 }[r.stage] ?? 0;
    return (<>
      <tr onClick={onExpand} className="border-b border-[rgba(208,198,174,0.1)] cursor-pointer hover:bg-[#fafafa] transition-colors group" style={{ background: expanded ? "rgba(59,130,246,0.025)" : undefined }}>
        <td className="px-4 py-3.5"><div className="size-2 rounded-full" style={{ background: priCol }}/></td>
        <td className="px-2 py-3.5">
          <p className="font-bold text-[11px] text-[#4d4634]" style={{ fontFamily: I }}>{r.id}</p>
        </td>
        <td className="px-3 py-3.5">
          <p className="font-semibold text-[13px] text-[#1b1c1c] whitespace-nowrap" style={{ fontFamily: M }}>{r.product}</p>
          <p className="text-[11px] text-[#4d4634]" style={{ fontFamily: I }}>{r.value}</p>
        </td>
        <td className="px-3 py-3.5">
          <p className="text-[12px] text-[#1b1c1c] whitespace-nowrap" style={{ fontFamily: I }}>{r.supplier}</p>
        </td>
        <td className="px-3 py-3.5">
          <p className="text-[12px] text-[#1b1c1c] whitespace-nowrap" style={{ fontFamily: I }}>{r.manufacturer}</p>
        </td>
        <td className="px-3 py-3.5">
          <p className="text-[12px] text-[#4d4634] whitespace-nowrap" style={{ fontFamily: I }}>{r.transport}</p>
        </td>
        <td className="px-3 py-3.5">
          <span className="inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap" style={{ background: `${r.stageCol}18`, color: r.stageCol, fontFamily: I }}>{r.stage}</span>
        </td>
        <td className="px-3 py-3.5">
          <p className="text-[12px] text-[#4d4634] whitespace-nowrap" style={{ fontFamily: I }}>{r.delivery}</p>
        </td>
        <td className="px-3 py-3.5">
          <span className="text-[11px] font-bold whitespace-nowrap" style={{ color: r.delayDays > 0 ? "#ba1a1a" : "#16a34a", fontFamily: I }}>{r.delay}</span>
        </td>
        <td className="px-3 py-3.5">
          <div className="w-20">
            <p className="text-[9px] text-[#4d4634] mb-0.5" style={{ fontFamily: I }}>{r.progress}%</p>
            <div className="w-full h-1.5 rounded-full bg-[#efeded] overflow-hidden">
              <div className="h-full rounded-full" style={{ width: `${r.progress}%`, background: r.stageCol }}/>
            </div>
          </div>
        </td>
        <td className="px-3 py-3.5">
          <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap" style={{ background: riskCfg.bg, color: riskCfg.col, fontFamily: I }}>
            {r.risk === "low" ? "Low" : r.risk === "medium" ? "Medium" : "High"} Risk
          </span>
        </td>
        <td className="px-3 py-3.5">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap" style={{ background: aiCfg.bg, color: aiCfg.col, fontFamily: I }}>
            <Brain size={9}/>{r.aiStatus}
          </span>
        </td>
        <td className="px-3 py-3.5">
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
            <button onClick={e => { e.stopPropagation(); toast.info(`Tracking ${r.id}…`); }} className="p-1.5 hover:bg-[#efeded] rounded-lg transition" title="Track">
              <Truck size={12} style={{ color: "#4d4634" }}/>
            </button>
            <button onClick={e => { e.stopPropagation(); toast.info("Downloading documents…"); }} className="p-1.5 hover:bg-[#efeded] rounded-lg transition" title="Download">
              <Download size={12} style={{ color: "#4d4634" }}/>
            </button>
            <button onClick={e => e.stopPropagation()} className="p-1.5 hover:bg-[#efeded] rounded-lg transition">
              <MoreHorizontal size={12} style={{ color: "#4d4634" }}/>
            </button>
          </div>
        </td>
        <td className="px-4 py-3.5">
          <ChevronDown size={14} style={{ color: "#4d4634", transform: expanded ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}/>
        </td>
      </tr>
      {expanded && (<tr>
          <td colSpan={14}>
            <div className="bg-[rgba(59,130,246,0.025)] border-b border-[rgba(208,198,174,0.15)] px-8 py-5">
              <div className="grid grid-cols-3 gap-6 mb-5">
                {/* Order Info */}
                <div>
                  <p className="font-bold text-[11px] text-[#4d4634] uppercase tracking-wide mb-3" style={{ fontFamily: M }}>Order Details</p>
                  {[
                { l: "Product", v: r.product },
                { l: "Supplier", v: r.supplier },
                { l: "Manufacturer", v: r.manufacturer },
                { l: "Warehouse", v: r.warehouse },
                { l: "Transport", v: r.transport },
                { l: "Order Value", v: r.value },
            ].map((d, i) => (<div key={i} className="flex justify-between items-center py-1 border-b border-[rgba(208,198,174,0.1)] last:border-0">
                      <span className="text-[12px] text-[#4d4634]" style={{ fontFamily: I }}>{d.l}</span>
                      <span className="text-[12px] font-semibold text-[#1b1c1c]" style={{ fontFamily: M }}>{d.v}</span>
                    </div>))}
                </div>
                {/* Delivery Timeline */}
                <div>
                  <p className="font-bold text-[11px] text-[#4d4634] uppercase tracking-wide mb-3" style={{ fontFamily: M }}>Delivery Timeline</p>
                  <div className="flex flex-col gap-0">
                    {timelineSteps.map((step, si) => {
                const done = si < stageIndex;
                const curr = si === stageIndex;
                return (<div key={si} className="flex items-start gap-3">
                          <div className="flex flex-col items-center">
                            <div className="size-5 rounded-full flex items-center justify-center shrink-0" style={{ background: done ? "#16a34a" : curr ? "#3b82f6" : "#efeded", border: curr ? "2px solid #3b82f6" : "none" }}>
                              {done && <CheckCircle size={11} style={{ color: "white" }}/>}
                              {curr && <div className="size-2 rounded-full bg-white"/>}
                            </div>
                            {si < timelineSteps.length - 1 && (<div className="w-[2px] h-5" style={{ background: done ? "#16a34a" : "rgba(208,198,174,0.3)" }}/>)}
                          </div>
                          <p className="text-[12px] pb-4 pt-0.5" style={{ color: done ? "#16a34a" : curr ? "#3b82f6" : "#4d4634", fontFamily: I, fontWeight: curr || done ? 600 : 400 }}>
                            {step}
                          </p>
                        </div>);
            })}
                  </div>
                </div>
                {/* Documents & Actions */}
                <div className="flex flex-col gap-4">
                  <div>
                    <p className="font-bold text-[11px] text-[#4d4634] uppercase tracking-wide mb-3" style={{ fontFamily: M }}>Documents</p>
                    {["Purchase Order (PDF)", "Invoice INV-2041", "Quality Certificate", "Packing List"].map((doc, i) => (<button key={i} onClick={() => toast.info(`Downloading ${doc}…`)} className="flex items-center gap-2 w-full py-2 text-[12px] text-[#4d4634] hover:text-[#1b1c1c] border-b border-[rgba(208,198,174,0.1)] last:border-0 transition text-left" style={{ fontFamily: I }}>
                        <Download size={11} style={{ color: "#3b82f6" }}/>{doc}
                      </button>))}
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="font-bold text-[11px] text-[#4d4634] uppercase tracking-wide" style={{ fontFamily: M }}>Quick Actions</p>
                    <button onClick={() => toast.info(`Tracking ${r.id}…`)} className="w-full py-2 rounded-xl text-[12px] font-bold text-white hover:bg-[#1b1c1c] transition" style={{ background: "#303031", fontFamily: M }}>Track Shipment</button>
                    {r.stage !== "Completed" && (
                      <button 
                        onClick={async () => {
                          try {
                            const { api } = await import("../../services/api");
                            await api.post(`/orders/sales-orders/${r.id}/update-status/`, { status: "shipped" });
                            toast.success(`${r.id} marked as shipped`);
                            // We aren't fully wired so we don't have refetch(), but toast shows success
                          } catch (err) {
                            toast.error(err.message || "Failed to mark shipped");
                          }
                        }} 
                        className="w-full py-2 rounded-xl text-[12px] font-bold text-white hover:bg-[#1b1c1c] transition flex items-center justify-center gap-1.5" 
                        style={{ background: "#3b82f6", fontFamily: M }}
                      >
                        <CheckCircle size={13} /> Mark Shipped
                      </button>
                    )}
                    <button onClick={() => toast.info("AI recommendation loading…")} className="w-full py-2 rounded-xl text-[12px] font-bold hover:opacity-90 transition" style={{ background: "#ffd54a", color: "#735c00", fontFamily: M }}>AI Recommendation</button>
                    <button onClick={() => toast.info("Contacting supplier…")} className="w-full py-2 rounded-xl text-[12px] font-semibold border border-[rgba(208,198,174,0.3)] text-[#4d4634] hover:bg-[#efeded] transition" style={{ fontFamily: M }}>Contact Supplier</button>
                  </div>
                </div>
              </div>
            </div>
          </td>
        </tr>)}
    </>);
}
