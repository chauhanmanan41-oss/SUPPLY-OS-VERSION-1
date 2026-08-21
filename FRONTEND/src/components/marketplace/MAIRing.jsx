import { I, M } from "../../constants/fonts";

export function MAIRing({ score }) {
    const col = score >= 95 ? "#16a34a" : score >= 88 ? "#3b82f6" : "#eab308";
    const r = 24, sw = 3, circ = 2 * Math.PI * r;
    return (<div className="flex flex-col items-center gap-1 shrink-0">
      <div className="relative size-[60px] flex items-center justify-center">
        <svg className="absolute" width={60} height={60} style={{ transform: "rotate(-90deg)" }}>
          <circle cx={30} cy={30} r={r} fill="none" stroke="rgba(208,198,174,0.15)" strokeWidth={sw}/>
          <circle cx={30} cy={30} r={r} fill="none" stroke={col} strokeWidth={sw} strokeDasharray={`${(score / 100) * circ} ${circ}`} strokeLinecap="round"/>
        </svg>
        <span className="font-bold text-[14px] relative z-10" style={{ color: col, fontFamily: M }}>{score}%</span>
      </div>
      <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: col, fontFamily: I }}>AI Match</span>
    </div>);
}
