import React from 'react';
import { Play } from 'lucide-react';
import { motion } from 'framer-motion';

interface CardItemProps {
    title: string;
    description: string;
    imageUrl?: string;
    isRound?: boolean;
    onClick?: () => void;
}

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.4 } }
};

const CardItem = ({ title, description, imageUrl, isRound = false, onClick }: CardItemProps) => {
    return (
        <motion.div
            variants={itemVariants}
            // Thêm group vào đây để xử lý hover cho các phần tử con
            onClick={onClick}
            className="group p-3 rounded-lg cursor-pointer transition-all duration-300
                       hover:bg-zinc-200/50 dark:hover:bg-zinc-800"
        >
            {/* Image Container */}
            <div className={`relative w-full aspect-square mb-4 shadow-lg overflow-hidden
                            ${isRound ? 'rounded-full' : 'rounded-md'}
                            bg-zinc-200 dark:bg-zinc-800`}>
                
                {imageUrl ? (
                    <img src={imageUrl} alt={title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-400 text-xs font-bold">NO IMG</div>
                )}
                
                {/* Play Button - Chỉ hiện với thẻ vuông */}
                {!isRound && (
                    <div className="absolute bottom-2 right-2 translate-y-2 opacity-0 
                                    group-hover:translate-y-0 group-hover:opacity-100 
                                    transition-all duration-300 ease-out">
                        <button className="bg-green-500 rounded-full p-3 text-black shadow-xl 
                                         hover:scale-105 hover:bg-green-400 active:scale-95 transition-transform">
                            <Play size={20} fill="currentColor" />
                        </button>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="flex flex-col gap-1">
                <h3 className="font-bold text-base truncate text-zinc-900 dark:text-white">
                    {title}
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2">
                    {description}
                </p>
            </div>
        </motion.div>
    );
};

export default CardItem;