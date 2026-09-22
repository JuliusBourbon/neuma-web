import { api } from "./apiClient";

/**
 * Get all shop items and ownership status
 * Endpoint: GET /api/shop/items
 */
export async function getShopItems() {
  const result = await api.get("/shop/items");

  return result.data?.items || [];
}

/**
 * Purchase shop item
 * Endpoint: POST /api/shop/items/:id/purchase
 */
export async function purchaseShopItem(itemId) {
  const result = await api.post(`/shop/items/${itemId}/purchase`);

  return result.data;
}
