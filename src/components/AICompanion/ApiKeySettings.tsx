import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface ApiKeySettingsProps {
    apiKey: string;
    onSave: (key: string) => void;
}

export const ApiKeySettings: React.FC<ApiKeySettingsProps> = ({ apiKey, onSave }) => {
    const [tempKey, setTempKey] = useState(apiKey);

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
            className="overflow-hidden bg-zinc-50/50 dark:bg-zinc-900/30 border-b border-zinc-200/50 dark:border-zinc-800/50"
        >
            <form onSubmit={handleSubmit} className="p-4 space-y-3">
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
                {apiKey ? (
                    <p className="text-[10px] text-zinc-500 dark:text-zinc-400">
                        Đã lưu key (đầu: {apiKey.substring(0, 6)}...)
                    </p>
                ) : (
                    <p className="text-[10px] text-zinc-500 dark:text-zinc-500">
                        Chưa có key. Vui lòng nhập để sử dụng AI.
                    </p>
                )}
            </form>
        </motion.div>
    );
};
