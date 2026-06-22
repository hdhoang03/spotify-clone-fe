import { useEffect, useRef } from 'react';

import api from '../services/api';

// Hàm lấy endpoint dựa vào baseURL hiện tại của api (để hỗ trợ fallback URL)
const getSseEndpoint = () => `${api.defaults.baseURL}/sse/subscribe`;

// Thời gian chờ tối đa để xác nhận SSE kết nối được
const SSE_CONNECT_TIMEOUT_MS = 5000;
// Thời gian chờ trước khi reconnect khi SSE bị lỗi
const SSE_RECONNECT_DELAY_MS = 3000;
// Polling fallback interval (khi SSE không khả dụng)
const FALLBACK_POLL_MS = 30000;

interface UseNotificationSSEOptions {
    /** Có user đang đăng nhập không (SSE chỉ kết nối khi có user) */
    enabled: boolean;
    /** Callback được gọi mỗi khi server push 1 notification mới đến */
    onNewNotification: () => void;
    /** Fallback: hàm fetch count thủ công (dùng khi SSE không khả dụng) */
    fetchCount: () => Promise<void>;
}

/**
 * Hook quản lý kết nối SSE để nhận thông báo real-time từ server.
 *
 * Backend (RabbitMQ → SseService) gửi event tên "NOTIFICATION" với data là JSON object.
 * Hook này lắng nghe event đó và gọi onNewNotification() để trigger re-fetch count.
 *
 * Endpoint: GET /sse/subscribe  (JWT được gắn qua Authorization header thông qua
 *           fetch + ReadableStream polyfill — hoặc dùng token qua query param nếu
 *           backend cho phép).
 *
 * Vì EventSource không hỗ trợ custom header, ta truyền JWT qua ?token=...
 * và backend cần đọc token từ query param trong SecurityConfig.
 */
export const useNotificationSSE = ({
    enabled,
    onNewNotification,
    fetchCount,
}: UseNotificationSSEOptions) => {
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

        // Tạm dừng/tiếp tục khi tab bị ẩn
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                fetchCount();
                if (!sseActiveRef.current) {
                    startFallbackPolling();
                }
            } else {
                stopFallbackPolling();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            cleanup();
        };
    }, [enabled]);

    const getToken = (): string | null => localStorage.getItem('token');

    const connectSSE = () => {
        const token = getToken();
        if (!token) {
            startFallbackPolling();
            return;
        }

        // EventSource không hỗ trợ Authorization header
        // → truyền JWT qua query param (backend SecurityConfig cần cho phép)
        const url = `${getSseEndpoint()}?access_token=${encodeURIComponent(token)}`;
        const es = new EventSource(url, { withCredentials: false });
        eventSourceRef.current = es;

        // Timeout fallback nếu không nhận được event nào
        connectTimeoutRef.current = setTimeout(() => {
            if (!sseActiveRef.current) {
                console.warn('[SSE] Không nhận được event sau timeout → fallback polling');
                es.close();
                startFallbackPolling();
            }
        }, SSE_CONNECT_TIMEOUT_MS);

        // Backend gửi "INIT" khi vừa subscribe thành công
        es.addEventListener('INIT', () => {
            clearTimeout(connectTimeoutRef.current!);
            sseActiveRef.current = true;
            stopFallbackPolling();
            console.info('[SSE] Kết nối thành công');
        });

        // Backend (RabbitMQConsumerService → SseService.sendNotification) gửi event "NOTIFICATION"
        // với data là NotificationResponse JSON object
        es.addEventListener('NOTIFICATION', () => {
            sseActiveRef.current = true;
            clearTimeout(connectTimeoutRef.current!);
            stopFallbackPolling();
            // Re-fetch count để cập nhật badge số thông báo chưa đọc
            fetchCount();
            // Thông báo cho component cha biết có notification mới
            onNewNotification();
        });

        es.onerror = () => {
            console.warn('[SSE] Mất kết nối, thử reconnect sau', SSE_RECONNECT_DELAY_MS, 'ms');
            es.close();
            sseActiveRef.current = false;
            eventSourceRef.current = null;

            startFallbackPolling();

            reconnectTimerRef.current = setTimeout(() => {
                stopFallbackPolling();
                connectSSE();
            }, SSE_RECONNECT_DELAY_MS);
        };
    };

    const startFallbackPolling = () => {
        if (fallbackIntervalRef.current) return;
        if (document.visibilityState !== 'visible') return;
        fallbackIntervalRef.current = setInterval(fetchCount, FALLBACK_POLL_MS);
    };

    const stopFallbackPolling = () => {
        if (fallbackIntervalRef.current) {
            clearInterval(fallbackIntervalRef.current);
            fallbackIntervalRef.current = null;
        }
    };

    const cleanup = () => {
        eventSourceRef.current?.close();
        eventSourceRef.current = null;
        sseActiveRef.current = false;
        stopFallbackPolling();
        if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
        if (connectTimeoutRef.current) clearTimeout(connectTimeoutRef.current);
    };
};
