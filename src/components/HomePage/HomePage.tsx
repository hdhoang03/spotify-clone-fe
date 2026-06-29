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
    const { playRadio, currentSong, isPlaying } = useMusic();

    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
        const userString = localStorage.getItem('user');
        return !!(userString && userString !== 'undefined');
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
            const userString = localStorage.getItem('user');
            setIsLoggedIn(!!(userString && userString !== 'undefined'));
        };
        window.addEventListener('user-update', checkLoginStatus);
        return () => window.removeEventListener('user-update', checkLoginStatus);
    }, []);

    const { data, isLoading } = useHomeData(activeTab, isFollowingMode);

    return (
        <div className="w-full min-h-screen bg-transparent overflow-x-hidden relative">

            {/* ── Ambient orbs (subtle depth, 2026 aesthetic) ── */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute top-0 right-0 w-[520px] h-[520px]
                           rounded-full opacity-[0.07] dark:opacity-[0.04]
                           bg-primary-400 blur-[140px] -translate-y-1/4 translate-x-1/4"
            />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 left-0 w-[460px] h-[460px]
                           rounded-full opacity-[0.06] dark:opacity-[0.03]
                           bg-violet-500 blur-[160px] -translate-x-1/3"
            />

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

            <div className="px-4 md:px-8 mt-2 space-y-2 min-h-[50vh] relative z-10">
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
                                {data.topStreamedSongs.length > 0 && (
                                    <Section title={t('home.trending')}>
                                        {data.topStreamedSongs.map((song) => (
                                            <CardItem
                                                key={song.id}
                                                title={song.title}
                                                description={song.artist}
                                                imageUrl={song.coverUrl}
                                                isCurrent={currentSong?.id === song.id}
                                                isPlaying={currentSong?.id === song.id && isPlaying}
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

                        {/* ── Artist tab ── */}
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