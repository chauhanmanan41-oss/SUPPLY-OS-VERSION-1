import { api } from "./api";

export async function listSuppliers(params) {
  const qs = params ? "?" + new URLSearchParams(params).toString() : "";
  return api.get(`/suppliers/${qs}`);
}

export async function getSupplier(id) {
  return api.get(`/suppliers/${id}/`);
}

export async function createSupplier(data) {
  return api.post("/suppliers/", data);
}

export async function updateSupplier(id, data) {
  return api.patch(`/suppliers/${id}/`, data);
}

export async function deleteSupplier(id) {
  return api.delete(`/suppliers/${id}/`);
}
