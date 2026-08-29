import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';

interface ApiKeySettingsProps {
    apiKey: string;
    onSave: (key: string) => void;
}

export const ApiKeySettings: React.FC<ApiKeySettingsProps> = ({ apiKey, onSave }) => {
    const [tempKey, setTempKey] = useState(apiKey);
    const [showDisclaimer, setShowDisclaimer] = useState(false);

    useEffect(() => {
        setTempKey(apiKey);
    }, [apiKey]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(tempKey.trim());
    };

    return (
        <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-zinc-50/50 dark:bg-zinc-900/30 border-b border-zinc-200/50 dark:border-zinc-800/50 shrink-0"
        >
            <div className="overflow-y-auto max-h-[60vh]">
            <form onSubmit={handleSubmit} className="p-4 space-y-3">
                {/* Header row */}
                <div className="flex items-center justify-between">
                    <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400">
                        Gemini API Key
                    </label>
                    <a
                        href="https://aistudio.google.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 hover:underline transition-colors"
                    >
                        Get free API key ↗
                    </a>
                </div>

                {/* Input + Save */}
                <div className="flex gap-2">
                    <input
                        type="password"
                        value={tempKey}
                        onChange={(e) => setTempKey(e.target.value)}
                        placeholder="Nhập API Key..."
                        className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#121212] focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-600 transition-all placeholder:text-zinc-400"
                    />
                    <button
                        type="submit"
                        className="px-3 py-1.5 text-xs font-medium rounded-lg text-white bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 transition-colors"
                    >
                        Lưu
                    </button>
                </div>

                {/* Status */}
                {apiKey ? (
                    <p className="text-[10px] text-zinc-500 dark:text-zinc-400">
                        Đã lưu key (đầu: {apiKey.substring(0, 6)}...)
                    </p>
                ) : (
                    <p className="text-[10px] text-zinc-500 dark:text-zinc-500">
                        Chưa có key. Vui lòng nhập để sử dụng AI.
                    </p>
                )}

                {/* Disclaimer toggle */}
                <button
                    type="button"
                    onClick={() => setShowDisclaimer(v => !v)}
                    className="flex items-center gap-1.5 text-[10px] text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors w-full"
                >
                    <ShieldCheck size={11} className="shrink-0 text-emerald-500" />
                    <span>Tại sao bạn phải tự nhập key? Dữ liệu của bạn được bảo vệ như thế nào?</span>
                    {showDisclaimer
                        ? <ChevronUp size={11} className="ml-auto shrink-0" />
                        : <ChevronDown size={11} className="ml-auto shrink-0" />}
                </button>

                <AnimatePresence>
                    {showDisclaimer && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                        >
                            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-3 space-y-3 text-[10px] leading-relaxed text-zinc-500 dark:text-zinc-400">

                                {/* Lý do tự nhập key */}
                                <div className="flex gap-2">
                                    <ShieldCheck size={13} className="shrink-0 mt-0.5 text-emerald-500" />
                                    <div>
                                        <p className="font-semibold text-zinc-700 dark:text-zinc-200 mb-0.5">Tại sao bạn phải tự nhập API key?</p>
                                        <p>
                                            Springtunes AI sử dụng Gemini API của Google. Mỗi API key gắn với tài khoản Google cá nhân của bạn, kèm theo hạn mức miễn phí riêng.
                                            Nếu server lưu một key dùng chung, toàn bộ người dùng sẽ chia sẻ hạn mức đó và nhanh chóng bị giới hạn.
                                            Bằng cách tự nhập key, bạn sở hữu hoàn toàn hạn mức sử dụng của mình.
                                        </p>
                                    </div>
                                </div>

                                <hr className="border-zinc-100 dark:border-zinc-800" />

                                {/* Bảo mật phía server */}
                                <div className="flex gap-2">
                                    <ShieldCheck size={13} className="shrink-0 mt-0.5 text-emerald-500" />
                                    <div>
                                        <p className="font-semibold text-zinc-700 dark:text-zinc-200 mb-0.5">Key của bạn không bao giờ lên server</p>
                                        <p>
                                            API key được lưu trên trình duyệt của bạn và gọi thẳng đến Google AI từ máy bạn.
                                            Springtunes server <span className="font-semibold text-zinc-700 dark:text-zinc-300">không bao giờ nhận, lưu hay đọc</span> API key của bạn.
                                            Không ai — kể cả đội ngũ phát triển — có thể lấy được key này.
                                        </p>
                                    </div>
                                </div>

                                <hr className="border-zinc-100 dark:border-zinc-800" />

                                {/* Cảnh báo localStorage */}
                                <div className="flex gap-2">
                                    <AlertTriangle size={13} className="shrink-0 mt-0.5 text-amber-500" />
                                    <div>
                                        <p className="font-semibold text-amber-600 dark:text-amber-400 mb-0.5">Lưu ý bảo mật thiết bị</p>
                                        <p>
                                            Key được lưu trong <code className="px-1 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 font-mono">localStorage</code> của trình duyệt.
                                            Đây là vùng nhớ cục bộ trên máy bạn, <span className="font-semibold text-zinc-700 dark:text-zinc-300">không thể bị đọc từ xa</span>.
                                            Tuy nhiên, nếu thiết bị của bạn bị nhiễm mã độc (malware/spyware), kẻ tấn công có thể đọc localStorage.
                                            Để an toàn: chỉ sử dụng trên thiết bị cá nhân tin cậy, và xóa key khi không cần.
                                        </p>
                                    </div>
                                </div>

                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </form>
            </div>
        </motion.div>
    );
};
