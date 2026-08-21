/**
 * Auth Service
 * ─────────────
 * All authentication API calls.
 * Maps 1:1 to backend `apps.users.urls`.
 */

import { api } from "./api";

/**
 * POST /auth/login/
 * Returns { access, refresh, user? }
 */
export async function login(email, password) {
  return api.post("/auth/login/", { email, password }, { auth: false });
}

/**
 * POST /auth/register/
 * Returns { id, email, first_name, last_name }
 */
export async function register({ email, password, firstName, lastName }) {
  return api.post("/auth/register/", {
    email,
    password,
    first_name: firstName,
    last_name: lastName,
  }, { auth: false });
}

/**
 * POST /auth/logout/
 * Blacklists the refresh token.
 */
export async function logout(refreshToken) {
  return api.post("/auth/logout/", { refresh: refreshToken });
}

/**
 * POST /auth/refresh/
 * Returns { access, refresh? }
 */
export async function refreshToken(refresh) {
  return api.post("/auth/refresh/", { refresh }, { auth: false });
}

/**
 * GET /auth/me/
 * Returns the current user profile.
 */
export async function getMe() {
  return api.get("/auth/me/");
}

/**
 * PATCH /auth/me/
 * Updates the current user profile.
 */
export async function updateMe(data) {
  return api.patch("/auth/me/", data);
}

/**
 * POST /auth/change-password/
 */
export async function changePassword(oldPassword, newPassword) {
  return api.post("/auth/change-password/", {
    old_password: oldPassword,
    new_password: newPassword,
  });
}
