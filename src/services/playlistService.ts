import axios from 'axios';

const API_URL = 'http://localhost:8080/spotify/playlist';

export const playlistService = {
    // Lấy danh sách playlist của tôi
    getMyPlaylists: async (page = 1, size = 10) => {
        const response = await axios.get(`${API_URL}/my?page=${page}&size=${size}`);
        return response.data;
    },

    // Thêm bài hát vào playlist
    addSongToPlaylist: async (playlistId: string, songId: string) => {
        const response = await axios.post(`${API_URL}/${playlistId}/add/${songId}`);
        return response.data;
    },

    // Xóa bài hát khỏi playlist
    removeSongFromPlaylist: async (playlistId: string, songId: string) => {
        const response = await axios.delete(`${API_URL}/${playlistId}/remove/${songId}`);
        return response.data;
    }
};