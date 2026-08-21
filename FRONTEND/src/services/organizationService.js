/**
 * Organization Service
 * ─────────────────────
 * Maps to backend `apps.organizations.urls`.
 */

import { api } from "./api";

/** GET /organizations/ — list orgs the current user belongs to */
export async function listOrganizations() {
  return api.get("/organizations/");
}

/** POST /organizations/create/ — create a new org */
export async function createOrganization({ name, slug, industry }) {
  return api.post("/organizations/create/", { name, slug, industry });
}

/** GET /organizations/:id/ — get org details */
export async function getOrganization(id) {
  return api.get(`/organizations/${id}/`);
}

/** PATCH /organizations/:id/ — update org */
export async function updateOrganization(id, data) {
  return api.patch(`/organizations/${id}/`, data);
}

/** GET /organizations/:id/members/ — list members */
export async function listMembers(orgId) {
  return api.get(`/organizations/${orgId}/members/`);
}

/** POST /organizations/:id/invite/ — invite a member */
export async function inviteMember(orgId, { email, role }) {
  return api.post(`/organizations/${orgId}/invite/`, { email, role });
}
