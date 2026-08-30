import axios from 'axios';
import { clearSession, getUICache } from '../utils/userStorage';

// Lấy URL từ biến môi trường (nếu có, hỗ trợ cho production), ngược lại dùng default
const envApiUrl = import.meta.env.VITE_API_URL;

const defaultUrls = import.meta.env.DEV
    ? [
        'http://localhost:8080/spotify',
        'https://spotify-clone-8xkm.onrender.com',
        // 'https://spotify-clone-production-643e.up.railway.app/spotify'
    ]
    : [
        // 'https://spotify-clone-production-643e.up.railway.app/spotify',
        'https://spotify-clone-8xkm.onrender.com',
        'http://localhost:8080/spotify'
    ];

const BASE_URLS = envApiUrl
    ? envApiUrl.split(',').map((url: string) => url.trim())
    : defaultUrls;

let currentBaseUrlIndex = 0;

export const getBaseUrl = () => BASE_URLS[currentBaseUrlIndex];

const api = axios.create({
    baseURL: getBaseUrl(),
    withCredentials: true, // ← Gửi httpOnly cookie tự động trong mọi request
    headers: {
        // Header giúp API vượt qua màn hình cảnh báo của ngrok
        'ngrok-skip-browser-warning': 'true'
    }
});

// Request Interceptor: Cookie httpOnly được gửi tự động nhờ withCredentials:true
// Không cần đọc localStorage hay gắn Authorization header thủ công nữa.
api.interceptors.request.use((config) => config);

// --- Mutex để tránh race condition khi nhiều request cùng lúc nhận 401 ---
let isRefreshing = false;
let failedQueue: { resolve: (value: any) => void; reject: (reason?: any) => void }[] = [];

const processQueue = (error: any) => {
    failedQueue.forEach((prom) => {
        if (error) prom.reject(error);
        else prom.resolve(undefined);
    });
    failedQueue = [];
};

// Helper: Xóa Content-Type để Axios tự gen boundary đúng khi retry FormData
const clearFormDataContentType = (originalRequest: any) => {
    if (originalRequest.data instanceof FormData) {
        if (originalRequest.headers && typeof originalRequest.headers.delete === 'function') {
            originalRequest.headers.delete('Content-Type');
            originalRequest.headers.delete('content-type');
        } else if (originalRequest.headers) {
            delete originalRequest.headers['Content-Type'];
            delete originalRequest.headers['content-type'];
        }
    }
};

/**
 * Danh sách các endpoint PUBLIC — không yêu cầu xác thực.
 * Khi 401 xảy ra trên các URL này, KHÔNG thử refresh token (tránh spam /auth/refresh
 * và tránh đưa request public vào failedQueue rồi bị reject khi refresh thất bại).
 */
const PUBLIC_ENDPOINTS = [
    '/song/allSongs',
    '/like/top',
    '/stream/top',
    '/albums/all',
    '/artist/all',
    '/song/',         // GET chi tiết bài hát
    '/albums/',       // GET chi tiết album
    '/artist/',       // GET chi tiết nghệ sĩ
];

const isPublicEndpoint = (url: string = ''): boolean =>
    PUBLIC_ENDPOINTS.some((pub) => url.includes(pub));

// Response Interceptor: Xử lý khi Token hết hạn (Lỗi 401) và Rate Limit (Lỗi 429)
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Xử lý fallback URL nếu bị lỗi Network
        if (error.code === 'ERR_NETWORK' && !originalRequest._retryUrl) {
            originalRequest._retryUrl = true;
            currentBaseUrlIndex = (currentBaseUrlIndex + 1) % BASE_URLS.length;
            const newUrl = getBaseUrl();

            api.defaults.baseURL = newUrl;
            originalRequest.baseURL = newUrl;

            clearFormDataContentType(originalRequest);
            return api(originalRequest);
        }

        // Rate limit (429) → throw thẳng để UI hiển thị thông báo
        if (error.response?.status === 429) {
            return Promise.reject(error);
        }

        // Endpoint public bị 401 → reject thẳng, KHÔNG refresh
        // (tránh spam /auth/refresh và tránh xếp vào failedQueue rồi bị reject domino)
        if (error.response?.status === 401 && isPublicEndpoint(originalRequest?.url)) {
            return Promise.reject(error);
        }

        // Chỉ thử refresh khi: lỗi 401 + chưa retry + user đã từng đăng nhập
        // Nếu không có UICache → guest, không refresh để tránh spam request thừa
        const isLoggedIn = getUICache() !== null;
        if (error.response?.status === 401 && !originalRequest._retry && isLoggedIn) {
            if (isRefreshing) {
                // Nếu đang refresh rồi → xếp hàng chờ, retry sau khi refresh xong
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(() => {
                    clearFormDataContentType(originalRequest);
                    return api(originalRequest);
                }).catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                // Không cần gửi token trong body — BE đọc từ cookie tự động
                await axios.post(`${getBaseUrl()}/auth/refresh`, {}, { withCredentials: true });

                clearFormDataContentType(originalRequest);
                processQueue(null);
                return api(originalRequest); // Cookie mới đã được set bởi response
            } catch (refreshError) {
                processQueue(refreshError);
                // Refresh thất bại → xóa session UI, thông báo cho hàng chờ
                clearSession();
                window.dispatchEvent(new Event('user-logout'));
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
