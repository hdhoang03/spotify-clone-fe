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
                className="relative flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full focus:outline-none group shadow-lg shadow-primary-500/20 hover:shadow-primary-500/30 transition-shadow duration-300"
                title="Springtunes AI"
            >
                {/* Subtle Animated Gradient Border */}
                <div className="absolute inset-[-1px] rounded-full bg-gradient-to-r from-primary-400/50 via-purple-400/50 to-primary-500/50 animate-[spin_6s_linear_infinite] opacity-50 group-hover:opacity-100 transition-opacity" />

                {/* Core button body */}
                <div className="absolute inset-[1px] rounded-full bg-white/95 dark:bg-[#181818]/95 backdrop-blur-md flex items-center justify-center border border-black/5 dark:border-white/5 overflow-hidden">
                    {/* Inner subtle glow on hover */}
                    <div className="absolute inset-0 bg-primary-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {isOpen ? (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-zinc-600 dark:text-zinc-400">
                                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        ) : (
                            <Sparkles className="w-5 h-5 text-primary-500 dark:text-primary-400 relative z-10 drop-shadow-sm" strokeWidth={1.5} />
                        )}
                    </motion.div>
                </div>
            </motion.button>
        </div>
    );
};
