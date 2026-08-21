import { api } from "./api";

export async function listShipments(params) {
  const qs = params ? "?" + new URLSearchParams(params).toString() : "";
  return api.get(`/logistics/shipments/${qs}`);
}

export async function getShipment(id) {
  return api.get(`/logistics/shipments/${id}/`);
}

export async function createShipment(data) {
  return api.post("/logistics/shipments/", data);
}

export async function updateShipment(id, data) {
  return api.patch(`/logistics/shipments/${id}/`, data);
}

export async function deleteShipment(id) {
  return api.delete(`/logistics/shipments/${id}/`);
}
