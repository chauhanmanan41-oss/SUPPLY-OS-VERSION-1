import { api } from "./api";

export async function listWarehouses(params) {
  const qs = params ? "?" + new URLSearchParams(params).toString() : "";
  return api.get(`/warehouses/${qs}`);
}

export async function getWarehouse(id) {
  return api.get(`/warehouses/${id}/`);
}

export async function createWarehouse(data) {
  return api.post("/warehouses/", data);
}

export async function updateWarehouse(id, data) {
  return api.patch(`/warehouses/${id}/`, data);
}

export async function deleteWarehouse(id) {
  return api.delete(`/warehouses/${id}/`);
}
