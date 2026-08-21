/** Blueprint Service — maps to backend apps.blueprints */
import { api } from "./api";

/**
 * Generate a blueprint for a product using the AI service.
 * POST /api/v1/blueprints/generate/
 *
 * @param {object} data — { product: UUID, product_name, category, ... }
 * @returns {Promise<object>} — BlueprintSerializer payload
 */
export async function generateBlueprint(data) {
  return api.post("/blueprints/generate/", data);
}

export async function listBlueprints(params) {
  const qs = params ? "?" + new URLSearchParams(params).toString() : "";
  return api.get(`/blueprints/${qs}`);
}

export async function getBlueprint(id) {
  return api.get(`/blueprints/${id}/`);
}

/**
 * Get the current blueprint for a specific product.
 */
export async function getCurrentBlueprint(productId) {
  return api.get(`/blueprints/?product=${productId}&is_current=true`);
}
