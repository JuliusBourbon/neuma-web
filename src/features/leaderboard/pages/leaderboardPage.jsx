import { useState } from "react";
import PageHeader from "../../../components/layout/PageHeader";
import LoadingOverlay from "../../../components/common/LoadingOverlay";
import LeaderboardItem from "../components/LeaderboardItem";
import MyRankBar from "../components/MyRankBar";
import { useLeaderboard } from "../hooks/useLeaderboard";

export default function LeaderboardPage() {
  const [user] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      return {};
    }
  });
  const lang = user?.preferredLanguage || 'id';

  const { leaderboard, myRank, isInitializing } = useLeaderboard();

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
            {leaderboard.map((user) => (
              <LeaderboardItem 
                key={user.userId} 
                user={user} 
                isMe={myRank && user.userId === myRank.userId} 
                lang={lang} 
              />
            ))}
          </div>
        </div>
      )}

      {/* My Rank Fixed Bottom */}
      {!isInitializing && <MyRankBar myRank={myRank} lang={lang} />}
    </div>
  );
}
