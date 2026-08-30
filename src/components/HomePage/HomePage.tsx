import { useState, useMemo } from 'react';
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
import { GreetingHeader } from './GreetingHeader';
import { SmartPicksSection } from './SmartPicksSection';
import { ThrowbackSection } from './ThrowbackSection';
import { getUICache } from '../../utils/userStorage';

const HomePage = () => {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState<TabType>('ALL');
    const [isFollowingMode, setIsFollowingMode] = useState(false);

    const navigate = useNavigate();
    const { playRadio, currentSong, isPlaying } = useMusic();

    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
        return !!getUICache();
    });

    const handlePlaySong = (song: any, queue: any[]) => {
        if (!song?.audioUrl) {
            navigate(`/song/${song.id}`);
            return;
        }
        const validQueue = queue.filter(s => !!s?.audioUrl);
        const startIndex = validQueue.findIndex(s => s.id === song.id);
        playRadio(validQueue, startIndex >= 0 ? startIndex : 0, t('home.playing_randomly'));
    };

    React.useEffect(() => {
        const checkLoginStatus = () => {
            setIsLoggedIn(!!getUICache());
        };
        window.addEventListener('user-update', checkLoginStatus);
        window.addEventListener('user-logout', checkLoginStatus);
        return () => {
            window.removeEventListener('user-update', checkLoginStatus);
            window.removeEventListener('user-logout', checkLoginStatus);
        };
    }, []);

    const { data, isLoading } = useHomeData(activeTab, isFollowingMode);

    // Shuffle secondary sections once per mount for dynamic layout
    const shuffledSectionKeys = useMemo(() => {
        return ['throwback', 'smartPicks', 'topLiked', 'newAlbums'].sort(() => 0.5 - Math.random());
    }, []);

    const renderSecondarySection = (key: string) => {
        switch (key) {
            case 'throwback':
                return data.myLikedSongs.length > 0 ? (
                    <ThrowbackSection
                        key="throwback"
                        likedSongs={data.myLikedSongs}
                        currentSong={currentSong}
                        isPlaying={isPlaying}
                        onPlay={handlePlaySong}
                    />
                ) : null;
            case 'smartPicks':
                return data.allSongs.length > 0 ? (
                    <SmartPicksSection
                        key="smartPicks"
                        allSongs={data.allSongs}
                        likedSongs={data.myLikedSongs}
                        currentSong={currentSong}
                        isPlaying={isPlaying}
                        onPlay={handlePlaySong}
                    />
                ) : null;
            case 'topLiked':
                return data.topLikedSongs.length > 0 ? (
                    <TrendingSection
                        key="topLiked"
                        songs={data.topLikedSongs}
                        onPlay={(song) => handlePlaySong(song, data.topLikedSongs)}
                    />
                ) : null;
            case 'newAlbums':
                return data.newAlbums.length > 0 && activeTab === 'ALL' ? (
                    <Section key="newAlbums" title={t('home.new_albums')}>
                        {data.newAlbums.map((album) => (
                            <CardItem
                                key={album.id}
                                title={album.name}
                                description={album.artist?.name || album.artistName || 'Album tuyển chọn'}
                                imageUrl={album.albumUrl || album.avatarUrl || album.coverUrl}
                                shape="landscape"
                                onClick={() => navigate(`/albums/${album.id}`)}
                            />
                        ))}
                    </Section>
                ) : null;
            default:
                return null;
        }
    };

    return (
        <div className="w-full min-h-screen bg-transparent overflow-x-hidden relative">

            <GreetingHeader />

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

            <div className="px-4 md:px-8 mt-6 space-y-6 min-h-[50vh] relative z-10">
                {isLoading ? (
                    <div className="w-full h-64 flex items-center justify-center gap-3">
                        <Loader2 className="animate-spin text-primary-500" size={28} />
                        <span className="font-medium text-gray-400">{t('home.syncing')}</span>
                    </div>
                ) : (
                    <>
                        {/* ── Music & All tabs ── */}
                        {activeTab !== 'ARTIST' && (
                            <>
                                {/* Top Streamed or Fallback All Songs */}
                                {(data.topStreamedSongs.length > 0 ? data.topStreamedSongs : data.allSongs).length > 0 && (
                                    <Section title={data.topStreamedSongs.length > 0 ? t('home.trending') : 'Bài hát đề xuất'}>
                                        {(data.topStreamedSongs.length > 0 ? data.topStreamedSongs : data.allSongs.slice(0, 10)).map((song) => (
                                            <CardItem
                                                key={song.id}
                                                title={song.title}
                                                description={song.artist}
                                                imageUrl={song.coverUrl}
                                                isCurrent={currentSong?.id === song.id}
                                                isPlaying={currentSong?.id === song.id && isPlaying}
                                                onClick={() => handlePlaySong(song, data.topStreamedSongs.length > 0 ? data.topStreamedSongs : data.allSongs)}
                                            />
                                        ))}
                                    </Section>
                                )}

                                {/* Render shuffled secondary sections */}
                                {shuffledSectionKeys.map(renderSecondarySection)}
                            </>
                        )}

                        {/* ── Artist tab ── */}
                        {(activeTab === 'ALL' || activeTab === 'ARTIST') && data.artists.length > 0 && (
                            <Section title={isFollowingMode ? t('home.following_artists') : t('home.featured_artists')}>
                                {data.artists.map((artist) => (
                                    <CardItem
                                        key={artist.id}
                                        title={artist.name}
                                        description={t('home.artist_role')}
                                        imageUrl={artist.avatarUrl}
                                        shape="circle"
                                        onClick={() => navigate(`/artist/${artist.id}`)}
                                    />
                                ))}
                            </Section>
                        )}

                        {/* Empty following state */}
                        {isFollowingMode &&
                            data.topStreamedSongs.length === 0 &&
                            data.topLikedSongs.length === 0 &&
                            data.artists.length === 0 && (
                                <div className="text-center py-16 text-zinc-400 dark:text-zinc-500">
                                    <p className="text-sm font-medium">{t('home.no_following')}</p>
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