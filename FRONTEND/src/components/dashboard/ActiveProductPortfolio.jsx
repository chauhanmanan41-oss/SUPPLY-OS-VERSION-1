import { toast } from "sonner";
import { ChevronRight, Clock, ArrowUpRight } from "lucide-react";
import { Badge } from "../common/Badge";
import { StatusDot } from "../common/StatusDot";
import { I, M } from "../../constants/fonts";

export function ActiveProductPortfolio({ onOpenWorkspace, products = [] }) {
    return (<div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-[#1b1c1c] font-bold text-lg" style={{ fontFamily: M }}>Active Product Portfolio</h2>
          <p className="text-[#4d4634] text-sm mt-0.5" style={{ fontFamily: I }}>{products.length} active workspaces · AI-monitored in real time</p>
        </div>
        <button onClick={() => toast.info("Showing all product workspaces.")} className="flex items-center gap-1.5 text-[#4d4634] text-sm font-bold hover:text-[#1b1c1c] transition" style={{ fontFamily: I }}>
          View All <ChevronRight size={14}/>
        </button>
      </div>
      
      {products.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[rgba(208,198,174,0.2)] shadow-[0_1px_2px_rgba(0,0,0,0.05)] p-12 flex flex-col items-center justify-center text-center">
          <p className="text-[#1b1c1c] font-bold text-lg mb-2" style={{ fontFamily: M }}>No products yet</p>
          <p className="text-[#4d4634] text-sm max-w-md" style={{ fontFamily: I }}>Create your first product to start tracking its lifecycle.</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-5">
          {products.map((p) => {
            const stageColor = p.stage === "Manufacturing" ? "#a855f7" : p.stage === "Planning" ? "#3b82f6" : "#eab308";
            const stageBg = p.stage === "Manufacturing" ? "rgba(168,85,247,0.1)" : p.stage === "Planning" ? "rgba(59,130,246,0.1)" : "rgba(234,179,8,0.1)";
            const healthColor = p.health_score > 80 ? "#16a34a" : p.health_score > 60 ? "#eab308" : "#ba1a1a";
            
            return (<div key={p.id} className="bg-white rounded-2xl border border-[rgba(208,198,174,0.2)] shadow-[0_1px_2px_rgba(0,0,0,0.05)] p-6 flex flex-col gap-5 hover:shadow-[0_4px_16px_rgba(0,0,0,0.07)] transition-shadow duration-200">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="size-12 rounded-xl bg-[#efeded] flex items-center justify-center border border-[rgba(208,198,174,0.3)] shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)] text-2xl">
                    {p.emoji || "📦"}
                  </div>
                  <div>
                    <p className="text-[#1b1c1c] font-bold text-base leading-tight" style={{ fontFamily: M }}>{p.name}</p>
                    <Badge label={p.stage} color={stageColor} bg={stageBg}/>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <StatusDot color={healthColor}/>
                  <span className="text-[#1b1c1c] text-sm font-bold" style={{ fontFamily: M }}>{p.health_score ?? 0}%</span>
                </div>
              </div>

              {/* Progress */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[#4d4634] text-[11px] font-bold uppercase tracking-[0.5px]" style={{ fontFamily: I }}>Progress</span>
                  <span className="text-[#1b1c1c] text-[13px] font-bold" style={{ fontFamily: M }}>{p.progress_pct ?? 0}%</span>
                </div>
                <div className="h-1.5 bg-[#efeded] rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: `${p.progress_pct ?? 0}%`, background: stageColor }}/>
                </div>
              </div>

              {/* Stats grid */}
              <div className="flex items-center justify-between py-2 border-t border-[rgba(208,198,174,0.2)]">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#4d4634]" style={{ fontFamily: I }}>EST. LAUNCH</p>
                  <p className="font-bold text-[#1b1c1c]" style={{ fontFamily: M }}>TBD</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#4d4634]" style={{ fontFamily: I }}>RISK LEVEL</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <StatusDot color={p.risk_level === "low" ? "#16a34a" : p.risk_level === "medium" ? "#eab308" : "#ba1a1a"} />
                    <span className="text-sm font-bold text-[#1b1c1c] capitalize" style={{ fontFamily: I }}>{p.risk_level || "low"}</span>
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="pt-4 border-t border-[rgba(208,198,174,0.3)] flex items-center justify-between mt-auto">
                <div className="flex items-center gap-2 text-[#4d4634] text-xs font-semibold" style={{ fontFamily: I }}>
                  <Clock size={12}/>
                  <span>{p.current_milestone || "No milestone"}</span>
                </div>
                <button onClick={() => onOpenWorkspace(p.id)} className="h-8 px-3 rounded-lg bg-[rgba(208,198,174,0.15)] text-[#1b1c1c] text-xs font-bold flex items-center gap-1.5 hover:bg-[rgba(208,198,174,0.25)] transition" style={{ fontFamily: I }}>
                  Workspace <ArrowUpRight size={13}/>
                </button>
              </div>
            </div>);
          })}
        </div>
      )}
    </div>);
}
