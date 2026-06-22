import api from './api';

export const playlistService = {
    // Lấy danh sách playlist của tôi
    getMyPlaylists: async (page = 1, size = 10) => {
        const response = await api.get(`/playlist/my?page=${page}&size=${size}`);
        return response.data;
    },

    // Thêm bài hát vào playlist
    addSongToPlaylist: async (playlistId: string, songId: string) => {
        const response = await api.post(`/playlist/${playlistId}/add/${songId}`);
        return response.data;
    },

    // Xóa bài hát khỏi playlist
    removeSongFromPlaylist: async (playlistId: string, songId: string) => {
        const response = await api.delete(`/playlist/${playlistId}/remove/${songId}`);
        return response.data;
    }
};