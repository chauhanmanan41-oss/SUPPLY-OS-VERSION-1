/** Project Service — maps to backend apps.projects */
import { api } from "./api";

export async function listProjects(params) {
  const qs = params ? "?" + new URLSearchParams(params).toString() : "";
  return api.get(`/projects/${qs}`);
}

export async function getProject(id) {
  return api.get(`/projects/${id}/`);
}

export async function createProject(data) {
  return api.post("/projects/", data);
}

export async function updateProject(id, data) {
  return api.patch(`/projects/${id}/`, data);
}

export async function deleteProject(id) {
  return api.delete(`/projects/${id}/`);
}
