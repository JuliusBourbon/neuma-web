import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TopBar from "../../../components/common/topBar";
import LevelMap from "../components/LevelMap/LevelMap";
import UserStats from "../components/userStats";
import { getLevels } from "../../../services/api/levelService";
import { getMyStats, getMyProfile } from "../../../services/api/userService";
import { logout } from "../../../services/api/authService";

export default function HomePage() {
  const navigate = useNavigate();
  const [levels, setLevels] = useState([]);
  const [userStats, setUserStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const fetchInitialData = async () => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const [levelsData, statsData, userProfile] = await Promise.all([
        getLevels(),
        getMyStats().catch((err) => {
          console.warn("Gagal memuat statistik pengguna:", err);
          return null;
        }),
        getMyProfile().catch((err) => {
          console.warn("Gagal memuat profil pengguna:", err);
          return null;
        }),
      ]);
      setLevels(levelsData);
      if (statsData) {
        setUserStats(statsData);
      }
      if (userProfile) {
        setUser(userProfile);
        localStorage.setItem("user", JSON.stringify(userProfile));
      }
    } catch (err) {
      setErrorMessage(err.message || "Gagal memuat level pembelajaran.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      return {};
    }
  });

  const lang = user?.preferredLanguage || 'id';

  // List for TopBar
  const navLinks = [
    { text: lang === 'id' ? "Beranda" : "Home", href: "/home" },
    { text: lang === 'id' ? "Peringkat" : "Leaderboard", onClick: () => navigate("/leaderboard") },
    { text: lang === 'id' ? "Misi" : "Quest", onClick: () => navigate("/quest") },
    { text: lang === 'id' ? "Toko" : "Shop", onClick: () => navigate("/shop") },
    { text: lang === 'id' ? "Profil" : "Profile", onClick: () => navigate("/profile") },
  ];

  const activeAvatar = userStats?.avatar || user?.avatarUrl || user?.avatar || null;
  const formattedAlphabet = `${String(userStats?.wordsCollected ?? 0).padStart(2, "0")}/26`;

  return (
    <div className="relative w-screen h-screen overflow-hidden select-none bg-primary">
      {/* Floating TopBar Navigation */}
      <TopBar links={navLinks} className="" />

      {/* Main Interactive Level Map / Loading / Error Overlay */}
      {isLoading ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-primary z-40">
          <div className="w-12 h-12 border-4 border-secondary border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-tertiary/80 font-medium text-sm tracking-wide">
            {lang === 'id' ? "Memuat Peta Petualangan BISINDO..." : "Loading BISINDO Adventure Map..."}
          </p>
        </div>
      ) : errorMessage ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-primary/95 z-40 p-6">
          <div className="text-red-700 px-8 py-6 max-w-md text-center">
            <p className="text-base font-bold mb-3">{errorMessage}</p>
            <button
              type="button"
              onClick={fetchInitialData}
              className="text-xs bg-secondary text-white px-5 py-2.5 rounded-xl font-bold hover:brightness-110 shadow transition cursor-pointer"
            >
              {lang === 'id' ? "Coba Lagi" : "Try Again"}
            </button>
          </div>
        </div>
      ) : (
        <>
          <LevelMap levels={levels} avatar={activeAvatar} lang={lang} />
          {/* User Stats Floating Widget in Bottom Left */}
          <div className="fixed bottom-6 left-6 z-30 pointer-events-auto">
            <UserStats
              alphabet={formattedAlphabet}
              coins={userStats?.currencyBalance ?? 0}
              rank={userStats?.rank ?? "-"}
              streak={userStats?.dayStreak ?? 0}
              avatar={activeAvatar}
            />
          </div>
        </>
      )}
    </div>
  );
}
