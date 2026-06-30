import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

interface SectionProps {
    title: string;
    onSeeAll?: () => void;
    children: React.ReactNode;
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.05 }
    }
};

const Section = ({ title, onSeeAll, children }: SectionProps) => {
    return (
        <section className="mb-10 px-1">
            {/* Header */}
            <div className="flex justify-between items-center mb-5 mt-10">
                <div className="flex items-center gap-3">
                    {/* Accent bar */}
                    <span className="block w-1 h-5 rounded-full bg-primary-500 shadow-[0_0_8px_rgba(30,215,96,0.6)]" />
                    <h2 className="text-lg md:text-xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
                        {title}
                    </h2>
                </div>
                {onSeeAll && (
                    <button
                        onClick={onSeeAll}
                        className="flex items-center gap-0.5 text-xs font-bold text-zinc-400 dark:text-zinc-500
                                   hover:text-zinc-900 dark:hover:text-white transition-colors duration-200 group"
                    >
                        Xem tất cả
                        <ChevronRight
                            size={14}
                            className="group-hover:translate-x-0.5 transition-transform duration-200"
                        />
                    </button>
                )}
            </div>

            <motion.div
                className="flex gap-4 overflow-x-auto hide-scrollbar snap-x pb-4 -mx-1 px-1"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
            >
                {React.Children.map(children, (child) => {
                    if (React.isValidElement(child)) {
                        return (
                            <div className="w-[150px] md:w-[180px] xl:w-[200px] flex-shrink-0 snap-start">
                                {child}
                            </div>
                        );
                    }
                    return child;
                })}
            </motion.div>
        </section>
    );
};

export default Section;
