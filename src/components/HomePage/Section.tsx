import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';

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
    const scrollRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);
    const { t } = useTranslation();
    const checkScroll = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
        }
    };

    useEffect(() => {
        checkScroll();
        window.addEventListener('resize', checkScroll);
        return () => window.removeEventListener('resize', checkScroll);
    }, [children]);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const { clientWidth } = scrollRef.current;
            const scrollAmount = direction === 'left' ? -clientWidth / 1.5 : clientWidth / 1.5;
            scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

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
                        {t('filter.all')}
                        <ChevronRight
                            size={14}
                            className="group-hover:translate-x-0.5 transition-transform duration-200"
                        />
                    </button>
                )}
            </div>

            <div className="relative group/scroll">
                {canScrollLeft && (
                    <button
                        onClick={(e) => { e.preventDefault(); scroll('left'); }}
                        className="absolute -left-4 top-[calc(50%-8px)] -translate-y-1/2 z-10 w-10 h-10 hidden md:flex items-center justify-center bg-white dark:bg-zinc-800 text-black dark:text-white rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.15)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.5)] opacity-0 group-hover/scroll:opacity-100 transition-all hover:scale-105 border border-zinc-100 dark:border-zinc-700"
                    >
                        <ChevronLeft size={24} />
                    </button>
                )}
                {canScrollRight && (
                    <button
                        onClick={(e) => { e.preventDefault(); scroll('right'); }}
                        className="absolute -right-4 top-[calc(50%-8px)] -translate-y-1/2 z-10 w-10 h-10 hidden md:flex items-center justify-center bg-white dark:bg-zinc-800 text-black dark:text-white rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.15)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.5)] opacity-0 group-hover/scroll:opacity-100 transition-all hover:scale-105 border border-zinc-100 dark:border-zinc-700"
                    >
                        <ChevronRight size={24} />
                    </button>
                )}

                <motion.div
                    ref={scrollRef}
                    onScroll={checkScroll}
                    className="flex gap-4 overflow-x-auto scrollbar-hide snap-x pb-4 -mx-1 px-1 scroll-smooth"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                >
                    {React.Children.map(children, (child) => {
                        if (React.isValidElement(child)) {
                            // @ts-ignore
                            const childShape = child.props.shape || (child.props.isRound ? 'circle' : 'square');

                            let widthClass = 'w-[150px] md:w-[180px] xl:w-[200px]';
                            if (childShape === 'landscape') {
                                widthClass = 'w-[220px] md:w-[260px] xl:w-[280px]';
                            } else if (childShape === 'list') {
                                widthClass = 'w-full md:w-[300px] xl:w-[350px] pr-4 md:pr-0';
                            }

                            return (
                                <div className={`${widthClass} flex-shrink-0 snap-start`}>
                                    {child}
                                </div>
                            );
                        }
                        return child;
                    })}
                </motion.div>
            </div>
        </section>
    );
};

export default Section;
