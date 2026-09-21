import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { leaderboardService } from "../../../services/api/leaderboardService";
import firefly4 from "../../../assets/onboarding/firefly-4.png";

export default function LeaderboardPage() {
    const navigate = useNavigate();
    const [leaderboard, setLeaderboard] = useState([]);
    const [myRank, setMyRank] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const topResponse = await leaderboardService.getTop();
                if (topResponse.success) {
                    setLeaderboard(topResponse.data.leaderboard);
                }
                const myRankResponse = await leaderboardService.getMyRank();
                if (myRankResponse.success) {
                    setMyRank(myRankResponse.data.myRank);
                }
            } catch (error) {
                console.error("Failed to fetch leaderboard data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const getAvatarUrl = (avatar) => {
        // use backend imageUrl or fallback to local avatar
        return avatar?.imageUrl ? `http://localhost:3000${avatar.imageUrl}` : firefly4;
    };

    return (
        <div className="h-screen bg-primary flex flex-col overflow-hidden relative">
            <div className="relative w-full max-w-7xl mx-auto px-4 md:px-6 py-6 flex items-center shrink-0">
                {/* Back Button (<) */}
                <button
                    onClick={() => navigate("/home")}
                    className="flex items-center gap-2 px-3 py-3 md:px-4 md:py-4 rounded-full bg-tertiary hover:bg-black text-white font-semibold text-sm shadow-sm transition active:scale-95 cursor-pointer z-10"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3 w-3 md:h-4 md:w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <h1 className="absolute left-1/2 -translate-x-1/2 text-3xl md:text-4xl py-6">Leaderboard</h1>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar w-full pb-24 pr-1">
                {loading ? (
                    <div className="flex justify-center items-center h-full">
                        <span className="text-xl">Loading...</span>
                    </div>
                ) : (
                    <div className="flex flex-col w-full max-w-6xl mx-auto gap-3 px-4 py-4 md:py-8">
                        {leaderboard.map((user) => {
                            const isMe = myRank && user.userId === myRank.userId;
                            return (
                                <div
                                    key={user.userId}
                                    className={`flex justify-between text-base md:text-xl rounded-lg gap-4 items-center py-2 md:py-3 px-3 md:px-6 transition-colors ${isMe
                                        ? "bg-tertiary/40 text-white shadow-lg ring-1 ring-tertiary/30"
                                        : "bg-tertiary/10 hover:bg-tertiary/20"
                                        }`}
                                >
                                    <div className="flex items-center gap-4 md:gap-6">
                                        <span className={`font-bold w-6 md:w-8 ${isMe ? "text-white" : ""}`}>#{user.rank}</span>
                                        <div className={`bg-tertiary rounded-full p-1 shrink-0 ${isMe ? "shadow-md" : ""}`}>
                                            <img src={getAvatarUrl(user.avatar)} alt="user-avatar" className="h-8 w-8 md:h-10 md:w-10 rounded-full object-cover" />
                                        </div>
                                        <span
                                            className={`truncate max-w-30 md:max-w-xs ${isMe ? "font-semibold" : ""}`}
                                            title={isMe ? `${user.username} (You)` : user.username}
                                        >
                                            {user.username} {isMe ? "(You)" : ""}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4 md:gap-8 text-right">
                                        <span title="Total XP" className={`whitespace-nowrap ${isMe ? "font-bold text-white" : "font-semibold"}`}>
                                            {user.totalXp} xp
                                        </span>
                                        <span title="Alphabet Collected" className={`whitespace-nowrap w-12 md:w-16 text-center ${isMe ? "font-bold text-white" : "font-semibold"}`}>
                                            {user.wordsCollected || 0}/26
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* My Rank Fixed Bottom */}
            {myRank && !loading && (
                <div className="bg-primary backdrop-blur-sm border-t border-tertiary/20 p-4 shrink-0 absolute bottom-0 w-full z-20 text-white">
                    <div className="flex justify-between w-full max-w-6xl mx-auto text-lg md:text-2xl bg-tertiary/40 rounded-xl gap-4 items-center py-3 px-4 md:px-6 shadow-lg ring-1 ring-tertiary/30">
                        <div className="flex items-center gap-4 md:gap-6">
                            <span className="font-bold w-6 md:w-8">#{myRank.rank}</span>
                            <div className="bg-tertiary rounded-full p-1 shrink-0 shadow-md">
                                <img src={getAvatarUrl(myRank.avatar)} alt="user-avatar" className="h-10 w-10 rounded-full object-cover" />
                            </div>
                            <span
                                className="truncate max-w-30 md:max-w-xs font-semibold"
                                title={`${myRank.username} (You)`}
                            >
                                {myRank.username} (You)
                            </span>
                        </div>
                        <div className="flex items-center gap-4 md:gap-8 text-right">
                            <span title="Total XP" className="font-bold whitespace-nowrap">{myRank.totalXp} xp</span>
                            <span title="Alphabet Collected" className="font-bold whitespace-nowrap w-12 md:w-16 text-center">{myRank.wordsCollected || 0}/26</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}