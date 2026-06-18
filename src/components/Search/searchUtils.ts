export const handlePlaySongAction = (
    song: any,
    data: any,
    playRadio: (queue: any[], startIndex: number, context: string) => void
) => {

    const allSongs = data?.songs ?? [];
    const validQueue = allSongs
        .filter((s: any) => !!s?.audioUrl)
        .map((s: any) => ({
            id: s.id,
            title: s.title,
            artist: s.artistName || 'Nghệ sỹ SpringTunes',
            artistId: s.artistId || '',
            coverUrl: s.coverUrl || '',
            audioUrl: s.audioUrl,
            duration: s.duration || 0,
            isLiked: s.isLiked ?? false,
            featuredArtists: s.featuredArtists || []
        }));

    if (!song?.audioUrl) return;

    const startIndex = validQueue.findIndex((s: any) => s.id === song.id);
    playRadio(validQueue, startIndex >= 0 ? startIndex : 0, 'Search');
};
