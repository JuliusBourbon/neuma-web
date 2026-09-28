import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoadingOverlay from "../../../components/common/LoadingOverlay";
import QuestItemCard from "../components/QuestItemCard";
import { useQuest } from "../hooks/useQuest";
import PageHeader from "../../../components/layout/PageHeader";

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
        <div className="h-[calc(100vh-64px)] md:h-screen bg-primary flex flex-col overflow-hidden relative">
            <PageHeader
                title={lang === 'id' ? "Misi" : "Quest"}
                showBackButton={true}
                backButtonPath="/home"
            />

            {isInitializing ? (
                <LoadingOverlay message={lang === 'id' ? "Memuat quest..." : "Loading quests..."} />
            ) : (
                <div className="flex-1 overflow-y-auto pb-20 py-2 custom-scrollbar">
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