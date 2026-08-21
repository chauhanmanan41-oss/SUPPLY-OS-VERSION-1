import { I } from "../../constants/fonts";

export const Badge = ({ label, color, bg }) => (<div className="inline-flex items-center px-2.5 py-[3px] rounded-md text-[10px] font-bold tracking-[0.6px] uppercase" style={{ background: bg, color, fontFamily: I }}>
    {label}
  </div>);
