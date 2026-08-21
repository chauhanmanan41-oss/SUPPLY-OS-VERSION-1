import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

/**
 * WorkflowLockContext
 * ───────────────────
 * Single source of truth for whether a multi-step workflow is active.
 *
 * How to use from a wizard:
 *   const { lockWorkflow, unlockWorkflow } = useWorkflowLock();
 *   useEffect(() => { lockWorkflow("Create Product Wizard"); return unlockWorkflow; }, []);
 *
 * How to use from a nav element instead of navigating directly:
 *   const { requestNavigation } = useWorkflowLock();
 *   requestNavigation(() => setActiveNav("Dashboard"));
 */

const WorkflowLockContext = createContext(null);

export function WorkflowLockProvider({ children }) {
  const [isLocked, setIsLocked]       = useState(false);
  const [workflowName, setWorkflowName] = useState("");
  const [showDialog, setShowDialog]   = useState(false);

  // The navigation callback to fire if the user clicks "Leave Anyway"
  const pendingCallbackRef = useRef(null);

  /* ── Lock / unlock ───────────────────────────────────────── */
  const lockWorkflow = useCallback((name) => {
    setWorkflowName(name || "Current Workflow");
    setIsLocked(true);
  }, []);

  const unlockWorkflow = useCallback(() => {
    setIsLocked(false);
    setWorkflowName("");
    setShowDialog(false);
    pendingCallbackRef.current = null;
  }, []);

  /* ── Navigation request (call instead of navigating directly) */
  const requestNavigation = useCallback((callback) => {
    if (!isLocked) {
      callback();
      return;
    }
    pendingCallbackRef.current = callback;
    setShowDialog(true);
  }, [isLocked]);

  /* ── Dialog responses ────────────────────────────────────── */
  const handleStay = useCallback(() => {
    setShowDialog(false);
    pendingCallbackRef.current = null;
  }, []);

  const handleLeave = useCallback(() => {
    const cb = pendingCallbackRef.current;
    unlockWorkflow();          // release lock first
    if (cb) cb();              // then navigate
  }, [unlockWorkflow]);

  /* ── Browser Back-button guard ───────────────────────────── */
  useEffect(() => {
    if (!isLocked) return;

    // Push a dummy history entry so the Back button hits it first
    window.history.pushState({ workflowLock: true }, "");

    const onPopState = (e) => {
      if (e.state?.workflowLock || isLocked) {
        // Re-push the sentinel so the user stays "in place"
        window.history.pushState({ workflowLock: true }, "");
        // Show our dialog instead of allowing navigation
        pendingCallbackRef.current = null; // browser back has no "forward" action
        setShowDialog(true);
      }
    };

    const onBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = "";       // triggers browser "Leave site?" prompt
      return "";
    };

    window.addEventListener("popstate", onPopState);
    window.addEventListener("beforeunload", onBeforeUnload);

    return () => {
      window.removeEventListener("popstate", onPopState);
      window.removeEventListener("beforeunload", onBeforeUnload);
    };
  }, [isLocked]);

  return (
    <WorkflowLockContext.Provider
      value={{
        isLocked,
        workflowName,
        showDialog,
        lockWorkflow,
        unlockWorkflow,
        requestNavigation,
        handleStay,
        handleLeave,
      }}
    >
      {children}
    </WorkflowLockContext.Provider>
  );
}

/** Primary consumer hook */
export function useWorkflowLock() {
  const ctx = useContext(WorkflowLockContext);
  if (!ctx) throw new Error("useWorkflowLock must be used inside <WorkflowLockProvider>");
  return ctx;
}
