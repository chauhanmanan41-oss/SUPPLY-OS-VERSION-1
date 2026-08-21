import { I, M } from "../../constants/fonts";

export function ProductTimeline({ projects }) {
    const PHASES = ["Planning", "Supplier Selection", "Manufacturing", "Packaging", "Logistics", "Launch"];
    const phaseColors = {
        "Planning": "#3b82f6", "Supplier Selection": "#a855f7",
        "Manufacturing": "#f97316", "Packaging": "#14b8a6",
        "Logistics": "#16a34a", "Launch": "#ffd54a",
    };
    const stageToPhaseIdx = {
        "Planning": 0, "Supplier Selection": 1, "Manufacturing": 2,
        "Packaging": 3, "Logistics": 4, "Completed": 5, "Delayed": 2,
    };
    return (<div className="bg-white rounded-2xl border border-[rgba(208,198,174,0.2)] shadow-[0_1px_2px_rgba(0,0,0,0.05)] overflow-hidden">
      <div className="px-7 py-5 border-b border-[rgba(208,198,174,0.2)] flex items-center justify-between">
        <div>
          <h3 className="text-[#1b1c1c] font-bold text-base" style={{ fontFamily: M }}>Launch Timeline</h3>
          <p className="text-[#4d4634] text-[12px] mt-0.5" style={{ fontFamily: I }}>Product launch pipeline · Phase-by-phase progress</p>
        </div>
      </div>
      {/* Phase headers */}
      <div className="px-7 pt-5 pb-1">
        <div className="flex">
          <div className="w-40 shrink-0"/>
          <div className="flex-1 grid" style={{ gridTemplateColumns: `repeat(${PHASES.length}, 1fr)` }}>
            {PHASES.map((ph, i) => (<div key={ph} className="text-center">
                <div className="size-2 rounded-full mx-auto mb-1" style={{ background: phaseColors[ph] }}/>
                <p className="text-[10px] font-bold uppercase tracking-[0.4px]" style={{ fontFamily: I, color: phaseColors[ph] }}>{ph}</p>
              </div>))}
          </div>
        </div>
      </div>
      {/* Rows */}
      <div className="px-7 pb-6 flex flex-col gap-3 mt-3">
        {projects.map(p => {
            const currentIdx = stageToPhaseIdx[p.stage] ?? 0;
            return (<div key={p.id} className="flex items-center gap-4">
              <div className="w-40 shrink-0 flex items-center gap-2.5">
                <span className="text-lg">{p.emoji}</span>
                <p className="text-[13px] font-semibold text-[#1b1c1c] truncate" style={{ fontFamily: M }}>{p.name}</p>
              </div>
              <div className="flex-1 relative">
                {/* Track */}
                <div className="h-5 bg-[#efeded] rounded-full overflow-hidden relative">
                  {/* Completed fill */}
                  <div className="h-full rounded-full transition-all duration-700" style={{
                    width: `${((currentIdx + p.progress / 100) / PHASES.length) * 100}%`,
                    background: p.stage === "Delayed" ? "#ba1a1a" : p.stageColor,
                    opacity: 0.85,
                }}/>
                </div>
                {/* Phase dots */}
                <div className="absolute inset-0 flex items-center">
                  {PHASES.map((ph, i) => {
                    const done = i < currentIdx;
                    const active = i === currentIdx;
                    return (<div key={ph} className="flex-1 flex justify-center">
                        <div className={`size-3 rounded-full border-2 transition-all ${done ? "" : active ? "" : ""}`} style={{
                            background: done ? phaseColors[ph] : active ? phaseColors[ph] : "#fff",
                            borderColor: done || active ? phaseColors[ph] : "rgba(208,198,174,0.5)",
                        }}/>
                      </div>);
                })}
                </div>
              </div>
              <div className="w-20 shrink-0 text-right">
                <p className="text-[11px] font-semibold text-[#4d4634]" style={{ fontFamily: I }}>{p.launch}</p>
              </div>
            </div>);
        })}
      </div>
    </div>);
}
/* Portfolio analytics charts */
