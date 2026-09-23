import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CoinIcon from "../../../components/icons/coinIcon";
import { getQuests, claimQuest } from "../../../services/api/questService";

export default function QuestPage() {
    const navigate = useNavigate();
    const [quests, setQuests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchQuests = async () => {
        setIsLoading(true);
        try {
            const data = await getQuests();
            setQuests(data.quests || []);
        } catch (err) {
            setError(err.message || "Gagal memuat quest.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchQuests();
    }, []);

    const handleClaim = async (questId) => {
        try {
            await claimQuest(questId);
            // Refresh quest list after claiming
            fetchQuests();
        } catch (err) {
            alert(err.message || "Gagal mengklaim quest.");
        }
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
                <h1 className="absolute left-1/2 -translate-x-1/2 text-3xl md:text-4xl py-6 font-bold text-tertiary">Quest</h1>
            </div>

            <div className="flex items-center justify-center shrink-0">
                <h3 className="text-lg md:text-xl font-medium text-secondary">Selesaikan misi dan dapatkan coin!</h3>
            </div>

            <div className="flex-1 overflow-y-auto pb-20 mt-6">
                <div className="flex flex-col items-center w-full max-w-3xl mx-auto px-4 gap-4">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center mt-10">
                            <div className="w-10 h-10 border-4 border-secondary border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : error ? (
                        <div className="text-red-500 mt-10 font-medium">{error}</div>
                    ) : quests.length === 0 ? (
                        <div className="text-gray-500 mt-10">Belum ada quest yang tersedia.</div>
                    ) : (
                        quests.map((quest) => {
                            const isClaimed = quest.status === 'claimed';
                            const isAchieved = quest.status === 'achieved';
                            const title = quest.title.id || quest.title.en;
                            const description = quest.description.id || quest.description.en;

                            return (
                                <div 
                                    key={quest.id} 
                                    className={`flex items-center w-full justify-between px-5 py-4 rounded-2xl shadow-sm border ${
                                        isClaimed ? 'bg-gray-100 border-gray-200 opacity-70' : 
                                        isAchieved ? 'bg-yellow-50 border-yellow-200 ring-2 ring-yellow-400' : 'bg-white border-transparent'
                                    }`}
                                >
                                    <div className="flex flex-col max-w-[70%]">
                                        <span className={`font-bold text-base md:text-lg ${isClaimed ? 'text-gray-500' : 'text-tertiary'}`}>
                                            {title}
                                        </span>
                                        <span className={`text-sm mt-1 leading-snug ${isClaimed ? 'text-gray-400' : 'text-gray-600'}`}>
                                            {description}
                                        </span>
                                        {!isClaimed && !isAchieved && (
                                            <div className="w-full bg-gray-200 h-2 rounded-full mt-3 overflow-hidden">
                                                <div 
                                                    className="bg-secondary h-full transition-all duration-500" 
                                                    style={{ width: `${Math.min((quest.currentProgress / quest.targetValue) * 100, 100)}%` }}
                                                ></div>
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className="flex flex-col items-end justify-center shrink-0">
                                        <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100 mb-2">
                                            <CoinIcon />
                                            <span className="font-bold text-tertiary">{quest.rewardCurrency}</span>
                                        </div>
                                        
                                        {isClaimed ? (
                                            <span className="text-xs font-bold text-gray-400 px-2 uppercase tracking-wide">Selesai</span>
                                        ) : isAchieved ? (
                                            <button 
                                                onClick={() => handleClaim(quest.id)}
                                                className="bg-secondary hover:brightness-110 active:scale-95 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-md shadow-secondary/30 cursor-pointer"
                                            >
                                                Klaim!
                                            </button>
                                        ) : (
                                            <span className="text-xs font-bold text-gray-500 px-2">
                                                {quest.currentProgress} / {quest.targetValue}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}