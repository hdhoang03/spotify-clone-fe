import { useState, useEffect } from 'react';
import api from '../../../services/api';

export interface LyricLine {
    t: number;
    text: string;
}

export const useLyrics = (songId?: string | number) => {
    const [lyrics, setLyrics] = useState<LyricLine[]>([]);
    const [isInstrumental, setIsInstrumental] = useState(false);
    const [isLyricsLoading, setIsLyricsLoading] = useState(false);

    useEffect(() => {
        if (!songId) return;
        setIsLyricsLoading(true);
        setLyrics([]);
        setIsInstrumental(false);
        api.get(`/lyrics/${songId}/get`)
            .then(res => {
                if (res.data?.result) {
                    setIsInstrumental(res.data.result.isInstrumental ?? false);
                    const content: LyricLine[] = res.data.result.content || [];
                    setLyrics(content.sort((a, b) => a.t - b.t));
                }
            })
            .catch(() => { })
            .finally(() => setIsLyricsLoading(false));
    }, [songId]);

    return { lyrics, isInstrumental, isLyricsLoading };
};