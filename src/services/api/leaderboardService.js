import { api } from './apiClient';

export const leaderboardService = {
    getTop: async () => {
        const response = await api.get('/leaderboard/top');
        return response;
    },
    getMyRank: async () => {
        const response = await api.get('/leaderboard/me');
        return response;
    }
};
