import { api } from "./api";

export async function listManufacturers(params) {
  const qs = params ? "?" + new URLSearchParams(params).toString() : "";
  return api.get(`/manufacturers/${qs}`);
}

export async function getManufacturer(id) {
  return api.get(`/manufacturers/${id}/`);
}

export async function createManufacturer(data) {
  return api.post("/manufacturers/", data);
}

export async function updateManufacturer(id, data) {
  return api.patch(`/manufacturers/${id}/`, data);
}

export async function deleteManufacturer(id) {
  return api.delete(`/manufacturers/${id}/`);
}

export async function linkProductToManufacturer(manufacturerId, productId) {
  return api.post(`/manufacturers/${manufacturerId}/link-product/`, { product: productId });
}
