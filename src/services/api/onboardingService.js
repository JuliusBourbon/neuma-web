const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

/**
 * Menandai onboarding user sebagai selesai
 * Endpoint: PATCH /api/users/me/onboarding
 * @returns {Promise<object>} Data user yang sudah menyelesaikan onboarding
 */
export async function completeOnboarding() {
  const token = localStorage.getItem("accessToken");

  const response = await fetch(`${API_BASE_URL}/users/me/onboarding`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    credentials: "include",
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(result.message || "Gagal menyelesaikan onboarding.");
  }

  return result.data?.user;
}
