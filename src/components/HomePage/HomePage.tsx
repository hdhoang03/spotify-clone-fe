import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import Section from './Section';
import TrendingSection from './TrendingSection';
import CardItem from '../common/CardItem';
import Footer from './Footer';
import FilterBar, { type TabType } from './FilterBar';
import { useHomeData } from './useHomeData';
import { useNavigate } from 'react-router-dom';
import { useMusic } from '../../contexts/MusicContent';
import React from 'react';
import { useTranslation } from 'react-i18next';

const HomePage = () => {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState<TabType>('ALL');
    const [isFollowingMode, setIsFollowingMode] = useState(false);

    const navigate = useNavigate();
    const { playRadio } = useMusic();

    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
        const userString = localStorage.getItem('user');
        return !!(userString && userString !== 'undefined');
    });

    /**
     * Phát nhạc từ trang chủ theo chế độ Radio.
     * @param song Bài hát vừa click
     * @param queue Toàn bộ danh sách bài để tạo queue (có thể là topStreamed, topLiked hoặc cả hai)
     */
    const handlePlaySong = (song: any, queue: any[]) => {
        // 1. Nếu bài hát bị lỗi (không có audio)
        if (!song?.audioUrl) {
            navigate(`/song/${song.id}`);
            return;
        }

        // 2. Phát Radio! (Cho phép cả khách và thành viên phát)
        const validQueue = queue.filter(s => !!s?.audioUrl);
        const startIndex = validQueue.findIndex(s => s.id === song.id);
        playRadio(validQueue, startIndex >= 0 ? startIndex : 0, t('home.playing_randomly'));
    };

    React.useEffect(() => {
        const checkLoginStatus = () => {
            const userString = localStorage.getItem('user');
            setIsLoggedIn(!!(userString && userString !== 'undefined'));
        };

        window.addEventListener('user-update', checkLoginStatus);
        return () => window.removeEventListener('user-update', checkLoginStatus);
    }, []);

    const { data, isLoading } = useHomeData(activeTab, isFollowingMode);

    return (
        <div className="w-full min-h-screen bg-transparent overflow-x-hidden">
            <FilterBar
                activeTab={activeTab}
                onTabChange={(tab) => {
                    setActiveTab(tab);
                    if (tab === 'ARTIST') setIsFollowingMode(false);
                }}
                isFollowingMode={isFollowingMode}
                onToggleFollowing={() => setIsFollowingMode(!isFollowingMode)}
                isLoggedIn={isLoggedIn}
            />

            <div className="px-4 md:px-8 mt-6 space-y-8 min-h-[50vh]">
                {isLoading ? (
                    <div className="w-full h-64 flex items-center justify-center gap-3">
                        <Loader2 className="animate-spin text-green-500" size={28} />
                        <span className="font-medium text-gray-400">{t('home.syncing')}</span>
                    </div>
                ) : (
                    <>
                        {/* --- TAB ALL HOẶC TAB MUSIC --- */}
                        {activeTab !== 'ARTIST' && (
                            <>
                                {data.topStreamedSongs.length > 0 && (
                                    <Section title={t('home.trending')}>
                                        {data.topStreamedSongs.map((song) => (
                                            <CardItem
                                                key={song.id}
                                                title={song.title}
                                                description={song.artist}
                                                imageUrl={song.coverUrl}
                                                onClick={() => handlePlaySong(song, data.topStreamedSongs)}
                                            />
                                        ))}
                                    </Section>
                                )}

                                {data.topLikedSongs.length > 0 && (
                                    <TrendingSection
                                        songs={data.topLikedSongs}
                                        onPlay={(song) => handlePlaySong(song, data.topLikedSongs)}
                                    />
                                )}

                                {data.newAlbums.length > 0 && activeTab === 'ALL' && (
                                    <Section title={t('home.new_albums')}>
                                        {data.newAlbums.map((album) => (
                                            <CardItem
                                                key={album.id}
                                                title={album.name}
                                                description={album.artist?.name || album.artistName || 'Album tuyển chọn'}
                                                imageUrl={album.albumUrl || album.avatarUrl || album.coverUrl}
                                                onClick={() => navigate(`/albums/${album.id}`)}
                                            />
                                        ))}
                                    </Section>
                                )}
                            </>
                        )}

                        {/* --- TAB ARTIST (hiện trong ALL + tab ARTIST riêng) --- */}
                        {(activeTab === 'ALL' || activeTab === 'ARTIST') && data.artists.length > 0 && (
                            <Section title={isFollowingMode ? t('home.following_artists') : t('home.featured_artists')}>
                                {data.artists.map((artist) => (
                                    <CardItem
                                        key={artist.id}
                                        title={artist.name}
                                        description={t('home.artist_role')}
                                        imageUrl={artist.avatarUrl}
                                        isRound={true}
                                        onClick={() => navigate(`/artist/${artist.id}`)}
                                    />
                                ))}
                            </Section>
                        )}

                        {/* Trống khi bật following mode */}
                        {isFollowingMode &&
                            data.topStreamedSongs.length === 0 &&
                            data.topLikedSongs.length === 0 &&
                            data.artists.length === 0 && (
                                <div className="text-center py-12 text-gray-500">
                                    {t('home.no_following')}
                                </div>
                            )}
                    </>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default HomePage;