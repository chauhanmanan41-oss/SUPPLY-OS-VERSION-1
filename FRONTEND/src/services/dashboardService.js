/** Dashboard Service — maps to backend apps.dashboard */
import { api } from "./api";

export async function getDashboardOverview() {
  return api.get("/dashboard/overview/");
}
