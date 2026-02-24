export interface RoleResponse {
    name: string;
    description: string;
    permissions: PermissionResponse[]; // Giả sử có type này hoặc để any[]
}

export interface PermissionResponse {
    name: string;
    description: string;
}

export interface UserResponse {
    id: string;
    username: string;
    name: string; // Display Name
    email: string;
    dob?: string; // dd-MM-yyyy (LocalDate trả về String JSON)
    avatarUrl?: string; // Backend chưa có nhưng FE cần, có thể mapping từ UserSummaryResponse
    enabled: boolean;
    roles: RoleResponse[];
    isPublicProfile: boolean;
    // Các trường FE tự tính toán thêm hoặc chờ API bổ sung sau
    publicPlaylistsCount?: number;
    followingCount?: number;
    followersCount?: number;
}

export interface UserSummaryResponse {
    id: string;
    username: string;
    avatarUrl: string;
}

// --- MUSIC ENTITIES ---
export interface SongResponse {
    id: string;
    title: string;
    artist: string; // Tên Artist dạng text
    artistId?: string; // Cần thêm ID để link sang trang Artist
    albumId?: string;
    albumName?: string;
    category?: string;
    coverUrl: string;
    audioUrl: string;
    uploadedBy: string;
    duration: number; // Double -> number
    createdAt: string; // LocalDateTime -> ISO String
}

export interface ArtistResponse {
    id: string;
    name: string;
    avatarUrl?: string;
    description?: string;
    songCount?: number;
    followerCount?: number;
    deletedAt?: string;
}

export interface CategoryResponse {
    id: string;
    name: string;
    coverUrl: string;
    description: string;
    songs: SongResponse[];
}

export interface PlaylistResponse {
    id: string;
    name: string;
    description: string;
    coverUrl: string;
    isPublic: boolean;
    createdAt: string;
    user: UserSummaryResponse;
    songCount: number;
}

// --- ANALYTICS (Dành cho Admin) ---
export interface StreamStatResponse {
    date: string; // LocalDate
    count: number; // Long
}

export interface TopLikeSongResponse {
    songId: string;
    songTitle: string;
    artistName: string;
    coverUrl: string;
    likeCount: number;
    duration: number;
}

export interface UserCreationRequest {
    username: string;
    password: string;
    dob: string; // YYYY-MM-DD
    name: string;
    email: string;
}

export interface AlbumResponse {
    id: string;
    name: string;
    description?: string;
    avatarUrl?: string; // Khớp với trường avatarUrl bên Java
    songCount?: number;   // Số lượng bài hát thật
    artistName?: string;  // Tên nghệ sĩ chủ quản
    releaseDate?: string;
}

export interface CategoryResponse {
    id: string;
    name: string;
    slug: string; //
    coverUrl: string;
    description?: string;
    backgroundColor?: string; //
    type: 'GENRE' | 'MOOD' | 'ARTIST' | 'TRENDING'; //
    songCount: number; //
    active: boolean;
    displayOrder?: number; //
}