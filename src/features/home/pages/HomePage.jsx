import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TopBar from "../../../components/common/topBar";
import LevelMap from "../components/LevelMap/LevelMap";
import UserStats from "../components/userStats";
import { getLevels } from "../../../services/api/levelService";
import { getMyStats } from "../../../services/api/userService";
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
      const [levelsData, statsData] = await Promise.all([
        getLevels(),
        getMyStats().catch((err) => {
          console.warn("Gagal memuat statistik pengguna:", err);
          return null;
        }),
      ]);
      setLevels(levelsData);
      if (statsData) {
        setUserStats(statsData);
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

  // List for TopBar
  const navLinks = [
    { text: "Home", href: "/home" },
    { text: "Leaderboard", onClick: () => navigate("/leaderboard") },
    { text: "Quest", href: "#quest" },
    { text: "Shop", href: "#shop" },
    { text: "Profile", onClick: () => navigate("/profile") },
  ];

  const [user] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      return {};
    }
  });

  const activeAvatar =
    userStats?.avatar || user?.avatarUrl || user?.avatar || null;
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
            Memuat Peta Petualangan BISINDO...
          </p>
        </div>
      ) : errorMessage ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-primary/95 z-40 p-6">
          <div className="bg-white/95 backdrop-blur-md border border-red-300 text-red-700 px-8 py-6 rounded-3xl max-w-md text-center shadow-2xl">
            <p className="text-base font-bold mb-3">{errorMessage}</p>
            <button
              type="button"
              onClick={fetchInitialData}
              className="text-xs bg-secondary text-white px-5 py-2.5 rounded-xl font-bold hover:brightness-110 shadow transition cursor-pointer"
            >
              Coba Lagi
            </button>
          </div>
        </div>
      ) : (
        <>
          <LevelMap levels={levels} avatar={activeAvatar} />
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
