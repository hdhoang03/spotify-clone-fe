import { useState, useRef, useEffect } from 'react';
import { normalizeSong } from '../HomePage/useHomeData';
import { useParams } from 'react-router-dom';
import ProfileHeader from './components/ProfileHeader';
import ProfileActionBar from './components/ProfileActionBar';
import ProfileSection from './components/ProfileSection';
import TrackRow from './components/TrackRow';
import Footer from '../HomePage/Footer';
import FollowListModal from './components/FollowListModal';
import EditProfileModal from './components/EditProfileModal';
import ProfileShareCard from './components/ProfileShareCard';
import BackButton from '../../components/common/BackButton';
import { useProfileLogic } from './hooks/useProfileLogic';
import ConfirmModal from '../Admin/ConfirmModal';
import { Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useMusic } from '../../contexts/MusicContent';
import PageLoader from '../common/PageLoader';
import { useTranslation } from 'react-i18next';

const ProfilePage = () => {
    const { id } = useParams<{ id: string }>();
    const { profile, topTracks, playlists, following,
        playlistsWithNavigation, followingWithNavigation, publicPlaylistCount,
        isLoading, isOwnProfile, isPrivateError,
        // privateFollowing, handleToggleFollowPrivate,
        handleUpdateProfile,
        handleToggleFollowUser, openBlockConfirm, closeBlockConfirm, confirmBlockModal, handleToggleBlockUser
    } = useProfileLogic(id);
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { playPlaylist, currentSong } = useMusic();
    const token = localStorage.getItem('token');
    const isLoggedIn = !!token && token !== 'null' && token !== 'undefined';

    const [showAllTracks, setShowAllTracks] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [listType, setListType] = useState<'followers' | 'following' | null>(null);

    // Xử lý Sticky Header
    const [isSticky, setIsSticky] = useState(false);
    const headerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isLoading || !profile) return;

        const observer = new IntersectionObserver(([entry]) => {
            setIsSticky(!entry.isIntersecting);
        }, { threshold: 0 });

        if (headerRef.current) {
            observer.observe(headerRef.current);
        }

        return () => observer.disconnect();
    }, [isLoading, profile]);

    if (isLoading) return <PageLoader />;

    // Trường hợp API trả về 1014 (private) mà không có profile data
    if (isPrivateError && !profile) {
        return (
            <div className="relative min-h-screen transition-colors duration-300 bg-white dark:bg-[#121212]">
                <div className="absolute top-4 left-4 z-20">
                    <BackButton className="bg-black/20 backdrop-blur-sm p-1 rounded-full text-white" />
                </div>

                {/* Header giả lập với lock icon */}
                <div className="flex items-end gap-6 px-6 md:px-8 py-10 bg-gradient-to-b from-sky-300 to-sky-100 dark:from-zinc-700 dark:to-zinc-900 min-h-[220px]">
                    <div className="w-28 h-28 md:w-36 md:h-36 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center shadow-2xl flex-shrink-0">
                        <Lock size={48} className="text-zinc-500 dark:text-zinc-400" />
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-xs font-bold uppercase tracking-widest text-zinc-600 dark:text-zinc-400">{t('profile.header_label')}</span>
                        <h1 className="text-3xl md:text-5xl font-extrabold text-zinc-900 dark:text-white">{t('profile.private_profile')}</h1>
                    </div>
                </div>

                {/* Action bar với nút Follow + Block */}
                <div className="flex items-center justify-end gap-4 px-6 md:px-8 py-3">
                    {/* <button
                            onClick={handleToggleFollowPrivate}
                            className={`px-6 py-2 rounded-full text-sm font-bold border transition active:scale-95 ${privateFollowing
                                ? 'border-zinc-400 dark:border-zinc-600 text-zinc-900 dark:text-white hover:scale-105'
                                : 'bg-primary-500 text-white border-transparent hover:bg-primary-600 hover:scale-105'
                                }`}
                        >
                            {privateFollowing ? 'Following' : 'Follow'}
                        </button> */}
                    <button
                        onClick={openBlockConfirm}
                        className="px-4 py-2 rounded-full text-sm font-medium text-red-500 border border-red-300 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-500/10 transition"
                    >
                        {t('profile.block')}
                    </button>
                </div>

                {/* Content body riêng tư */}
                <div className="px-6 md:px-8 pb-24 pt-4">
                    <div className="flex flex-col items-center justify-center mt-10 opacity-70">
                        <div className="w-24 h-24 bg-zinc-200 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-6">
                            <Lock size={40} className="text-zinc-500 dark:text-zinc-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">{t('profile.private_account')}</h2>
                        <p className="text-zinc-500 text-center max-w-sm">{t('profile.private_desc')}</p>
                    </div>
                </div>

                {/* Confirm modal chặn */}
                <ConfirmModal
                    isOpen={confirmBlockModal.isOpen}
                    onClose={closeBlockConfirm}
                    onConfirm={async () => { closeBlockConfirm(); const ok = await handleToggleBlockUser(); if (ok) navigate('/search'); }}
                    type={confirmBlockModal.type}
                    title={t('profile.block_confirm_title')}
                    message={t('profile.block_confirm_desc')}
                />
            </div>
        );
    }

    if (!profile) return <div className="h-screen flex items-center justify-center bg-white dark:bg-[#121212] text-zinc-900 dark:text-white">{t('profile.user_not_found')}</div>;

    // isPrivate: có profile data nhưng publicProfile=false, HOẶC API báo 403
    const isPrivate = (!isOwnProfile && !profile.publicProfile) || isPrivateError;


    const handlePlaySong = (song: any) => {
        // Yêu cầu đăng nhập trước khi phát nhạc
        if (!isLoggedIn) {
            window.dispatchEvent(new Event('open-auth-modal'));
            return;
        }

        const audioLink = song.audioUrl || song.url || song.fileUrl || '';

        if (!audioLink) {
            console.warn('[Profile] Bài hát thiếu audioUrl:', song);
            alert("Bài hát này chưa có link Audio từ API. Mở F12 để xem log.");
            return;
        }

        // Dùng normalizeSong để đảm bảo đầy đủ: artistId, albumId, albumName, ...
        // (cần cho Lyrics + ExtraInfo hiển thị đúng)
        const formattedSong = normalizeSong(song);
        playPlaylist([formattedSong], 0);
    };

    const onBlockUserExecute = async () => {
        closeBlockConfirm();
        const isSuccess = await handleToggleBlockUser();
        if (isSuccess) {
            navigate('/search');
        }
    };

    const visibleTracks = showAllTracks ? topTracks : topTracks.slice(0, 5);

    return (
        <div className="relative min-h-screen transition-colors duration-300 bg-white dark:bg-[#121212]">
            <div className="absolute top-4 left-4 z-20">
                <BackButton className="bg-black/20 backdrop-blur-sm p-1 rounded-full text-white" />
            </div>

            {/* Header Area */}
            <div ref={headerRef}>
                <ProfileHeader
                    user={{ ...profile, playlistCount: publicPlaylistCount }}
                    isOwnProfile={isOwnProfile}
                    onEditClick={() => setIsEditModalOpen(true)}
                    onShowFollowers={() => setListType('followers')}
                    onShowFollowing={() => setListType('following')}
                />
            </div>

            {/* Sticky Action Bar */}
            <div className="sticky top-0 z-40">
                <ProfileActionBar
                    isOwnProfile={isOwnProfile}
                    isFollowing={isLoggedIn ? profile.isFollowedByMe : false}
                    onToggleFollow={handleToggleFollowUser}
                    onEditProfile={() => setIsEditModalOpen(true)}
                    onShareProfile={() => setIsShareModalOpen(true)}
                    onToggleBlock={openBlockConfirm}
                    userName={profile.name || profile.username}
                    avatarUrl={profile.avatarUrl}
                    isSticky={isSticky}
                    isLoggedIn={isLoggedIn}
                />
            </div>

            {/* Content Body */}
            <div className="px-6 md:px-8 space-y-10 pb-24 pt-6 w-full min-h-[50vh]">
                {isPrivate ? (
                    <div className="flex flex-col items-center justify-center mt-10 opacity-70">
                        <div className="w-24 h-24 bg-zinc-200 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-6">
                            <Lock size={40} className="text-zinc-500 dark:text-zinc-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">{t('profile.private_account')}</h2>
                        <p className="text-zinc-500 text-center max-w-sm">{t('profile.private_desc')}</p>
                    </div>
                ) : (
                    <>
                        {isOwnProfile && topTracks.length > 0 && (
                            <section>
                                <div className="flex justify-between items-end mb-4">
                                    <h2 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">{t('profile.top_tracks')}</h2>
                                    <span className="text-sm font-bold text-zinc-500">{t('profile.only_visible_to_you')}</span>
                                </div>
                                <div className="flex flex-col">
                                    {visibleTracks.map((song, index) => (
                                        <TrackRow
                                            key={song.songId}
                                            index={index}
                                            songId={song.songId}
                                            coverUrl={song.coverUrl}
                                            title={song.songTitle}
                                            artist={song.artistName}
                                            duration={song.duration || 0}
                                            streamCount={song.streamCount}
                                            userStreamCount={song.likeCount !== undefined ? Number(song.likeCount) : undefined}
                                            onClick={() => handlePlaySong(song)}
                                            isPlaying={currentSong?.id === song.songId}
                                            isActive={currentSong?.id === song.songId}
                                        />
                                    ))}
                                </div>

                                {/* 🌟 4. NÚT SEE MORE / SEE LESS CHỈ XUẤT HIỆN KHI MẢNG GỐC CÓ TRÊN 5 BÀI */}
                                {topTracks.length > 5 && (
                                    <div className="mt-4 flex justify-start">
                                        <button
                                            onClick={() => setShowAllTracks(!showAllTracks)}
                                            className="text-sm font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors duration-200"
                                        >
                                            {showAllTracks ? t('profile.see_less') : t('profile.see_more')}
                                        </button>
                                    </div>
                                )}
                            </section>
                        )}

                        {playlists.length > 0 && (
                            <ProfileSection
                                title={isOwnProfile ? t('profile.your_playlists') : t('profile.public_playlists')}
                                items={playlistsWithNavigation} // Sử dụng list đã có navigation
                            />
                        )}

                        {following.length > 0 && (
                            <ProfileSection
                                title={t('profile.following_artists')}
                                items={followingWithNavigation} // Sử dụng list đã có navigation
                            />
                        )}
                    </>
                )}
            </div>

            <Footer />

            {/* Modals */}
            <FollowListModal isOpen={listType !== null} onClose={() => setListType(null)} userId={profile.id} type={listType || 'followers'} />
            <EditProfileModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} currentName={profile.name} currentAvatar={profile.avatarUrl} onSave={async (n, f, r) => { await handleUpdateProfile(n, f, r); setIsEditModalOpen(false); }} />
            <ProfileShareCard isOpen={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} user={profile} dominantColor="#22c55e" />
            <ConfirmModal
                isOpen={confirmBlockModal.isOpen}
                onClose={closeBlockConfirm}
                onConfirm={onBlockUserExecute}
                type={confirmBlockModal.type}
                title={confirmBlockModal.title}
                message={confirmBlockModal.message}
            />
        </div>
    );
};

export default ProfilePage;