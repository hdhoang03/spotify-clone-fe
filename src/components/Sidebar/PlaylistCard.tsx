import { Play } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import TiltCover from '../common/TiltCover';

interface PlaylistCardProps {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    index?: number;
    onPlay?: (e: React.MouseEvent) => void;
}

const PlaylistCard = ({ id, title, description, imageUrl, index = 0, onPlay }: PlaylistCardProps) => {
    const navigate = useNavigate();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: index * 0.05, ease: [0.25, 0.46, 0.45, 0.94] }}
            onClick={() => navigate(`/playlist/${id}`)}
            className="group relative p-3 md:p-4 rounded-2xl cursor-pointer
                       bg-white/60 dark:bg-zinc-900/70
                       border border-black/[0.04] dark:border-white/[0.06]
                       backdrop-blur-sm
                       hover:bg-white/90 dark:hover:bg-zinc-800/80
                       hover:shadow-[0_8px_32px_rgba(0,0,0,0.18)] dark:hover:shadow-[0_8px_32px_rgba(0,0,0,0.5)]
                       hover:-translate-y-0.5
                       transition-all duration-300 ease-out"
        >
            {/* Cover với TiltCover — nút Play nổi lên khi hover */}
            <div className="relative mb-3 md:mb-4">
                <TiltCover
                    src={imageUrl}
                    alt={title}
                    sizeClass="w-full aspect-square"
                    radiusClass="rounded-xl"
                    maxTilt={6}
                    hoverOverlay={
                        <div className="absolute inset-0 flex items-end justify-end p-2.5">
                            <motion.button
                                initial={{ opacity: 0, y: 8, scale: 0.9 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.92 }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onPlay?.(e) ?? console.log('Play playlist', id);
                                }}
                                className="w-11 h-11 md:w-12 md:h-12 bg-green-500 rounded-full
                                           flex items-center justify-center text-black
                                           shadow-[0_4px_20px_rgba(34,197,94,0.5)]
                                           hover:bg-green-400 transition-colors duration-150"
                            >
                                <Play fill="black" size={20} className="ml-0.5" />
                            </motion.button>
                        </div>
                    }
                />
            </div>

            <h3 className="font-semibold tracking-tight text-zinc-900 dark:text-white mb-1 truncate text-sm md:text-base">
                {title}
            </h3>
            <p className="text-zinc-500 dark:text-zinc-400 line-clamp-2 text-xs md:text-sm leading-relaxed">
                {description}
            </p>
        </motion.div>
    );
};

export default PlaylistCard;