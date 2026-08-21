import { ChevronRight, Sparkles } from "lucide-react";
import { I, M } from "../../constants/fonts";
import { W_STEPS } from "../../constants/wizard";

export function WizardBottomBar({
  step,
  generating,
  onBack,
  onNext,
  onSaveDraft,
  onCreateWorkspace
}) {
  const isFirst = step === 1;
  const isLast = step === 5;
  const isGen = generating;
  const nextLabel = isLast ? null : `Continue to ${W_STEPS[step]?.label ?? "Review"}`;
  return (<div className="shrink-0 bg-white border-t border-[rgba(208,198,174,0.2)] px-8 py-4 flex items-center justify-between" style={{ boxShadow: "0 -1px 4px rgba(0,0,0,0.04)" }}>
    <div className="flex items-center gap-3">
      {!isFirst && (<button onClick={onBack} className="flex items-center gap-2 px-5 py-2.5 border border-[rgba(208,198,174,0.4)] rounded-xl text-[#1b1c1c] text-[14px] font-semibold hover:bg-[#efeded] transition" style={{ fontFamily: M }}>
        <ChevronRight size={15} className="rotate-180" /> Back
      </button>)}
      <button onClick={onSaveDraft} className="px-5 py-2.5 border border-[rgba(208,198,174,0.4)] rounded-xl text-[#4d4634] text-[14px] font-semibold hover:bg-[#efeded] transition" style={{ fontFamily: M }}>
        Save Draft
      </button>
    </div>
    <div className="flex items-center gap-4">
      <p className="text-[#4d4634] text-[13px]" style={{ fontFamily: I }}>
        Step {step} of {W_STEPS.length} · {isLast ? "Ready to create workspace" : `Next: ${W_STEPS[step]?.label}`}
      </p>
      {isLast ? (<button onClick={onCreateWorkspace} className="flex items-center gap-2 px-7 py-3 bg-[#303031] text-white rounded-xl font-bold text-[14px] hover:bg-[#1b1c1c] transition" style={{ fontFamily: M, boxShadow: "0 4px 14px rgba(0,0,0,0.2)" }}>
        <Sparkles size={15} /> Create Product Workspace
      </button>) : (<button onClick={onNext} disabled={isGen} className="flex items-center gap-2 px-7 py-3 rounded-xl font-bold text-[14px] transition" style={{ background: isGen ? "#efeded" : "#ffd54a", color: isGen ? "#4d4634" : "#735c00", fontFamily: M, opacity: isGen ? 0.7 : 1, cursor: isGen ? "wait" : "pointer" }}>
        {isGen ? "Generating Blueprint…" : nextLabel}
        {!isGen && <ChevronRight size={15} />}
      </button>)}
    </div>
  </div>);
}
/* ── Root Wizard Component ── */
