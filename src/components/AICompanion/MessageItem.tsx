import React from 'react';
import ReactMarkdown from 'react-markdown';
import type { Message } from './types';

interface MessageItemProps {
    message: Message;
}

export const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
    const isUser = message.role === 'user';

    return (
        <div className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl px-5 py-3.5 text-[13px] shadow-sm border ${
                isUser 
                    ? 'bg-primary-500 text-white border-transparent rounded-br-sm' 
                    : 'bg-white dark:bg-[#1A1A1A] border-zinc-200/50 dark:border-zinc-800/50 text-zinc-800 dark:text-zinc-200 rounded-bl-sm'
            }`}>
                <div className="prose prose-sm dark:prose-invert max-w-none prose-p:leading-relaxed prose-pre:bg-zinc-800 prose-pre:text-zinc-100">
                    <ReactMarkdown>{message.text}</ReactMarkdown>
                </div>
            </div>
        </div>
    );
};
