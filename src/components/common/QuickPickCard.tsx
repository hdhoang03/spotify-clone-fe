import { motion } from 'framer-motion';
import { Play } from 'lucide-react';

interface QuickPickCardProps {
    title: string;
    imageUrl?: string;
    onClick: () => void;
}

const QuickPickCard = ({ title, imageUrl, onClick }: QuickPickCardProps) => {
    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className="group relative flex items-center bg-zinc-200/50 dark:bg-white/5 hover:bg-zinc-300/50 dark:hover:bg-white/10 transition-colors duration-300 rounded-md overflow-hidden cursor-pointer shadow-sm"
        >
            <div className="w-12 h-12 md:w-16 md:h-16 flex-shrink-0 bg-zinc-300 dark:bg-zinc-800 shadow-[2px_0_10px_rgba(0,0,0,0.1)] z-10">
                <img
                    src={imageUrl || '/default-album.png'}
                    alt={title}
                    className="w-full h-full object-cover"
                />
            </div>
            <div className="flex-1 px-3 py-2 flex items-center justify-between">
                <p className="font-bold text-sm md:text-base truncate text-zinc-900 dark:text-white drop-shadow-sm">
                    {title}
                </p>
                {/* Play button appears on hover */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 mr-2 shadow-lg rounded-full bg-primary-500 p-2.5 text-black">
                    <Play size={16} fill="black" className="ml-0.5" />
                </div>
            </div>
        </motion.div>
    );
};

export default QuickPickCard;
