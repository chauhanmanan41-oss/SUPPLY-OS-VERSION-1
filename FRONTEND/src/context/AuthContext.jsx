/**
 * AuthContext
 * ───────────
 * Global authentication state for the entire app.
 *
 * Provides: user, isAuthenticated, isLoading, login, register, logout
 *
 * On mount it checks for an existing JWT in localStorage and fetches
 * the user profile — so refreshing the page doesn't log you out.
 */

import { createContext, useCallback, useEffect, useState } from "react";
import {
  getAccessToken,
  getRefreshToken,
  setTokens,
  clearAuth,
  setOrgId,
} from "../services/api";
import * as authService from "../services/authService";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]               = useState(null);
  const [isAuthenticated, setIsAuth]  = useState(false);
  const [isLoading, setIsLoading]     = useState(true); // true until initial check completes

  /* ── Bootstrap: check stored token on mount ─────────────── */
  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      const token = getAccessToken();
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const me = await authService.getMe();
        if (!cancelled) {
          setUser(me);
          if (me?.default_organization?.id) {
            setOrgId(me.default_organization.id);
          }
          setIsAuth(true);
        }
      } catch {
        // Token invalid / expired — clean up
        clearAuth();
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    bootstrap();

    // Listen for forced logout (e.g. from api.js 401 handler)
    const onExpired = () => {
      setUser(null);
      setIsAuth(false);
    };
    window.addEventListener("supplyos:session-expired", onExpired);

    return () => {
      cancelled = true;
      window.removeEventListener("supplyos:session-expired", onExpired);
    };
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const me = await authService.getMe();
      setUser(me);
      if (me?.default_organization?.id) {
        setOrgId(me.default_organization.id);
      }
    } catch (err) {
      console.error("Failed to refresh user:", err);
    }
  }, []);

  /* ── Login ──────────────────────────────────────────────── */
  const login = useCallback(async (email, password) => {
    const data = await authService.login(email, password);

    // Backend returns { access, refresh } (SimpleJWT)
    setTokens(data.access, data.refresh);

    // Fetch user profile
    const me = await authService.getMe();
    setUser(me);
    if (me?.default_organization?.id) {
      setOrgId(me.default_organization.id);
    }
    setIsAuth(true);

    return me;
  }, []);

  /* ── Register ───────────────────────────────────────────── */
  const register = useCallback(async ({ email, password, firstName, lastName }) => {
    const newUser = await authService.register({ email, password, firstName, lastName });

    // Auto-login after registration
    const tokens = await authService.login(email, password);
    setTokens(tokens.access, tokens.refresh);

    const me = await authService.getMe();
    setUser(me);
    if (me?.default_organization?.id) {
      setOrgId(me.default_organization.id);
    }
    setIsAuth(true);

    return me;
  }, []);

  /* ── Logout ─────────────────────────────────────────────── */
  const logout = useCallback(async () => {
    const refresh = getRefreshToken();
    try {
      if (refresh) await authService.logout(refresh);
    } catch {
      // Ignore — token may already be blacklisted
    }
    clearAuth();
    setUser(null);
    setIsAuth(false);
  }, []);

  /* ── Update profile (PATCH /auth/me/) ───────────────────── */
  const updateProfile = useCallback(async (data) => {
    const updated = await authService.updateMe(data);
    setUser(updated);
    return updated;
  }, []);

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    updateProfile,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
