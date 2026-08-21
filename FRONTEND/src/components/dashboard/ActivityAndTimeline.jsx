import { toast } from "sonner";
import { ChevronRight, Activity } from "lucide-react";
import { ACTIVITIES, TIMELINE } from "../../constants/dashboard";
import { I, M } from "../../constants/fonts";

export function ActivityAndTimeline() {
    return (<div className="grid grid-cols-2 gap-5">
      {/* Recent Activity */}
      <div className="bg-white rounded-2xl border border-[rgba(208,198,174,0.2)] shadow-[0_1px_2px_rgba(0,0,0,0.05)] overflow-hidden">
        <div className="px-6 py-5 border-b border-[rgba(208,198,174,0.2)] flex items-center justify-between">
          <div>
            <h3 className="text-[#1b1c1c] font-bold text-base" style={{ fontFamily: M }}>Recent Activity</h3>
            <p className="text-[#4d4634] text-[12px] mt-0.5" style={{ fontFamily: I }}>Last 24 hours</p>
          </div>
          <button onClick={() => toast.info("Showing full activity log.")} className="text-[#4d4634] text-[13px] font-bold flex items-center gap-1 hover:text-[#1b1c1c] transition" style={{ fontFamily: I }}>
            View All <ChevronRight size={13}/>
          </button>
        </div>
        <div className="divide-y divide-[rgba(208,198,174,0.12)]">
          {ACTIVITIES.map((a, i) => {
            const Icon = a.icon;
            return (<div key={i} className="flex items-start gap-4 px-6 py-4 hover:bg-[rgba(208,198,174,0.05)] transition cursor-pointer" onClick={() => toast.info(a.label, { description: a.detail })}>
                <div className="size-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5" style={{ background: a.bg }}>
                  <Icon size={14} style={{ color: a.color }}/>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[#1b1c1c] text-[13px] font-semibold leading-tight" style={{ fontFamily: I }}>{a.label}</p>
                  <p className="text-[#4d4634] text-[12px] mt-0.5 truncate" style={{ fontFamily: I }}>{a.detail}</p>
                </div>
                <span className="text-[#4d4634]/50 text-[11px] shrink-0 mt-0.5" style={{ fontFamily: I }}>{a.time}</span>
              </div>);
        })}
        </div>
      </div>

      {/* Upcoming Timeline */}
      <div className="bg-white rounded-2xl border border-[rgba(208,198,174,0.2)] shadow-[0_1px_2px_rgba(0,0,0,0.05)] overflow-hidden">
        <div className="px-6 py-5 border-b border-[rgba(208,198,174,0.2)] flex items-center justify-between">
          <div>
            <h3 className="text-[#1b1c1c] font-bold text-base" style={{ fontFamily: M }}>Upcoming</h3>
            <p className="text-[#4d4634] text-[12px] mt-0.5" style={{ fontFamily: I }}>Deliveries, payments & deadlines</p>
          </div>
          <button onClick={() => toast.info("Opening full calendar view.")} className="text-[#4d4634] text-[13px] font-bold flex items-center gap-1 hover:text-[#1b1c1c] transition" style={{ fontFamily: I }}>
            Calendar <ChevronRight size={13}/>
          </button>
        </div>
        <div className="divide-y divide-[rgba(208,198,174,0.12)]">
          {TIMELINE.map((t, i) => {
            const Icon = t.icon;
            return (<div key={i} className="flex items-center gap-4 px-6 py-4 hover:bg-[rgba(208,198,174,0.05)] transition cursor-pointer" onClick={() => toast.info(t.label, { description: t.detail })}>
                <div className="size-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${t.color}15` }}>
                  <Icon size={15} style={{ color: t.color }}/>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[#1b1c1c] text-[13px] font-semibold leading-tight" style={{ fontFamily: I }}>{t.label}</p>
                  <p className="text-[#4d4634] text-[12px] mt-0.5 truncate" style={{ fontFamily: I }}>{t.detail}</p>
                </div>
                <div className="text-right shrink-0">
                  <div className="px-2.5 py-1 rounded-lg text-[11px] font-bold" style={{ background: `${t.color}15`, color: t.color, fontFamily: I }}>
                    {t.date}
                  </div>
                </div>
              </div>);
        })}
        </div>
      </div>
    </div>);
}
