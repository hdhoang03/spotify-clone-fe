import { useState, useEffect } from 'react';
import api from '../../services/api';
import type { SongInfo } from './types';

export const useSystemSongs = () => {
    const [systemSongs, setSystemSongs] = useState<SongInfo[]>([]);

    useEffect(() => {
        const fetchSongs = async () => {
            try {
                // Fetch up to 150 songs from the system to provide context for AI recommendations
                const res = await api.get('/song/allSongs', { params: { size: 150 } });
                const songsData = res.data.result?.content || [];
                
                const formattedSongs: SongInfo[] = songsData.map((s: any) => ({
                    id: s.id,
                    title: s.title,
                    artist: s.artistName || s.artist?.name || s.artist || 'Unknown',
                    coverUrl: s.coverUrl || '',
                    audioUrl: s.audioUrl || ''
                }));
                
                setSystemSongs(formattedSongs);
            } catch (err) {
                console.error('Failed to fetch system songs for AI context', err);
            }
        };

        fetchSongs();
    }, []);

    return { systemSongs };
};
