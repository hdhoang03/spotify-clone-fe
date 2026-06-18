import { Play } from 'lucide-react';
import { motion } from 'framer-motion';
import TiltCover from './TiltCover';

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
            onClick={onClick}
            className="group p-3 rounded-2xl cursor-pointer transition-all duration-500
                       hover:bg-black/5 dark:hover:bg-white/5 active:scale-95"
        >
            {/* Cover — TiltCover 3D effect */}
            <div className="mb-4 relative">
                <TiltCover
                    src={imageUrl}
                    alt={title}
                    sizeClass="w-full aspect-square shadow-md"
                    radiusClass={isRound ? 'rounded-full' : 'rounded-xl'}
                    maxTilt={7}
                    onClick={onClick}
                    hoverOverlay={
                        /* Nút Play chỉ hiện với card vuông (playlist), không hiện với artist (tròn) */
                        !isRound ? (
                            <div className="absolute inset-0 flex items-end justify-end p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <motion.button
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onClick?.();
                                    }}
                                    className="w-10 h-10 md:w-12 md:h-12 bg-green-500 dark:bg-[#1ed760] rounded-full
                                               flex items-center justify-center shadow-[0_4px_15px_rgba(34,197,94,0.3)] dark:shadow-[0_4px_15px_rgba(30,215,96,0.3)] text-black hover:scale-105"
                                >
                                    <Play fill="black" size={18} className="ml-0.5" />
                                </motion.button>
                            </div>
                        ) : undefined
                    }
                />
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