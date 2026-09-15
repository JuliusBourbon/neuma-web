const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

export async function register({ email, password, username }) {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password, username })
    })

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(result.message || 'Register gagal. Silakan coba lagi.');
    }

    return result.data;
}

/**
 * Login dengan email dan password
 * @param {{ email: string, password: string }} credentials
 * @returns {Promise<{ user: object, accessToken: string }>}
 */
export async function login({ email, password }) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(result.message || 'Login gagal. Silakan coba lagi.');
    }

    return result.data;
}

/**
 * Login atau Register dengan Google Token (ID Token atau Access Token)
 * @param {{ idToken?: string, accessToken?: string }} payload
 * @returns {Promise<{ user: object, accessToken: string }>}
 */
export async function loginWithGoogle({ idToken, accessToken }) {
    const response = await fetch(`${API_BASE_URL}/auth/google`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ idToken, accessToken }),
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(result.message || 'Login Google gagal. Silakan coba lagi.');
    }

    return result.data;
}
