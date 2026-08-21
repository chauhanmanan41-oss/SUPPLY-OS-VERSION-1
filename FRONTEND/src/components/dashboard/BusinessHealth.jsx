import { toast } from "sonner";
import { ChevronRight } from "lucide-react";
import { ProgressRing } from "../common/ProgressRing";
import { StatusDot } from "../common/StatusDot";
import { HEALTH_METRICS } from "../../constants/dashboard";
import { I, M } from "../../constants/fonts";

export function BusinessHealth() {
    const overall = 76;
    return (<div className="bg-white rounded-2xl border border-[rgba(208,198,174,0.2)] shadow-[0_1px_2px_rgba(0,0,0,0.05)] p-7">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-[#1b1c1c] font-bold text-lg" style={{ fontFamily: M }}>Business Health</h2>
          <p className="text-[#4d4634] text-sm mt-0.5" style={{ fontFamily: I }}>Real-time operational health index</p>
        </div>
        <button onClick={() => toast.info("Opening detailed health report…")} className="text-[#4d4634] text-sm font-bold flex items-center gap-1 hover:text-[#1b1c1c] transition" style={{ fontFamily: I }}>
          Details <ChevronRight size={14}/>
        </button>
      </div>

      <div className="flex items-center gap-8">
        {/* Overall ring */}
        <div className="flex flex-col items-center gap-3 shrink-0">
          <ProgressRing value={overall} color={overall > 80 ? "#16a34a" : overall > 60 ? "#eab308" : "#ba1a1a"} size={96} sw={7}>
            <div className="flex flex-col items-center">
              <span className="font-bold text-xl text-[#1b1c1c] leading-none" style={{ fontFamily: M }}>{overall}%</span>
              <span className="text-[9px] text-[#4d4634] uppercase tracking-wider mt-0.5" style={{ fontFamily: I }}>Overall</span>
            </div>
          </ProgressRing>
          <div className="flex items-center gap-1.5">
            <StatusDot color="#eab308"/>
            <span className="text-[#4d4634] text-[12px] font-semibold" style={{ fontFamily: I }}>Moderate</span>
          </div>
        </div>

        {/* Divider */}
        <div className="h-24 w-px bg-[rgba(208,198,174,0.3)]"/>

        {/* Sub-metrics */}
        <div className="flex-1 grid grid-cols-5 gap-4">
          {HEALTH_METRICS.map((m) => (<div key={m.label} className="flex flex-col items-center gap-2">
              <ProgressRing value={m.value} color={m.color} size={56} sw={5}>
                <span className="font-bold text-xs text-[#1b1c1c]" style={{ fontFamily: M }}>{m.value}%</span>
              </ProgressRing>
              <p className="text-[#4d4634] text-[11px] font-semibold text-center" style={{ fontFamily: I }}>{m.label}</p>
              <div className="flex items-center gap-1">
                <StatusDot color={m.color}/>
                <span className="text-[10px] font-semibold" style={{ fontFamily: I, color: m.color }}>
                  {m.value >= 80 ? "Good" : m.value >= 65 ? "Fair" : "Poor"}
                </span>
              </div>
            </div>))}
        </div>
      </div>
    </div>);
}
