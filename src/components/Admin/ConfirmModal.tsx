// src/components/Admin/Modals/ConfirmModal.tsx
import { Trash2, RefreshCw, XCircle } from 'lucide-react';

export type ConfirmActionType = 'DELETE_SOFT' | 'DELETE_HARD' | 'RESTORE';

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    type: ConfirmActionType;
    title: string;
    message: string;
    isLoading?: boolean;
}

const ConfirmModal = ({ isOpen, onClose, onConfirm, type, title, message, isLoading = false }: ConfirmModalProps) => {
    if (!isOpen) return null;

    // Cấu hình giao diện dựa trên loại hành động
    const config = {
        DELETE_SOFT: {
            icon: <Trash2 size={48} className="text-orange-500" />,
            confirmBtnColor: 'bg-orange-500 hover:bg-orange-600',
            confirmText: 'Chuyển vào thùng rác'
        },
        DELETE_HARD: {
            icon: <XCircle size={48} className="text-red-600" />,
            confirmBtnColor: 'bg-red-600 hover:bg-red-700',
            confirmText: 'Xóa vĩnh viễn'
        },
        RESTORE: {
            icon: <RefreshCw size={48} className="text-green-500" />,
            confirmBtnColor: 'bg-green-600 hover:bg-green-700',
            confirmText: 'Khôi phục lại'
        }
    };

    const currentConfig = config[type];

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 animate-in fade-in duration-200">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm -mt-20" onClick={onClose} />

            {/* Modal Content */}
            <div className="relative bg-white dark:bg-zinc-900 w-full max-w-sm rounded-2xl shadow-2xl border border-gray-200 dark:border-white/10 overflow-hidden flex flex-col items-center text-center p-6 space-y-4 scale-100 animate-in zoom-in-95 duration-200">

                <div className={`p-4 rounded-full bg-opacity-10 dark:bg-opacity-20 ${type === 'DELETE_HARD' ? 'bg-red-100' : type === 'RESTORE' ? 'bg-green-100' : 'bg-orange-100'}`}>
                    {currentConfig.icon}
                </div>

                <div className="space-y-2">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                        {message}
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-3 w-full pt-2">
                    <button
                        onClick={onClose}
                        className="w-full py-2.5 rounded-xl font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 dark:bg-zinc-800 dark:text-gray-300 dark:hover:bg-zinc-700 transition"
                    >
                        Hủy bỏ
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className={`w-full py-2.5 rounded-xl font-bold text-white shadow-lg shadow-black/20 transition ${currentConfig.confirmBtnColor}`}
                    >
                        {currentConfig.confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;