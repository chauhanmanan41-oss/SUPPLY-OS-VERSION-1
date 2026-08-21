import { motion } from "motion/react";
import { Brain, CheckCircle, Sparkles } from "lucide-react";
import { Bar } from "recharts";
import { ProgressRing } from "../common/ProgressRing";
import { I, M } from "../../constants/fonts";
import { MOCK_BP, W_STEPS } from "../../constants/wizard";
import { fmtCr } from "../../utils/formatCurrency";

export function WizardAIPanel({ step, data, generating, blueprint }) {
    const bp = blueprint ?? MOCK_BP;
    const conf = [55, 72, 84, bp.confidence, 94][step - 1];
    const titles = ["Product Analysis", "Strategy Insights", "Supply Chain Preview", "Blueprint Ready", "Ready to Launch"];
    const subs = ["AI is ready to build your supply chain", "Optimising based on your priorities", "Analysing your logistics profile", `${bp.confidence}% confidence · ${bp.roi} ROI`, "Final review complete"];
    const tips = [
        "Detailed descriptions improve AI accuracy by up to 40%.",
        "Brands ranking 'Supply Reliability' in top 3 have 2× better outcomes.",
        data.coldChain ? "Cold chain adds ~15% to logistics costs — factored into blueprint." : "Enable Cold Chain if your product requires refrigeration.",
        "You can regenerate or compare alternatives before proceeding.",
        "Your workspace will have AI monitoring enabled from day one.",
    ];
    const insights = {
        1: ["Nutrition & Supplements is a high-growth category in India", "Third Party Manufacturing reduces capital requirement by ~60%", "FSSAI certification: plan 45–60 days for clearance"],
        2: [data.budget ? `For ${fmtCr(Number(data.budget))}, Third Party Manufacturing is optimal` : "Set a budget for personalised AI recommendations", "'Fast Launch' + 'Low Cost' is challenging — consider phased approach", "Dual-sourcing raw materials reduces disruption risk by 35%"],
        3: ["Your MOQ unlocks bulk pricing with 3 top suppliers", data.coldChain ? "Cold chain via BlueDart Express recommended" : "Road freight is most cost-effective for your profile", "3 manufacturers match your spec — shortlist starts at AI Blueprint"],
        4: [`${bp.manufacturers[0].name} is 96% match — highest in your category`, `Consolidating freight saves ${bp.savings[0].amount} — apply before launch`, "Expected time to first production: 13 weeks"],
        5: ["Lock in manufacturer contract within 7 days to secure pricing", "File FSSAI application in parallel with supplier selection", `Expected first revenue: ${bp.estimatedRevenue} in 4–5 months`],
    };
    const missing = [
        !data.productName && "Product name",
        !data.category && "Category",
        !data.businessModel && "Business model",
        step >= 2 && !data.budget && "Budget",
        step >= 2 && data.priorities.length === 0 && "Priority ranking",
        step >= 3 && !data.packagingType && "Packaging type",
    ].filter(Boolean);
    return (<div className="w-[340px] shrink-0 h-full flex flex-col bg-[#fbf9f9] border-l border-[rgba(208,198,174,0.2)]">
      <div className="px-5 py-5 border-b border-[rgba(208,198,174,0.2)] shrink-0">
        <div className="flex items-center gap-3 mb-4">
          <div className="size-8 rounded-xl bg-[#ffd54a] flex items-center justify-center shrink-0"><Brain size={15} className="text-[#735c00]"/></div>
          <div>
            <p className="font-bold text-[#1b1c1c] text-[14px]" style={{ fontFamily: M }}>AI Assistant</p>
            <p className="text-[#4d4634] text-[11px]" style={{ fontFamily: I }}>Updates with every step</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-[rgba(208,198,174,0.2)]">
          <ProgressRing value={conf} color="#ffd54a" size={44} sw={4}>
            <span className="text-[10px] font-bold text-[#1b1c1c]" style={{ fontFamily: M }}>{conf}%</span>
          </ProgressRing>
          <div>
            <p className="font-bold text-[#1b1c1c] text-[13px]" style={{ fontFamily: M }}>{titles[step - 1]}</p>
            <p className="text-[#4d4634] text-[11px]" style={{ fontFamily: I }}>{subs[step - 1]}</p>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4" style={{ scrollbarWidth: "none" }}>
        {/* Wizard completion */}
        <div>
          <div className="flex justify-between mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-[0.5px] text-[#4d4634]" style={{ fontFamily: I }}>Wizard Completion</span>
            <span className="text-[12px] font-bold text-[#1b1c1c]" style={{ fontFamily: M }}>{Math.min(Math.round((step - 1) * 22 + 12), 100)}%</span>
          </div>
          <div className="h-1.5 bg-[#efeded] rounded-full overflow-hidden">
            <motion.div className="h-full bg-[#ffd54a] rounded-full" animate={{ width: `${Math.min((step - 1) * 22 + 12, 100)}%` }} transition={{ duration: 0.5 }}/>
          </div>
        </div>
        {/* Missing */}
        {missing.length > 0 && (<div className="bg-[rgba(186,26,26,0.05)] rounded-xl border border-[rgba(186,26,26,0.15)] p-3">
            <p className="text-[11px] font-bold uppercase tracking-[0.5px] text-[#ba1a1a] mb-2" style={{ fontFamily: I }}>Missing Information</p>
            {missing.map(m => <div key={m} className="flex items-center gap-2 py-0.5"><div className="size-1.5 rounded-full bg-[#ba1a1a] shrink-0"/><span className="text-[12px] text-[#ba1a1a]" style={{ fontFamily: I }}>{m}</span></div>)}
          </div>)}
        {/* Insights */}
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.5px] text-[#4d4634] mb-2.5" style={{ fontFamily: I }}>AI Insights</p>
          <div className="flex flex-col gap-2">
            {insights[step].map((ins, i) => (<div key={i} className="flex items-start gap-2.5 p-3 bg-white rounded-xl border border-[rgba(208,198,174,0.2)]">
                <Sparkles size={12} className="text-[#735c00] shrink-0 mt-0.5"/>
                <p className="text-[12px] text-[#1b1c1c] leading-snug" style={{ fontFamily: I }}>{ins}</p>
              </div>))}
          </div>
        </div>
        {/* Tip */}
        <div className="p-3 rounded-xl border" style={{ background: "rgba(255,249,230,0.7)", borderColor: "rgba(255,213,74,0.3)" }}>
          <p className="text-[10px] font-bold uppercase tracking-[0.5px] text-[#735c00] mb-1" style={{ fontFamily: I }}>💡 Quick Tip</p>
          <p className="text-[12px] text-[#4d4634] leading-snug" style={{ fontFamily: I }}>{tips[step - 1]}</p>
        </div>
        {/* Steps mini tracker */}
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.5px] text-[#4d4634] mb-2.5" style={{ fontFamily: I }}>Progress</p>
          <div className="flex flex-col gap-1.5">
            {W_STEPS.map(({ n, label, Icon: SIcon }) => {
            const done = step > n;
            const active = step === n;
            return (<div key={n} className="flex items-center gap-2.5">
                  <div className="size-5 rounded-full flex items-center justify-center shrink-0" style={{ background: done ? "#303031" : active ? "#ffd54a" : "#efeded" }}>
                    {done ? <CheckCircle size={11} color="white"/>
                    : <span className="text-[9px] font-bold" style={{ color: active ? "#735c00" : "#9a8f7a" }}>{n}</span>}
                  </div>
                  <span className="text-[12px]" style={{ fontFamily: I, color: done ? "#1b1c1c" : active ? "#1b1c1c" : "rgba(77,70,52,0.45)", fontWeight: active || done ? 600 : 400 }}>{label}</span>
                </div>);
        })}
          </div>
        </div>
      </div>
    </div>);
}
/* ── Bottom Action Bar ── */
