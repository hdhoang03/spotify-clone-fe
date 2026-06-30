import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings2, Trash2, X, Send } from 'lucide-react';
import { ApiKeySettings } from './ApiKeySettings';
import { MessageList } from './MessageList';
import { QuickActions } from './QuickActions';
import type { Message } from './types';
import { i18n } from './i18n';
import type { ChatLanguage } from './i18n'
import { Globe } from 'lucide-react';

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
    triggerQuickAction: (type: 'explain' | 'translate' | 'recommend' | 'chat' | 'recommend_taste') => void;
    language: ChatLanguage;
    onLanguageChange: (lang: ChatLanguage) => void;
}

export const ChatDrawer: React.FC<ChatDrawerProps> = ({
    isOpen, onClose, apiKey, onSaveKey, messages, onClearChat,
    onSendMessage, isLoading, errorMsg, currentSong, triggerQuickAction,
    language, onLanguageChange
}) => {
    const [showKeySettings, setShowKeySettings] = useState(false);
    const [showLangMenu, setShowLangMenu] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [drawerWidth, setDrawerWidth] = useState(420);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputValue.trim()) {
            onSendMessage(inputValue);
            setInputValue('');
        }
    };

    const handlePointerDown = (e: React.PointerEvent) => {
        e.preventDefault();
        const startX = e.clientX;
        const startWidth = drawerWidth;

        const handlePointerMove = (moveEvent: PointerEvent) => {
            const diffX = startX - moveEvent.clientX;
            const newWidth = Math.min(Math.max(startWidth + diffX, 320), window.innerWidth - 40);
            setDrawerWidth(newWidth);
        };

        const handlePointerUp = () => {
            document.removeEventListener('pointermove', handlePointerMove);
            document.removeEventListener('pointerup', handlePointerUp);
            document.body.style.userSelect = '';
        };

        document.body.style.userSelect = 'none';
        document.addEventListener('pointermove', handlePointerMove);
        document.addEventListener('pointerup', handlePointerUp);
    };

    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, x: 400 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 400 }}
                    transition={{ type: 'spring', damping: 28, stiffness: 260 }}
                    className="fixed top-0 right-0 z-50 h-full shadow-[-10px_0_50px_rgba(0,0,0,0.15)] dark:shadow-[-10px_0_50px_rgba(0,0,0,0.5)] flex flex-col
                        bg-white/80 dark:bg-[#0A0A0A]/80 backdrop-blur-[40px] border-l border-white/20 dark:border-white/5 text-zinc-900 dark:text-zinc-100 overflow-hidden"
                    style={{ width: isMobile ? '100%' : `${drawerWidth}px`, maxWidth: '100vw' }}
                >
                    {/* Resizer Handle */}
                    {!isMobile && (
                        <div
                            className="absolute top-0 left-0 w-1.5 h-full cursor-col-resize z-50 hover:bg-primary-500/50 active:bg-primary-500 transition-colors opacity-0 hover:opacity-100 active:opacity-100"
                            onPointerDown={handlePointerDown}
                        />
                    )}
                    {/* Background Ambient Glow */}
                    <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-primary-500/10 to-transparent pointer-events-none" />
                    {/* Header */}
                    <div className="relative px-5 py-4 border-b border-zinc-200/50 dark:border-zinc-800/50 flex items-center justify-between bg-white/50 dark:bg-black/20 backdrop-blur-md z-10">
                        <div>
                            <h3 className="font-bold text-[16px] tracking-tight bg-gradient-to-r from-primary-600 to-purple-600 dark:from-primary-400 dark:to-purple-400 bg-clip-text text-transparent">
                                Springtunes AI
                            </h3>
                            <div className="flex items-center gap-2 mt-0.5">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
                                </span>
                                <span className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">{i18n[language].ready}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-1 relative">
                            <button
                                onClick={() => setShowLangMenu(!showLangMenu)}
                                className={`p-2 rounded-full transition-colors flex items-center justify-center ${showLangMenu ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100' : 'hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 dark:text-zinc-500'}`}
                                title="Ngôn ngữ"
                            >
                                <Globe className="w-4 h-4" />
                            </button>

                            {showLangMenu && (
                                <div className="absolute top-10 right-24 w-32 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-lg z-50 overflow-hidden">
                                    {(Object.keys(i18n) as ChatLanguage[]).map((lang) => (
                                        <button
                                            key={lang}
                                            onClick={() => {
                                                onLanguageChange(lang);
                                                setShowLangMenu(false);
                                            }}
                                            className={`w-full text-left px-4 py-2 text-[12px] transition-colors ${language === lang
                                                ? 'bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 font-medium'
                                                : 'hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                                                }`}
                                        >
                                            {i18n[lang].name}
                                        </button>
                                    ))}
                                </div>
                            )}

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
                            language={language}
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

                        <form onSubmit={handleSubmit} className="relative flex items-center gap-2 p-1 bg-zinc-100/80 dark:bg-zinc-900/80 backdrop-blur-md border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl shadow-inner focus-within:ring-2 focus-within:ring-primary-500/30 transition-all">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder={i18n[language].placeholder}
                                disabled={isLoading}
                                className="flex-1 px-4 py-3 text-[13px] bg-transparent focus:outline-none transition-colors disabled:opacity-50 placeholder:text-zinc-500 dark:placeholder:text-zinc-400"
                            />
                            <button
                                type="submit"
                                disabled={!inputValue.trim() || isLoading}
                                className="p-3 rounded-xl text-white bg-gradient-to-br from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 shadow-md shadow-primary-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all shrink-0 flex items-center justify-center w-10 h-10 mr-1"
                            >
                                <Send className="w-4 h-4 translate-x-[-1px] translate-y-[1px]" />
                            </button>
                        </form>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
