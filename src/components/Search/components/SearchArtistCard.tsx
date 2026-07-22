import { Play } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { ArtistSearchResponse } from '../types/search.types';

interface Props {
    artist: ArtistSearchResponse;
    index: number;
}

const SearchArtistCard = ({ artist, index }: Props) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: index * 0.05 }}
            onClick={() => navigate(`/artist/${artist.id}`)}
            className="group flex flex-col items-center p-4 rounded-lg cursor-pointer
                bg-zinc-50 dark:bg-zinc-900/60
                hover:bg-zinc-100 dark:hover:bg-zinc-800/80
                border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700/60
                transition-all duration-300 hover:shadow-xl hover:shadow-black/10 dark:hover:shadow-black/30
                active:scale-[0.97]"
        >
            {/* Avatar with ring + play overlay */}
            <div className="relative w-24 h-24 mb-3">
                <img
                    src={artist.avatarUrl || '/default-artist.png'}
                    alt={artist.name}
                    className="w-full h-full rounded-full object-cover shadow-md
                        ring-2 ring-transparent group-hover:ring-zinc-300 dark:group-hover:ring-zinc-600
                        transition-all duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 rounded-full bg-black/35 opacity-0 group-hover:opacity-100
                    transition-opacity duration-300 flex items-center justify-center">
                    <Play size={20} className="text-white fill-white ml-1" />
                </div>
            </div>

            <h3 className="font-bold text-zinc-900 dark:text-white truncate w-full text-center text-sm
                group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-200">
                {artist.name}
            </h3>
            <span className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">
                {t('home.artist_role')}
            </span>
        </motion.div>
    );
};

export default SearchArtistCard;
