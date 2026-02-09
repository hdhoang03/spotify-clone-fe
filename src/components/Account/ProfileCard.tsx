// // src/components/Account/components/ProfileCard.tsx
// import { useState } from 'react';
// import { Camera, User, Mail, Calendar } from 'lucide-react';
// import { motion } from 'framer-motion';
// import { useUserProfile } from '../../hooks/useUserProfile';

// const ProfileCard = () => {
//     const [isEditing, setIsEditing] = useState(false);

//     // Mock Data
//     const [profile, setProfile] = useState({
//         name: 'Sơn Tùng M-TP',
//         email: 'tung.mtp@gmail.com',
//         birthdate: '1994-07-05',
//         gender: 'male',
//         avatar: 'https://i.scdn.co/image/ab6761610000e5ebc5798933b93f774e14251785'
//     });

//     return (
//         <div className="bg-white dark:bg-zinc-900/50 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm">
//             <div className="flex items-center justify-between mb-6">
//                 <h2 className="text-xl font-bold flex items-center gap-2">
//                     <User className="text-blue-500" />
//                     Hồ sơ của tôi
//                 </h2>
//                 <button
//                     onClick={() => setIsEditing(!isEditing)}
//                     className="text-sm font-bold text-green-500 hover:underline"
//                 >
//                     {isEditing ? 'Hủy' : 'Chỉnh sửa'}
//                 </button>
//             </div>

//             <div className="flex flex-col md:flex-row gap-8 items-start">
//                 {/* Avatar Section */}
//                 <div className="relative group mx-auto md:mx-0">
//                     <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-zinc-100 dark:border-zinc-800">
//                         <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
//                     </div>
//                     {/* Overlay Upload Button */}
//                     <button className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
//                         <Camera className="text-white" />
//                     </button>
//                 </div>

//                 {/* Form Section */}
//                 <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div className="space-y-1.5">
//                         <label className="text-xs font-bold text-zinc-500 uppercase">Tên hiển thị</label>
//                         <input
//                             disabled={!isEditing}
//                             value={profile.name}
//                             onChange={(e) => setProfile({ ...profile, name: e.target.value })}
//                             className="w-full bg-zinc-100 dark:bg-zinc-800 px-4 py-2.5 rounded-lg font-medium outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
//                         />
//                     </div>

//                     <div className="space-y-1.5">
//                         <label className="text-xs font-bold text-zinc-500 uppercase">Email</label>
//                         <div className="relative">
//                             <input
//                                 disabled // Email thường không cho sửa trực tiếp
//                                 value={profile.email}
//                                 className="w-full bg-zinc-100 dark:bg-zinc-800 px-4 py-2.5 pl-10 rounded-lg font-medium outline-none text-zinc-500 cursor-not-allowed"
//                             />
//                             <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
//                         </div>
//                     </div>

//                     <div className="space-y-1.5">
//                         <label className="text-xs font-bold text-zinc-500 uppercase">Ngày sinh</label>
//                         <div className="relative">
//                             <input
//                                 type="date"
//                                 disabled={!isEditing}
//                                 value={profile.birthdate}
//                                 onChange={(e) => setProfile({ ...profile, birthdate: e.target.value })}
//                                 className="w-full bg-zinc-100 dark:bg-zinc-800 px-4 py-2.5 pl-10 rounded-lg font-medium outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-70"
//                             />
//                             <Calendar size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
//                         </div>
//                     </div>

//                     <div className="space-y-1.5">
//                         <label className="text-xs font-bold text-zinc-500 uppercase">Giới tính</label>
//                         <select
//                             disabled={!isEditing}
//                             value={profile.gender}
//                             onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
//                             className="w-full bg-zinc-100 dark:bg-zinc-800 px-4 py-2.5 rounded-lg font-medium outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-70"
//                         >
//                             <option value="male">Nam</option>
//                             <option value="female">Nữ</option>
//                             <option value="other">Khác</option>
//                         </select>
//                     </div>
//                 </div>
//             </div>

//             {isEditing && (
//                 <motion.div
//                     initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
//                     className="flex justify-end mt-6 pt-6 border-t border-zinc-100 dark:border-zinc-800"
//                 >
//                     <button
//                         onClick={() => setIsEditing(false)}
//                         className="px-6 py-2 bg-green-500 hover:bg-green-600 text-black font-bold rounded-full transition-transform active:scale-95"
//                     >
//                         Lưu thay đổi
//                     </button>
//                 </motion.div>
//             )}
//         </div>
//     );
// };

// export default ProfileCard;

// src/components/Account/components/ProfileCard.tsx
import { useState } from 'react';
import { Camera, User, Mail, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import EditProfileModal from '../Profile/EditProfileModal';
import { useUserProfile } from '../../hooks/useUserProfile';

const ProfileCard = () => {
    const { user, isLoading, updateInfo, updateAvatar } = useUserProfile(); // Dữ liệu tự đồng bộ
    const [isEditing, setIsEditing] = useState(false);
    const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);

    // State cục bộ để edit form (tránh giật lag khi gõ phím)
    const [formData, setFormData] = useState<any>({});

    // Đồng bộ form khi data user tải xong
    if (!user && isLoading) return <div>Loading profile...</div>;
    if (!user) return null;

    // Hàm chuẩn bị dữ liệu khi bấm nút Edit
    const handleStartEdit = () => {
        setFormData({
            name: user.name,
            birthdate: user.birthdate || '',
        });
        setIsEditing(true);
    };

    // Hàm lưu Form Text
    const handleSaveInfo = async () => {
        await updateInfo(formData); // Gọi qua hook -> hook gọi service -> service lưu DB
        setIsEditing(false);
    };

    // Hàm lưu Avatar từ Modal
    const handleAvatarSave = async (newName: string, newFile: File | null, isRemoved?: boolean) => {
        if (newName !== user.name) {
            await updateInfo({ name: newName });
        }
        if (newFile) {
            await updateAvatar(newFile);
        } else if (isRemoved) {
            await updateInfo({ avatarUrl: '' });
        }
    };

    return (
        <div className="bg-white dark:bg-zinc-900/50 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm transition-colors duration-300">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2 text-zinc-900 dark:text-white">
                    <User className="text-blue-500" />
                    Hồ sơ của tôi
                </h2>
                {!isEditing ? (
                    <button onClick={handleStartEdit} className="text-sm font-bold text-green-500 hover:underline">
                        Chỉnh sửa
                    </button>
                ) : (
                    <button onClick={() => setIsEditing(false)} className="text-sm font-bold text-zinc-500 hover:underline">
                        Hủy bỏ
                    </button>
                )}
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-start">
                {/* Avatar Section */}
                <div className="relative group mx-auto md:mx-0 cursor-pointer" onClick={() => setIsAvatarModalOpen(true)}>
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-zinc-100 dark:border-zinc-800 shadow-lg">
                        {user.avatarUrl ? (
                            <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-green-500 flex items-center justify-center">
                                <span className="text-4xl font-bold text-white uppercase">{user.name.charAt(0)}</span>
                            </div>
                        )}
                    </div>
                    <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Camera className="text-white" />
                    </div>
                </div>

                {/* Form Section */}
                <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-zinc-500 uppercase">Tên hiển thị</label>
                        <input
                            disabled={!isEditing}
                            value={isEditing ? formData.name : user.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white px-4 py-2.5 rounded-lg font-medium outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-70 disabled:cursor-not-allowed"
                        />
                    </div>
                    {/* ... Các trường Email, Birthdate tương tự ... */}
                    {/* Với Email nhớ để disabled luôn nhé */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-zinc-500 uppercase">Email</label>
                        <input
                            disabled value={user.email}
                            className="w-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 px-4 py-2.5 rounded-lg font-medium cursor-not-allowed"
                        />
                    </div>
                </div>
            </div>

            {isEditing && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-end mt-6 pt-6 border-t border-zinc-100 dark:border-zinc-800">
                    <button
                        onClick={handleSaveInfo}
                        disabled={isLoading}
                        className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white font-bold rounded-full transition-transform active:scale-95 shadow-lg disabled:opacity-50"
                    >
                        {isLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
                    </button>
                </motion.div>
            )}

            <EditProfileModal
                isOpen={isAvatarModalOpen}
                onClose={() => setIsAvatarModalOpen(false)}
                currentName={user.name}
                currentAvatar={user.avatarUrl}
                onSave={handleAvatarSave}
            />
        </div>
    );
};

export default ProfileCard;