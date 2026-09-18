import { api } from './apiClient';

/**
 * Get current user stats, rank, and avatar
 * Endpoint: GET /api/users/me/stats
 * @returns {Promise<{
 *   userId: string,
 *   totalXp: number,
 *   currencyBalance: number,
 *   dayStreak: number,
 *   lastActiveDate: string,
 *   wordsCollected: number,
 *   rank: number,
 *   avatar: string | null,
 *   username: string | null
 * }>}
 */
export async function getMyStats() {
    const result = await api.get('/users/me/stats');
    return result.data?.stats;
}

/**
 * Get current user profile
 * Endpoint: GET /api/users/me
 */
export async function getMyProfile() {
    const result = await api.get('/users/me');
    return result.data?.user;
}
