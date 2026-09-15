import { Navigate, Outlet } from "react-router-dom";

/**
 * Route guard untuk halaman yang membutuhkan autentikasi (harus login).
 * Jika token tidak ditemukan, pengguna diarahkan ke /login.
 */
export function ProtectedRoute({ children }) {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children ? children : <Outlet />;
}

/**
 * Route guard untuk halaman publik seperti /login dan /register.
 * Jika pengguna sudah login, langsung diarahkan ke /home.
 */
export function GuestRoute({ children }) {
  const token = localStorage.getItem("accessToken");

  if (token) {
    return <Navigate to="/home" replace />;
  }

  return children ? children : <Outlet />;
}

export default ProtectedRoute;
