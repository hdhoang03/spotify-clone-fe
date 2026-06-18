// src/components/Library/LibraryPlaylistsView.tsx
import { motion } from 'framer-motion';
import PlaylistCard from './PlaylistCard';
import LikedSongsCard from './LikedSongsCard';
import { useTranslation } from 'react-i18next';

interface LibraryPlaylistsViewProps {
    playlists: any[];
}

const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } }
};

const LibraryPlaylistsView = ({ playlists }: LibraryPlaylistsViewProps) => {
    const { t } = useTranslation();
    return (
        <motion.div
            key="playlists"
            variants={contentVariants}
            initial="hidden" animate="visible" exit="exit"
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6 pb-24 md:pb-0"
        >
            <LikedSongsCard />

            {playlists.map((pl, idx) => (
                <PlaylistCard
                    key={pl.id}
                    id={pl.id}
                    title={pl.name}
                    description={pl.description || t('library.created_by_you')}
                    imageUrl={pl.coverUrl || 'https://via.placeholder.com/300'}
                    index={idx}
                />
            ))}
        </motion.div>
    );
};

export default LibraryPlaylistsView;