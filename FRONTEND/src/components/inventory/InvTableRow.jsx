import { toast } from "sonner";
import { I, M } from "../../constants/fonts";
import { INV_STATUS_CFG } from "../../constants/inventory";

export function InvTableRow({ r }) {
    const sc = INV_STATUS_CFG[r.status];
    const pct = Math.min(100, Math.round((r.available / r.maxLevel) * 100));
    const barCol = r.status === "critical" || r.status === "out" ? "#ba1a1a" : r.status === "low" ? "#eab308" : r.status === "overstock" ? "#3b82f6" : "#16a34a";
    return (<tr className="border-b border-[rgba(208,198,174,0.1)] hover:bg-[#fafafa] transition-colors group">
      <td className="px-4 py-3.5">
        <p className="font-semibold text-[13px] text-[#1b1c1c]" style={{ fontFamily: M }}>{r.name}</p>
        <p className="text-[10px] text-[#4d4634]" style={{ fontFamily: I }}>{r.sku}</p>
      </td>
      <td className="px-3 py-3.5">
        <span className="text-[11px] font-semibold text-[#4d4634]" style={{ fontFamily: I }}>{r.category}</span>
      </td>
      <td className="px-3 py-3.5">
        <span className="text-[11px] text-[#4d4634] whitespace-nowrap" style={{ fontFamily: I }}>{r.warehouse}</span>
      </td>
      <td className="px-3 py-3.5 text-center">
        <p className="font-bold text-[13px] text-[#1b1c1c]" style={{ fontFamily: M }}>{r.available.toLocaleString()}</p>
        <p className="text-[10px] text-[#4d4634]" style={{ fontFamily: I }}>{r.unit}</p>
      </td>
      <td className="px-3 py-3.5 text-center">
        <p className="text-[12px] text-[#4d4634]" style={{ fontFamily: I }}>{r.reserved.toLocaleString()}</p>
      </td>
      <td className="px-3 py-3.5 text-center">
        <p className="text-[12px]" style={{ color: r.incoming > 0 ? "#16a34a" : "#4d4634", fontFamily: I, fontWeight: r.incoming > 0 ? 600 : 400 }}>
          {r.incoming > 0 ? `+${r.incoming.toLocaleString()}` : "—"}
        </p>
      </td>
      <td className="px-3 py-3.5">
        <div className="w-[80px]">
          <div className="flex justify-between mb-0.5">
            <span className="text-[9px] text-[#4d4634]" style={{ fontFamily: I }}>{pct}%</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-[#efeded] overflow-hidden">
            <div className="h-full rounded-full" style={{ width: `${pct}%`, background: barCol }}/>
          </div>
        </div>
      </td>
      <td className="px-3 py-3.5">
        <p className="font-bold text-[13px] text-[#1b1c1c]" style={{ fontFamily: M }}>{r.value}</p>
      </td>
      <td className="px-3 py-3.5">
        <span className="inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap" style={{ background: sc.bg, color: sc.col, fontFamily: I }}>{sc.label}</span>
      </td>
      <td className="px-3 py-3.5 max-w-[160px]">
        <p className="text-[11px] text-[#4d4634] leading-snug" style={{ fontFamily: I }}>{r.aiRec}</p>
      </td>
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
          {["Reorder", "Transfer", "Adjust"].map(a => (<button key={a} onClick={() => toast.info(`${a} — ${r.name}`)} className="px-2 py-1 rounded-lg text-[10px] font-semibold bg-[#efeded] text-[#4d4634] hover:bg-[#e0dddd] transition whitespace-nowrap" style={{ fontFamily: M }}>{a}</button>))}
        </div>
      </td>
    </tr>);
}
