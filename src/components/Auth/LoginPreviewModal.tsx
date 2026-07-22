import { motion, AnimatePresence } from 'framer-motion';
import { Music, Lock } from 'lucide-react';
import React from 'react';

interface LoginPreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLoginClick: () => void;
}

const LoginPreviewModal = ({ isOpen, onClose, onLoginClick }: LoginPreviewModalProps) => {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop mờ */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 15 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 15 }}
                        className="relative w-full max-w-sm bg-white dark:bg-zinc-900 rounded-lg shadow-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800/80 p-6 flex flex-col items-center text-center select-none"
                    >
                        {/* Premium Crown/Lock Circle Icon */}
                        <div className="w-16 h-16 bg-primary-100 dark:bg-primary-500/10 rounded-full flex items-center justify-center mb-5 text-primary-600 dark:text-primary-500 animate-bounce">
                            <Lock size={28} />
                        </div>

                        <h3 className="text-2xl font-black tracking-tight text-zinc-950 dark:text-white mb-3">
                            Bạn đang nghe thử 20s
                        </h3>
                        <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed mb-6 px-1">
                            Hãy đăng nhập hoặc tạo tài khoản miễn phí để thưởng thức trọn vẹn bản nhạc chất lượng cao, không giới hạn thời gian và lưu bài hát yêu thích.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col gap-3 w-full">
                            <button
                                onClick={onLoginClick}
                                className="w-full py-3 rounded-full font-bold text-black bg-primary-500 hover:bg-primary-400 shadow-lg shadow-primary-500/20 transition-transform active:scale-95 text-sm"
                            >
                                Đăng nhập ngay
                            </button>
                            <button
                                onClick={onClose}
                                className="w-full py-2.5 rounded-full font-bold text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-white transition-colors text-xs"
                            >
                                Bỏ qua
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default LoginPreviewModal;
