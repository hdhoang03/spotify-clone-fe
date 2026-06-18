import { useEffect, useRef } from 'react';

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080';
const SSE_ENDPOINT = `${BASE_URL}/notification/stream`;

// Thời gian chờ tối đa để xác nhận SSE kết nối được
const SSE_CONNECT_TIMEOUT_MS = 5000;
// Thời gian chờ trước khi reconnect khi SSE bị lỗi
const SSE_RECONNECT_DELAY_MS = 3000;
// Polling fallback interval (khi SSE không khả dụng)
const FALLBACK_POLL_MS = 30000;

interface UseNotificationSSEOptions {
    /** Có user đang đăng nhập không (SSE chỉ kết nối khi có user) */
    enabled: boolean;
    /** Callback được gọi mỗi khi server push số thông báo chưa đọc mới */
    onUnreadCount: (count: number) => void;
    /** Fallback: hàm fetch count thủ công (dùng khi SSE không khả dụng) */
    fetchCount: () => Promise<void>;
}

/**
 * Hook quản lý kết nối SSE để nhận thông báo real-time từ server.
 *
 * Chiến lược:
 *  1. Mở EventSource tới /notification/stream (yêu cầu token qua query param vì
 *     EventSource không hỗ trợ custom header).
 *  2. Nếu server không hỗ trợ SSE hoặc kết nối thất bại sau SSE_CONNECT_TIMEOUT_MS,
 *     tự động fallback sang polling mỗi FALLBACK_POLL_MS giây.
 *  3. Tạm dừng hoàn toàn khi tab bị ẩn (Page Visibility API).
 *  4. Tự reconnect sau SSE_RECONNECT_DELAY_MS nếu SSE bị ngắt đột ngột.
 */
export const useNotificationSSE = ({
    enabled,
    onUnreadCount,
    fetchCount,
}: UseNotificationSSEOptions) => {
    // Ref để track xem SSE có đang hoạt động không (tránh bật fallback poll song song)
    const sseActiveRef = useRef(false);
    const eventSourceRef = useRef<EventSource | null>(null);
    const fallbackIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const connectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (!enabled) {
            cleanup();
            return;
        }

        // Fetch ngay khi mount
        fetchCount();

        connectSSE();

        // Xử lý tab visibility
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                fetchCount(); // Fetch ngay khi quay lại tab
                if (!sseActiveRef.current) {
                    // SSE đang dùng fallback → restart interval
                    startFallbackPolling();
                }
                // Nếu SSE đã active thì không cần làm gì, server sẽ push
            } else {
                stopFallbackPolling();
                // Không đóng SSE khi ẩn tab — giữ kết nối để nhận event khi quay lại
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            cleanup();
        };
    }, [enabled]);

    const getToken = (): string | null => {
        return localStorage.getItem('token');
    };

    const connectSSE = () => {
        const token = getToken();
        if (!token) {
            // Không có token → dùng polling
            startFallbackPolling();
            return;
        }

        // EventSource không hỗ trợ Authorization header
        // → truyền token qua query param (backend cần hỗ trợ ?token=...)
        const url = `${SSE_ENDPOINT}?token=${encodeURIComponent(token)}`;
        const es = new EventSource(url, { withCredentials: false });
        eventSourceRef.current = es;

        // Đặt timeout: nếu sau SSE_CONNECT_TIMEOUT_MS chưa nhận được event nào
        // → coi như backend không hỗ trợ SSE, fallback polling
        connectTimeoutRef.current = setTimeout(() => {
            if (!sseActiveRef.current) {
                console.warn('[SSE] Không nhận được event sau timeout → fallback polling');
                es.close();
                startFallbackPolling();
            }
        }, SSE_CONNECT_TIMEOUT_MS);

        // Server gửi event tên "unread-count" với data là số nguyên
        es.addEventListener('unread-count', (e: MessageEvent) => {
            clearTimeout(connectTimeoutRef.current!);
            sseActiveRef.current = true;
            stopFallbackPolling(); // Hủy polling nếu đang chạy
            const count = parseInt(e.data, 10);
            if (!isNaN(count)) {
                onUnreadCount(count);
            }
        });

        // Heartbeat event (server gửi định kỳ để giữ kết nối sống)
        es.addEventListener('ping', () => {
            sseActiveRef.current = true;
            clearTimeout(connectTimeoutRef.current!);
        });

        es.onerror = () => {
            console.warn('[SSE] Mất kết nối, thử reconnect sau', SSE_RECONNECT_DELAY_MS, 'ms');
            es.close();
            sseActiveRef.current = false;
            eventSourceRef.current = null;

            // Bật polling tạm trong thời gian chờ reconnect
            startFallbackPolling();

            // Thử reconnect sau một khoảng thời gian
            reconnectTimerRef.current = setTimeout(() => {
                stopFallbackPolling();
                connectSSE();
            }, SSE_RECONNECT_DELAY_MS);
        };
    };

    const startFallbackPolling = () => {
        if (fallbackIntervalRef.current) return; // Đã đang chạy
        if (document.visibilityState !== 'visible') return; // Tab đang ẩn
        fallbackIntervalRef.current = setInterval(fetchCount, FALLBACK_POLL_MS);
    };

    const stopFallbackPolling = () => {
        if (fallbackIntervalRef.current) {
            clearInterval(fallbackIntervalRef.current);
            fallbackIntervalRef.current = null;
        }
    };

    const cleanup = () => {
        // Đóng SSE
        eventSourceRef.current?.close();
        eventSourceRef.current = null;
        sseActiveRef.current = false;

        // Dọn tất cả timer
        stopFallbackPolling();
        if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
        if (connectTimeoutRef.current) clearTimeout(connectTimeoutRef.current);
    };
};
