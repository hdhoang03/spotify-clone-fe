import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings2, Trash2, X, Send } from 'lucide-react';
import { ApiKeySettings } from './ApiKeySettings';
import { MessageList } from './MessageList';
import { QuickActions } from './QuickActions';
import type { Message } from './types';

interface ChatDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    apiKey: string;
    onSaveKey: (key: string) => void;
    messages: Message[];
    onClearChat: () => void;
    onSendMessage: (text?: string) => void;
    isLoading: boolean;
    errorMsg: string | null;
    currentSong: any;
    triggerQuickAction: (type: 'explain' | 'translate' | 'recommend' | 'chat') => void;
}

export const ChatDrawer: React.FC<ChatDrawerProps> = ({
    isOpen, onClose, apiKey, onSaveKey, messages, onClearChat,
    onSendMessage, isLoading, errorMsg, currentSong, triggerQuickAction
}) => {
    const [showKeySettings, setShowKeySettings] = useState(false);
    const [inputValue, setInputValue] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputValue.trim()) {
            onSendMessage(inputValue);
            setInputValue('');
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, x: 400 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 400 }}
                    transition={{ type: 'spring', damping: 28, stiffness: 260 }}
                    className="fixed top-0 right-0 z-50 w-full md:w-[420px] h-full shadow-[0_0_50px_rgba(0,0,0,0.1)] dark:shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col
                        bg-white/95 dark:bg-[#0A0A0A]/95 backdrop-blur-2xl border-l border-zinc-200/50 dark:border-zinc-800/50 text-zinc-900 dark:text-zinc-100"
                >
                    {/* Header */}
                    <div className="px-5 py-4 border-b border-zinc-200/50 dark:border-zinc-800/50 flex items-center justify-between">
                        <div>
                            <h3 className="font-semibold text-[15px] tracking-tight">Springtunes AI</h3>
                            <div className="flex items-center gap-2 mt-0.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse" />
                                <span className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">Ready to assist</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => setShowKeySettings(!showKeySettings)}
                                className={`p-2 rounded-full transition-colors ${showKeySettings ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100' : 'hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 dark:text-zinc-500'}`}
                                title="Cấu hình"
                            >
                                <Settings2 className="w-4 h-4" />
                            </button>
                            <button
                                onClick={onClearChat}
                                className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 dark:text-zinc-500 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                                title="Xóa lịch sử"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 dark:text-zinc-500 transition-colors"
                                title="Đóng"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    <AnimatePresence>
                        {showKeySettings && (
                            <ApiKeySettings apiKey={apiKey} onSave={(key) => { onSaveKey(key); setShowKeySettings(false); }} />
                        )}
                    </AnimatePresence>

                    {/* Messages */}
                    <MessageList messages={messages} isLoading={isLoading} errorMsg={errorMsg} />

                    {/* Footer / Input Area */}
                    <div className="p-4 border-t border-zinc-200/50 dark:border-zinc-800/50 bg-white/50 dark:bg-[#0A0A0A]/50 space-y-4">
                        <QuickActions
                            currentSong={currentSong}
                            isLoading={isLoading}
                            onAction={(type) => {
                                triggerQuickAction(type);
                            }}
                        />

                        {currentSong && (
                            <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/50 dark:border-zinc-800/50">
                                <img
                                    src={currentSong.coverUrl}
                                    alt={currentSong.title}
                                    className="w-9 h-9 rounded-md object-cover shadow-sm"
                                />
                                <div className="flex-1 min-w-0">
                                    <p className="text-[13px] font-semibold text-zinc-900 dark:text-zinc-100 truncate">{currentSong.title}</p>
                                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">{currentSong.artist}</p>
                                </div>
                                <div className="flex h-3 items-end gap-0.5 opacity-50 px-2">
                                    <span className="w-0.5 h-full bg-primary-500 animate-pulse" />
                                    <span className="w-0.5 h-[60%] bg-primary-500 animate-pulse delay-75" />
                                    <span className="w-0.5 h-[80%] bg-primary-500 animate-pulse delay-150" />
                                </div>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="flex gap-2">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="Hỏi tôi bất cứ điều gì..."
                                disabled={isLoading}
                                className="flex-1 px-4 py-3 text-[13px] rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#121212] focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 transition-colors disabled:opacity-50 placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
                            />
                            <button
                                type="submit"
                                disabled={!inputValue.trim() || isLoading}
                                className="p-3 rounded-xl text-white bg-primary-500 hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shrink-0 flex items-center justify-center w-12 h-12"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </form>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
