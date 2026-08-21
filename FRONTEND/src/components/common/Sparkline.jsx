import { sparkPath } from "../../utils/helpers";

export const Sparkline = ({ data, color, w = 80, h = 28 }) => (<svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none">
    <defs>
      <linearGradient id={`sg-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={color} stopOpacity="0.15"/>
        <stop offset="100%" stopColor={color} stopOpacity="0"/>
      </linearGradient>
    </defs>
    <path d={sparkPath(data, w, h) + ` L ${w} ${h} L 0 ${h} Z`} fill={`url(#sg-${color.replace("#", "")})`}/>
    <path d={sparkPath(data, w, h)} stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>);
