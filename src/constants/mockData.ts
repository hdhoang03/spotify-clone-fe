import type {
    UserResponse,
    SongResponse,
    ArtistResponse,
    PlaylistResponse,
    TopLikeSongResponse,
    StreamStatResponse
} from '../types/backend';

// 1. MOCK USER (Đóng vai trò là người đang đăng nhập)
export const CURRENT_USER: UserResponse = {
    id: 'user_01',
    username: 'hoang_dev',
    name: 'Hoang',
    email: 'dev@springtunes.com',
    dob: '01-01-1999',
    enabled: true,
    isPublicProfile: true,
    avatarUrl: 'https://github.com/shadcn.png', // FE tự thêm để hiển thị
    roles: [
        {
            name: 'ADMIN',
            description: 'Quản trị viên hệ thống',
            permissions: []
        }
    ],
    // Mock thêm số liệu cho đẹp (FE only)
    publicPlaylistsCount: 6,
    followingCount: 12,
    followersCount: 100
};

export const MOCK_USERS_LIST: UserResponse[] = [
    // User 1: Admin (Chính mình)
    {
        ...CURRENT_USER, // Kế thừa từ user đang login
        roles: [{ name: 'ADMIN', description: 'Quản trị viên', permissions: [] }]
    },
    // User 2: User thường
    {
        id: 'u2',
        username: 'listener_01',
        name: 'Nguyễn Văn A',
        email: 'nguyenvan_a@gmail.com',
        dob: '2000-05-20',
        enabled: true,
        isPublicProfile: true,
        roles: [{ name: 'USER', description: 'Người dùng', permissions: [] }],
        avatarUrl: 'https://i.pravatar.cc/150?u=u2'
    },
    // User 3: User bị khóa (Banned)
    {
        id: 'u3',
        username: 'spammer_xyz',
        name: 'Spammer Bot',
        email: 'spam@bot.net',
        dob: '2005-12-12',
        enabled: false,
        isPublicProfile: false,
        roles: [{ name: 'USER', description: 'Người dùng', permissions: [] }],
        avatarUrl: ''
    },
    // Tạo thêm 15 user giả lập nữa để test phân trang
    ...Array.from({ length: 15 }).map((_, i) => ({
        id: `mock_${i}`,
        username: `user_test_${i}`,
        name: `User Test ${i}`,
        email: `test${i}@springtunes.com`,
        dob: '1999-01-01',
        enabled: i % 5 !== 0, // Cứ 5 người thì có 1 người bị ban
        isPublicProfile: true,
        roles: [{ name: 'USER', description: 'Người dùng', permissions: [] }],
        avatarUrl: `https://i.pravatar.cc/150?u=mock_${i}`
    }))
];

// 2. MOCK SONGS
export const MOCK_SONGS: SongResponse[] = [
    {
        id: '04c22275-d68b-4b6c-b384-d770fa44ea84',
        title: 'THICHTHICH',
        artist: 'Phương Ly',
        artistId: 'art_justatee',
        albumName: 'Single 2018',
        coverUrl: "https://res.cloudinary.com/dfsoeiui1/image/upload/v1760323249/covers/rreyyxcnknuuqezwbp6b.jpg",
        audioUrl: "https://res.cloudinary.com/dfsoeiui1/video/upload/v1760323267/audios/agjnmnhing96bpewr8wh.mp3",
        duration: 265,
        uploadedBy: 'admin',
        createdAt: '2025-01-20T10:00:00',
        category: 'Pop'
    },
    {
        id: '04db2790-8a90-43c0-aedb-89d32b249319',
        title: 'MISSING YOU',
        artist: 'Phương Ly',
        artistId: 'art_st',
        albumName: 'Little Flower',
        coverUrl: "https://res.cloudinary.com/dfsoeiui1/image/upload/v1765295893/covers/lnspyjq7l4sbalm75ivo.jpg",
        audioUrl: "https://res.cloudinary.com/dfsoeiui1/video/upload/v1765295897/audios/v3tdpsn3e24rpdvwqxao.mp3",
        duration: 252.16,
        uploadedBy: 'admin',
        createdAt: '225-02-14T00:00:00',
        category: 'Ballad'
    }
];

// 3. MOCK ARTISTS
// 4. MOCK PLAYLISTS
export const MOCK_PLAYLISTS: PlaylistResponse[] = [
    {
        id: 'pl_01',
        name: 'Code Chill 2026',
        description: 'Nhạc không lời để tập trung code Spring Boot',
        coverUrl: 'https://images.unsplash.com/photo-1516280440614-6697288d5d38?auto=format&fit=crop&q=80&w=1000',
        isPublic: true,
        createdAt: '2026-01-01T00:00:00',
        songCount: 15,
        user: {
            id: 'user_01',
            username: 'hoang_dev',
            avatarUrl: 'https://github.com/shadcn.png'
        }
    }
];

// --- DATA CHO ADMIN DASHBOARD ---

// 5. Thống kê lượt nghe 7 ngày qua
export const MOCK_STREAM_STATS: StreamStatResponse[] = [
    { date: '2026-02-08', count: 1200 },
    { date: '2026-02-09', count: 1500 },
    { date: '2026-02-10', count: 1100 },
    { date: '2026-02-11', count: 1800 },
    { date: '2026-02-12', count: 2200 }, // Đỉnh điểm
    { date: '2026-02-13', count: 1900 },
    { date: '2026-02-14', count: 2500 },
];

// 6. Top bài hát được Like nhiều nhất
export const MOCK_TOP_LIKED: TopLikeSongResponse[] = [
    {
        songId: 's1',
        songTitle: 'Thằng Điên',
        artistName: 'JustaTee, Phương Ly',
        coverUrl: MOCK_SONGS[0].coverUrl,
        likeCount: 54321,
        duration: 265
    },
    {
        songId: 's2',
        songTitle: 'Muộn rồi mà sao còn',
        artistName: 'Sơn Tùng M-TP',
        coverUrl: MOCK_SONGS[1].coverUrl,
        likeCount: 49876,
        duration: 300
    }
];

export const MOCK_ARTIST_OPTIONS = [
    { id: 'artist_001', name: 'Sơn Tùng M-TP' },
    { id: 'artist_002', name: 'Đen Vâu' },
    { id: 'artist_003', name: 'Vũ.' },
    { id: 'artist_004', name: 'Phương Ly' },
    { id: 'artist_005', name: 'Hoàng Thùy Linh' }
];

export const MOCK_ALBUMS = [
    {
        id: 'album_001',
        name: 'Chúng ta của hiện tại',
        description: 'Single mở đường cho album Chúng Ta, mang âm hưởng Pop R&B hoài niệm.',
        avatarUrl: 'https://i.scdn.co/image/ab67616d0000b273a108e07c661f9fc54de9c43a',
        artists: [
            { id: 'artist_001', name: 'Sơn Tùng M-TP' }
        ]
    },
    {
        id: 'album_002',
        name: 'Hoàng',
        description: 'Album phòng thu thứ 3 của Hoàng Thùy Linh, kết hợp dân gian đương đại.',
        avatarUrl: 'https://upload.wikimedia.org/wikipedia/vi/3/3d/Hoang_thuy_linh_hoang_album_cover.jpg',
        artists: [
            { id: 'artist_005', name: 'Hoàng Thùy Linh' }
        ]
    },
    {
        id: 'album_003',
        name: 'Mười Năm (Loisirs)',
        description: 'Tuyển tập những ca khúc đánh dấu chặng đường 10 năm của Đen Vâu.',
        avatarUrl: 'https://i1.sndcdn.com/artworks-000473262657-616327-t500x500.jpg',
        artists: [
            { id: 'artist_002', name: 'Đen Vâu' }
        ]
    },
    {
        id: 'album_004',
        name: 'LINK',
        description: 'Album phòng thu thứ 4, tiếp tục khẳng định tư duy âm nhạc độc đáo.',
        avatarUrl: 'https://i.scdn.co/image/ab67616d0000b27318856da02f1d3e81cb89b7b9',
        artists: [
            { id: 'artist_005', name: 'Hoàng Thùy Linh' }
        ]
    },
    {
        id: 'album_005',
        name: 'Một Vạn Năm',
        description: 'Album chứa đựng những bản tình ca buồn đặc trưng của Vũ.',
        avatarUrl: 'https://i.scdn.co/image/ab67616d0000b2730146e27352345634567432', // Link fake
        artists: [
            { id: 'artist_003', name: 'Vũ.' }
        ]
    }
];

export const MOCK_CATEGORIES = [
    {
        id: 'cat_pop',
        name: 'Pop',
        description: 'Nhạc Pop thịnh hành, giai điệu bắt tai.',
        coverUrl: 'https://images.unsplash.com/photo-1514525253440-b393452e3726?auto=format&fit=crop&q=80&w=1000',
        active: true,
        songCount: 120,
        songs: []
    },
    {
        id: 'cat_ballad',
        name: 'Ballad',
        description: 'Những bản tình ca buồn và sâu lắng.',
        coverUrl: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?auto=format&fit=crop&q=80&w=1000',
        active: true,
        songCount: 85,
        songs: []
    },
    {
        id: 'cat_rock',
        name: 'Rock',
        description: 'Giai điệu mạnh mẽ và bùng nổ.',
        coverUrl: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?auto=format&fit=crop&q=80&w=1000',
        active: false, // Ví dụ danh mục bị ẩn
        songCount: 40,
        songs: []
    }
];

export const MOCK_DASHBOARD_OVERVIEW = {
    totalUsers: 1234,
    totalSongs: 456,
    totalArtists: 89,
    totalAlbums: 32, // Khớp với MOCK_ALBUMS
    monthlyStreams: "50.2K"
};

// 2. Biểu đồ tăng trưởng người dùng (User Growth - Area Chart)
export const MOCK_USER_GROWTH = [
    { month: 'T1', users: 40 },
    { month: 'T2', users: 80 },
    { month: 'T3', users: 150 },
    { month: 'T4', users: 240 },
    { month: 'T5', users: 300 },
    { month: 'T6', users: 450 },
];

// 3. Top bài hát nghe nhiều (Leaderboard)
export const MOCK_TOP_STREAM_SONGS = [
    {
        id: '1',
        title: 'Chúng ta của hiện tại',
        artist: 'Sơn Tùng M-TP',
        streams: 15400,
        cover: 'https://i.scdn.co/image/ab67616d0000b273a108e07c661f9fc54de9c43a'
    },
    {
        id: '2',
        title: 'Thằng Điên',
        artist: 'JustaTee, Phương Ly',
        streams: 12300,
        cover: 'https://res.cloudinary.com/dfsoeiui1/image/upload/v1760323249/covers/rreyyxcnknuuqezwbp6b.jpg'
    },
    {
        id: '3',
        title: 'Nấu ăn cho em',
        artist: 'Đen Vâu',
        streams: 10500,
        cover: 'https://i1.sndcdn.com/artworks-000473262657-616327-t500x500.jpg'
    },
    {
        id: '4',
        title: 'Cắt đôi nỗi sầu',
        artist: 'Tăng Duy Tân',
        streams: 9800,
        cover: 'https://via.placeholder.com/50'
    },
    {
        id: '5',
        title: 'Một Vạn Năm',
        artist: 'Vũ.',
        streams: 8500,
        cover: 'https://i.scdn.co/image/ab67616d0000b2730146e27352345634567432'
    },
];

export const generateStreamData = (startDate: Date, days: number): StreamStatResponse[] => {
    const data: StreamStatResponse[] = [];

    for (let i = 0; i < days; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);

        // Format YYYY-MM-DD
        const dateStr = date.toISOString().split('T')[0];

        // Random số liệu (ví dụ từ 1000 đến 5000 lượt nghe)
        const count = Math.floor(Math.random() * 4000) + 1000;

        data.push({ date: dateStr, count });
    }
    return data;
};

// Hàm lấy dữ liệu theo bộ lọc (Năm -> Tháng -> Tuần)
export const getMockStreamData = (year: number, month: number, week?: number) => {
    // Lưu ý: month trong JS bắt đầu từ 0 (tháng 1 là 0)
    const startDate = new Date(year, month - 1, 1);

    // Nếu xem cả tháng
    if (!week) {
        // Lấy số ngày trong tháng đó (ngày 0 của tháng sau = ngày cuối tháng này)
        const daysInMonth = new Date(year, month, 0).getDate();
        return generateStreamData(startDate, daysInMonth);
    }

    // Nếu xem theo tuần (Giả sử mỗi tuần 7 ngày)
    // Tuần 1: ngày 1->7, Tuần 2: 8->14...
    const startDay = (week - 1) * 7 + 1;
    const weekStartDate = new Date(year, month - 1, startDay);

    // Xử lý trường hợp tuần cuối có thể ít hơn 7 ngày nếu hết tháng
    const daysInMonth = new Date(year, month, 0).getDate();
    const remainingDays = daysInMonth - startDay + 1;
    const daysToGen = remainingDays < 7 ? remainingDays : 7;

    return generateStreamData(weekStartDate, daysToGen);
};

export const MOCK_GENRE_DISTRIBUTION = [
    { name: 'Pop', value: 45, color: '#3b82f6' },    // Blue
    { name: 'Ballad', value: 30, color: '#ec4899' }, // Pink
    { name: 'Rap/Hip-hop', value: 15, color: '#f97316' }, // Orange
    { name: 'Indie', value: 10, color: '#10b981' },  // Emerald
];

// --- 2. HÀM SINH DỮ LIỆU THỐNG KÊ (LOGIC MỚI) ---

// Helper: Sinh số ngẫu nhiên
const random = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

// Case 1: Xem theo NĂM -> Trả về 12 Tháng
export const getStreamDataForYear = (year: number) => {
    return Array.from({ length: 12 }, (_, i) => ({
        date: `T${i + 1}`, // Label: T1, T2...
        fullDate: `Tháng ${i + 1}/${year}`, // Tooltip
        count: random(30000, 80000) // Số liệu tháng sẽ to hơn ngày
    }));
};

// Case 2: Xem theo THÁNG -> Trả về 4-5 Tuần
export const getStreamDataForMonth = (year: number, month: number) => {
    // Logic: Tính xem tháng đó có bao nhiêu tuần
    // Để đơn giản cho Mock, ta fix cứng 4 tuần, hoặc logic tương đối
    return Array.from({ length: 4 }, (_, i) => ({
        date: `Tuần ${i + 1}`,
        fullDate: `Tuần ${i + 1} - Tháng ${month}/${year}`,
        count: random(8000, 25000) // Số liệu tuần
    }));
};

// Case 3: Xem theo TUẦN (Mặc định cũ) -> Trả về 7 ngày
// Giữ lại hàm cũ của bạn hoặc cập nhật nhẹ
export const getStreamDataForWeek = () => {
    // Mock 7 ngày gần nhất
    const today = new Date();
    const data = [];
    for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        data.push({
            date: `${d.getDate()}/${d.getMonth() + 1}`,
            fullDate: d.toLocaleDateString('vi-VN'),
            count: random(1000, 5000)
        });
    }
    return data;
};