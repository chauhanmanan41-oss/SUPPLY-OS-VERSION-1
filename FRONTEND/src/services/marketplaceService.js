/** Enterprise Marketplace Service — maps to backend apps.marketplace */
import { api } from "./api";

export async function listMarketplaceCategories() {
  return api.get("/marketplace/categories/");
}

export async function listPartners(params) {
  const qs = params ? "?" + new URLSearchParams(params).toString() : "";
  return api.get(`/marketplace/partners/${qs}`);
}

export async function getPartner(id) {
  return api.get(`/marketplace/partners/${id}/`);
}

export async function addPartnerReview(id, data) {
  return api.post(`/marketplace/partners/${id}/add-review/`, data);
}

export async function searchMarketplace(params) {
  let qs = "";
  if (typeof params === "string") {
    qs = params ? `?q=${encodeURIComponent(params)}` : "";
  } else if (params && typeof params === "object") {
    const cleanParams = {};
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== "" && params[key] !== null && params[key] !== "all") {
        cleanParams[key] = params[key];
      }
    });
    qs = "?" + new URLSearchParams(cleanParams).toString();
  }
  return api.get(`/marketplace/search/${qs}`);
}

export async function getAIAdvisor(params = {}) {
  const cleanParams = {};
  Object.keys(params).forEach(key => {
    if (params[key] !== undefined && params[key] !== "" && params[key] !== null && params[key] !== "all") {
      cleanParams[key] = params[key];
    }
  });
  const qs = "?" + new URLSearchParams(cleanParams).toString();
  return api.get(`/marketplace/ai-advisor/${qs}`);
}

export async function getTrendingSearches() {
  return api.get("/marketplace/trending-searches/");
}
