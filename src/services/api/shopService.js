import { api } from "./apiClient";

/**
 * Get all shop items and ownership status
 * Endpoint: GET /api/shop/items
 */
export async function getShopItems() {
  const result = await api.get("/shop/items");

  return result.data?.items || [];
}
