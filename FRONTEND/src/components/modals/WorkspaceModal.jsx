import { CheckCircle, X, ArrowUpRight } from "lucide-react";
import { Badge } from "../common/Badge";
import { ModalOverlay } from "../common/Modal";
import { PRODUCTS } from "../../constants/dashboard";
import { I, M } from "../../constants/fonts";

export function WorkspaceModal({ name, onClose }) {
    const product = PRODUCTS.find(p => p.name === name) ?? PRODUCTS[0];
    const tasks = ["Market Research", "Supplier Shortlist", "RFQ Submission", "Sample Approval", "Manufacturing Contract"];
    const doneCount = Math.floor((product.progress / 100) * tasks.length);
    return (<ModalOverlay onClose={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-[540px] overflow-hidden">
        <div className="bg-[#303031] px-8 py-6 flex items-center gap-4">
          <div className="text-3xl">{product.emoji}</div>
          <div className="flex-1">
            <p className="text-white font-bold text-lg" style={{ fontFamily: M }}>{product.name}</p>
            <div className="flex items-center gap-3 mt-1">
              <Badge label={product.stage} color={product.stageColor} bg={`${product.stageColor}22`}/>
              <span className="text-white/50 text-[12px]" style={{ fontFamily: I }}>Launch: {product.launch}</span>
            </div>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white transition"><X size={18}/></button>
        </div>
        {/* Progress bar */}
        <div className="h-1.5 bg-[#1b1c1c]">
          <div className="h-full transition-all duration-700" style={{ width: `${product.progress}%`, background: product.stageColor }}/>
        </div>
        <div className="p-8">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
            { label: "Progress", value: `${product.progress}%`, color: product.stageColor },
            { label: "AI Health", value: `${product.health}%`, color: product.healthColor },
            { label: "Budget Used", value: `${product.budgetUsed}%`, color: product.budgetUsed > 80 ? "#ba1a1a" : "#4d4634" },
        ].map(s => (<div key={s.label} className="bg-[#fbf9f9] rounded-xl p-4 border border-[rgba(208,198,174,0.2)] text-center">
                <p className="text-[#4d4634] text-[10px] font-bold uppercase tracking-wider mb-1" style={{ fontFamily: I }}>{s.label}</p>
                <p className="font-bold text-xl" style={{ fontFamily: M, color: s.color }}>{s.value}</p>
              </div>))}
          </div>

          {/* Tasks */}
          <div className="flex flex-col gap-2">
            {tasks.map((t, i) => {
            const isDone = i < doneCount;
            const isNext = i === doneCount;
            return (<div key={t} className={`flex items-center gap-3 p-3.5 rounded-xl border transition ${isDone ? "border-[rgba(22,163,74,0.2)] bg-[rgba(22,163,74,0.04)]" : isNext ? "border-[rgba(255,213,74,0.4)] bg-[rgba(255,249,230,0.5)]" : "border-[rgba(208,198,174,0.2)]"}`}>
                  <div className={`size-5 rounded-full border-2 flex items-center justify-center shrink-0 ${isDone ? "border-[#16a34a] bg-[#16a34a]" : isNext ? "border-[#ffd54a]" : "border-[rgba(208,198,174,0.5)]"}`}>
                    {isDone && <CheckCircle size={11} className="text-white"/>}
                    {isNext && <div className="size-1.5 rounded-full bg-[#ffd54a]"/>}
                  </div>
                  <span className={`text-sm font-semibold flex-1 ${isDone ? "text-[#4d4634] line-through" : "text-[#1b1c1c]"}`} style={{ fontFamily: I }}>{t}</span>
                  {isNext && <Badge label="Next" color="#735c00" bg="rgba(255,213,74,0.2)"/>}
                </div>);
        })}
          </div>

          <button onClick={onClose} className="mt-6 w-full bg-[#ffd54a] text-[#735c00] font-bold py-3.5 rounded-xl hover:brightness-105 transition flex items-center justify-center gap-2" style={{ fontFamily: M }}>
            Continue to {tasks[doneCount]} <ArrowUpRight size={15}/>
          </button>
        </div>
      </div>
    </ModalOverlay>);
}
// ─── PROJECTS PAGE COMPONENTS ────────────────────────────────────────────────
/* KPI summary strip */
