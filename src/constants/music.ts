export interface Artist {
    id: string;
    name: string;
    role: string;
    imageUrl: string;
}

export interface Song {
    id: string;
    title: string;
    artist: string; // Hoặc object Artist
    album: string;
    duration: string;
    imageUrl: string; // Cần cái này để ghép ảnh bìa
}

export interface Album {
    id: string;
    name: string;
    description?: string;
    albumUrl?: string; // Ảnh bìa gốc (nếu có)
    artists: Artist[];
    songs: Song[];     // Danh sách bài hát (để lấy 4 ảnh đầu)
    releaseDate: string;
}

// Dùng chung cho cả Playlist và Album khi hiển thị dạng thẻ
export interface MediaItem {
    id: string;
    title: string;
    description: string;
    imageUrl?: string;
    type: 'ALBUM' | 'PLAYLIST' | 'ARTIST';
    subImages?: string[]; // Dành cho logic ghép 4 ảnh
}