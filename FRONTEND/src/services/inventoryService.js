/** Inventory Service — maps to backend apps.inventory */
import { api } from "./api";

export async function listInventoryItems(params) {
  const qs = params ? "?" + new URLSearchParams(params).toString() : "";
  return api.get(`/inventory/${qs}`);
}

export async function getInventoryItem(id) {
  return api.get(`/inventory/${id}/`);
}

export async function createInventoryItem(data) {
  return api.post("/inventory/", data);
}

export async function updateInventoryItem(id, data) {
  return api.patch(`/inventory/${id}/`, data);
}

export async function deleteInventoryItem(id) {
  return api.delete(`/inventory/${id}/`);
}

export async function listWarehouses() {
  return api.get("/warehouses/");
}

export async function transferStock(data) {
  return api.post("/inventory/transfer/", data);
}
