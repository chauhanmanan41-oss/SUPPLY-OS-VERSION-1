import { motion } from "motion/react";
import { ACTIONS } from "../../constants/dashboard";
import { I, M } from "../../constants/fonts";

export function QuickActions({ onAction }) {
    return (<div>
      {/*
          6 equal columns on wide screens; wraps to 3-col (2 rows) on ≤900px.
          The inline-style grid is overridden by the .qa-grid media query below.
        */}
      <style>{`
        .qa-grid { grid-template-columns: repeat(6, minmax(0, 1fr)); }
        @media (max-width: 900px) { .qa-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
      `}</style>
      <div className="qa-grid grid gap-3">
        {ACTIONS.map((a) => {
            const Icon = a.icon;
            const isPrimary = a.action === "create-product";
            const isAccent = a.action === "ai-strategy";
            /* Colours */
            const cardBg = isPrimary ? "#303031" : isAccent ? "#ffd54a" : "#ffffff";
            const cardBorder = isPrimary ? "transparent" : isAccent ? "#e6bf00" : "rgba(208,198,174,0.25)";
            const cardShadow = isPrimary || isAccent
                ? "0 4px 14px rgba(0,0,0,0.13)"
                : "0 1px 3px rgba(0,0,0,0.06)";
            const iconBg = isPrimary ? "rgba(255,255,255,0.12)" : isAccent ? "rgba(115,92,0,0.13)" : a.bg;
            const iconColor = isPrimary ? "#ffffff" : isAccent ? "#735c00" : a.textColor;
            const titleCol = isPrimary ? "#ffffff" : isAccent ? "#735c00" : "#1b1c1c";
            const descCol = isPrimary ? "rgba(255,255,255,0.55)" : isAccent ? "rgba(115,92,0,0.65)" : "#4d4634";
            return (<motion.button key={a.label} onClick={() => onAction(a.action)} whileHover={{ y: -4, boxShadow: isPrimary || isAccent ? "0 8px 24px rgba(0,0,0,0.18)" : "0 6px 18px rgba(0,0,0,0.09)", transition: { duration: 0.14 } }} whileTap={{ scale: 0.975 }} 
            /* Fixed height so every card is identical */
            className="flex flex-col justify-between rounded-2xl border text-left cursor-pointer" style={{
                    height: 142,
                    padding: 20,
                    background: cardBg,
                    borderColor: cardBorder,
                    boxShadow: cardShadow,
                }}>
              {/* Icon */}
              <div className="size-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: iconBg }}>
                <Icon size={18} color={iconColor} strokeWidth={1.8}/>
              </div>

              {/* Text — pinned to bottom */}
              <div className="flex flex-col gap-[3px]">
                <p className="font-bold text-[13px] leading-[1.25]" style={{ fontFamily: M, color: titleCol }}>
                  {a.label}
                </p>
                <p className="text-[11px] leading-[1.45]" style={{ fontFamily: I, color: descCol }}>
                  {a.desc}
                </p>
              </div>
            </motion.button>);
        })}
      </div>
    </div>);
}
