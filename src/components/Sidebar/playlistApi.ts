import api from "../../services/api";

export interface UserSummaryResponse {
    id: string;
    username: string;
    avatarUrl: string;
}

export interface PlaylistResponse {
    id: string;
    name: string;
    description: string;
    coverUrl: string;
    isPublic: boolean;
    createdAt: string;
    user: UserSummaryResponse;
    songCount: number;
}

export const playlistApi = {
    // 1. Lấy danh sách playlist CỦA TÔI (Sidebar sẽ dùng cái này)
    getMyPlaylists: (page = 1, size = 50) =>
        api.get(`/playlist/my?page=${page}&size=${size}`),

    // 2. Lấy playlist của MỘT USER KHÁC (Trang Profile dùng)
    getUserPlaylists: (targetUserId: string, page = 1, size = 50) =>
        api.get(`/playlist/${targetUserId}/user?page=${page}&size=${size}`),

    // 3. Lấy chi tiết 1 playlist (Trang Playlist Detail dùng)
    getPlaylistById: (playlistId: string) =>
        api.get(`/playlist/${playlistId}`),

    // 4. Tạo mới playlist (Gửi FormData vì có thể sau này cho up ảnh luôn)
    createPlaylist: (formData: FormData) =>
        api.post('/playlist/create', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        }),

    // 5. Cập nhật playlist
    updatePlaylist: (playlistId: string, formData: FormData) =>
        api.put(`/playlist/${playlistId}/update`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        }),

    // 6. Xóa playlist
    deletePlaylist: (playlistId: string) =>
        api.delete(`/playlist/${playlistId}/delete`),

    // 7. Thêm bài hát vào playlist
    addSong: (playlistId: string, songId: string) =>
        api.post(`/playlist/${playlistId}/add/${songId}`),

    // 8. Xóa bài hát khỏi playlist
    removeSong: (playlistId: string, songId: string) =>
        api.delete(`/playlist/${playlistId}/remove/${songId}`),

    // 9. Lấy danh sách bài hát trong playlist
    getPlaylistSongs: (playlistId: string, page = 1, size = 20) =>
        api.get(`/playlist/${playlistId}/songs?page=${page}&size=${size}`),
};