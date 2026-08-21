import { Star } from "lucide-react";

export function MStars({ r }) {
    return (<div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (<Star key={i} size={11} fill={i <= Math.round(r) ? "#ffd54a" : "none"} stroke={i <= Math.round(r) ? "#e6b800" : "rgba(208,198,174,0.5)"}/>))}
    </div>);
}
