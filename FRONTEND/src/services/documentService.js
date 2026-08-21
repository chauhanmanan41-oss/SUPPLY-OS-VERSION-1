import { api } from "./api";

export async function listDocuments(params) {
  const qs = params ? "?" + new URLSearchParams(params).toString() : "";
  return api.get(`/documents/${qs}`);
}

export async function getDocument(id) {
  return api.get(`/documents/${id}/`);
}

export async function uploadDocument(formData) {
  return api.post("/documents/", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
}

export async function deleteDocument(id) {
  return api.delete(`/documents/${id}/`);
}
