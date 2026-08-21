import { toast } from "sonner";
import { motion } from "motion/react";
import { I, M } from "../../constants/fonts";

export function InvCategories() {
    const cats = [
        { emoji: "🧪", label: "Raw Materials", items: 12, value: "₹77L", low: 2, health: 78, col: "#3b82f6", bg: "rgba(59,130,246,0.08)" },
        { emoji: "📦", label: "Packaging Materials", items: 18, value: "₹27L", low: 3, health: 65, col: "#a855f7", bg: "rgba(168,85,247,0.08)" },
        { emoji: "⚗️", label: "Semi-Finished", items: 4, value: "₹14.2L", low: 0, health: 92, col: "#f97316", bg: "rgba(249,115,22,0.08)" },
        { emoji: "🏷️", label: "Finished Products", items: 6, value: "₹22.4L", low: 0, health: 96, col: "#16a34a", bg: "rgba(22,163,74,0.08)" },
        { emoji: "🔩", label: "Consumables", items: 9, value: "₹3.8L", low: 1, health: 84, col: "#14b8a6", bg: "rgba(20,184,166,0.08)" },
        { emoji: "🏗️", label: "Warehouse Equipment", items: 7, value: "₹6.1L", low: 0, health: 100, col: "#6b7280", bg: "rgba(107,114,128,0.08)" },
    ];
    return (<div>
      <p className="font-bold text-[15px] text-[#1b1c1c] mb-3" style={{ fontFamily: M }}>Inventory Categories</p>
      <div className="grid grid-cols-3 gap-3">
        {cats.map((c, i) => (<motion.div key={i} whileHover={{ y: -2, boxShadow: "0 12px 32px rgba(0,0,0,0.07)" }} transition={{ duration: 0.15 }} className="bg-white rounded-2xl border border-[rgba(208,198,174,0.2)] p-5 flex flex-col gap-4">
            <div className="flex items-start justify-between gap-2">
              <div className="size-11 rounded-2xl flex items-center justify-center text-2xl shrink-0" style={{ background: c.bg }}>{c.emoji}</div>
              {c.low > 0 && (<span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: "rgba(186,26,26,0.1)", color: "#ba1a1a", fontFamily: I }}>
                  {c.low} low
                </span>)}
            </div>
            <div>
              <p className="font-bold text-[14px] text-[#1b1c1c]" style={{ fontFamily: M }}>{c.label}</p>
              <p className="text-[12px] text-[#4d4634] mt-0.5" style={{ fontFamily: I }}>{c.items} items · {c.value}</p>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-[10px] text-[#4d4634]" style={{ fontFamily: I }}>Health</span>
                <span className="text-[10px] font-bold" style={{ color: c.col, fontFamily: M }}>{c.health}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-[#efeded] overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${c.health}%`, background: c.col }}/>
              </div>
            </div>
            <button onClick={() => toast.info(`Viewing ${c.label}…`)} className="w-full py-2 rounded-xl text-[12px] font-semibold border border-[rgba(208,198,174,0.3)] text-[#4d4634] hover:bg-[#efeded] transition" style={{ fontFamily: M }}>View Details →</button>
          </motion.div>))}
      </div>
    </div>);
}
