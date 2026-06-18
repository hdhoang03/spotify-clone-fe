import api from "./api";

export const likeApi = {
    // Gọi API lấy danh sách bài hát đã thích
    getMyLikedSongs: (page = 1, size = 10) =>
        api.get(`/like/my?page=${page}&size=${size}`),
};