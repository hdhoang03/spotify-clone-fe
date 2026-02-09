// src/constants/mockArtistData.ts

export const ARTIST_DETAIL = {
    id: 'phuongly',
    name: 'Phương Ly',
    coverImage: 'https://th.bing.com/th/id/R.d9a8f9c4a5d20df9828351001625f9e3?rik=9ykOwOHNJadujQ&pid=ImgRaw&r=0',
    avatarUrl: 'https://tse1.mm.bing.net/th/id/OIP.5don3GwJXP0OUEyKE8JOogHaHa?rs=1&pid=ImgDetMain&o=7&rm=3',
    monthlyListeners: 1309967,
    isVerified: true,
    isFollowing: false,
    globalRank: 145,
    bio: "Phương Ly là một nữ ca sĩ người Việt Nam. Cô bắt đầu nổi danh với vai trò là một hot girl, trước khi trở nên nổi tiếng với khả năng ca hát thực lực qua các bản hit 'Mặt Trời Của Em', 'Thằng Điên'..."
};

export const ARTIST_POPULAR_TRACKS = [
    { 
        id: '1', 
        title: 'Thằng Điên', 
        artist: 'JustaTee, Phương Ly', 
        coverUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/ef/0c/eb/ef0ceb8e-ee43-42d2-07b8-e6061cf0d47d/3615938759684.jpg/1200x1200bf-60.jpg', 
        duration: 265, 
        audioUrl: 'https://res.cloudinary.com/dfsoeiui1/video/upload/v1760323267/audios/agjnmnhing96bpewr8wh.mp3',
        streamCount: 16363720 
    },
    { 
        id: '2', 
        title: 'Anh Là Ai', 
        artist: 'Phương Ly', 
        coverUrl: 'https://tse3.mm.bing.net/th/id/OIP.dPdi5YNoN_v557nXrDssugHaHa?rs=1&pid=ImgDetMain&o=7&rm=3', 
        duration: 252.16, 
        audioUrl: 'https://res.cloudinary.com/dfsoeiui1/video/upload/v1765295897/audios/v3tdpsn3e24rpdvwqxao.mp3',
        streamCount: 13917357 
    },
    { 
        id: '3', 
        title: 'Mặt Trời Của Em', 
        artist: 'Phương Ly, JustaTee', 
        coverUrl: 'https://tse3.mm.bing.net/th/id/OIP.bNicNJQrKy7dchlODmH0XQHaHa?rs=1&pid=ImgDetMain&o=7&rm=3', 
        duration: 265, 
        audioUrl: 'https://res.cloudinary.com/dfsoeiui1/video/upload/v1760323267/audios/agjnmnhing96bpewr8wh.mp3',
        streamCount: 15952861 
    },
    { 
        id: '4', 
        title: 'Missing You', 
        artist: 'Phương Ly', 
        coverUrl: 'https://res.cloudinary.com/dfsoeiui1/image/upload/v1765295893/covers/lnspyjq7l4sbalm75ivo.jpg', 
        duration: 252.16, 
        audioUrl: 'https://res.cloudinary.com/dfsoeiui1/video/upload/v1765295897/audios/v3tdpsn3e24rpdvwqxao.mp3',
        streamCount: 23988204
    },
    { 
        id: '5', 
        title: 'Đâu Chịu Ngồi Yên', 
        artist: 'Touliver, Rhymastic, Phương Ly', 
        coverUrl: 'https://th.bing.com/th/id/OIP.NmAZQwbHwzNYPmkNZWBDwAHaHa?o=7rm=3&rs=1&pid=ImgDetMain&o=7&rm=3', 
        duration: 265, 
        audioUrl: 'https://res.cloudinary.com/dfsoeiui1/video/upload/v1760323267/audios/agjnmnhing96bpewr8wh.mp3',
        streamCount: 20063779
    },
    { 
        id: '6', 
        title: 'Crush On You', 
        artist: 'Phương Ly', 
        coverUrl: 'https://allvpop.com/wp-content/uploads/2016/08/29046362816_b388181f71_o.jpg', 
        duration: 252.16, 
        audioUrl: 'https://res.cloudinary.com/dfsoeiui1/video/upload/v1765295897/audios/v3tdpsn3e24rpdvwqxao.mp3',
        streamCount: 5000000 
    },
];

export const ARTIST_DISCOGRAPHY = [
    { id: 'a1', title: 'Bông Hoa Nhỏ', subTitle: '2023 • Single', imageUrl: 'https://th.bing.com/th/id/OIP.1LhN8lQ08w8Ks6j4xBBdvgHaK0?o=7rm=3&rs=1&pid=ImgDetMain&o=7&rm=3', type: 'single', rounded: false },
    { id: 'a2', title: 'Anh Là Ngoại Lệ Của Em', subTitle: '2023 • Single', imageUrl: 'https://i.ex-cdn.com/giadinhonline.vn/files/content/2023/12/15/phuong-ly-8-1853.jpg', type: 'single', rounded: false },
    { id: 'a3', title: 'Thichthich', subTitle: '2022 • Single', imageUrl: 'https://cdnmedia.tinmoi.vn/upload/yenlinh/2023/06/02/phuong-ly-3-1685697623-1642591.jpg', type: 'single', rounded: false },
    { id: 'a4', title: 'Little Flower 1', subTitle: '2020 • Album', imageUrl: 'https://tse3.mm.bing.net/th/id/OIP.bi4sIQaJZhe-UXDxEfe0wwHaJ5?rs=1&pid=ImgDetMain&o=7&rm=3', type: 'album', rounded: false },
];

export const ARTIST_RELATED = [
    { id: 'r1', title: 'Wren Evans', subTitle: 'Artist', imageUrl: 'https://photo.znews.vn/Uploaded/qfssu/2026_01_02/Wren_Evans.jpg', rounded: true },
    { id: 'r2', title: 'Lena', subTitle: 'Artist', imageUrl: 'https://kenh14cdn.com/203336854389633024/2020/12/12/lnavna733721215408661600620871417146916669408771n-1607774658575764892720.jpg', rounded: true },
    { id: 'r3', title: 'Sơn Tùng M-TP', subTitle: 'Artist', imageUrl: 'https://tse3.mm.bing.net/th/id/OIP.krJtjuPfcu82pRniUm0fDQHaHa?rs=1&pid=ImgDetMain&o=7&rm=3', rounded: true },
    { id: 'r4', title: 'Taylor Swift', subTitle: 'Artist', imageUrl: 'https://tse3.mm.bing.net/th/id/OIP.Lut4V63ntA1vr6vqvQTuMwHaFj?rs=1&pid=ImgDetMain&o=7&rm=3', rounded: true },
    { id: 'r5', title: 'NewJeans', subTitle: 'Artist', imageUrl: 'https://www.nme.com/wp-content/uploads/2023/06/newjeans-get-up-eta.jpg', rounded: true },
];