import React from 'react';
import { motion } from 'framer-motion';
import { i18n } from './i18n';
import type { ChatLanguage } from './i18n'

interface QuickActionsProps {
    currentSong: any;
    isLoading: boolean;
    onAction: (type: 'explain' | 'translate' | 'recommend' | 'chat' | 'recommend_taste') => void;
    language: ChatLanguage;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ currentSong, isLoading, onAction, language }) => {
    return (
        <div className="flex flex-wrap gap-2 overflow-x-auto py-1 hide-scrollbar">
            {currentSong ? (
                <>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onAction('explain')}
                        disabled={isLoading}
                        className="px-4 py-2 rounded-full text-[11px] font-medium border border-zinc-200 dark:border-zinc-800 hover:border-primary-400 dark:hover:border-primary-600 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm text-zinc-700 dark:text-zinc-300 transition-colors shrink-0 shadow-sm"
                    >
                        {i18n[language].actionExplain}
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onAction('translate')}
                        disabled={isLoading}
                        className="px-4 py-2 rounded-full text-[11px] font-medium border border-zinc-200 dark:border-zinc-800 hover:border-primary-400 dark:hover:border-primary-600 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm text-zinc-700 dark:text-zinc-300 transition-colors shrink-0 shadow-sm"
                    >
                        {i18n[language].actionTranslate}
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onAction('recommend')}
                        disabled={isLoading}
                        className="px-4 py-2 rounded-full text-[11px] font-medium border border-zinc-200 dark:border-zinc-800 hover:border-primary-400 dark:hover:border-primary-600 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm text-zinc-700 dark:text-zinc-300 transition-colors shrink-0 shadow-sm"
                    >
                        {i18n[language].actionRecommend}
                    </motion.button>
                </>
            ) : (
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onAction('chat')}
                    disabled={isLoading}
                    className="px-4 py-2 rounded-full text-[11px] font-medium border border-zinc-200 dark:border-zinc-800 hover:border-primary-400 dark:hover:border-primary-600 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm text-zinc-700 dark:text-zinc-300 transition-colors shrink-0 shadow-sm"
                >
                    {i18n[language].actionChat}
                </motion.button>
            )}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onAction('recommend_taste')}
                disabled={isLoading}
                className="px-4 py-2 rounded-full text-[11px] font-bold border border-transparent bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-500 hover:to-teal-600 text-white transition-all shrink-0 shadow-md shadow-emerald-500/20"
            >
                {i18n[language].actionTaste}
            </motion.button>
        </div>
    );
};
