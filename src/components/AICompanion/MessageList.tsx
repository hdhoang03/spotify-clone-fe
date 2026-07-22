import React, { useEffect, useRef } from 'react';
import { MessageItem } from './MessageItem';
import type { Message } from './types';

interface MessageListProps {
    messages: Message[];
    isLoading: boolean;
    errorMsg: string | null;
}

export const MessageList: React.FC<MessageListProps> = ({ messages, isLoading, errorMsg }) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    return (
        <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-zinc-50/30 dark:bg-zinc-950/20 hide-scrollbar">
            {messages.map((msg, index) => (
                <MessageItem key={index} message={msg} />
            ))}
            
            {isLoading && (
                <div className="flex gap-3 justify-start">
                    <div className="max-w-[75%] rounded-lg px-5 py-4 bg-white dark:bg-[#1A1A1A] border border-zinc-200/50 dark:border-zinc-800/50 rounded-bl-sm shadow-sm flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 dark:bg-zinc-600 animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 dark:bg-zinc-600 animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 dark:bg-zinc-600 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                </div>
            )}

            {errorMsg && (
                <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 text-[13px] text-center">
                    {errorMsg}
                </div>
            )}
            <div ref={messagesEndRef} />
        </div>
    );
};
