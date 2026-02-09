// Định nghĩa giống Java Class
export interface User {
    id: string;
    name: string;
    email?: string;
    avatarUrl?: string;
}

export interface Artist {
    id: string;
    name: string;
    description?: string;
    avatarUrl: string;
    followerCount: number; // Java: Long -> TS: number
    debutDate?: string;    // Java: LocalDate -> TS: string (ISO)
    country?: string;
}

export interface Category {
    id: string;
    name: string;
}

export interface Album {
    id: string;
    name: string;
    description?: string;
    albumUrl?: string; // Cover
    releaseDate?: string;
    artists: Artist[]; // Album có thể của nhiều nghệ sĩ
}

export interface Song {
    id: string;
    title: string;
    artist: Artist;         // Main Artist (ManyToOne)
    featuredArtists: Artist[]; // Nghệ sĩ kết hợp (ManyToMany) - Quan trọng
    album?: Album;
    coverUrl: string;
    audioUrl: string;
    duration: number;       // Giây (Double)
    playCount: number;
    likeCount: number;
    category?: Category;
    createdAt: string;
}

export interface Playlist {
    id: string;
    name: string;
    description?: string;
    coverUrl?: string;      // Có thể null nếu chưa chọn ảnh
    user: User;             // Owner
    isPublic: boolean;
    songs: Song[];          // Danh sách bài hát
    createdAt: string;
}