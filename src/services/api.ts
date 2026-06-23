import axios from 'axios';

// Lấy URL từ biến môi trường (nếu có, hỗ trợ cho production), ngược lại dùng localhost
const envApiUrl = import.meta.env.VITE_API_URL;

let defaultUrls = ['http://localhost:8080/spotify', 'http://localhost:8081/spotify'];
// Tự động ưu tiên link ngrok nếu không chạy ở localhost (đang chạy trên Vercel)
if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    defaultUrls = ['https://faf8-171-244-205-251.ngrok-free.app/spotify', ...defaultUrls];
}

const BASE_URLS = envApiUrl 
    ? envApiUrl.split(',').map((url: string) => url.trim()) 
    : defaultUrls;

let currentBaseUrlIndex = 0;

export const getBaseUrl = () => BASE_URLS[currentBaseUrlIndex];

const api = axios.create({
    baseURL: getBaseUrl(),
    headers: {
        // Cực kỳ quan trọng: Header này giúp API vượt qua màn hình cảnh báo (Warning) của ngrok
        'ngrok-skip-browser-warning': 'true'
    }
});

// 1. Request Interceptor: Tự đính kèm Token vào mỗi yêu cầu
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// --- Mutex để tránh race condition khi nhiều request cùng lúc nhận 401 ---
let isRefreshing = false;
let failedQueue: { resolve: (value: any) => void; reject: (reason?: any) => void }[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

// 2. Response Interceptor: Xử lý khi Token hết hạn (Lỗi 401)
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Xử lý fallback URL nếu bị lỗi Network
        if (error.code === 'ERR_NETWORK' && !originalRequest._retryUrl) {
            originalRequest._retryUrl = true;
            // Chuyển sang URL dự phòng
            currentBaseUrlIndex = (currentBaseUrlIndex + 1) % BASE_URLS.length;
            const newUrl = getBaseUrl();
            
            api.defaults.baseURL = newUrl;
            originalRequest.baseURL = newUrl;

            // Fix lỗi FormData khi Retry bị mất boundary
            if (originalRequest.data instanceof FormData) {
                delete originalRequest.headers['Content-Type'];
            }
            
            return api(originalRequest);
        }

        let token = localStorage.getItem('token');
        if (token === 'null' || token === 'undefined') token = null;

        // Chỉ thử refresh khi: lỗi 401 + có token thực sự + chưa retry
        if (error.response?.status === 401 && !originalRequest._retry && token) {
            if (isRefreshing) {
                // Nếu đang refresh rồi → xếp hàng chờ, không gọi refresh thêm
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then((newToken) => {
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                    return api(originalRequest);
                }).catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const res = await axios.post(`${getBaseUrl()}/auth/refresh`, { token });

                if (res.data.code === 1000) {
                    const newToken = res.data.result.token;
                    localStorage.setItem('token', newToken);
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                    processQueue(null, newToken); // Cho hàng chờ dùng token mới
                    return api(originalRequest);
                } else {
                    throw new Error('Refresh failed');
                }
            } catch (refreshError) {
                // Refresh thất bại → xóa session, thông báo cho hàng chờ
                processQueue(refreshError, null);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                localStorage.removeItem('user_profile');
                window.dispatchEvent(new Event('user-update'));
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        // Guest gọi API yêu cầu auth hoặc API chết → reject bình thường, không redirect
        return Promise.reject(error);
    }
);

export default api;