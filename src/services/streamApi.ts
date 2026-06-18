// src/services/streamApi.ts
import api from './api';

export const streamApi = {
    // Gọi ngay khi bắt đầu phát bài hát
    increasePlayCount: (songId: string) =>
        api.post(`/stream/play/${songId}`),

    // Gọi khi người dùng nghe đủ thời lượng (ví dụ: 30s)
    createStream: (songId: string, duration: number, speed: number = 1.0) =>
        api.post('/stream/create', { songId, duration, speed }),
};