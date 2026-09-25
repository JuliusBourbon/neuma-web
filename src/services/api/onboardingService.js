import { api } from "./apiClient";

/**
 * Complete onboarding and save preferred language
 * Endpoint: PATCH /api/users/me/onboarding
 *
 * @param {"id" | "en"} preferredLanguage - Selected application language
 * @returns {Promise<object>} User data after completing onboarding
 */
export async function completeOnboarding(preferredLanguage) {
  const result = await api.patch("/users/me/onboarding", {
    preferredLanguage,
  });

  return result.data?.user;
}
