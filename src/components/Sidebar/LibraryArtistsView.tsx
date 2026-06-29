import { motion } from 'framer-motion';
import { Loader2, Music } from 'lucide-react';
import TiltCover from '../common/TiltCover';
import useLibraryArtists from './useLibraryArtists';
import { useTranslation } from 'react-i18next';

const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
};

const LibraryArtistsView = () => {
    const { t } = useTranslation();
    const { artists, isLoading, error } = useLibraryArtists();

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-20">
                <Loader2 className="animate-spin text-primary-500" size={32} />
            </div>
        );
    }

    if (error || artists.length === 0) {
        return (
            <div className="flex flex-col items-center gap-3 py-20 text-zinc-400">
                <Music size={48} />
                <p className="text-sm">{error ?? t('library.no_artists')}</p>
            </div>
        );
    }

    return (
        <motion.div
            key="artists"
            variants={contentVariants}
            initial="hidden" animate="visible" exit="exit"
            className="flex flex-col gap-1 md:grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 md:gap-6 pb-24 md:pb-0"
        >
            {artists.map((artist, idx) => (
                <motion.div
                    key={artist.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={artist.onClick}
                    className="group cursor-pointer rounded-xl
                               flex items-center gap-4 p-2
                               hover:bg-zinc-100 dark:hover:bg-white/5
                               transition-colors
                               md:flex-col md:p-4 md:items-center
                               md:bg-zinc-100/50 md:dark:bg-[#181818] md:dark:hover:bg-[#282828]"
                >
                    {/* Mobile: avatar tròn nhỏ */}
                    <div className="shrink-0 md:hidden w-14 h-14 rounded-full overflow-hidden shadow-sm">
                        <img
                            src={artist.avatarUrl}
                            alt={artist.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        />
                    </div>

                    {/* Desktop: TiltCover */}
                    <div className="hidden md:block w-full">
                        <TiltCover
                            src={artist.avatarUrl}
                            alt={artist.name}
                            sizeClass="w-full aspect-square"
                            radiusClass="rounded-full"
                            maxTilt={5}
                        />
                    </div>

                    <div className="flex flex-col flex-1 justify-center md:items-center md:mt-3 min-w-0">
                        <h3 className="font-bold text-zinc-900 dark:text-white truncate text-sm md:text-base md:text-center w-full">
                            {artist.name}
                        </h3>
                        <p className="text-zinc-500 dark:text-gray-400 text-xs md:text-center md:mt-0.5">
                            {t('library.artist')}
                        </p>
                    </div>
                </motion.div>
            ))}
        </motion.div>
    );
};

export default LibraryArtistsView;