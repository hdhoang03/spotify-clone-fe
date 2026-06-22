import { Music } from 'lucide-react';
import { motion } from 'framer-motion';
import { useMusic } from '../../contexts/MusicContent';
import { useTranslation } from 'react-i18next';
import { useSearchApi } from './hooks/useSearchApi';
import { handlePlaySongAction } from './utils/searchUtils';
import SearchSongItem from './components/SearchSongItem';
import SearchArtistCard from './components/SearchArtistCard';
import SearchAlbumCard from './components/SearchAlbumCard';
import SearchUserCard from './components/SearchUserCard';
import type { SearchSongResponse } from './types/search.types';

interface SearchResultsProps {
    query: string;
}

// ── Section header wrapper ──────────────────────────────────────────────────
const SectionHeader = ({ title }: { title: string }) => (
    <h2 className="text-lg font-extrabold mb-3 text-zinc-900 dark:text-white tracking-tight">
        {title}
    </h2>
);

// ── Loading skeleton ─────────────────────────────────────────────────────────
const SearchLoader = () => (
    <div className="mt-12 flex flex-col items-center gap-3 text-zinc-400">
        <div className="relative w-12 h-12">
            <div className="absolute inset-0 rounded-full border-2 border-green-500/30" />
            <div className="absolute inset-0 rounded-full border-2 border-green-500 border-t-transparent animate-spin" />
        </div>
        <span className="text-sm font-medium animate-pulse">
            {/* intentional: avoids flicker on fast connections */}
        </span>
    </div>
);

// ── Empty state ──────────────────────────────────────────────────────────────
const NoResults = ({ query }: { query: string }) => {
    const { t } = useTranslation();
    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-20 text-center"
        >
            <div className="w-20 h-20 rounded-2xl bg-zinc-100 dark:bg-zinc-800/80 flex items-center justify-center mx-auto mb-5 shadow-inner">
                <Music size={32} className="text-zinc-400" />
            </div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
                {t('search.no_results', { query })}
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-xs mx-auto leading-relaxed">
                {t('search.try_again')}
            </p>
        </motion.div>
    );
};

// ── Main component ───────────────────────────────────────────────────────────
const SearchResults = ({ query }: SearchResultsProps) => {
    const { t } = useTranslation();
    const { data, isLoading, error } = useSearchApi(query);
    const { playRadio, currentSong, isPlaying } = useMusic();

    if (!query) return null;

    if (isLoading) return <SearchLoader />;

    if (error) {
        return (
            <div className="mt-8 text-center text-red-500 text-sm font-medium">
                {t('search.search_error', 'Something went wrong. Please try again.')}
            </div>
        );
    }

    const hasResults = data && (
        (data.songs?.length ?? 0) > 0 ||
        (data.artists?.length ?? 0) > 0 ||
        (data.albums?.length ?? 0) > 0 ||
        (data.users?.length ?? 0) > 0
    );

    if (data && !hasResults) return <NoResults query={query} />;

    const handlePlaySong = (song: SearchSongResponse) => {
        handlePlaySongAction(song, data, playRadio);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="mt-4 pb-24 space-y-10"
        >
            {/* Songs */}
            {data?.songs && data.songs.length > 0 && (
                <section>
                    <SectionHeader title={t('search.songs')} />
                    <div className="flex flex-col gap-0.5">
                        {data.songs.map((song, index) => (
                            <SearchSongItem
                                key={`song-${song.id}`}
                                song={song}
                                index={index}
                                currentSong={currentSong}
                                isPlaying={isPlaying}
                                onPlay={handlePlaySong}
                            />
                        ))}
                    </div>
                </section>
            )}

            {/* Artists */}
            {data?.artists && data.artists.length > 0 && (
                <section>
                    <SectionHeader title={t('search.artists')} />
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {data.artists.map((artist, index) => (
                            <SearchArtistCard key={`artist-${artist.id}`} artist={artist} index={index} />
                        ))}
                    </div>
                </section>
            )}

            {/* Albums */}
            {data?.albums && data.albums.length > 0 && (
                <section>
                    <SectionHeader title={t('search.albums')} />
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {data.albums.map((album, index) => (
                            <SearchAlbumCard key={`album-${album.id}`} album={album} index={index} />
                        ))}
                    </div>
                </section>
            )}

            {/* Users */}
            {data?.users && data.users.length > 0 && (
                <section>
                    <SectionHeader title={t('search.users')} />
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {data.users.map((user, index) => (
                            <SearchUserCard key={`user-${user.id}`} user={user} index={index} />
                        ))}
                    </div>
                </section>
            )}
        </motion.div>
    );
};

export default SearchResults;