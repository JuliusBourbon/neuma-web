import { useState, useEffect } from "react";
import { leaderboardService } from "../../../services/api/leaderboardService";

export function useLeaderboard() {
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

  return { leaderboard, myRank, isInitializing };
}
