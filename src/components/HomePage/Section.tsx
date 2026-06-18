import React from 'react';
import { motion } from 'framer-motion';

interface SectionProps {
    title: string;
    children: React.ReactNode;
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
}

const Section = ({ title, children }: SectionProps) => {
    return (
        <section className="mb-14 px-2 pt-6">
            <div className="flex justify-between items-end mb-6">
                <h2 className="text-xl md:text-2xl font-extrabold text-zinc-900 dark:text-white cursor-pointer tracking-tight drop-shadow-sm">
                    {title}
                </h2>
            </div>

            <motion.div
                // Tối ưu Grid Responsive:
                // min-w-[180px] giúp các thẻ không bị co quá nhỏ trên màn hình bé
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
            >
                {children}
            </motion.div>
        </section>
    );
};

export default Section;