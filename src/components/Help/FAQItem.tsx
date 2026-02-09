// src/components/Help/components/FAQItem.tsx
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FAQItemProps {
    question: string;
    answer: string;
}

const FAQItem = ({ question, answer }: FAQItemProps) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-zinc-100 dark:border-zinc-800 last:border-none">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between py-4 text-left group"
            >
                <span className={`font-medium transition-colors ${isOpen ? 'text-green-500' : 'text-zinc-900 dark:text-white group-hover:text-green-500'}`}>
                    {question}
                </span>
                <ChevronDown
                    size={20}
                    className={`text-zinc-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-green-500' : ''}`}
                />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <p className="pb-4 text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                            {answer}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default FAQItem;