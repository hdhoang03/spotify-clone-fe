// types/profile.ts

/**
 * UICacheUser – bộ dữ liệu TỐI GIẢN được phép lưu vào localStorage.
 * Chỉ chứa những gì cần cho UI (avatar, tên hiển thị).
 * KHÔNG lưu: email, role, birthdate, phone, hay bất kỳ dữ liệu nhạy cảm nào.
 */
export interface UICacheUser {
    id: string;
    name: string;
    avatarUrl?: string;
}
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

export type UserRole = 'USER' | 'ADMIN';

export interface UserProfile {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
    birthdate?: string;
    publicPlaylistsCount: number;
    followingCount: number;
    followersCount: number; // Thêm cho giống thật
    role: UserRole;
    isPublicProfile: boolean;
}