import { toast } from "sonner";
import { motion } from "motion/react";
import { I, M } from "../../constants/fonts";
import { WS_TASKS, priCols } from "../../constants/workspace";

export function WsKanban() {
    const cols = [
        { id: "todo", label: "To Do", color: "#6b7280", tasks: WS_TASKS.todo },
        { id: "inprogress", label: "In Progress", color: "#eab308", tasks: WS_TASKS.inprogress },
        { id: "done", label: "Completed", color: "#16a34a", tasks: WS_TASKS.done },
    ];
    return (<div>
      <p className="font-bold text-[15px] text-[#1b1c1c] mb-3" style={{ fontFamily: M }}>Current Tasks</p>
      <div className="grid grid-cols-3 gap-4">
        {cols.map(c => (<div key={c.id} className="bg-white rounded-2xl border border-[rgba(208,198,174,0.2)] overflow-hidden">
            <div className="px-4 py-3 flex items-center gap-2 border-b border-[rgba(208,198,174,0.12)]" style={{ background: `${c.color}08` }}>
              <div className="size-2 rounded-full" style={{ background: c.color }}/>
              <p className="font-bold text-[13px]" style={{ color: c.color, fontFamily: M }}>{c.label}</p>
              <span className="ml-auto text-[11px] font-semibold text-[#4d4634] bg-[#efeded] px-2 py-0.5 rounded-full" style={{ fontFamily: I }}>{c.tasks.length}</span>
            </div>
            <div className="p-3 flex flex-col gap-2">
              {c.tasks.map(t => {
                const pc = priCols[t.pri] ?? priCols.low;
                return (<motion.div key={t.id} whileHover={{ y: -1, boxShadow: "0 4px 16px rgba(0,0,0,0.06)" }} className="p-3 rounded-xl border border-[rgba(208,198,174,0.2)] bg-[#fbf9f9] cursor-pointer">
                    <p className="text-[12px] font-semibold text-[#1b1c1c] leading-snug" style={{ fontFamily: M }}>{t.label}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full capitalize" style={{ background: pc.bg, color: pc.col, fontFamily: I }}>{t.pri}</span>
                      <span className="text-[10px] text-[#4d4634]" style={{ fontFamily: I }}>Due {t.due}</span>
                    </div>
                  </motion.div>);
            })}
              <button onClick={() => toast.info("New task added")} className="w-full py-2 text-[12px] text-[#4d4634] border border-dashed border-[rgba(208,198,174,0.4)] rounded-xl hover:bg-[#efeded] transition" style={{ fontFamily: I }}>+ Add task</button>
            </div>
          </div>))}
      </div>
    </div>);
}
