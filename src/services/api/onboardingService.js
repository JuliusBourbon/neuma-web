import { api } from './apiClient';

/**
 * Mark onboarding user as complete
 * Endpoint: PATCH /api/users/me/onboarding
 * @returns {Promise<object>} User data after completing onboarding
 */
export async function completeOnboarding() {
  const result = await api.patch('/users/me/onboarding');
  return result.data?.user;
}

