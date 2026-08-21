import { api } from "./api";

export async function listInspections(params) {
  const qs = params ? "?" + new URLSearchParams(params).toString() : "";
  return api.get(`/quality/inspections/${qs}`);
}

export async function getInspection(id) {
  return api.get(`/quality/inspections/${id}/`);
}

export async function createInspection(data) {
  return api.post("/quality/inspections/", data);
}

export async function updateInspection(id, data) {
  return api.patch(`/quality/inspections/${id}/`, data);
}

export async function deleteInspection(id) {
  return api.delete(`/quality/inspections/${id}/`);
}
