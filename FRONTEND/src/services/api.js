/**
 * SupplyOS API Client
 * ────────────────────
 * Centralised fetch wrapper with JWT auth, token refresh, and org scoping.
 * Every service module (`authService.js`, `inventoryService.js`, …) calls
 * through this client — no raw `fetch()` anywhere else.
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";

/* ── Token helpers ──────────────────────────────────────────── */

const TOKEN_KEY   = "supplyos_access";
const REFRESH_KEY = "supplyos_refresh";
const ORG_KEY     = "supplyos_org_id";

export function getAccessToken()  { return localStorage.getItem(TOKEN_KEY); }
export function getRefreshToken() { return localStorage.getItem(REFRESH_KEY); }
export function getOrgId()        { return localStorage.getItem(ORG_KEY); }

export function setTokens(access, refresh) {
  localStorage.setItem(TOKEN_KEY, access);
  if (refresh) localStorage.setItem(REFRESH_KEY, refresh);
}

export function setOrgId(id) {
  if (id) localStorage.setItem(ORG_KEY, id);
  else localStorage.removeItem(ORG_KEY);
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem(ORG_KEY);
}

/* ── Token refresh ──────────────────────────────────────────── */

let refreshPromise = null;

async function refreshAccessToken() {
  const refresh = getRefreshToken();
  if (!refresh) throw new Error("No refresh token");

  // Deduplicate — if a refresh is already in-flight, reuse it
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    const res = await fetch(`${BASE_URL}/auth/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh }),
    });

    if (!res.ok) {
      clearAuth();
      throw new Error("Session expired");
    }

    const data = await res.json();
    setTokens(data.access, data.refresh ?? refresh);
    return data.access;
  })();

  try {
    return await refreshPromise;
  } finally {
    refreshPromise = null;
  }
}

/* ── Core request function ──────────────────────────────────── */

/**
 * Make an API request.
 *
 * @param {string} endpoint — path relative to BASE_URL (e.g. "/auth/login/")
 * @param {object} options
 * @param {"GET"|"POST"|"PUT"|"PATCH"|"DELETE"} options.method
 * @param {object|FormData} [options.body]
 * @param {boolean} [options.auth=true] — attach JWT?
 * @param {object} [options.headers] — extra headers
 * @returns {Promise<any>}
 */
export async function apiRequest(endpoint, {
  method = "GET",
  body = null,
  auth = true,
  headers = {},
} = {}) {
  const url = `${BASE_URL}${endpoint}`;

  const reqHeaders = { ...headers };

  // JSON unless caller sends FormData (file uploads)
  const isFormData = body instanceof FormData;
  if (!isFormData && body) {
    reqHeaders["Content-Type"] = "application/json";
  }

  // JWT
  if (auth) {
    const token = getAccessToken();
    if (token) reqHeaders["Authorization"] = `Bearer ${token}`;
  }

  // Org scoping
  const orgId = getOrgId();
  if (orgId) reqHeaders["X-Organization-Id"] = orgId;

  let res = await fetch(url, {
    method,
    headers: reqHeaders,
    body: isFormData ? body : body ? JSON.stringify(body) : null,
  });

  // Auto-refresh on 401 and retry once
  if (res.status === 401 && auth) {
    try {
      const newToken = await refreshAccessToken();
      reqHeaders["Authorization"] = `Bearer ${newToken}`;
      res = await fetch(url, {
        method,
        headers: reqHeaders,
        body: isFormData ? body : body ? JSON.stringify(body) : null,
      });
    } catch {
      // Refresh failed — force logout
      clearAuth();
      window.dispatchEvent(new Event("supplyos:session-expired"));
      throw new Error("Session expired. Please log in again.");
    }
  }

  // 204 No Content
  if (res.status === 204) return null;

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    let errorMessage = data?.detail || data?.message;
    if (data?.errors && typeof data.errors === "object") {
      const errors = [];
      for (const [key, value] of Object.entries(data.errors)) {
        if (Array.isArray(value)) {
          errors.push(`${key}: ${value.join(" ")}`);
        } else if (typeof value === "string") {
          errors.push(`${key}: ${value}`);
        }
      }
      if (errors.length > 0) {
        errorMessage = errors.join(" | ");
      }
    } else if (!errorMessage && data && typeof data === "object") {
      // DRF field-level errors (e.g. {"field": ["Error"]})
      const errors = [];
      for (const [key, value] of Object.entries(data)) {
        if (Array.isArray(value)) {
          errors.push(`${key}: ${value.join(" ")}`);
        } else if (typeof value === "string") {
          errors.push(`${key}: ${value}`);
        }
      }
      if (errors.length > 0) {
        errorMessage = errors.join(" | ");
      }
    }
    
    const error = new Error(errorMessage || `API Error ${res.status}`);
    error.status = res.status;
    error.data = data;
    throw error;
  }

  return data;
}

/* ── Convenience shortcuts ──────────────────────────────────── */

export const api = {
  get:    (endpoint, opts) => apiRequest(endpoint, { method: "GET",    ...opts }),
  post:   (endpoint, body, opts) => apiRequest(endpoint, { method: "POST",   body, ...opts }),
  put:    (endpoint, body, opts) => apiRequest(endpoint, { method: "PUT",    body, ...opts }),
  patch:  (endpoint, body, opts) => apiRequest(endpoint, { method: "PATCH",  body, ...opts }),
  delete: (endpoint, opts) => apiRequest(endpoint, { method: "DELETE", ...opts }),
};
