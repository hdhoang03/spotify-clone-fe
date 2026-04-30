// import { useState, useEffect, useRef } from 'react';
// import { FastAverageColor } from 'fast-average-color';
// import { MoreHorizontal, Share2, Edit2, Lock } from 'lucide-react';
// import EditProfileModal from './EditProfileModal';
// import ProfileShareCard from './ProfileShareCard';

// interface ProfileHeaderProps {
//     user: any; // Bạn có thể thay bằng type UserProfileResponse đã định nghĩa
//     isOwnProfile: boolean;
//     onUpdateProfile: (name: string, file: File | null, isRemoved?: boolean) => Promise<boolean>;
//     onFollowToggle: () => void;
//     onShowFollowers: () => void; // MỚI
//     onShowFollowing: () => void; // MỚI
// }

// const ProfileHeader = ({ user, isOwnProfile, onUpdateProfile, onFollowToggle, onShowFollowers, onShowFollowing }: ProfileHeaderProps) => {
//     const [dominantColor, setDominantColor] = useState('#535353');
//     const [isDarkBackground, setIsDarkBackground] = useState(true);
//     const [isMenuOpen, setIsMenuOpen] = useState(false);
//     const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//     const [isShareModalOpen, setIsShareModalOpen] = useState(false);

//     const menuRef = useRef<HTMLDivElement>(null);

//     // 1. Lấy màu trung bình từ Avatar
//     useEffect(() => {
//         if (user.avatarUrl) {
//             const fac = new FastAverageColor();
//             fac.getColorAsync(user.avatarUrl, { algorithm: 'dominant' })
//                 .then(color => {
//                     setDominantColor(color.hex);
//                     setIsDarkBackground(color.isDark);
//                 })
//                 .catch(() => {
//                     setDominantColor('#535353');
//                     setIsDarkBackground(true);
//                 });
//         }
//     }, [user.avatarUrl]);

//     // 2. Đóng dropdown menu khi click ra ngoài
//     useEffect(() => {
//         const handleClickOutside = (event: MouseEvent) => {
//             if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
//                 setIsMenuOpen(false);
//             }
//         };
//         document.addEventListener('mousedown', handleClickOutside);
//         return () => document.removeEventListener('mousedown', handleClickOutside);
//     }, []);

//     if (!user) return null;

//     return (
//         <>
//             {/* THÔNG TIN HEADER (ẢNH + TÊN) */}
//             {/* <div
//                 className="relative w-full h-[300px] md:h-[300px] flex items-end md:p-8 transition-colors duration-700 ease-in-out"
//                 style={{ background: `linear-gradient(to bottom, ${dominantColor} 0%, rgba(18, 18, 18, 0.6) 100%)` }}
//             > */}
//             <div
//                 className="relative w-full h-[300px] md:h-[300px] flex items-end md:p-8 transition-colors duration-700 ease-in-out overflow-hidden"
//                 style={{ backgroundColor: dominantColor }}
//             >
//                 {/* 2. LỚP LÓT BẢO VỆ CHỮ (BÍ QUYẾT Ở ĐÂY) */}
//                 {/* Ở Light Mode: Nó tỏa màu Trắng từ dưới lên. Ở Dark Mode: Nó tỏa màu Đen từ dưới lên */}
//                 <div className="absolute inset-0 bg-gradient-to-t from-white via-white/60 to-transparent dark:from-[#121212] dark:via-[#121212]/60 dark:to-transparent pointer-events-none"></div>

//                 <div className="flex flex-col md:flex-row items-center md:items-end gap-6 relative z-10 w-full">
//                     {/* Phần Avatar giữ nguyên */}
//                     <div
//                         className="w-32 h-32 md:w-44 md:h-44 rounded-full shadow-2xl overflow-hidden flex-shrink-0 cursor-pointer group relative"
//                         onClick={() => isOwnProfile && setIsEditModalOpen(true)}
//                     >
//                         <img
//                             src={user.avatarUrl || `https://ui-avatars.com/api/?name=${user.name}&background=random`}
//                             alt={user.name}
//                             className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
//                             crossOrigin={user.avatarUrl && !user.avatarUrl.includes('ui-avatars') ? "anonymous" : undefined}
//                         />
//                         {isOwnProfile && (
//                             <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
//                                 <Edit2 size={24} className="text-white" />
//                             </div>
//                         )}
//                     </div>

//                     {/* 3. Phần Chữ: Bỏ hẳn logic màu phức tạp, chỉ cần dùng text-black dark:text-white */}
//                     <div className="flex flex-col gap-1 text-center md:text-left overflow-hidden w-full transition-colors duration-500 text-black dark:text-white">
//                         <span className="hidden md:block text-xs font-bold uppercase tracking-wider opacity-70">
//                             Profile
//                         </span>

//                         <h1
//                             className="text-3xl md:text-5xl lg:text-7xl font-black tracking-tighter truncate pb-2 cursor-pointer hover:opacity-80"
//                             onClick={() => isOwnProfile && setIsEditModalOpen(true)}
//                         >
//                             {user.name}
//                         </h1>

//                         <div className="flex items-center justify-center md:justify-start gap-2 text-sm font-medium transition-colors duration-500 text-black/70 dark:text-white/70">
//                             <span>{user.playlistCount || 0} Playlists</span>
//                             <span className="text-[6px]">●</span>

//                             <span
//                                 className={`${user.publicProfile || isOwnProfile ? 'hover:underline cursor-pointer' : 'opacity-70'}`}
//                                 onClick={() => { if (user.publicProfile || isOwnProfile) onShowFollowers() }}
//                             >
//                                 {user.followerCount || 0} Followers
//                             </span>

//                             <span className="text-[6px]">●</span>

//                             <span
//                                 className={`${user.publicProfile || isOwnProfile ? 'hover:underline cursor-pointer' : 'opacity-70'}`}
//                                 onClick={() => { if (user.publicProfile || isOwnProfile) onShowFollowing() }}
//                             >
//                                 {user.followingCount || 0} Following
//                             </span>
//                         </div>
//                     </div>


//                     {/* <div className="flex items-center justify-center md:justify-start gap-2 text-sm font-medium transition-colors duration-500 text-black/70 dark:text-white/70">
//                         <span>{user.playlistCount || 0} Playlists</span>
//                         <span className="text-[6px]">●</span>

//                         <span
//                             className={`${user.publicProfile || isOwnProfile ? 'hover:underline cursor-pointer' : 'opacity-70'}`}
//                             onClick={() => { if (user.publicProfile || isOwnProfile) onShowFollowers() }}
//                         >
//                             {user.followerCount || 0} Followers
//                         </span>

//                         <span className="text-[6px]">●</span>

//                         <span
//                             className={`${user.publicProfile || isOwnProfile ? 'hover:underline cursor-pointer' : 'opacity-70'}`}
//                             onClick={() => { if (user.publicProfile || isOwnProfile) onShowFollowing() }}
//                         >
//                             {user.followingCount || 0} Following
//                         </span>
//                     </div> */}

//                 </div>
//             </div>

//             {/* NÚT THAO TÁC (ACTIONS) */}
//             <div className="p-6 flex items-center gap-4 relative z-30">
//                 {!isOwnProfile && (
//                     <button
//                         onClick={onFollowToggle}
//                         className={`px-8 py-1.5 rounded-full text-sm font-bold tracking-widest border transition ${user.isFollowedByMe
//                             ? 'border-white/30 text-white hover:border-white'
//                             : 'border-transparent bg-white text-black hover:scale-105'
//                             }`}
//                     >
//                         {user.isFollowedByMe ? 'FOLLOWING' : 'FOLLOW'}
//                     </button>
//                 )}

//                 {/* Dropdown Menu */}
//                 <div className="relative" ref={menuRef}>
//                     <button
//                         onClick={() => setIsMenuOpen(!isMenuOpen)}
//                         className="text-[#b3b3b3] hover:text-white transition"
//                     >
//                         <MoreHorizontal size={32} />
//                     </button>

//                     {isMenuOpen && (
//                         <div className="absolute top-10 left-0 w-44 bg-[#282828] text-white rounded shadow-2xl p-1 z-50">
//                             {isOwnProfile && (
//                                 <button
//                                     onClick={() => { setIsEditModalOpen(true); setIsMenuOpen(false); }}
//                                     className="w-full text-left px-3 py-2.5 text-sm text-white/90 hover:bg-[#3e3e3e] rounded-sm font-medium flex justify-between items-center"
//                                 >
//                                     Edit profile <Edit2 size={16} />
//                                 </button>
//                             )}

//                             <button
//                                 onClick={() => { setIsShareModalOpen(true); setIsMenuOpen(false); }}
//                                 className="w-full text-left px-3 py-2.5 text-sm text-white/90 hover:bg-[#3e3e3e] rounded-sm font-medium flex justify-between items-center"
//                             >
//                                 Share profile <Share2 size={16} />
//                             </button>

//                             {isOwnProfile && (
//                                 <>
//                                     <div className="h-[1px] bg-white/10 my-1"></div>
//                                     <button className="w-full text-left px-3 py-2.5 text-sm text-white/50 cursor-not-allowed rounded-sm font-medium flex justify-between items-center">
//                                         Privacy Settings <Lock size={14} />
//                                     </button>
//                                 </>
//                             )}
//                         </div>
//                     )}
//                 </div>
//             </div>

//             {/* CÁC MODALS GẮN KÈM */}
//             <EditProfileModal
//                 isOpen={isEditModalOpen}
//                 onClose={() => setIsEditModalOpen(false)}
//                 currentName={user.name}
//                 currentAvatar={user.avatarUrl}
//                 onSave={async (name, file, isRemoved) => {
//                     const success = await onUpdateProfile(name, file, isRemoved);
//                     if (success) setIsEditModalOpen(false);
//                 }}
//             />

//             <ProfileShareCard
//                 isOpen={isShareModalOpen}
//                 onClose={() => setIsShareModalOpen(false)}
//                 user={user}
//                 dominantColor={dominantColor}
//             />
//         </>
//     );
// };

// export default ProfileHeader;

import React, { useState, useEffect } from 'react';
import { FastAverageColor } from 'fast-average-color';
import { Edit2 } from 'lucide-react';

interface ProfileHeaderProps {
    user: any;
    isOwnProfile: boolean;
    onEditClick: () => void;
    onShowFollowers: () => void;
    onShowFollowing: () => void;
}

const ProfileHeader = ({ user, isOwnProfile, onEditClick, onShowFollowers, onShowFollowing }: ProfileHeaderProps) => {
    const [dominantColor, setDominantColor] = useState('#535353');

    useEffect(() => {
        if (user?.avatarUrl) {
            new FastAverageColor().getColorAsync(user.avatarUrl, { algorithm: 'dominant' })
                .then(color => setDominantColor(color.hex))
                .catch(() => setDominantColor('#535353'));
        }
    }, [user?.avatarUrl]);

    if (!user) return null;

    return (
        <div
            className="relative w-full h-[35vh] md:h-[45vh] flex items-end px-6 md:px-8 pb-6 transition-colors duration-700"
            style={{ backgroundColor: dominantColor }}
        >
            {/* Lớp Overlay để màu dịu lại ở mép dưới */}
            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent dark:from-[#121212] dark:via-[#121212]/40 dark:to-transparent pointer-events-none" />

            <div className="flex flex-col md:flex-row items-center md:items-end gap-6 relative z-10 w-full">

                {/* Avatar lớn */}
                <div
                    className={`w-32 h-32 md:w-56 md:h-56 rounded-full shadow-2xl overflow-hidden flex-shrink-0 relative group ${isOwnProfile ? 'cursor-pointer' : ''}`}
                    onClick={() => isOwnProfile && onEditClick()}
                >
                    <img
                        src={user.avatarUrl || `https://ui-avatars.com/api/?name=${user.name || user.username}`}
                        alt={user.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        crossOrigin="anonymous"
                    />
                    {isOwnProfile && (
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity text-white">
                            <Edit2 size={32} className="mb-2" />
                            <span className="font-bold text-sm">Choose photo</span>
                        </div>
                    )}
                </div>

                {/* Info */}
                <div className="flex flex-col text-center md:text-left text-black dark:text-white w-full">
                    <span className="hidden md:block text-sm font-bold uppercase tracking-wider opacity-80 mb-2">Profile</span>

                    <h1 className="text-4xl md:text-7xl lg:text-8xl font-black tracking-tighter truncate pb-2 drop-shadow-md">
                        {user.name || user.username}
                    </h1>

                    {/* Stats Clickable */}
                    <div className="flex items-center justify-center md:justify-start gap-2 text-sm md:text-base font-medium opacity-90 mt-2">
                        <span>{user.playlistCount || 0} Public Playlists</span>
                        <span className="text-[8px] opacity-50">●</span>

                        <span
                            className={`${user.publicProfile || isOwnProfile ? 'hover:underline cursor-pointer font-bold' : 'opacity-70'}`}
                            onClick={() => { if (user.publicProfile || isOwnProfile) onShowFollowers() }}
                        >
                            {user.followerCount || 0} Followers
                        </span>

                        <span className="text-[8px] opacity-50">●</span>

                        <span
                            className={`${user.publicProfile || isOwnProfile ? 'hover:underline cursor-pointer font-bold' : 'opacity-70'}`}
                            onClick={() => { if (user.publicProfile || isOwnProfile) onShowFollowing() }}
                        >
                            {user.followingCount || 0} Following
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileHeader;