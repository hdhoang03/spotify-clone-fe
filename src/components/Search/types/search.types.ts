// ============================================================
// search.types.ts - All shared TypeScript interfaces for Search
// ============================================================

export interface SearchSongResponse {
    id: string;
    title: string;
    coverUrl: string;
    audioUrl: string;
    artistName: string;
    artistId: string;
    duration?: number;
    isLiked?: boolean;
    featuredArtists?: { id: string; name: string; avatarUrl?: string }[];
    is_deleted?: boolean;
    deleted?: boolean;
    isDeleted?: boolean;
}

export interface ArtistSearchResponse {
    id: string;
    name: string;
    description: string;
    avatarUrl: string;
    followerCount: number;
    songCount: number;
    country: string;
}

export interface AlbumSearchResponse {
    id: string;
    name: string;
    description: string;
    avatarUrl?: string;
    albumUrl?: string;
    coverUrl?: string;
    songCount: number;
    artistName: string;
    releaseDate: string;
}

export interface UserSearchResponse {
    id: string;
    username: string;
    avatarUrl: string;
}

export interface SearchResponseData {
    songs: SearchSongResponse[];
    artists: ArtistSearchResponse[];
    albums: AlbumSearchResponse[];
    users: UserSearchResponse[];
    categories?: any[];
}
