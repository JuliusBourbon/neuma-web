import { useState, useEffect } from "react";
import { getQuests, claimQuest } from "../../../services/api/questService";

export function useQuest(lang) {
    const [quests, setQuests] = useState(() => {
        try {
            const cached = localStorage.getItem("questData");
            if (cached) return JSON.parse(cached);
        } catch {}
        return [];
    });
    
    const [isInitializing, setIsInitializing] = useState(() => {
        return !localStorage.getItem("questData");
    });
    
    const [error, setError] = useState(null);
    const [claimingQuestId, setClaimingQuestId] = useState(null);

    const fetchQuests = async (showLoading = true) => {
        if (showLoading) setIsInitializing(true);
        try {
            const data = await getQuests();
            setQuests(data.quests || []);
            localStorage.setItem("questData", JSON.stringify(data.quests || []));
        } catch (err) {
            setError(err.message || (lang === 'id' ? "Gagal memuat quest." : "Failed to load quests."));
        } finally {
            if (showLoading) setIsInitializing(false);
        }
    };

    useEffect(() => {
        fetchQuests();
    }, []);

    const handleClaim = async (questId) => {
        if (claimingQuestId) return; // Prevent multiple clicks
        setClaimingQuestId(questId);
        try {
            await claimQuest(questId);
            // Refresh quest list after claiming without global loading
            await fetchQuests(false);
        } catch (err) {
            alert(err.message || (lang === 'id' ? "Gagal mengklaim quest." : "Failed to claim quest."));
        } finally {
            setClaimingQuestId(null);
        }
    };

    return { quests, isInitializing, error, claimingQuestId, handleClaim };
}
