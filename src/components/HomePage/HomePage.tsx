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