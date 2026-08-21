import { api } from "./api";

export async function listMaterials(params) {
  const qs = params ? "?" + new URLSearchParams(params).toString() : "";
  return api.get(`/materials/${qs}`);
}

export async function getMaterial(id) {
  return api.get(`/materials/${id}/`);
}

export async function createMaterial(data) {
  return api.post("/materials/", data);
}

export async function updateMaterial(id, data) {
  return api.patch(`/materials/${id}/`, data);
}

export async function deleteMaterial(id) {
  return api.delete(`/materials/${id}/`);
}
