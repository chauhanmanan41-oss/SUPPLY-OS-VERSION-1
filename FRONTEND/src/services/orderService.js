/** Order Service — maps to backend apps.orders */
import { api } from "./api";

export async function listOrders(params) {
  const qs = params ? "?" + new URLSearchParams(params).toString() : "";
  return api.get(`/orders/${qs}`);
}

export async function getOrder(id) {
  return api.get(`/orders/${id}/`);
}

export async function createOrder(data) {
  return api.post("/orders/", data);
}

export async function updateOrder(id, data) {
  return api.patch(`/orders/${id}/`, data);
}

export async function deleteOrder(id) {
  return api.delete(`/orders/${id}/`);
}
