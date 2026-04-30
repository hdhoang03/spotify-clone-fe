// import { useParams } from 'react-router-dom';
// import ProfileHeader from './ProfileHeader';
// import ProfileSection from './ProfileSection';
// import TrackRow from './TrackRow';
// import Footer from '../HomePage/Footer';
// import { useProfileLogic } from './useProfileLogic';
// import { Loader2 } from 'lucide-react';
// import BackButton from '../../components/common/BackButton';

// const ProfilePage = () => {
//     // Lấy ID từ thanh URL (Ví dụ: /profile/123). Nếu rỗng, hook sẽ tự lấy "me"
//     const { id } = useParams<{ id: string }>();

//     // Khai báo Custom Hook
//     const {
//         profile, topTracks, playlists, following,
//         isLoading, isOwnProfile,
//         handleUpdateProfile, handleToggleFollowUser
//     } = useProfileLogic(id);

//     if (isLoading) {
//         return <div className="h-full flex justify-center items-center"><Loader2 className="animate-spin text-white" size={40} /></div>;
//     }

//     if (!profile) {
//         // return <div className="h-full flex justify-center items-center text-white">User not found!</div>;
//         return <div className="h-full flex justify-center items-center text-black dark:text-white">User not found!</div>;
//     }

//     return (
//         // <div className="min-h-screen bg-[#121212] overflow-y-auto custom-scrollbar relative">
//         <div className="min-h-screen bg-white dark:bg-[#121212] overflow-y-auto custom-scrollbar relative">
//             <div className="absolute top-4 left-4 z-20 md:hidden">
//                 <BackButton className="bg-black/20 backdrop-blur-sm p-1 rounded-full text-white" />
//             </div>
//             <ProfileHeader
//                 user={profile}
//                 isOwnProfile={isOwnProfile}
//                 onUpdateProfile={handleUpdateProfile}
//                 onFollowToggle={handleToggleFollowUser} // Chuyền thêm hàm follow
//             />

//             <div className="px-6 relative z-10 -mt-6">
//                 {/* TOP TRACKS CỦA THÁNG (Chỉ hiện nếu có dữ liệu) */}
//                 {topTracks.length > 0 && (
//                     <section className="mb-8">
//                         <div className="flex justify-between items-end mb-4">
//                             {/* <h2 className="text-2xl font-bold text-white tracking-tight">Top tracks this month</h2> */}
//                             <h2 className="text-2xl font-bold text-black dark:text-white tracking-tight">Top tracks this month</h2>
//                             <span className="text-sm font-bold text-[#b3b3b3]">Only visible to you</span>
//                         </div>
//                         <div className="flex flex-col">
//                             {topTracks.map((song, index) => (
//                                 <TrackRow
//                                     key={song.songId}
//                                     index={index}
//                                     coverUrl={song.coverUrl}
//                                     title={song.songTitle}
//                                     artist={song.artistName}
//                                     duration={song.duration || 0}
//                                     streamCount={song.likeCount}
//                                 />
//                             ))}
//                         </div>
//                     </section>
//                 )}

//                 {/* DANH SÁCH PLAYLIST */}
//                 {playlists.length > 0 && (
//                     <ProfileSection
//                         title={isOwnProfile ? "Your Playlists" : "Public Playlists"}
//                         items={playlists}
//                         onShowAll={playlists.length > 5 ? () => console.log('Show all playlist') : undefined}
//                     />
//                 )}

//                 {/* DANH SÁCH ĐANG THEO DÕI */}
//                 {following.length > 0 && (
//                     <ProfileSection
//                         title="Following"
//                         items={following.slice(0, 5)}
//                         onShowAll={following.length > 5 ? () => console.log('Show all following') : undefined}
//                     />
//                 )}
//             </div>

//             <Footer />
//         </div>
//     );
// };

// export default ProfilePage;

// src/components/Profile/ProfilePage.tsx
import { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ProfileHeader from './ProfileHeader';
import ProfileActionBar from './ProfileActionBar';
import ProfileSection from './ProfileSection';
import TrackRow from './TrackRow';
import Footer from '../HomePage/Footer';
import FollowListModal from './FollowListModal';
import EditProfileModal from './EditProfileModal';
import ProfileShareCard from './ProfileShareCard';
import BackButton from '../../components/common/BackButton';
import { useProfileLogic } from './useProfileLogic';
import { Loader2, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
    const { id } = useParams<{ id: string }>();
    const { profile, topTracks, playlists, following, isLoading, isOwnProfile, handleUpdateProfile, handleToggleFollowUser, handleToggleBlockUser } = useProfileLogic(id);
    const navigate = useNavigate();
    // States cho UI Modal
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [listType, setListType] = useState<'followers' | 'following' | null>(null);

    // Xử lý Sticky Header
    const [isSticky, setIsSticky] = useState(false);
    const headerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => setIsSticky(!entry.isIntersecting), { threshold: 0, rootMargin: "-64px 0px 0px 0px" });
        if (headerRef.current) observer.observe(headerRef.current);
        return () => observer.disconnect();
    }, [profile]);

    if (isLoading) return <div className="h-screen flex items-center justify-center bg-white dark:bg-[#121212]"><Loader2 className="animate-spin text-green-500" size={40} /></div>;
    if (!profile) return <div className="h-screen flex items-center justify-center bg-white dark:bg-[#121212] text-zinc-900 dark:text-white">Không tìm thấy người dùng!</div>;

    const isPrivate = !isOwnProfile && !profile.publicProfile;

    const playlistsWithNavigation = playlists.map(p => ({
        ...p,
        onClick: () => navigate(`/playlist/${p.id}`) //
    }));

    const followingWithNavigation = following.map(a => ({
        ...a,
        onClick: () => navigate(`/artist/${a.id}`)
    }));

    return (
        <div className="relative min-h-screen transition-colors duration-300 bg-white dark:bg-[#121212]">
            <div className="absolute top-4 left-4 z-20 md:hidden">
                <BackButton className="bg-black/20 backdrop-blur-sm p-1 rounded-full text-white" />
            </div>

            {/* Header Area */}
            <div ref={headerRef}>
                <ProfileHeader
                    user={profile}
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
                    isFollowing={profile.isFollowedByMe}
                    onToggleFollow={handleToggleFollowUser}
                    onEditProfile={() => setIsEditModalOpen(true)}
                    onShareProfile={() => setIsShareModalOpen(true)}
                    onToggleBlock={handleToggleBlockUser}
                    userName={profile.name || profile.username}
                    avatarUrl={profile.avatarUrl}
                    isSticky={isSticky}
                />
            </div>

            {/* Content Body */}
            <div className="px-6 md:px-8 space-y-10 pb-24 pt-6 w-full min-h-[50vh]">
                {isPrivate ? (
                    <div className="flex flex-col items-center justify-center mt-10 opacity-70">
                        <div className="w-24 h-24 bg-zinc-200 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-6">
                            <Lock size={40} className="text-zinc-500 dark:text-zinc-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">Hồ sơ này là riêng tư</h2>
                        <p className="text-zinc-500 text-center max-w-sm">Tài khoản này đã thiết lập quyền riêng tư. Bạn không thể xem danh sách nhạc và bạn bè của họ.</p>
                    </div>
                ) : (
                    <>
                        {topTracks.length > 0 && (
                            <section>
                                <div className="flex justify-between items-end mb-4">
                                    <h2 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">Top tracks this month</h2>
                                    <span className="text-sm font-bold text-zinc-500">Only visible to you</span>
                                </div>
                                <div className="flex flex-col">
                                    {topTracks.map((song, index) => <TrackRow key={song.songId} index={index} coverUrl={song.coverUrl} title={song.songTitle} artist={song.artistName} duration={song.duration || 0} streamCount={song.likeCount} />)}
                                </div>
                            </section>
                        )}
                        {/* {playlists.length > 0 && <ProfileSection title={isOwnProfile ? "Your Playlists" : "Public Playlists"} items={playlists} />}
                        {following.length > 0 && <ProfileSection title="Following" items={following.slice(0, 5)} />} */}

                        {playlists.length > 0 && (
                            <ProfileSection
                                title={isOwnProfile ? "Your Playlists" : "Public Playlists"}
                                items={playlistsWithNavigation} // Sử dụng list đã có navigation
                            />
                        )}

                        {following.length > 0 && (
                            <ProfileSection
                                title="Following"
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
        </div>
    );
};

export default ProfilePage;