import { useState, useEffect } from "react";
import { getHomeData } from "../services/api/userService";

export function useHomeData() {
  const [levels, setLevels] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("cachedLevels")) || [];
    } catch {
      return [];
    }
  });

  const [userStats, setUserStats] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("cachedStats")) || null;
    } catch {
      return null;
    }
  });

  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      return {};
    }
  });

  const [isLoading, setIsLoading] = useState(levels.length === 0);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchInitialData = async () => {
    if (levels.length === 0) setIsLoading(true);
    setErrorMessage("");
    
    try {
      const response = await getHomeData();
      const levelsData = response?.levels;
      const statsData = response?.stats;
      const userProfile = response?.user;

      if (levelsData) {
        setLevels(levelsData);
        localStorage.setItem("cachedLevels", JSON.stringify(levelsData));
      }
      if (statsData) {
        setUserStats(statsData);
        localStorage.setItem("cachedStats", JSON.stringify(statsData));
      }
      if (userProfile) {
        setUser(userProfile);
        localStorage.setItem("user", JSON.stringify(userProfile));
      }
    } catch (err) {
      if (levels.length === 0) {
        setErrorMessage(err.message || "Gagal memuat data pembelajaran.");
      } else {
        console.warn("Background fetch failed:", err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Derived state calculations
  const lang = user?.preferredLanguage || 'id';
  const activeAvatar = userStats?.avatar || user?.avatarUrl || user?.avatar || null;
  const formattedAlphabet = `${String(userStats?.wordsCollected ?? 0).padStart(2, "0")}/26`;

  return {
    levels,
    userStats,
    user,
    lang,
    activeAvatar,
    formattedAlphabet,
    isLoading,
    errorMessage,
    refetch: fetchInitialData
  };
}
