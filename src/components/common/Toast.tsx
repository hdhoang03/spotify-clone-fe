import { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';

export type ToastType = 'error' | 'success' | 'info' | 'warning';

interface ToastProps {
    message: string;
    type?: ToastType;
    duration?: number;       // ms, mặc định 3000
    onClose: () => void;
}

// Sub-component: Toast Icon
const ToastIcon = ({ type }: { type: ToastType }) => {
    switch (type) {
        case 'error':
            return <AlertCircle size={20} className="shrink-0 text-red-500 dark:text-red-400" />;
        case 'success':
            return <CheckCircle2 size={20} className="shrink-0 text-primary-500 dark:text-primary-400" />;
        case 'warning':
            return <AlertCircle size={20} className="shrink-0 text-amber-500 dark:text-amber-400" />;
        case 'info':
        default:
            return <Info size={20} className="shrink-0 text-sky-500 dark:text-sky-400" />;
    }
};

// Sub-component: Toast Close Button
const ToastCloseButton = ({ onClick }: { onClick: () => void }) => {
    return (
        <button
            onClick={onClick}
            className="shrink-0 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors p-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
            aria-label="Close"
        >
            <X size={16} />
        </button>
    );
};

// Border styles mapping light/dark
const borderStyles: Record<ToastType, string> = {
    error: 'border-red-500/20 dark:border-red-500/30',
    success: 'border-primary-500/20 dark:border-primary-500/30',
    warning: 'border-amber-500/20 dark:border-amber-500/30',
    info: 'border-sky-500/20 dark:border-sky-500/30',
};

/**
 * Toast — thông báo ngắn tự đóng sau `duration` ms.
 */
const Toast = ({ message, type = 'info', duration = 3000, onClose }: ToastProps) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        // Trigger enter animation
        const enterTimer = setTimeout(() => setVisible(true), 10);
        // Bắt đầu exit animation trước khi unmount
        const exitTimer = setTimeout(() => setVisible(false), duration - 300);
        // Unmount sau khi animation exit hoàn tất
        const closeTimer = setTimeout(onClose, duration);

        return () => {
            clearTimeout(enterTimer);
            clearTimeout(exitTimer);
            clearTimeout(closeTimer);
        };
    }, [duration, onClose]);

    const handleManualClose = () => {
        setVisible(false);
        setTimeout(onClose, 300);
    };

    return (
        <div
            className={`
                fixed bottom-28 left-1/2 z-[9999]
                flex items-center gap-3.5
                px-4 py-3.5 rounded-xl
                
                /* Đồng bộ nền: Sáng thì trắng đục, tối thì đen đục (backdrop-blur) */
                bg-white/85 dark:bg-zinc-900/85
                backdrop-blur-xl
                
                /* Border tinh tế đồng bộ loại Toast */
                border ${borderStyles[type]}
                
                /* Bóng đổ mềm mại */
                shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)]
                
                /* Màu chữ đồng bộ */
                text-zinc-800 dark:text-zinc-200
                text-sm font-medium
                
                /* Responsive width: Tránh bị bóp lại trên điện thoại */
                w-[calc(100%-2rem)] max-w-[420px] 
                md:w-max md:max-w-md
                
                transition-all duration-300 ease-out
                ${visible
                    ? 'opacity-100 translate-x-[-50%] translate-y-0 scale-100'
                    : 'opacity-0 translate-x-[-50%] translate-y-4 scale-95'
                }
            `}
            role="alert"
            aria-live="assertive"
        >
            <ToastIcon type={type} />
            <span className="flex-1 leading-snug break-words pr-1">{message}</span>
            <ToastCloseButton onClick={handleManualClose} />
        </div>
    );
};

export default Toast;
