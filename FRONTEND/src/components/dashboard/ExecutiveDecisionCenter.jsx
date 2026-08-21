import { useState } from "react";
import { toast } from "sonner";
import { ChevronRight, ChevronDown } from "lucide-react";
import svgPaths from "../../imports/HtmlBody/svg-whh5jpitbk";
import { StatusDot } from "../common/StatusDot";
import { DECISIONS } from "../../constants/dashboard";
import { I, M } from "../../constants/fonts";

export function ExecutiveDecisionCenter() {
    const [collapsed, setCollapsed] = useState([]);
    const toggle = (cat) => setCollapsed(p => p.includes(cat) ? p.filter(c => c !== cat) : [...p, cat]);
    return (<div className="w-[380px] shrink-0 h-full flex flex-col bg-[#fbf9f9] border-l border-[rgba(208,198,174,0.2)]">
      {/* Header */}
      <div className="px-6 py-5 border-b border-[rgba(208,198,174,0.2)] bg-[#fbf9f9] z-10 shrink-0">
        <div className="flex items-center gap-3">
          <svg width="20" height="22" viewBox="0 0 22.5 25" fill="none">
            <path d={svgPaths.p3ef9980} fill="#FFD54A"/>
          </svg>
          <div className="flex-1">
            <h3 className="text-[#1b1c1c] font-bold text-base" style={{ fontFamily: M }}>Executive Decision Center</h3>
            <p className="text-[#4d4634] text-[11px] mt-0.5" style={{ fontFamily: I }}>5 items need your attention</p>
          </div>
          <div className="px-2.5 py-1 rounded-lg bg-[#efeded] border border-[rgba(208,198,174,0.3)]">
            <span className="text-[#4d4634] text-[11px] font-bold uppercase tracking-wider" style={{ fontFamily: I }}>5 Tasks</span>
          </div>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3" style={{ scrollbarWidth: "none" }}>
        {DECISIONS.map((section) => {
            const isCollapsed = collapsed.includes(section.category);
            return (<div key={section.category} className="rounded-xl overflow-hidden border" style={{ borderColor: section.borderColor }}>
              {/* Section header */}
              <button onClick={() => toggle(section.category)} className="w-full flex items-center justify-between px-4 py-3 transition" style={{ background: section.bg }}>
                <div className="flex items-center gap-2">
                  <StatusDot color={section.color}/>
                  <span className="text-[11px] font-bold uppercase tracking-[0.6px]" style={{ fontFamily: I, color: section.textColor ?? section.color }}>{section.category}</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md" style={{ background: `${section.color}20`, color: section.color, fontFamily: I }}>
                    {section.items.length}
                  </span>
                </div>
                {isCollapsed ? <ChevronRight size={13} style={{ color: section.color }}/> : <ChevronDown size={13} style={{ color: section.color }}/>}
              </button>

              {/* Items */}
              {!isCollapsed && section.items.map((item, i) => (<div key={i} className="bg-white px-4 py-4 border-t" style={{ borderColor: section.borderColor }}>
                  {/* Left accent bar */}
                  <div className="flex gap-3">
                    <div className="w-1 rounded-full shrink-0 self-stretch" style={{ background: section.color }}/>
                    <div className="flex-1 min-w-0">
                      <p className="text-[#1b1c1c] text-[13px] font-bold leading-tight" style={{ fontFamily: M }}>{item.title}</p>
                      <p className="text-[#4d4634] text-[12px] mt-1.5 leading-snug" style={{ fontFamily: I }}>{item.detail}</p>

                      {/* Impact row */}
                      <div className="flex items-center gap-4 mt-3 py-2 px-3 rounded-lg" style={{ background: `${section.color}0d` }}>
                        <div>
                          <p className="text-[9px] font-bold uppercase tracking-[0.5px] mb-0.5" style={{ fontFamily: I, color: `${section.color}` }}>IMPACT</p>
                          <p className="text-[#1b1c1c] font-bold text-sm" style={{ fontFamily: M }}>{item.impact}</p>
                        </div>
                        <div className="w-px h-6 bg-[rgba(208,198,174,0.4)]"/>
                        <div>
                          <p className="text-[9px] font-bold uppercase tracking-[0.5px] mb-0.5" style={{ fontFamily: I, color: "rgba(77,70,52,0.5)" }}>DETAIL</p>
                          <p className="text-[#4d4634] text-[12px] font-semibold" style={{ fontFamily: I }}>{item.impactDetail}</p>
                        </div>
                      </div>

                      {/* CTA */}
                      <button onClick={() => toast.success(`${item.cta} initiated.`)} className="mt-3 w-full py-2.5 rounded-xl text-[13px] font-bold transition" style={{ background: "#1b1c1c", color: "white", fontFamily: M }}>
                        {item.cta}
                      </button>
                    </div>
                  </div>
                </div>))}
            </div>);
        })}
      </div>
    </div>);
}
