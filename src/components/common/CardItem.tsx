import { Play } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import TiltCover from './TiltCover';
import EqualizerBars from './EqualizerBars';

interface CardItemProps {
    title: string;
    description: string;
    imageUrl?: string;
    isRound?: boolean; // legacy
    shape?: 'square' | 'landscape' | 'circle' | 'list';
    isPlaying?: boolean;
    isCurrent?: boolean;
    onClick?: () => void;
}

const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } }
};

const CardItem = ({
    title, description, imageUrl,
    isRound = false,
    shape,
    isPlaying = false,
    isCurrent = false,
    onClick
}: CardItemProps) => {
    const finalShape = shape || (isRound ? 'circle' : 'square');
    const isCircle = finalShape === 'circle';
    const isLandscape = finalShape === 'landscape';
    const isList = finalShape === 'list';

    // Layout configuration
    let sizeClass = "w-full aspect-square";
    if (isLandscape) sizeClass = "w-full aspect-[4/3] sm:aspect-[16/9]";
    if (isList) sizeClass = "w-14 h-14 md:w-16 md:h-16 flex-shrink-0";

    const isHorizontalLayout = isList;
    return (
        <motion.div
            variants={itemVariants}
            onClick={onClick}
            className={`
                group rounded-lg cursor-pointer transition-all duration-300 relative
                ${isHorizontalLayout ? 'flex items-center gap-3 p-2.5' : 'flex flex-col p-3'}
                ${isCurrent
                    ? 'bg-primary-500/[0.07] dark:bg-primary-500/[0.05] ring-1 ring-primary-500/20'
                    : 'hover:bg-zinc-100 dark:hover:bg-white/[0.06]'
                }
                active:scale-[0.97]
            `}
        >
            {/* Cover */}
            <div className={`${isHorizontalLayout ? '' : 'mb-3'} relative flex-shrink-0`}>
                <TiltCover
                    src={imageUrl}
                    alt={title}
                    sizeClass={sizeClass}
                    radiusClass={isCircle ? 'rounded-full' : 'rounded-md'}
                    maxTilt={isHorizontalLayout ? 0 : 6}
                    onClick={onClick}
                    hoverOverlay={
                        !isCircle ? (
                            <div className="absolute inset-0 flex items-end justify-end p-2.5
                                            opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.92 }}
                                    onClick={(e) => { e.stopPropagation(); onClick?.(); }}
                                    className="w-10 h-10 md:w-11 md:h-11 bg-primary-500 rounded-full
                                               flex items-center justify-center
                                               shadow-[0_8px_24px_rgba(30,215,96,0.45)]
                                               text-black"
                                >
                                    <Play fill="black" size={16} className="ml-0.5" />
                                </motion.button>
                            </div>
                        ) : undefined
                    }
                />

                {/* Playing equalizer badge — bottom-left corner of cover */}
                {isCurrent && isPlaying && !isCircle && (
                    <div className="absolute bottom-2 left-2 p-1 bg-black/50 backdrop-blur-md rounded-md pointer-events-none">
                        <EqualizerBars />
                    </div>
                )}

                {/* Shadow under card */}
                {!isCircle && !isHorizontalLayout && (
                    <div className="absolute -bottom-1 left-2 right-2 h-4 bg-black/[0.08] dark:bg-black/20 blur-md rounded-md -z-10" />
                )}
            </div>

            {/* Info */}
            <div className={`flex flex-col gap-0.5 ${isHorizontalLayout ? 'min-w-0 flex-1' : 'px-0.5'}`}>
                <h3 className={`font-bold text-sm truncate transition-colors duration-150
                    ${isCurrent ? 'text-primary-500 dark:text-primary-400' : 'text-zinc-900 dark:text-white'}`}>
                    {title}
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-snug">
                    {description}
                </p>
            </div>
        </motion.div>
    );
};

export default CardItem;