import React, { useState } from 'react';
import TrackRow from '../Profile/components/TrackRow';
import { useTranslation } from 'react-i18next';

interface PopularTracksProps {
    tracks: any[];
    onPlayTrack: (index: number) => void;
    currentSongId?: string;
    onTogglePlay: () => void;
    globalIsPlaying: boolean;
}

const PopularTracks = ({ tracks, onPlayTrack, currentSongId, onTogglePlay, globalIsPlaying }: PopularTracksProps) => {
    const { t } = useTranslation();
    const [showAll, setShowAll] = useState(false);
    const visibleTracks = showAll ? tracks.slice(0, 10) : tracks.slice(0, 5);

    return (
        <section className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
            {/* Section header — nhất quán với style 2026 */}
            <h2 className="text-xl md:text-2xl font-bold mb-4 text-zinc-900 dark:text-white tracking-tight">
                {t('artist.popular_tracks')}
            </h2>

            {/* Column header — giống PlaylistTrackList nhưng chỉ 3 cột */}
            <div className="hidden md:flex items-center justify-between
                            px-4 pb-2 mb-1
                            text-[10.5px] font-semibold uppercase tracking-[0.1em]
                            text-zinc-400/80 dark:text-zinc-500/80
                            border-b border-black/[0.06] dark:border-white/[0.07]">
                <div className="flex items-center gap-4 flex-1">
                    <div className="w-6 text-center">#</div>
                    <span>{t('artist.title')}</span>
                </div>
                <div className="flex items-center gap-4 justify-end text-right">
                    <div className="w-24 text-right opacity-70">{t('artist.plays')}</div>
                    <div className="w-10 text-right opacity-70">{t('artist.time')}</div>
                    <div className="w-8" />
                </div>
            </div>

            <div className="flex flex-col">
                {visibleTracks.map((track, index) => {
                    const isCurrentSong = currentSongId === track.id;

                    return (
                        <TrackRow
                            key={track.id}
                            index={index}
                            songId={track.id}
                            coverUrl={track.coverUrl}
                            title={track.title}
                            artist={track.artist}
                            artistId={track.artistId}
                            featuredArtists={track.featuredArtists}
                            duration={track.duration}
                            streamCount={track.streamCount ?? 0}
                            onClick={() => onPlayTrack(index)}
                            onTogglePlayPause={onTogglePlay}
                            isArtistView={true}
                            isActive={isCurrentSong}
                            isPlaying={isCurrentSong && (globalIsPlaying ?? false)}
                            isDeleted={track.deleted || track.isDeleted || track.is_deleted}
                        />
                    )
                })}
            </div>

            {tracks.length > 5 && (
                <button
                    onClick={() => setShowAll(!showAll)}
                    className="mt-2 text-sm font-bold text-zinc-500
                               hover:text-zinc-900 dark:hover:text-white
                               transition-colors duration-200
                               hover:underline underline-offset-2"
                >
                    {showAll ? t('artist.show_less') : t('artist.see_more')}
                </button>
            )}
        </section>
    );
};

export default PopularTracks;