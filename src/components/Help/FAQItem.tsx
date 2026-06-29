// src/components/Help/components/FAQItem.tsx
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FAQItemProps {
    question: string;
    answer: string;
    icon?: React.ReactNode;
    isLast?: boolean;
}

const FAQItem = ({ question, answer, icon, isLast = false }: FAQItemProps) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={`${!isLast ? 'border-b border-zinc-100 dark:border-zinc-800/70' : ''}`}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center gap-3 px-5 py-4 text-left group hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors duration-200"
            >
                {icon && (
                    <span className={`flex-shrink-0 p-1.5 rounded-lg transition-colors duration-200
                        ${isOpen
                            ? 'bg-primary-500/15 text-primary-500'
                            : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 group-hover:bg-primary-500/10 group-hover:text-primary-500 dark:group-hover:text-primary-400'
                        }`}>
                        {icon}
                    </span>
                )}
                <span className={`flex-1 font-semibold text-base transition-colors leading-snug
                    ${isOpen ? 'text-primary-500 dark:text-primary-400' : 'text-zinc-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400'}`}>
                    {question}
                </span>
                <ChevronDown
                    size={18}
                    className={`flex-shrink-0 text-zinc-400 transition-all duration-300 ${isOpen ? 'rotate-180 text-primary-500' : ''}`}
                />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        className="overflow-hidden"
                    >
                        <p className="px-5 pb-5 text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed
                                      border-l-2 border-primary-500/40 ml-5 pl-4">
                            {answer}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default FAQItem;