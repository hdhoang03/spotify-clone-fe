import React, { useState, useEffect } from 'react';
import Section from './Section';
import CardItem from '../common/CardItem';
import { useTranslation } from 'react-i18next';

interface SmartPicksProps {
    allSongs: any[];
    likedSongs: any[];
    currentSong: any;
    isPlaying: boolean;
    onPlay: (song: any, queue: any[]) => void;
}

export const SmartPicksSection: React.FC<SmartPicksProps> = ({
    allSongs, likedSongs, currentSong, isPlaying, onPlay
}) => {
    const { t } = useTranslation();
    const [picks, setPicks] = useState<any[]>([]);

    useEffect(() => {
        if (allSongs.length === 0) return;

        // Filter out liked songs
        const likedIds = new Set(likedSongs.map(s => s.id));
        const availableSongs = allSongs.filter(s => !likedIds.has(s.id));

        // Enhance algorithm: try to match artists from liked songs if available
        let candidateSongs = availableSongs;
        if (likedSongs.length > 0) {
            const likedArtists = new Set(likedSongs.map(s => s.artist));
            const similarArtistSongs = availableSongs.filter(s => likedArtists.has(s.artist));
            // If we have enough similar songs, use them mixed with some random ones
            if (similarArtistSongs.length > 0) {
                candidateSongs = [...similarArtistSongs, ...availableSongs].filter((v, i, a) => a.findIndex(t => (t.id === v.id)) === i); // Unique merge
            }
        }

        // Pick 10 random from candidates
        const shuffled = [...candidateSongs].sort(() => 0.5 - Math.random());
        setPicks(shuffled.slice(0, 5));
    }, [allSongs.length, likedSongs.length]);

    if (picks.length === 0) return null;

    return (
        <Section title={t('home.smart_picks')}>
            {picks.map((song) => (
                <CardItem
                    key={song.id}
                    title={song.title}
                    description={song.artist}
                    imageUrl={song.coverUrl}
                    isCurrent={currentSong?.id === song.id}
                    isPlaying={currentSong?.id === song.id && isPlaying}
                    onClick={() => onPlay(song, picks)}
                />
            ))}
        </Section>
    );
};
