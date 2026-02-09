// types/profile.ts
export interface Artist {
    id: string;
    name: string;
    imageUrl: string;
    type: 'Artist';
}

export interface Track {
    id: string;
    title: string;
    artist: string;
    album: string;
    duration: string;
    imageUrl: string;
}

export interface Playlist {
    id: string;
    name: string;
    imageUrl: string;
    owner: string;
}

export interface UserProfile {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
    birthdate?: string;
    publicPlaylistsCount: number;
    followingCount: number;
    followersCount: number; // Thêm cho giống thật
}