import { api, refreshAccessToken } from "./apiClient";

export async function register({ email, password, username }) {
  const result = await api.post("/auth/register", {
    email,
    password,
    username,
  });
  return result.data;
}

/**
 * Login with email and password
 * @param {{ email: string, password: string }} credentials
 * @returns {Promise<{ user: object, accessToken: string }>}
 */
export async function login({ email, password }) {
  const result = await api.post("/auth/login", { email, password });
  return result.data;
}

/**
 * Login or Register with Google Token (ID Token or Access Token)
 * @param {{ idToken?: string, accessToken?: string }} payload
 * @returns {Promise<{ user: object, accessToken: string }>}
 */
export async function loginWithGoogle({ idToken, accessToken }) {
  const result = await api.post("/auth/google", { idToken, accessToken });
  return result.data;
}

/**
 * Set password for OAuth users who do not have a password yet.
 *
 * @param {{ newPassword: string, confirmPassword: string }} payload
 * @returns {Promise<{ message: string }>}
 */
export async function setPassword({ newPassword, confirmPassword }) {
  const result = await api.post("/auth/password/set", {
    newPassword,
    confirmPassword,
  });

  return result.data;
}

/**
 * Change password for users who already have a password.
 *
 * @param {{
 *   oldPassword: string,
 *   newPassword: string,
 *   confirmPassword: string
 * }} payload
 * @returns {Promise<{ message: string }>}
 */
export async function changePassword({
  oldPassword,
  newPassword,
  confirmPassword,
}) {
  const result = await api.post("/auth/password/change", {
    oldPassword,
    newPassword,
    confirmPassword,
  });

  return result.data;
}

// Logout user and clear refresh token cookie and localStorage
export async function logout() {
  try {
    await api.post("/auth/logout");
  } catch {
    // Ignore network errors during logout
  } finally {
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  }
}

export { refreshAccessToken };
