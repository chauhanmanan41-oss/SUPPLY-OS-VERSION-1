import { api } from "./api";

export async function listNotifications(params) {
  const qs = params ? "?" + new URLSearchParams(params).toString() : "";
  return api.get(`/notifications/${qs}`);
}

export async function markNotificationRead(id) {
  return api.post(`/notifications/${id}/mark-read/`);
}

export async function markAllNotificationsRead() {
  return api.post("/notifications/mark-all-read/");
}
