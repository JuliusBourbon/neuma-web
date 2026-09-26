import { useNavigate } from "react-router-dom";
import TopBar from "../../../components/common/topBar";
import LevelMap from "../components/LevelMap/LevelMap";
import UserStats from "../components/userStats";
import LoadingOverlay from "../../../components/common/LoadingOverlay";
import ErrorOverlay from "../../../components/common/ErrorOverlay";
import { useHomeData } from "../../../hooks/useHomeData";

export default function HomePage() {
  const navigate = useNavigate();
  const {
    levels,
    userStats,
    lang,
    activeAvatar,
    formattedAlphabet,
    isLoading,
    errorMessage,
    refetch,
  } = useHomeData();

  // List for TopBar
  const navLinks = [
    { text: lang === 'id' ? "Beranda" : "Home", href: "/home" },
    { text: lang === 'id' ? "Peringkat" : "Leaderboard", onClick: () => navigate("/leaderboard") },
    { text: lang === 'id' ? "Misi" : "Quest", onClick: () => navigate("/quest") },
    { text: lang === 'id' ? "Toko" : "Shop", onClick: () => navigate("/shop") },
    { text: lang === 'id' ? "Profil" : "Profile", onClick: () => navigate("/profile") },
  ];

  return (
    <div className="relative w-screen h-screen overflow-hidden select-none bg-primary">
      {/* Floating TopBar Navigation */}
      <TopBar links={navLinks} className="" />

      {/* Main Interactive Level Map / Loading / Error Overlay */}
      {isLoading ? (
        <LoadingOverlay message={lang === 'id' ? "Memuat..." : "Loading..."} />
      ) : errorMessage ? (
        <ErrorOverlay
          message={errorMessage}
          onRetry={refetch}
          retryText={lang === 'id' ? "Coba Lagi" : "Try Again"}
        />
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
