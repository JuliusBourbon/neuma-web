import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import LoginPage from "./features/auth/pages/loginPage.jsx";
import RegisterPage from "./features/auth/pages/registerPage.jsx";
import HomePage from "./features/home/pages/HomePage.jsx";
import LearningPage from "./features/learning/pages/LearningPage.jsx";
import OnboardingPage from "./features/onboarding/pages/OnboardingPage.jsx";
import { ProtectedRoute, GuestRoute } from "./routes/ProtectedRoute.jsx";

const GOOGLE_CLIENT_ID =
  import.meta.env.VITE_GOOGLE_CLIENT_ID ||
  "664530130587-8vjleihnfoepful69hq1efudap2m7ut9.apps.googleusercontent.com";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <Routes>
          {/* Public Landing */}
          <Route path="/" element={<App />} />

          {/* Guest Routes (Hanya untuk yang belum login) */}
          <Route element={<GuestRoute />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          {/* Protected Routes (Wajib login) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/onboarding" element={<OnboardingPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/learning" element={<LearningPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </StrictMode>,
);
