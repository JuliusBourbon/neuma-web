import { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { refreshAccessToken } from "../services/api/apiClient";

function getTokenExpiry(token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp;
  } catch {
    return null;
  }
}

export function ProtectedRoute({ children }) {
  const [authState, setAuthState] = useState("checking");

  useEffect(() => {
    async function checkAuth() {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        setAuthState("fail");
        return;
      }

      const exp = getTokenExpiry(token);
      const nowInSeconds = Math.floor(Date.now() / 1000);
      const isExpiredOrSoon = !exp || exp - nowInSeconds < 60;

      if (isExpiredOrSoon) {
        try {
          await refreshAccessToken();
          setAuthState("ok");
        } catch {
          setAuthState("fail");
        }
      } else {
        setAuthState("ok");
      }
    }

    checkAuth();
  }, []);

  if (authState === "checking") return null;
  if (authState === "fail") return <Navigate to="/login" replace />;
  return children ? children : <Outlet />;
}

export function GuestRoute({ children }) {
  const token = localStorage.getItem("accessToken");

  if (token) {
    return <Navigate to="/home" replace />;
  }

  return children ? children : <Outlet />;
}

export default ProtectedRoute;
