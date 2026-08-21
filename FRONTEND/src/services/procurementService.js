/** Procurement Service — maps to backend apps.procurement */
import { api } from "./api";

export async function listRFQs(params) {
  const qs = params ? "?" + new URLSearchParams(params).toString() : "";
  return api.get(`/procurement/rfqs/${qs}`);
}

export async function createRFQ(data) {
  return api.post("/procurement/rfqs/", data);
}

export async function getRFQ(id) {
  return api.get(`/procurement/rfqs/${id}/`);
}

export async function listPurchaseOrders(params) {
  const qs = params ? "?" + new URLSearchParams(params).toString() : "";
  return api.get(`/procurement/purchase-orders/${qs}`);
}

export async function createPurchaseOrder(data) {
  return api.post("/procurement/purchase-orders/", data);
}

export async function getPurchaseOrder(id) {
  return api.get(`/procurement/purchase-orders/${id}/`);
}

export async function updatePurchaseOrder(id, data) {
  return api.patch(`/procurement/purchase-orders/${id}/`, data);
}

export async function listQuotations(rfqId) {
  return api.get(`/procurement/rfqs/${rfqId}/quotations/`);
}
