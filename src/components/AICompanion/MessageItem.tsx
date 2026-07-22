import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Sparkles } from 'lucide-react';
import type { Message } from './types';

interface MessageItemProps {
    message: Message;
}

export const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
    const isUser = message.role === 'user';

    return (
        <div className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
            {!isUser && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-purple-500 flex items-center justify-center shrink-0 shadow-md shadow-primary-500/20">
                    <Sparkles className="w-4 h-4 text-white" />
                </div>
            )}
            <div className={`max-w-[75%] rounded-lg px-5 py-3.5 text-[14px] shadow-sm ${isUser
                    ? 'bg-gradient-to-br from-primary-500 to-primary-600 text-white border-transparent rounded-br-sm shadow-primary-500/25 shadow-md'
                    : 'bg-white/80 dark:bg-[#1A1A1A]/80 backdrop-blur-xl border border-white/40 dark:border-white/5 text-zinc-800 dark:text-zinc-200 rounded-tl-sm shadow-xl'
                }`}>
                <div className={`prose prose-sm max-w-none prose-p:leading-relaxed prose-pre:bg-zinc-800 prose-pre:text-zinc-100 ${isUser ? 'prose-invert' : 'dark:prose-invert'} prose-a:text-primary-500 hover:prose-a:text-primary-600`}>
                    <ReactMarkdown>{message.text}</ReactMarkdown>
                </div>
            </div>
        </div>
    );
};
