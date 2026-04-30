// pages/HomePage.tsx
import React, { useState } from 'react';
import Section from './Section';
import CardItem from '../common/CardItem';
import Footer from './Footer';
import FilterBar, { type TabType } from './FilterBar';
import { useNavigate } from 'react-router-dom';

interface HomePageProps {
    onNavigate?: (tab: string) => void;
} //có thể bỏ sau khi dùng useNavigate

const HomePage = ({ onNavigate }: HomePageProps) => {
    const [activeTab, setActiveTab] = useState<TabType>('ALL');
    const [isFollowingMode, setIsFollowingMode] = useState(false);
    const userString = localStorage.getItem('user');

    // Chỉ parse khi chuỗi tồn tại và KHÔNG phải là chuỗi "undefined"
    const user = userString && userString !== 'undefined' ? JSON.parse(userString) : null;
    const isLoggedIn = !!user;
    const navigate = useNavigate();

    // --- MOCK DATA (Dữ liệu giả) ---
    const recentlyPlayed = [
        { id: 1, title: 'Lo-fi Chill', desc: 'Nhạc chill học bài', img: '' },
        { id: 2, title: 'Code Java', desc: 'Nhạc tập trung code', img: '' },
        { id: 3, title: 'Sơn Tùng M-TP', desc: 'Artist', img: '', isArtist: true },
        { id: 4, title: 'Gaming Music', desc: 'EDM cực mạnh', img: '' },
    ];

    const suggestForYou = [
        { id: 1, title: 'Daily Mix 1', desc: 'Dành riêng cho bạn', img: '' },
        { id: 2, title: 'Discover Weekly', desc: 'Nhạc mới mỗi tuần', img: '' },
        { id: 3, title: 'Pop Rising', desc: 'Top hit hiện nay', img: '' },
    ];

    const artists = [
        { id: 1, title: 'Den Vau', desc: 'Rapper', img: '', isArtist: true },
        { id: 2, title: 'Taylor Swift', desc: 'Artist', img: '', isArtist: true },
        { id: 3, title: 'Justin Bieber', desc: 'Artist', img: '', isArtist: true },
    ];

    const postcards = [
        { id: 1, title: 'Podcast Tech', desc: 'Bàn về công nghệ', img: '' },
        { id: 2, title: 'Chuyện ma', desc: 'Kể chuyện đêm khuya', img: '' },
    ];

    const getFilteredData = (data: any[]) => {
        if (isLoggedIn && isFollowingMode) {
            return data.filter(item => item.isFollowed);
        }
        return data;
    };

    return (
        <div className="bg-white dark:bg-[#121212] min-h-screen transition-colors duration-300">

            {/* 2. FilterBar: Khôi phục padding (pt-6 px-6) để nó không dính sát lề */}
            <div className="sticky top-0 z-10 bg-white/95 dark:bg-[#121212]/95 backdrop-blur-md pt-6 px-6">
                <FilterBar
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    isFollowingMode={isFollowingMode}
                    onToggleFollowing={() => setIsFollowingMode(!isFollowingMode)}
                    isLoggedIn={isLoggedIn}
                />
            </div>
            <div className="min-h-screen mt-4 space-y-8 pb-32">
                {activeTab === 'ALL' && (
                    <>
                        <Section title="Phát gần đây">
                            {recentlyPlayed.map(item => (
                                <CardItem key={item.id} title={item.title} description={item.desc} isRound={item.isArtist} />
                            ))}
                        </Section>

                        <Section title="Dành cho bạn">
                            {suggestForYou.map(item => (
                                <CardItem key={item.id} title={item.title} description={item.desc} />
                            ))}
                        </Section>

                        <Section title="Nghệ sĩ yêu thích">
                            {artists.map(item => (
                                <CardItem
                                    key={item.id}
                                    title={item.title}
                                    description={item.desc}
                                    isRound={true}
                                    // onClick={() => {if (onNavigate) onNavigate('ARTIST');}}
                                    onClick={() => {
                                        navigate(`/artist/${item.id}`)
                                    }}
                                />
                            ))}
                        </Section>
                    </>
                )}

                {/* --- TAB MUSIC --- */}
                {activeTab === 'MUSIC' && (
                    <>
                        <Section title="Phát gần đây (Music Only)">
                            {recentlyPlayed.filter(i => !i.isArtist).map(item => (
                                <CardItem key={item.id} title={item.title} description={item.desc} />
                            ))}
                        </Section>

                        <Section title="Gợi ý nhạc mới">
                            {suggestForYou.map(item => (
                                <CardItem key={item.id} title={item.title} description={item.desc} />
                            ))}
                        </Section>
                    </>
                )}

                {/* --- TAB POSTCARD --- */}
                {activeTab === 'POSTCARD' && (
                    <Section title="Các tập PostCard mới nhất">
                        {postcards.map(item => (
                            <CardItem key={item.id} title={item.title} description={item.desc} />
                        ))}
                    </Section>
                )}
            </div>

            {/* 4. FOOTER */}
            <Footer />
        </div>
    );
};

export default HomePage;

// import { useState } from 'react';
// import Section from './Section';
// import CardItem from '../common/CardItem';
// import Footer from './Footer';
// import FilterBar, { type TabType } from './FilterBar';
// import { useNavigate } from 'react-router-dom';
// import { useHomeData } from './useHomeData';
// import { Loader2 } from 'lucide-react';

// const HomePage = () => {
//     const [activeTab, setActiveTab] = useState<TabType>('ALL');
//     const [isFollowingMode, setIsFollowingMode] = useState(false);
//     const navigate = useNavigate();

//     // Gọi Hook lấy dữ liệu
//     const { data, isLoading } = useHomeData(activeTab);

//     // Xử lý kiểm tra đăng nhập (để FilterBar biết đường render)
//     const userString = localStorage.getItem('user');
//     const isLoggedIn = !!(userString && userString !== 'undefined');

//     return (
//         <div className="bg-[#121212] min-h-screen">
//             <FilterBar
//                 activeTab={activeTab}
//                 onTabChange={setActiveTab}
//                 isFollowingMode={isFollowingMode}
//                 onToggleFollowing={() => setIsFollowingMode(!isFollowingMode)}
//                 isLoggedIn={isLoggedIn}
//             />

//             {isLoading ? (
//                 <div className="flex flex-col items-center justify-center pt-32 text-zinc-500 gap-4">
//                     <Loader2 size={40} className="animate-spin text-green-500" />
//                     <p className="font-medium">Đang tải không gian âm nhạc của bạn...</p>
//                 </div>
//             ) : (
//                 <div className="space-y-8 pt-4 pb-10">

//                     {/* --- TAB: TẤT CẢ --- */}
//                     {activeTab === 'ALL' && (
//                         <>
//                             {/* PHÁT GẦN ĐÂY (Đang dùng Mock) */}
//                             <Section title="Phát gần đây">
//                                 {data.recentlyPlayed.map(item => (
//                                     <CardItem
//                                         key={item.songId}
//                                         title={item.songTitle}
//                                         description={item.artistName}
//                                         imageUrl={item.coverUrl}
//                                         onClick={() => console.log('Sẽ chuyển hướng sau')}
//                                     />
//                                 ))}
//                             </Section>

//                             {/* BÀI HÁT YÊU THÍCH NHẤT (Từ LikeSongController) */}
//                             {data.topLikedSongs.length > 0 && (
//                                 <Section title="Thịnh hành & Yêu thích">
//                                     {data.topLikedSongs.map(song => (
//                                         <CardItem
//                                             key={song.songId}
//                                             title={song.songTitle}
//                                             description={song.artistName}
//                                             imageUrl={song.coverUrl}
//                                             // Tùy vào luồng của bạn, có thể phát nhạc luôn hoặc chuyển trang
//                                             onClick={() => console.log('Play song:', song.songId)}
//                                         />
//                                     ))}
//                                 </Section>
//                             )}

//                             {/* TOP STREAM (Từ SongStreamService) */}
//                             {data.topStreamedSongs.length > 0 && (
//                                 <Section title="Đang HOT hiện nay">
//                                     {data.topStreamedSongs.map(song => (
//                                         <CardItem
//                                             key={song.songId}
//                                             title={song.songTitle}
//                                             description={song.artistName}
//                                             imageUrl={song.coverUrl}
//                                             onClick={() => console.log('Play song:', song.songId)}
//                                         />
//                                     ))}
//                                 </Section>
//                             )}

//                             {/* ALBUM MỚI */}
//                             {data.newAlbums.length > 0 && (
//                                 <Section title="Album mới phát hành">
//                                     {data.newAlbums.map(album => (
//                                         <CardItem
//                                             key={album.id}
//                                             title={album.name}
//                                             description={album.artistName || 'Various Artists'}
//                                             imageUrl={album.avatarUrl}
//                                             isRound={false}
//                                             onClick={() => navigate(`/album/${album.id}`)}
//                                         />
//                                     ))}
//                                 </Section>
//                             )}
//                         </>
//                     )}

//                     {/* --- TAB: MUSIC --- */}
//                     {activeTab === 'MUSIC' && (
//                         <div className="pt-10 flex flex-col items-center justify-center text-zinc-500">
//                             <p>Tính năng lọc chuyên sâu Âm nhạc đang được phát triển...</p>
//                         </div>
//                     )}

//                     {/* --- TAB: POSTCARD --- */}
//                     {activeTab === 'POSTCARD' && (
//                         <div className="pt-10 flex flex-col items-center justify-center text-zinc-500">
//                             <p>Tính năng Postcard/Podcast đang được phát triển...</p>
//                         </div>
//                     )}
//                 </div>
//             )}

//             <Footer />
//         </div>
//     );
// };

// export default HomePage;