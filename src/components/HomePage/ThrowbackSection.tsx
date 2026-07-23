import React, { useState, useEffect } from 'react';
import Section from './Section';
import CardItem from '../common/CardItem';
import { useTranslation } from 'react-i18next';

interface ThrowbackProps {
    likedSongs: any[];
    currentSong: any;
    isPlaying: boolean;
    onPlay: (song: any, queue: any[]) => void;
}

export const ThrowbackSection: React.FC<ThrowbackProps> = ({
    likedSongs, currentSong, isPlaying, onPlay
}) => {
    const [picks, setPicks] = useState<any[]>([]);
    const { t } = useTranslation();

    useEffect(() => {
        // Only show throwback if user has a decent amount of liked songs (e.g. > 5)
        if (likedSongs.length < 5) return;

        // Pick 5 random from liked songs
        const shuffled = [...likedSongs].sort(() => 0.5 - Math.random());
        setPicks(shuffled.slice(0, 5));
    }, [likedSongs.length]);

    if (picks.length === 0) return null;

    return (
        <Section title={t('home.long_time_no_hear')}>
            {picks.map((song) => (
                <CardItem
                    key={song.id}
                    title={song.title}
                    description={song.artist}
                    imageUrl={song.coverUrl}
                    shape="list"
                    isCurrent={currentSong?.id === song.id}
                    isPlaying={currentSong?.id === song.id && isPlaying}
                    onClick={() => onPlay(song, picks)}
                />
            ))}
        </Section>
    );
};
