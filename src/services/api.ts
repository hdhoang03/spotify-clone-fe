// // src/services/api.ts
// import axios from 'axios';

// const api = axios.create({
//     baseURL: 'http://localhost:8080/spotify',
//     headers: { 'Content-Type': 'application/json' },
// });

// // Request Interceptor: Luôn đính kèm token mới nhất vào mỗi request
// api.interceptors.request.use((config) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
// });

// // Response Interceptor: Xử lý khi token hết hạn
// api.interceptors.response.use(
//     (response) => response,
//     async (error) => {
//         const originalRequest = error.config;

//         // Nếu gặp lỗi 401 và request này chưa từng thử retry
//         if (error.response?.status === 401 && !originalRequest._retry) {
//             originalRequest._retry = true;

//             try {
//                 const currentToken = localStorage.getItem('token');
//                 // Gọi API refresh (sử dụng chính axios gốc để tránh lặp vô tận)
//                 const res = await axios.post('http://localhost:8080/spotify/auth/refresh', {
//                     token: currentToken
//                 });

//                 if (res.data.code === 1000) {
//                     const newToken = res.data.result.token;
//                     localStorage.setItem('token', newToken);

//                     // Gán token mới vào request cũ và thực hiện lại
//                     originalRequest.headers.Authorization = `Bearer ${newToken}`;
//                     return api(originalRequest);
//                 }
//             } catch (refreshError) {
//                 // Nếu refresh cũng lỗi -> Token đã chết hẳn, xóa sạch data
//                 localStorage.removeItem('token');
//                 localStorage.removeItem('user');
//                 window.location.href = '/';
//             }
//         }
//         return Promise.reject(error);
//     }
// );

// export default api;

// src/services/api.ts
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/spotify',
    headers: { 'Content-Type': 'application/json' },
});

// 1. Request Interceptor: Tự đính kèm Token vào mỗi yêu cầu
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// 2. Response Interceptor: Xử lý khi Token hết hạn (Lỗi 401)
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Nếu lỗi 401 và chưa thử Refresh lần nào
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const token = localStorage.getItem('token');

            try {
                // Gọi API Refresh của bạn
                // Dùng axios gốc để tránh bị Interceptor này bắt lại gây lặp vô tận
                const res = await axios.post('http://localhost:8080/spotify/auth/refresh', { token });

                if (res.data.code === 1000) {
                    const newToken = res.data.result.token;
                    localStorage.setItem('token', newToken);

                    // Thực hiện lại yêu cầu cũ với Token mới
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                    return api(originalRequest);
                }
            } catch (refreshError) {
                // Nếu refresh cũng thất bại (token đã chết hẳn) -> Đăng xuất
                localStorage.clear();
                window.location.href = '/';
            }
        }
        return Promise.reject(error);
    }
);

export default api;