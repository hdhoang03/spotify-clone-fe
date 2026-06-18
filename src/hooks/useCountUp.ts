import { useState, useEffect } from 'react';

/**
 * useCountUp — Đếm số từ 0 lên target khi component mount.
 *
 * @param target   - Số đích (number hoặc string có thể parse được, e.g. "1,234")
 * @param duration - Thời gian animation (ms), mặc định 1200ms
 * @returns        - Giá trị hiện tại dạng number hoặc string đã format
 */
export function useCountUp(target: number | string, duration = 1200): number | string {
    const [count, setCount] = useState(0);

    const numericTarget =
        typeof target === 'string'
            ? parseFloat(target.replace(/,/g, ''))
            : target;

    useEffect(() => {
        if (isNaN(numericTarget) || numericTarget === 0) return;

        let current = 0;
        const step = numericTarget / (duration / 16);

        const timer = setInterval(() => {
            current += step;
            if (current >= numericTarget) {
                setCount(numericTarget);
                clearInterval(timer);
            } else {
                setCount(Math.floor(current));
            }
        }, 16);

        return () => clearInterval(timer);
    }, [numericTarget, duration]);

    // Trả về string nếu input là string để giữ nguyên format gốc (e.g. "1,234")
    return typeof target === 'string' ? count.toLocaleString() : count;
}
