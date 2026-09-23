import { api } from './apiClient';

export const getQuests = async () => {
    const response = await api.get('/quests');
    return response.data;
};

export const claimQuest = async (questId) => {
    const response = await api.post(`/quests/${questId}/claim`);
    return response.data;
};
