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
import ScorePage from "./features/learning/pages/scorePage.jsx";
import OnboardingPage from "./features/onboarding/pages/OnboardingPage.jsx";
import ProfilePage from "./features/profile/pages/ProfilePage.jsx";
import { ProtectedRoute, GuestRoute } from "./routes/ProtectedRoute.jsx";
import LeaderboardPage from "./features/leaderboard/pages/leaderboardPage.jsx";
import ShopPage from "./features/shop/pages/ShopPage.jsx";
import QuestPage from "./features/quest/pages/questPage.jsx";
import AboutPage from "./static/aboutPage.jsx";
import TermsPage from "./static/termsPage.jsx";
import PrivacyPage from "./static/privacyPage.jsx";
import SignPage from "./static/signPage.jsx";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <Routes>
          {/* Public Landing */}
          <Route path="/" element={<App />} />
          <Route path="/sign-language" element={<SignPage />} />
          <Route path="/about-us" element={<AboutPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />

          {/* Guest Routes (Hanya untuk yang belum login) */}
          <Route element={<GuestRoute />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          {/* Protected Routes (Wajib login) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/onboarding" element={<OnboardingPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            <Route path="/quest" element={<QuestPage />} />
            <Route path="/learning" element={<LearningPage />} />
            <Route path="/score" element={<ScorePage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/shop" element={<ShopPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </StrictMode>,
);
