import type { SearchSongResponse, SearchResponseData } from '../types/search.types';

/**
 * Build a clean playback queue from search results and start playing from a given song.
 */
export const handlePlaySongAction = (
    song: SearchSongResponse,
    data: SearchResponseData | null,
    playRadio: (queue: any[], startIndex: number, context: string) => void
) => {
    if (!song?.audioUrl) return;

    const allSongs = data?.songs ?? [];
    const validQueue = allSongs
        .filter((s) => !!s?.audioUrl)
        .map((s) => ({
            id: s.id,
            title: s.title,
            artist: s.artistName || 'Unknown Artist',
            artistId: s.artistId || '',
            coverUrl: s.coverUrl || '',
            audioUrl: s.audioUrl,
            duration: s.duration || 0,
            isLiked: s.isLiked ?? false,
            featuredArtists: s.featuredArtists || [],
        }));

    const startIndex = validQueue.findIndex((s) => s.id === song.id);
    playRadio(validQueue, startIndex >= 0 ? startIndex : 0, 'Search');
};

/**
 * Check if a song is soft-deleted.
 */
export const isSongDeleted = (song: SearchSongResponse): boolean =>
    !!(song.deleted || song.isDeleted || song.is_deleted);
