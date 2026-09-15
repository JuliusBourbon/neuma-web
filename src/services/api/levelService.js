import { api } from './apiClient';

/**
 * Get all learning levels for the logged in user
 * Endpoint: GET /api/levels
 * @returns {Promise<Array<{ id: string, orderIndex: number, title: any, description: any, status: 'locked'|'available'|'completed', bestScore: number }>>}
 */
export async function getLevels() {
    const result = await api.get('/levels');
    return result.data?.levels || [];
}

/**
 * Get detail of a level
 * Endpoint: GET /api/levels/:levelId
 * @param {string} levelId
 * @returns {Promise<object>} Detail level
 */
export async function getLevelDetail(levelId) {
    const result = await api.get(`/levels/${levelId}`);
    return result.data?.level;
}

