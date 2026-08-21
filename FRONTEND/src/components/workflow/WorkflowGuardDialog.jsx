import { useEffect } from "react";
import { AlertTriangle, X } from "lucide-react";
import { I, M } from "../../constants/fonts";
import { useWorkflowLock } from "../../context/WorkflowLockContext";

/**
 * WorkflowGuardDialog
 * ────────────────────
 * Rendered globally (inside WorkflowLockProvider) whenever the user
 * tries to navigate away from an active workflow. No props needed —
 * it reads everything from WorkflowLockContext.
 */
export function WorkflowGuardDialog() {
  const { showDialog, workflowName, handleStay, handleLeave } = useWorkflowLock();

  // Close on Escape key → "Stay"
  useEffect(() => {
    if (!showDialog) return;
    const onKey = (e) => { if (e.key === "Escape") handleStay(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showDialog, handleStay]);

  if (!showDialog) return null;

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ background: "rgba(27,28,28,0.55)", backdropFilter: "blur(4px)" }}
      onClick={handleStay}   /* clicking outside = "Stay" */
    >
      {/* Dialog card */}
      <div
        className="relative w-[440px] bg-white rounded-2xl shadow-[0_24px_64px_rgba(0,0,0,0.22)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Danger stripe */}
        <div className="h-1 w-full" style={{ background: "linear-gradient(90deg,#eab308,#f97316)" }} />

        {/* Header */}
        <div className="p-6 pb-0 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            {/* Icon */}
            <div
              className="size-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "#fef9c3", border: "1px solid #eab30830" }}
            >
              <AlertTriangle size={18} style={{ color: "#ca8a04" }} />
            </div>
            <div>
              <p
                className="text-[#1b1c1c] font-bold text-[16px] leading-tight"
                style={{ fontFamily: M }}
              >
                Leave current workflow?
              </p>
              <p
                className="text-[#4d4634] text-[13px] mt-1 leading-relaxed"
                style={{ fontFamily: I }}
              >
                You are currently in the{" "}
                <span className="font-semibold text-[#1b1c1c]">
                  {workflowName}
                </span>
                .
              </p>
            </div>
          </div>
          {/* Close ×  → "Stay" */}
          <button
            onClick={handleStay}
            className="size-7 rounded-lg flex items-center justify-center shrink-0 hover:bg-[#efeded] transition mt-0.5"
          >
            <X size={14} className="text-[#4d4634]" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 pt-4 pb-5">
          {/* Warning box */}
          <div
            className="rounded-xl p-3.5 flex items-start gap-2.5 mb-5"
            style={{ background: "#fffbe6", border: "1px solid #eab30825" }}
          >
            <div
              className="size-1.5 rounded-full mt-1.5 shrink-0"
              style={{ background: "#ca8a04" }}
            />
            <p className="text-[12px] text-[#4d4634] leading-relaxed" style={{ fontFamily: I }}>
              Leaving now may{" "}
              <span className="font-semibold text-[#1b1c1c]">
                discard your progress
              </span>
              . All unsaved data entered in this workflow will be lost.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            {/* Primary: Stay (recommended) */}
            <button
              onClick={handleStay}
              id="workflow-guard-stay"
              className="flex-1 py-2.5 rounded-xl font-bold text-[14px] transition-all hover:opacity-90 active:scale-[0.98]"
              style={{
                background: "#ffd54a",
                color: "#735c00",
                fontFamily: M,
                boxShadow: "0 2px 8px rgba(255,213,74,0.35)",
              }}
            >
              Stay in Workflow
            </button>
            {/* Secondary: Leave */}
            <button
              onClick={handleLeave}
              id="workflow-guard-leave"
              className="flex-1 py-2.5 rounded-xl font-semibold text-[14px] border transition-all hover:bg-[#fafafa] active:scale-[0.98]"
              style={{
                color: "#ba1a1a",
                borderColor: "#ba1a1a30",
                fontFamily: M,
              }}
            >
              Leave Anyway
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
