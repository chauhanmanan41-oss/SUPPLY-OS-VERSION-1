import { toast } from "sonner";
import { Brain, Send, ChevronDown, MoreHorizontal, Download } from "lucide-react";
import { I, M } from "../../constants/fonts";
import { PRO_BUD_CFG, PRO_RISK_CFG } from "../../constants/procurement";

export function ProTableRow({ r, expanded, onExpand }) {
    const rCfg = PRO_RISK_CFG[r.risk];
    const bCfg = PRO_BUD_CFG[r.budget];
    const priCol = r.priority === "high" ? "#ba1a1a" : r.priority === "medium" ? "#f97316" : "#6b7280";
    return (<>
      <tr onClick={onExpand} className="border-b border-[rgba(208,198,174,0.1)] cursor-pointer hover:bg-[#fafafa] transition-colors group" style={{ background: expanded ? "rgba(59,130,246,0.025)" : undefined }}>
        <td className="px-4 py-3.5">
          <div className="size-2 rounded-full" style={{ background: priCol }}/>
        </td>
        <td className="px-2 py-3.5">
          <p className="font-bold text-[11px] text-[#4d4634]" style={{ fontFamily: I }}>{r.id}</p>
        </td>
        <td className="px-3 py-3.5">
          <p className="font-semibold text-[13px] text-[#1b1c1c] whitespace-nowrap" style={{ fontFamily: M }}>{r.product}</p>
          <p className="text-[11px] text-[#4d4634]" style={{ fontFamily: I }}>{r.btype}</p>
        </td>
        <td className="px-3 py-3.5">
          <p className="text-[13px] text-[#1b1c1c] whitespace-nowrap" style={{ fontFamily: I }}>{r.supplier}</p>
        </td>
        <td className="px-3 py-3.5">
          <span className="inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap" style={{ background: `${r.stageCol}18`, color: r.stageCol, fontFamily: I }}>{r.stage}</span>
        </td>
        <td className="px-3 py-3.5 text-center">
          <span className="font-bold text-[14px] text-[#3b82f6]" style={{ fontFamily: M }}>{r.quoteCount}</span>
        </td>
        <td className="px-3 py-3.5">
          <div className="flex items-center gap-1">
            <Brain size={10} style={{ color: "#735c00" }}/>
            <span className="text-[12px] font-semibold text-[#735c00] whitespace-nowrap" style={{ fontFamily: I }}>{r.aiRec}</span>
          </div>
        </td>
        <td className="px-3 py-3.5">
          <p className="font-bold text-[14px] text-[#1b1c1c] whitespace-nowrap" style={{ fontFamily: M }}>{r.value}</p>
        </td>
        <td className="px-3 py-3.5">
          <p className="text-[12px] text-[#4d4634] whitespace-nowrap" style={{ fontFamily: I }}>{r.delivery}</p>
        </td>
        <td className="px-3 py-3.5">
          <div className="w-20">
            <p className="text-[9px] text-[#4d4634] mb-0.5" style={{ fontFamily: I }}>{r.progress}%</p>
            <div className="w-full h-1.5 rounded-full bg-[#efeded] overflow-hidden">
              <div className="h-full rounded-full transition-all" style={{ width: `${r.progress}%`, background: r.stageCol }}/>
            </div>
          </div>
        </td>
        <td className="px-3 py-3.5">
          <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap" style={{ background: rCfg.bg, color: rCfg.col, fontFamily: I }}>{rCfg.label}</span>
        </td>
        <td className="px-3 py-3.5">
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
            <button onClick={e => { e.stopPropagation(); toast.success(`RFQ sent for ${r.product}`); }} className="p-1.5 hover:bg-[#efeded] rounded-lg transition" title="Send RFQ">
              <Send size={12} style={{ color: "#4d4634" }}/>
            </button>
            <button onClick={e => { e.stopPropagation(); toast.info("Downloading…"); }} className="p-1.5 hover:bg-[#efeded] rounded-lg transition" title="Download">
              <Download size={12} style={{ color: "#4d4634" }}/>
            </button>
            <button onClick={e => e.stopPropagation()} className="p-1.5 hover:bg-[#efeded] rounded-lg transition" title="More">
              <MoreHorizontal size={12} style={{ color: "#4d4634" }}/>
            </button>
          </div>
        </td>
        <td className="px-4 py-3.5">
          <ChevronDown size={14} style={{ color: "#4d4634", transform: expanded ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}/>
        </td>
      </tr>
      {expanded && (<tr>
          <td colSpan={13}>
            <div className="bg-[rgba(59,130,246,0.025)] border-b border-[rgba(208,198,174,0.15)] px-8 py-5 grid grid-cols-3 gap-6">
              {/* Product & Supplier */}
              <div>
                <p className="font-bold text-[11px] text-[#4d4634] uppercase tracking-wide mb-3" style={{ fontFamily: M }}>Product & Supplier</p>
                {[
                { l: "Product", v: r.product },
                { l: "Supplier", v: r.supplier },
                { l: "Type", v: r.btype },
                { l: "Value", v: r.value },
                { l: "Delivery", v: r.delivery },
            ].map((d, i) => (<div key={i} className="flex justify-between items-center py-1 border-b border-[rgba(208,198,174,0.1)] last:border-0">
                    <span className="text-[12px] text-[#4d4634]" style={{ fontFamily: I }}>{d.l}</span>
                    <span className="text-[12px] font-semibold text-[#1b1c1c]" style={{ fontFamily: M }}>{d.v}</span>
                  </div>))}
              </div>
              {/* Status */}
              <div>
                <p className="font-bold text-[11px] text-[#4d4634] uppercase tracking-wide mb-3" style={{ fontFamily: M }}>Procurement Status</p>
                {[
                { l: "RFQ Status", v: r.rfqStatus, c: r.stageCol },
                { l: "Stage", v: r.stage, c: r.stageCol },
                { l: "Quotes", v: `${r.quoteCount} received`, c: "#1b1c1c" },
                { l: "AI Rec.", v: r.aiRec, c: "#735c00" },
                { l: "Budget", v: bCfg.label, c: bCfg.col },
            ].map((d, i) => (<div key={i} className="flex justify-between items-center py-1 border-b border-[rgba(208,198,174,0.1)] last:border-0">
                    <span className="text-[12px] text-[#4d4634]" style={{ fontFamily: I }}>{d.l}</span>
                    <span className="text-[12px] font-bold" style={{ color: d.c, fontFamily: M }}>{d.v}</span>
                  </div>))}
                <div className="mt-3">
                  <p className="text-[11px] text-[#4d4634] mb-1" style={{ fontFamily: I }}>Progress — {r.progress}%</p>
                  <div className="w-full h-2 rounded-full bg-[#efeded] overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${r.progress}%`, background: r.stageCol }}/>
                  </div>
                </div>
              </div>
              {/* Quick Actions */}
              <div>
                <p className="font-bold text-[11px] text-[#4d4634] uppercase tracking-wide mb-3" style={{ fontFamily: M }}>Quick Actions</p>
                <div className="flex flex-col gap-2">
                  {[
                { l: "View Full Details", fn: () => toast.info("Opening procurement detail…"), primary: true },
                { l: "Send RFQ", fn: () => toast.success(`RFQ sent for ${r.product}`), primary: false },
                { l: "Create Purchase Order", fn: () => toast.success("PO draft created"), primary: false },
                { l: "AI Recommendation", fn: () => toast.info("Loading AI analysis…"), primary: false },
                { l: "Download Documents", fn: () => toast.info("Preparing documents…"), primary: false },
            ].map((a, i) => (<button key={i} onClick={a.fn} className="w-full py-2 rounded-xl text-[12px] font-semibold transition px-3 text-left" style={{ background: a.primary ? "#303031" : "transparent", color: a.primary ? "white" : "#4d4634", border: a.primary ? "none" : "1px solid rgba(208,198,174,0.3)", fontFamily: M }}>
                      {a.l}
                    </button>))}
                </div>
              </div>
            </div>
          </td>
        </tr>)}
    </>);
}
