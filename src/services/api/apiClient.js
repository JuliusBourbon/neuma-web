const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

// Promise for parallel refresh token requests
let isRefreshing = false;
let refreshSubscribers = [];

function subscribeTokenRefresh(cb) {
    refreshSubscribers.push(cb);
}

function onRefreshed(newAccessToken) {
    refreshSubscribers.forEach((cb) => cb(newAccessToken));
    refreshSubscribers = [];
}

/**
 * Request new access token using refresh token (stored in HttpOnly cookie)
 * @returns {Promise<string>} new access token
 */
export async function refreshAccessToken() {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });

        const result = await response.json().catch(() => ({}));

        if (!response.ok || !result.data?.accessToken) {
            throw new Error(result.message || 'Sesi telah berakhir.');
        }

        const newAccessToken = result.data.accessToken;
        localStorage.setItem('accessToken', newAccessToken);
        return newAccessToken;
    } catch (error) {
        // Remove local token if refresh token is invalid / expired
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        localStorage.removeItem('refreshToken');

        // Redirect to login page if not already on auth public page
        const currentPath = window.location.pathname;
        if (
            currentPath !== '/' &&
            !currentPath.startsWith('/login') &&
            !currentPath.startsWith('/register')
        ) {
            window.location.href = '/login';
        }

        throw error;
    }
}

/**
 * Fetch wrapper utama with auto-refresh token interceptor
 * @param {string} endpoint
 * @param {RequestInit} [options={}]
 * @returns {Promise<any>}
 */
export async function apiClient(endpoint, options = {}) {
    const url = endpoint.startsWith('http')
        ? endpoint
        : `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

    const token = localStorage.getItem('accessToken');
    const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
    };

    let response = await fetch(url, {
        ...options,
        headers,
        credentials: 'include',
    });

    // Check if 401 Unauthorized because access token is expired
    const isAuthEndpoint =
        endpoint.includes('/auth/login') ||
        endpoint.includes('/auth/register') ||
        endpoint.includes('/auth/refresh');

    if (response.status === 401 && !isAuthEndpoint) {
        if (!isRefreshing) {
            isRefreshing = true;

            try {
                const newAccessToken = await refreshAccessToken();
                isRefreshing = false;
                onRefreshed(newAccessToken);

                // Retry the original request with the new access token
                const retryHeaders = {
                    ...headers,
                    Authorization: `Bearer ${newAccessToken}`,
                };

                return await fetch(url, {
                    ...options,
                    headers: retryHeaders,
                    credentials: 'include',
                }).then(handleResponse);
            } catch (refreshErr) {
                isRefreshing = false;
                refreshSubscribers = [];
                const result = await response.json().catch(() => ({}));
                throw new Error(result.message || 'Session has expired. Please login again.');
            }
        }

        // If a refresh process is already running, queue this request
        return new Promise((resolve, reject) => {
            subscribeTokenRefresh(async (newAccessToken) => {
                try {
                    const retryHeaders = {
                        ...headers,
                        Authorization: `Bearer ${newAccessToken}`,
                    };

                    const retryResponse = await fetch(url, {
                        ...options,
                        headers: retryHeaders,
                        credentials: 'include',
                    });

                    resolve(await handleResponse(retryResponse));
                } catch (err) {
                    reject(err);
                }
            });
        });
    }

    return handleResponse(response);
}

async function handleResponse(response) {
    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(result.message || 'An error occurred on the server.');
    }

    return result;
}

export const api = {
    get: (endpoint, options = {}) => apiClient(endpoint, { ...options, method: 'GET' }),
    post: (endpoint, body, options = {}) =>
        apiClient(endpoint, {
            ...options,
            method: 'POST',
            body: body !== undefined ? JSON.stringify(body) : undefined,
        }),
    put: (endpoint, body, options = {}) =>
        apiClient(endpoint, {
            ...options,
            method: 'PUT',
            body: body !== undefined ? JSON.stringify(body) : undefined,
        }),
    patch: (endpoint, body, options = {}) =>
        apiClient(endpoint, {
            ...options,
            method: 'PATCH',
            body: body !== undefined ? JSON.stringify(body) : undefined,
        }),
    delete: (endpoint, options = {}) => apiClient(endpoint, { ...options, method: 'DELETE' }),
};

export default apiClient;
