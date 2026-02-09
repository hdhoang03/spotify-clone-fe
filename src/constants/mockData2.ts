import type { Artist, Song, Playlist, User, Album } from '../constants/entity';

// 1. MOCK USERS & ARTISTS TRƯỚC
export const MOCK_USER: User = {
    id: 'user_01',
    name: 'Java Spring Developer',
    avatarUrl: 'https://github.com/shadcn.png'
};

export const ARTISTS_DB: Record<string, Artist> = {
    'st': { id: 'st', name: 'Sơn Tùng M-TP', avatarUrl: 'https://th.bing.com/th/id/R.38258ebf99837affa696da4845ffacd1?rik=pT0fiZcF5Ck%2b0w&pid=ImgRaw&r=0', followerCount: 10000000, description: 'Hoàng tử mưa' },
    'ply': { id: 'ply', name: 'Phương Ly', avatarUrl: 'https://th.bing.com/th/id/OIP.5don3GwJXP0OUEyKE8JOogHaHa?o=7rm=3&rs=1&pid=ImgDetMain&o=7&rm=3', followerCount: 1309967, description: 'Ca sĩ...' },
    'justa': { id: 'lsh', name: 'Faker', avatarUrl: 'https://tse1.mm.bing.net/th/id/OIP.p2aamLrZ0JIwaaKESNZ1ogHaEK?rs=1&pid=ImgDetMain&o=7&rm=3', followerCount: 2000000 },
    'mck': { id: 'mck', name: 'LENA', avatarUrl: 'https://tse2.mm.bing.net/th/id/OIP.DU45_vQ30oJ83f8hWdGZGAHaHa?rs=1&pid=ImgDetMain&o=7&rm=3', followerCount: 500000 },
};

// 2. MOCK ALBUMS
export const ALBUMS_DB: Album[] = [
    { id: 'alb1', name: 'Sky Tour', artists: [ARTISTS_DB['st']], albumUrl: 'https://th.bing.com/th/id/R.3649fae768ea215594900a0a549e9d42?rik=yD8vAscM%2by5YYQ&pid=ImgRaw&r=0' },
    { id: 'alb2', name: 'Bông Hoa Nhỏ', artists: [ARTISTS_DB['ply']], albumUrl: 'https://th.bing.com/th/id/OIP.jaPzfbNUWLPzurJ8hooo5gHaDt?o=7rm=3&rs=1&pid=ImgDetMain&o=7&rm=3' }
];

// 3. MOCK SONGS (Quan trọng: Map đúng Artist Object)
export const SONGS_DB: Song[] = [
    {
        id: 's1',
        title: 'Thằng Điên',
        artist: ARTISTS_DB['justa'], // Nghệ sĩ chính
        featuredArtists: [ARTISTS_DB['ply']], // Nghệ sĩ kết hợp (Java: @ManyToMany)
        album: undefined,
        coverUrl: 'https://res.cloudinary.com/dfsoeiui1/image/upload/v1760323249/covers/rreyyxcnknuuqezwbp6b.jpg',
        audioUrl: 'https://res.cloudinary.com/dfsoeiui1/video/upload/v1760323267/audios/agjnmnhing96bpewr8wh.mp3',
        duration: 265,
        playCount: 16363720,
        likeCount: 50000,
        createdAt: '2025-01-20T10:00:00'
    },
    {
        id: 's2',
        title: 'Muộn rồi mà sao còn',
        artist: ARTISTS_DB['st'],
        featuredArtists: [],
        coverUrl: 'https://res.cloudinary.com/dfsoeiui1/image/upload/v1765295893/covers/lnspyjq7l4sbalm75ivo.jpg',
        audioUrl: 'https://res.cloudinary.com/dfsoeiui1/video/upload/v1765295897/audios/v3tdpsn3e24rpdvwqxao.mp3',
        duration: 300,
        playCount: 99999999,
        likeCount: 1000000,
        createdAt: '2025-01-21T10:00:00'
    }
];

// 4. MOCK PLAYLISTS (Để test logic ghép ảnh bìa)
export const PLAYLISTS_DB: Playlist[] = [
    {
        id: 'pl1',
        name: 'Nhạc Code Java',
        description: 'Nghe cho đỡ đau đầu',
        coverUrl: '', // Rỗng -> Frontend sẽ tự lấy 4 bài đầu ghép lại
        user: MOCK_USER,
        isPublic: true,
        songs: [SONGS_DB[0], SONGS_DB[1], SONGS_DB[0], SONGS_DB[1]], // Có 4 bài
        createdAt: '2026-01-01T00:00:00'
    }
];