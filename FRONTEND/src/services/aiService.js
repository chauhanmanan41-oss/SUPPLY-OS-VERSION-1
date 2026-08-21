import { api } from "./api";

export async function askMarketplaceAI(payload) {
    return api.post("/ai/marketplace-assistant/", payload);
}

export async function askCopilot(payload) {
    return api.post("/ai/copilot/", payload);
}

export async function buildProductWithAI(payload) {
    return api.post("/ai/product-builder/", payload);
}

export async function validateProductWithAI(payload) {
    return api.post("/ai/product-validator/", payload);
}

export async function buildProcurementPlanWithAI(payload) {
    return api.post("/ai/procurement-planner/", payload);
}

export async function generateDocumentWithAI(payload) {
    return api.post("/ai/generate-document/", payload);
}

// ── AI Product Architect ─────────────────────────────────────────────────────

/** Start a new AI Product Architect interview session. */
export async function startArchitectSession() {
    return api.post("/ai/architect/start/", {});
}

/** Send a message to an active interview session. */
export async function sendArchitectMessage(sessionId, message) {
    return api.post("/ai/architect/message/", { session_id: sessionId, message });
}

/** Create a full ERP workspace from the collected interview specs. */
export async function createArchitectWorkspace(sessionId) {
    return api.post("/ai/architect/create-workspace/", { session_id: sessionId });
}

/** Get the current state of an interview session. */
export async function getArchitectSession(sessionId) {
    return api.get(`/ai/architect/session/${sessionId}/`);
}

