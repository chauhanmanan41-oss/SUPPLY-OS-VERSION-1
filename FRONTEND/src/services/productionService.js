import { api } from "./api";

export async function listProductionPlans(params) {
  const qs = params ? "?" + new URLSearchParams(params).toString() : "";
  return api.get(`/production/plans/${qs}`);
}

export async function getProductionPlan(id) {
  return api.get(`/production/plans/${id}/`);
}

export async function createProductionPlan(data) {
  return api.post("/production/plans/", data);
}

export async function updateProductionPlan(id, data) {
  return api.patch(`/production/plans/${id}/`, data);
}

export async function listProductionBatches(params) {
  const qs = params ? "?" + new URLSearchParams(params).toString() : "";
  return api.get(`/production/batches/${qs}`);
}

export async function getProductionBatch(id) {
  return api.get(`/production/batches/${id}/`);
}

export async function createProductionBatch(data) {
  return api.post("/production/batches/", data);
}

export async function startProductionBatch(id) {
  return api.post(`/production/batches/${id}/start/`);
}

export async function completeProductionBatch(id) {
  return api.post(`/production/batches/${id}/complete/`);
}
