import apiClient from '../config/api';

export const chatService = {
    getActiveUsers: async () => {
        const response = await apiClient.get('/api/v1/chat/users');
        return response.data;
    },

    getChatHistory: async (userId: string) => {
        const response = await apiClient.get(`/api/v1/chat/history/${userId}`);
        return response.data;
    },

    markRead: async (userId: string) => {
        const response = await apiClient.put(`/api/v1/chat/read/${userId}`);
        return response.data;
    }
};
