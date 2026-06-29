export interface Message {
    role: 'user' | 'model';
    text: string;
}

export interface SongInfo {
    id: string;
    title: string;
    artist: string;
    artistId?: string;
    albumId?: string;
    albumName?: string;
    coverUrl: string;
    duration?: number;
    audioUrl: string;
    isLiked?: boolean;
    featuredArtists?: any[];
    lyrics?: string;
}
