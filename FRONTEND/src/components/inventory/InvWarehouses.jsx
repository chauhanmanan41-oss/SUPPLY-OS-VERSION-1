import { toast } from "sonner";
import { I, M } from "../../constants/fonts";
import { INV_WAREHOUSES } from "../../constants/inventory";

export function InvWarehouses() {
    return (<div>
      <p className="font-bold text-[15px] text-[#1b1c1c] mb-3" style={{ fontFamily: M }}>Warehouse Distribution</p>
      <div className="grid grid-cols-2 gap-4">
        {INV_WAREHOUSES.map((w, i) => {
            const alertCol = w.used >= 85 ? "#ba1a1a" : w.used >= 70 ? "#eab308" : "#16a34a";
            return (<div key={i} className="bg-white rounded-2xl border border-[rgba(208,198,174,0.2)] p-5 flex flex-col gap-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-bold text-[15px] text-[#1b1c1c]" style={{ fontFamily: M }}>{w.name}</p>
                  <p className="text-[12px] text-[#4d4634] mt-0.5" style={{ fontFamily: I }}>{w.items} items · {w.total}</p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold shrink-0" style={{ background: `${alertCol}15`, color: alertCol, fontFamily: I }}>
                  {w.used >= 85 ? "Near Full" : w.used >= 70 ? "Moderate" : "Good"}
                </span>
              </div>
              <div>
                <div className="flex justify-between mb-1.5">
                  <span className="text-[12px] text-[#4d4634]" style={{ fontFamily: I }}>Storage Used</span>
                  <span className="font-bold text-[13px]" style={{ color: alertCol, fontFamily: M }}>{w.used}%</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-[#efeded] overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${w.used}%`, background: alertCol }}/>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-[10px] text-[#4d4634]" style={{ fontFamily: I }}>Available: {w.available}</span>
                  <span className="text-[10px] font-semibold text-[#1b1c1c]" style={{ fontFamily: I }}>Value: {w.value}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => toast.info(`Viewing ${w.name}…`)} className="flex-1 py-2 rounded-xl text-[12px] font-semibold border border-[rgba(208,198,174,0.3)] text-[#4d4634] hover:bg-[#efeded] transition" style={{ fontFamily: M }}>View</button>
                <button onClick={() => toast.info("Transfer wizard opening…")} className="flex-1 py-2 rounded-xl text-[12px] font-semibold border border-[rgba(208,198,174,0.3)] text-[#4d4634] hover:bg-[#efeded] transition" style={{ fontFamily: M }}>Transfer</button>
                <button onClick={() => toast.success("Optimizing storage…")} className="flex-1 py-2 rounded-xl text-[12px] font-bold hover:opacity-90 transition text-white" style={{ background: "#303031", fontFamily: M }}>Optimize</button>
              </div>
            </div>);
        })}
      </div>
    </div>);
}
