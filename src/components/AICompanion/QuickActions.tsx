import React from 'react';

interface QuickActionsProps {
    currentSong: any;
    isLoading: boolean;
    onAction: (type: 'explain' | 'translate' | 'recommend' | 'chat' | 'recommend_taste') => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ currentSong, isLoading, onAction }) => {
    return (
        <div className="flex flex-wrap gap-2 overflow-x-auto py-1 hide-scrollbar">
            {currentSong ? (
                <>
                    <button
                        onClick={() => onAction('explain')}
                        disabled={isLoading}
                        className="px-4 py-2 rounded-full text-[11px] font-medium border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 transition-colors shrink-0"
                    >
                        Explain this song lyrics
                    </button>
                    <button
                        onClick={() => onAction('translate')}
                        disabled={isLoading}
                        className="px-4 py-2 rounded-full text-[11px] font-medium border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 transition-colors shrink-0"
                    >
                        Translate song lyrics
                    </button>
                    <button
                        onClick={() => onAction('recommend')}
                        disabled={isLoading}
                        className="px-4 py-2 rounded-full text-[11px] font-medium border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 transition-colors shrink-0"
                    >
                        Suggest similar song
                    </button>
                </>
            ) : (
                <button
                    onClick={() => onAction('chat')}
                    disabled={isLoading}
                    className="px-4 py-2 rounded-full text-[11px] font-medium border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 transition-colors shrink-0"
                >
                    Suggest something fun to listen to
                </button>
            )}
            <button
                onClick={() => onAction('recommend_taste')}
                disabled={isLoading}
                className="px-4 py-2 rounded-full text-[11px] font-medium border border-emerald-200 dark:border-emerald-800 hover:border-emerald-400 dark:hover:border-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 transition-colors shrink-0"
            >
                Hiểu Gu: Gợi ý nhạc cho tôi
            </button>
        </div>
    );
};
