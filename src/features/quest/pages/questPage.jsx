import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoadingOverlay from "../../../components/common/LoadingOverlay";
import QuestItemCard from "../components/QuestItemCard";
import { useQuest } from "../hooks/useQuest";

export default function QuestPage() {
    const navigate = useNavigate();
    const [user] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem("user") || "{}");
        } catch {
            return {};
        }
    });
    const lang = user?.preferredLanguage || 'id';

    const { quests, isInitializing, error, claimingQuestId, handleClaim } = useQuest(lang);

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
                <h3 className="text-lg md:text-xl font-medium text-secondary">{lang === 'id' ? "Selesaikan misi dan dapatkan coin!" : "Complete quests and earn coins!"}</h3>
            </div>

            {isInitializing ? (
                <LoadingOverlay message={lang === 'id' ? "Memuat quest..." : "Loading quests..."} />
            ) : (
                <div className="flex-1 overflow-y-auto pb-20 mt-6 py-2 custom-scrollbar">
                    <div className="flex flex-col items-center w-full max-w-3xl mx-auto px-4 gap-4">
                        {error ? (
                        <div className="text-red-500 mt-10 font-medium">{error}</div>
                    ) : quests.length === 0 ? (
                        <div className="text-gray-500 mt-10">{lang === 'id' ? "Belum ada quest yang tersedia." : "No quests available."}</div>
                    ) : (
                        quests.map((quest) => (
                            <QuestItemCard 
                                key={quest.id} 
                                quest={quest} 
                                claimingQuestId={claimingQuestId} 
                                handleClaim={handleClaim} 
                                lang={lang} 
                            />
                        ))
                    )}
                </div>
            </div>
            )}
        </div>
    );
}