// import { useState } from 'react';
// import { Camera, User, Mail, Calendar } from 'lucide-react';
// import { motion } from 'framer-motion';
// import EditProfileModal from '../Profile/EditProfileModal';
// import { useUserProfile } from '../../hooks/useUserProfile';

// const ProfileCard = () => {
//     const { user, isLoading, updateInfo, updateAvatar } = useUserProfile(); // Dữ liệu tự đồng bộ
//     const [isEditing, setIsEditing] = useState(false);
//     const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);

//     // State cục bộ để edit form (tránh giật lag khi gõ phím)
//     const [formData, setFormData] = useState<any>({});

//     // Đồng bộ form khi data user tải xong
//     if (!user && isLoading) return <div>Loading profile...</div>;
//     if (!user) return null;

//     // Hàm chuẩn bị dữ liệu khi bấm nút Edit
//     const handleStartEdit = () => {
//         setFormData({
//             name: user.name,
//             birthdate: user.birthdate || '',
//         });
//         setIsEditing(true);
//     };

//     // Hàm lưu Form Text
//     const handleSaveInfo = async () => {
//         await updateInfo(formData); // Gọi qua hook -> hook gọi service -> service lưu DB
//         setIsEditing(false);
//     };

//     // Hàm lưu Avatar từ Modal
//     const handleAvatarSave = async (newName: string, newFile: File | null, isRemoved?: boolean) => {
//         if (newName !== user.name) {
//             await updateInfo({ name: newName });
//         }
//         if (newFile) {
//             await updateAvatar(newFile);
//         } else if (isRemoved) {
//             await updateInfo({ avatarUrl: '' });
//         }
//     };

//     return (
//         <div className="bg-white dark:bg-zinc-900/50 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm transition-colors duration-300">
//             {/* Header */}
//             <div className="flex items-center justify-between mb-6">
//                 <h2 className="text-xl font-bold flex items-center gap-2 text-zinc-900 dark:text-white">
//                     <User className="text-blue-500" />
//                     Hồ sơ của tôi
//                 </h2>
//                 {!isEditing ? (
//                     <button onClick={handleStartEdit} className="text-sm font-bold text-green-500 hover:underline">
//                         Chỉnh sửa
//                     </button>
//                 ) : (
//                     <button onClick={() => setIsEditing(false)} className="text-sm font-bold text-zinc-500 hover:underline">
//                         Hủy bỏ
//                     </button>
//                 )}
//             </div>

//             <div className="flex flex-col md:flex-row gap-8 items-start">
//                 {/* Avatar Section */}
//                 <div className="relative group mx-auto md:mx-0 cursor-pointer" onClick={() => setIsAvatarModalOpen(true)}>
//                     <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-zinc-100 dark:border-zinc-800 shadow-lg">
//                         {user.avatarUrl ? (
//                             <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
//                         ) : (
//                             <div className="w-full h-full bg-green-500 flex items-center justify-center">
//                                 <span className="text-4xl font-bold text-white uppercase">{user.name.charAt(0)}</span>
//                             </div>
//                         )}
//                     </div>
//                     <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
//                         <Camera className="text-white" />
//                     </div>
//                 </div>

//                 {/* Form Section */}
//                 <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div className="space-y-1.5">
//                         <label className="text-xs font-bold text-zinc-500 uppercase">Tên hiển thị</label>
//                         <input
//                             disabled={!isEditing}
//                             value={isEditing ? formData.name : user.name}
//                             onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                             className="w-full bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white px-4 py-2.5 rounded-lg font-medium outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-70 disabled:cursor-not-allowed"
//                         />
//                     </div>
//                     {/* ... Các trường Email, Birthdate tương tự ... */}
//                     {/* Với Email nhớ để disabled luôn nhé */}
//                     <div className="space-y-1.5">
//                         <label className="text-xs font-bold text-zinc-500 uppercase">Email</label>
//                         <input
//                             disabled value={user.email}
//                             className="w-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 px-4 py-2.5 rounded-lg font-medium cursor-not-allowed"
//                         />
//                     </div>
//                 </div>
//             </div>

//             {isEditing && (
//                 <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-end mt-6 pt-6 border-t border-zinc-100 dark:border-zinc-800">
//                     <button
//                         onClick={handleSaveInfo}
//                         disabled={isLoading}
//                         className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white font-bold rounded-full transition-transform active:scale-95 shadow-lg disabled:opacity-50"
//                     >
//                         {isLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
//                     </button>
//                 </motion.div>
//             )}

//             <EditProfileModal
//                 isOpen={isAvatarModalOpen}
//                 onClose={() => setIsAvatarModalOpen(false)}
//                 currentName={user.name}
//                 currentAvatar={user.avatarUrl}
//                 onSave={handleAvatarSave}
//             />
//         </div>
//     );
// };

// export default ProfileCard;

import { useState, useEffect } from 'react';
import { Camera, User } from 'lucide-react';
import { motion } from 'framer-motion';
import EditProfileModal from '../Profile/EditProfileModal';
import { useUserProfile } from '../../hooks/useUserProfile';
import { useAccountSettings } from './useAccountSettings'; // Import Hook mới

const ProfileCard = () => {
    const { user, isLoading } = useUserProfile();
    const { updateProfile, isSavingProfile } = useAccountSettings(); // Lấy hàm và state từ Hook

    const [isEditing, setIsEditing] = useState(false);
    const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '' });

    useEffect(() => {
        if (user) setFormData({ name: user.name });
    }, [user]);

    if (!user && isLoading) return <div>Loading profile...</div>;
    if (!user) return null;

    const handleSaveInfo = async () => {
        const updatedUser = await updateProfile(formData.name, null, false);

        if (updatedUser) {
            const currentUserStr = localStorage.getItem('user');
            if (currentUserStr) {
                const currentUser = JSON.parse(currentUserStr);
                const newUser = { ...currentUser, name: updatedUser.name, avatarUrl: updatedUser.avatarUrl };
                localStorage.setItem('user', JSON.stringify(newUser));
            }

            alert("Cập nhật thông tin thành công!");
            setIsEditing(false);

            window.location.reload();
        } else {
            alert("Có lỗi xảy ra khi cập nhật!");
        }
    };

    const handleAvatarSave = async (newName: string, newFile: File | null, isRemoved?: boolean) => {
        const updatedUser = await updateProfile(newName, newFile, isRemoved);

        if (updatedUser) {
            const currentUserStr = localStorage.getItem('user');
            if (currentUserStr) {
                const currentUser = JSON.parse(currentUserStr);
                const newUser = { ...currentUser, name: updatedUser.name, avatarUrl: updatedUser.avatarUrl };
                localStorage.setItem('user', JSON.stringify(newUser));
            }

            alert("Cập nhật ảnh đại diện thành công!");
            setIsAvatarModalOpen(false);

            window.location.reload();
        } else {
            alert("Có lỗi xảy ra khi cập nhật ảnh!");
        }
    };

    return (
        <div className="bg-white dark:bg-zinc-900/50 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <User className="text-green-500" /> Hồ sơ cá nhân
                </h2>
                {!isEditing && (
                    <button onClick={() => setIsEditing(true)} className="text-sm font-bold text-green-600 hover:text-green-500 transition-colors">
                        Chỉnh sửa
                    </button>
                )}
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="relative group mx-auto md:mx-0 cursor-pointer" onClick={() => setIsAvatarModalOpen(true)}>
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-zinc-100 dark:border-zinc-800 shadow-xl relative bg-zinc-200">
                        <img src={user.avatarUrl || `https://ui-avatars.com/api/?name=${user.name}&background=random`} alt="Avatar" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Camera className="text-white" size={32} />
                        </div>
                    </div>
                </div>

                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-zinc-500 uppercase">Tên hiển thị</label>
                        <input
                            disabled={!isEditing} value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full bg-zinc-100 dark:bg-zinc-800 px-4 py-2.5 rounded-lg text-sm font-medium outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-70"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-zinc-500 uppercase">Email</label>
                        <input
                            disabled value={user.email}
                            className="w-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 px-4 py-2.5 rounded-lg text-sm font-medium cursor-not-allowed"
                        />
                    </div>
                </div>
            </div>

            {isEditing && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-end mt-6 pt-6 border-t border-zinc-100 dark:border-zinc-800 gap-3">
                    <button onClick={() => setIsEditing(false)} className="px-6 py-2 bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold rounded-full transition-colors">
                        Hủy
                    </button>
                    <button onClick={handleSaveInfo} disabled={isSavingProfile} className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white font-bold rounded-full transition-transform active:scale-95 shadow-lg disabled:opacity-50">
                        {isSavingProfile ? 'Đang lưu...' : 'Lưu thay đổi'}
                    </button>
                </motion.div>
            )}

            <EditProfileModal
                isOpen={isAvatarModalOpen} onClose={() => setIsAvatarModalOpen(false)}
                currentName={user.name} currentAvatar={user.avatarUrl}
                onSave={handleAvatarSave}
            />
        </div>
    );
};

export default ProfileCard;