const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

/**
 * Mengambil daftar seluruh level pembelajaran untuk pengguna yang sedang login
 * Endpoint: GET /api/levels
 * @returns {Promise<Array<{ id: string, orderIndex: number, title: any, description: any, status: 'locked'|'available'|'completed', bestScore: number }>>}
 */
export async function getLevels() {
    const token = localStorage.getItem('accessToken');

    const response = await fetch(`${API_BASE_URL}/levels`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: 'include',
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(result.message || 'Gagal memuat daftar level.');
    }

    return result.data?.levels || [];
}

/**
 * Mengambil detail materi dan soal kuis untuk suatu level
 * Endpoint: GET /api/levels/:levelId
 * @param {string} levelId
 * @returns {Promise<object>} Detail level
 */
export async function getLevelDetail(levelId) {
    const token = localStorage.getItem('accessToken');

    const response = await fetch(`${API_BASE_URL}/levels/${levelId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: 'include',
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(result.message || 'Gagal memuat detail level.');
    }

    return result.data?.level;
}
