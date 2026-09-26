import { useEffect, useState } from "react";
import { leaderboardService } from "../../../services/api/leaderboardService";
import firefly4 from "../../../assets/onboarding/firefly-4.png";
import PageHeader from "../../../components/layout/PageHeader";
import LoadingOverlay from "../../../components/common/LoadingOverlay";

export default function LeaderboardPage() {
  const [user] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      return {};
    }
  });
  const lang = user?.preferredLanguage || 'id';

  const [leaderboard, setLeaderboard] = useState(() => {
    try {
      const cached = localStorage.getItem("leaderboardData");
      if (cached) return JSON.parse(cached);
    } catch {}
    return [];
  });
  
  const [myRank, setMyRank] = useState(() => {
    try {
      const cached = localStorage.getItem("leaderboardMyRank");
      if (cached) return JSON.parse(cached);
    } catch {}
    return null;
  });

  const [isInitializing, setIsInitializing] = useState(() => {
    return !localStorage.getItem("leaderboardData");
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const topResponse = await leaderboardService.getTop();
        if (topResponse.success) {
          setLeaderboard(topResponse.data.leaderboard);
          localStorage.setItem("leaderboardData", JSON.stringify(topResponse.data.leaderboard));
        }
        const myRankResponse = await leaderboardService.getMyRank();
        if (myRankResponse.success) {
          setMyRank(myRankResponse.data.myRank);
          localStorage.setItem("leaderboardMyRank", JSON.stringify(myRankResponse.data.myRank));
        }
      } catch (error) {
        console.error("Failed to fetch leaderboard data", error);
      } finally {
        setIsInitializing(false);
      }
    };
    fetchData();
  }, []);

  const getAvatarUrl = (avatar) => {
    if (!avatar || !avatar.imageUrl) return firefly4;
    return avatar.imageUrl.startsWith("http")
      ? avatar.imageUrl
      : `http://localhost:3000${avatar.imageUrl}`;
  };

  return (
    <div className="h-screen bg-primary flex flex-col overflow-hidden relative">
      <PageHeader
        title={lang === 'id' ? "Papan Peringkat" : "Leaderboard"}
        showBackButton={true}
        backButtonPath="/home"
      />

      {isInitializing ? (
        <LoadingOverlay message={lang === 'id' ? "Memuat papan peringkat..." : "Loading leaderboard..."} />
      ) : (
        <div className="flex-1 overflow-y-auto custom-scrollbar w-full pb-24 pr-1">
          <div className="flex flex-col w-full max-w-6xl mx-auto gap-3 px-4 py-4 md:py-8">
            {leaderboard.map((user) => {
              const isMe = myRank && user.userId === myRank.userId;
              return (
                <div
                  key={user.userId}
                  className={`flex justify-between text-base md:text-xl rounded-lg gap-4 items-center py-2 md:py-3 px-3 md:px-6 transition-colors ${
                    isMe
                      ? "bg-tertiary/40 text-white shadow-lg ring-1 ring-tertiary/30"
                      : "bg-tertiary/10 hover:bg-tertiary/20"
                  }`}
                >
                  <div className="flex items-center gap-4 md:gap-6">
                    <span
                      className={`font-bold w-6 md:w-8 ${isMe ? "text-white" : ""}`}
                    >
                      #{user.rank}
                    </span>
                    <div
                      className={`bg-tertiary rounded-full p-1 shrink-0 ${isMe ? "shadow-md" : ""}`}
                    >
                      <img
                        src={getAvatarUrl(user.avatar)}
                        alt="user-avatar"
                        className="h-8 w-8 md:h-10 md:w-10 rounded-full object-cover"
                      />
                    </div>
                    <span
                      className={`truncate max-w-30 md:max-w-xs ${isMe ? "font-semibold" : ""}`}
                      title={isMe ? `${user.username || (lang === 'id' ? "Anonim" : "Anonymous")} ${lang === 'id' ? "(Anda)" : "(You)"}` : (user.username || (lang === 'id' ? "Anonim" : "Anonymous"))}
                    >
                      {user.username || (lang === 'id' ? "Anonim" : "Anonymous")} {isMe ? (lang === 'id' ? "(Anda)" : "(You)") : ""}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 md:gap-8 text-right">
                    <span
                      title="Total XP"
                      className={`whitespace-nowrap ${isMe ? "font-bold text-white" : "font-semibold"}`}
                    >
                      {user.totalXp} xp
                    </span>
                    <span
                      title={lang === 'id' ? "Abjad Terkumpul" : "Alphabet Collected"}
                      className={`whitespace-nowrap w-12 md:w-16 text-center ${isMe ? "font-bold text-white" : "font-semibold"}`}
                    >
                      {user.wordsCollected || 0}/26
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* My Rank Fixed Bottom */}
      {myRank && !isInitializing && (
        <div className="bg-primary backdrop-blur-sm border-t border-tertiary/20 p-4 shrink-0 absolute bottom-0 w-full z-20 text-white">
          <div className="flex justify-between w-full max-w-6xl mx-auto text-lg md:text-2xl bg-tertiary/40 rounded-xl gap-4 items-center py-3 px-4 md:px-6 shadow-lg ring-1 ring-tertiary/30">
            <div className="flex items-center gap-4 md:gap-6">
              <span className="font-bold w-6 md:w-8">#{myRank.rank}</span>
              <div className="bg-tertiary rounded-full p-1 shrink-0 shadow-md">
                <img
                  src={getAvatarUrl(myRank.avatar)}
                  alt="user-avatar"
                  className="h-10 w-10 rounded-full object-cover"
                />
              </div>
              <span
                className="truncate max-w-30 md:max-w-xs font-semibold"
                title={`${myRank.username || (lang === 'id' ? "Anonim" : "Anonymous")} ${lang === 'id' ? "(Anda)" : "(You)"}`}
              >
                {myRank.username || (lang === 'id' ? "Anonim" : "Anonymous")} {lang === 'id' ? "(Anda)" : "(You)"}
              </span>
            </div>
            <div className="flex items-center gap-4 md:gap-8 text-right">
              <span title="Total XP" className="font-bold whitespace-nowrap">
                {myRank.totalXp} xp
              </span>
              <span
                title={lang === 'id' ? "Abjad Terkumpul" : "Alphabet Collected"}
                className="font-bold whitespace-nowrap w-12 md:w-16 text-center"
              >
                {myRank.wordsCollected || 0}/26
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
