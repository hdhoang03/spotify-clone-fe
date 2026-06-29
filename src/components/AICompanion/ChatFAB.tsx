import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface ChatFABProps {
    isOpen: boolean;
    onClick: () => void;
}

export const ChatFAB: React.FC<ChatFABProps> = ({ isOpen, onClick }) => {
    return (
        <div className="fixed bottom-24 md:bottom-8 right-6 z-40">
            <motion.button
                onClick={onClick}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full text-zinc-800 bg-white dark:bg-[#1A1A1A] dark:text-zinc-200 shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)] focus:outline-none transition-shadow border border-zinc-200/50 dark:border-zinc-800/50 group overflow-hidden"
                title="Springtunes AI"
            >
                {/* Subtle hover gradient ring for 2026 aesthetics */}
                <div className="absolute inset-0 bg-gradient-to-tr from-primary-500/10 to-primary-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <Sparkles className="w-5 h-5 relative z-10 transition-transform duration-500 group-hover:scale-110 text-primary-500 dark:text-primary-400" strokeWidth={1.5} />
            </motion.button>
        </div>
    );
};
