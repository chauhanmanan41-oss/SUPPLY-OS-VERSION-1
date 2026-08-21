import { api } from "./api";

export async function getSalesAnalytics(params) {
  const qs = params ? "?" + new URLSearchParams(params).toString() : "";
  return api.get(`/analytics/sales/${qs}`);
}

export async function getInventoryAnalytics(params) {
  const qs = params ? "?" + new URLSearchParams(params).toString() : "";
  return api.get(`/analytics/inventory/${qs}`);
}

export async function getProductionAnalytics(params) {
  const qs = params ? "?" + new URLSearchParams(params).toString() : "";
  return api.get(`/analytics/production/${qs}`);
}

export async function getSupplierAnalytics(params) {
  const qs = params ? "?" + new URLSearchParams(params).toString() : "";
  return api.get(`/analytics/suppliers/${qs}`);
}
