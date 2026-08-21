import { createContext, useContext } from "react";

/**
 * Placeholder global context, per the target architecture.
 *
 * This is intentionally NOT wired into AppRoutes/App yet — all current
 * state (activeNav, modal, workspace, search) already lives in the
 * useModal/useWorkspace/useSearch hooks and works exactly as it did in
 * the original monolithic App.jsx. Introducing a context provider here
 * would change how state is threaded through the tree, which risks
 * behavior differences the refactor is explicitly meant to avoid.
 *
 * Use this once there's a genuine cross-cutting concern to share globally
 * (e.g. an authenticated user, once JWT auth is added) — wrap it around
 * <AppRoutes /> in App.jsx and consume via useAppContext() below.
 */
const AppContext = createContext(null);

export function AppProvider({ value, children }) {
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  return useContext(AppContext);
}
