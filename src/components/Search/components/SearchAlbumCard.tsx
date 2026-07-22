import { Play } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import type { AlbumSearchResponse } from '../types/search.types';

interface Props {
    album: AlbumSearchResponse;
    index: number;
}

const SearchAlbumCard = ({ album, index }: Props) => {
    const navigate = useNavigate();
    const coverSrc = album.albumUrl || album.avatarUrl || album.coverUrl || '/default-album.png';

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: index * 0.05 }}
            onClick={() => navigate(`/albums/${album.id}`)}
            className="group p-3 rounded-lg cursor-pointer transition-all duration-300 active:scale-[0.97]
                bg-zinc-50 dark:bg-zinc-900/60
                hover:bg-zinc-100 dark:hover:bg-zinc-800/80
                border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700/60
                hover:shadow-xl hover:shadow-black/10 dark:hover:shadow-black/30"
        >
            {/* Cover with green play button overlay */}
            <div className="relative aspect-square mb-3 rounded-xl overflow-hidden shadow-md">
                <img
                    src={coverSrc}
                    alt={album.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100
                    transition-opacity duration-300 flex items-end justify-end p-2.5">
                    <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center shadow-xl
                        translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:bg-primary-400 hover:scale-105">
                        <Play size={16} className="fill-black text-black ml-0.5" />
                    </div>
                </div>
            </div>

            <h3 className="font-bold text-zinc-900 dark:text-white truncate text-sm leading-snug">
                {album.name}
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate mt-0.5">
                {album.artistName}
            </p>
        </motion.div>
    );
};

export default SearchAlbumCard;
