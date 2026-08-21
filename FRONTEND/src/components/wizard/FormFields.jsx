import { I } from "../../constants/fonts";

export const WF = ({ label, required, children }) => (<div className="flex flex-col gap-2">
    <label className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-[0.55px] text-[#4d4634]" style={{ fontFamily: I }}>
      {label}{required && <span className="text-[#ba1a1a]">*</span>}
    </label>
    {children}
  </div>);

export const WIn = (p) => (<input {...p} className={`h-11 px-4 border border-[rgba(208,198,174,0.4)] rounded-xl bg-white text-[#1b1c1c] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#ffd54a] transition placeholder:text-[rgba(77,70,52,0.35)] ${p.className ?? ""}`} style={{ fontFamily: I, ...p.style }}/>);

export const WSel = (p) => (<select {...p} className={`h-11 px-4 border border-[rgba(208,198,174,0.4)] rounded-xl bg-white text-[#1b1c1c] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#ffd54a] transition appearance-none cursor-pointer ${p.className ?? ""}`} style={{ fontFamily: I, ...p.style }}/>);

export const WTA = (p) => (<textarea {...p} className={`px-4 py-3 border border-[rgba(208,198,174,0.4)] rounded-xl bg-white text-[#1b1c1c] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#ffd54a] transition placeholder:text-[rgba(77,70,52,0.35)] resize-none ${p.className ?? ""}`} style={{ fontFamily: I, ...p.style }}/>);

export const TagRow = ({ options, selected, onToggle, activeColor = "#303031", activeText = "white" }) => (<div className="flex flex-wrap gap-2 p-3 border border-[rgba(208,198,174,0.4)] rounded-xl bg-white min-h-[44px]">
    {options.map(o => {
        const sel = selected.includes(o);
        return (<button key={o} onClick={() => onToggle(o)} className="px-3 py-1 rounded-lg text-[12px] font-semibold transition" style={{ background: sel ? activeColor : "#efeded", color: sel ? activeText : "#4d4634", fontFamily: I }}>
          {o}
        </button>);
    })}
  </div>);
/* ── Horizontal Stepper ── */
