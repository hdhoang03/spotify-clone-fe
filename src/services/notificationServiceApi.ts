import api from './api';

// Định nghĩa Interface chuẩn theo class NotificationResponse ở Backend
export interface NotificationItem {
    id: string;
    type: string;
    title: string;
    message: string;
    targetUrl?: string;
    thumbnail?: string;
    createdAt: string;
    isRead: boolean; // Trạng thái đã đọc hay chưa (Cần thiết cho giao diện)
}

export const NotificationService = {
    // Lấy danh sách thông báo của tôi (có phân trang)
    getMyNotifications: async (page: number = 1, size: number = 10) => {
        const response = await api.get(`/notification/my?page=${page}&size=${size}`);
        return response.data.result;
    },

    // Lấy số lượng thông báo chưa đọc (để hiển thị chấm đỏ trên icon chuông)
    getUnreadCount: async () => {
        const response = await api.get('/notification/unread-count');
        return response.data.result;
    },

    // Đánh dấu 1 thông báo là đã đọc
    markAsRead: async (notificationId: string) => {
        const response = await api.put(`/notification/${notificationId}/read`);
        return response.data.result;
    },

    // Đánh dấu TẤT CẢ là đã đọc
    markAllAsRead: async () => {
        const response = await api.put('/notification/read-all');
        return response.data.result;
    },

    // Xóa 1 thông báo theo ID
    deleteNotification: async (notificationId: string) => {
        const response = await api.delete(`/notification/${notificationId}/delete`);
        return response.data;
    },
};