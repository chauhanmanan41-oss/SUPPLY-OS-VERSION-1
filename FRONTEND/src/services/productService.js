/** Product Service — maps to backend apps.products */
import { api } from "./api";

/**
 * Create a product workspace from the wizard data.
 * POST /api/v1/products/create-from-wizard/
 * Atomically creates Project + Product + LifecycleSteps + Milestones.
 *
 * @param {object} wizardData — matches WIZARD_DEFAULTS shape
 * @returns {Promise<object>} — ProductWorkspaceSerializer payload
 */
export async function createProductFromWizard(wizardData) {
  return api.post("/products/create-from-wizard/", wizardData);
}

export async function listProducts(params) {
  const qs = params ? "?" + new URLSearchParams(params).toString() : "";
  return api.get(`/products/${qs}`);
}

export async function getProduct(id) {
  return api.get(`/products/${id}/`);
}

export async function updateProduct(id, data) {
  return api.patch(`/products/${id}/`, data);
}

export async function deleteProduct(id) {
  return api.delete(`/products/${id}/`);
}

/**
 * GET /api/v1/products/{id}/workspace/
 * Returns the full workspace payload (product + lifecycle + milestones + tasks).
 */
export async function getProductWorkspace(id) {
  return api.get(`/products/${id}/workspace/`);
}

export async function listProductTasks(productId) {
  return api.get(`/products/${productId}/tasks/`);
}

export async function createProductTask(productId, data) {
  return api.post(`/products/${productId}/tasks/`, data);
}

export async function listProductMilestones(productId) {
  return api.get(`/products/${productId}/milestones/`);
}

export async function createProductMilestone(productId, data) {
  return api.post(`/products/${productId}/milestones/`, data);
}

export async function approveWorkspacePartner(productId, partnerId, category = "suppliers") {
  return api.post(`/products/${productId}/approve-partner/`, { partner_id: partnerId, category });
}

export async function runWorkspaceAIAction(productId, action, extra = {}) {
  return api.post(`/products/${productId}/run-ai-action/`, { action, ...extra });
}

