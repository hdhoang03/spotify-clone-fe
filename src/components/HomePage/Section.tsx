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
        <section className="mb-10 px-6"> {/* Thêm padding-x ở đây thay vì ở children */}
            <div className="flex justify-between items-end mb-5">
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-white hover:underline cursor-pointer">
                    {title}
                </h2>
                {/* Có thể thêm nút "Xem tất cả" ở đây sau này */}
                {/* <button className="text-sm font-bold text-zinc-500 hover:text-zinc-900 uppercase">Hiện tất cả</button> */}
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