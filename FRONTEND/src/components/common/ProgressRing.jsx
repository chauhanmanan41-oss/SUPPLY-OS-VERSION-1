export const ProgressRing = ({ value, color, size = 64, sw = 5, children }) => {
    const r = (size - sw * 2) / 2;
    const circ = 2 * Math.PI * r;
    return (<div className="relative inline-flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
      <svg className="absolute" width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(208,198,174,0.2)" strokeWidth={sw}/>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={sw} strokeDasharray={`${(value / 100) * circ} ${circ}`} strokeLinecap="round" style={{ transition: "stroke-dasharray 0.6s ease" }}/>
      </svg>
      <div className="relative z-10">{children}</div>
    </div>);
};
