import { useState, useEffect } from 'react';
import { Camera, User } from 'lucide-react';
import { motion } from 'framer-motion';
import EditProfileModal from '../../Profile/components/EditProfileModal';
import { useUserProfile } from '../../../hooks/useUserProfile';
import { useAccountSettings } from '../hooks/useAccountSettings';
import { useTranslation } from 'react-i18next';

const ProfileCard = () => {
    const { t } = useTranslation();
    const { user, isLoading } = useUserProfile();
    const { updateProfile, isSavingProfile } = useAccountSettings();

    const [isEditing, setIsEditing] = useState(false);
    const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '' });

    useEffect(() => {
        if (user) setFormData({ name: user.name });
    }, [user]);

    if (!user && isLoading) return <div>{t('account.loading_profile')}</div>;
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

            alert(t('account.update_info_success'));
            setIsEditing(false);

            window.location.reload();
        } else {
            alert(t('account.update_error'));
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

            alert(t('account.update_avatar_success'));
            setIsAvatarModalOpen(false);

            window.location.reload();
        } else {
            alert(t('account.update_avatar_error'));
        }
    };

    return (
        <div className="bg-white dark:bg-zinc-900/50 rounded-lg p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <User className="text-primary-500" /> {t('account.personal_profile')}
                </h2>
                {!isEditing && (
                    <button onClick={() => setIsEditing(true)} className="text-sm font-bold text-primary-600 hover:text-primary-500 transition-colors">
                        {t('account.edit')}
                    </button>
                )}
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="relative group mx-auto md:mx-0 cursor-pointer" onClick={() => setIsAvatarModalOpen(true)}>
                    <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-white dark:ring-[#121212] ring-offset-4 ring-offset-zinc-100 dark:ring-offset-zinc-800 shadow-2xl relative bg-zinc-200 dark:bg-zinc-800 transition-transform duration-300 group-hover:scale-105">
                        <img
                            src={user.avatarUrl || `https://ui-avatars.com/api/?name=${user.name}&background=random`}
                            alt="Avatar"
                            referrerPolicy="no-referrer"
                            crossOrigin="anonymous"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Camera className="text-white" size={32} />
                        </div>
                    </div>
                </div>

                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-zinc-500 uppercase">{t('account.display_name')}</label>
                        <input
                            disabled={!isEditing} value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full bg-zinc-50/50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-white/10 px-4 py-3 rounded-xl text-sm font-medium outline-none transition-all duration-300 hover:border-zinc-300 dark:hover:border-white/20 focus:bg-white dark:focus:bg-zinc-900 focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-zinc-500 uppercase">{t('account.email')}</label>
                        <input
                            disabled value={user.email}
                            className="w-full bg-zinc-50/50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-white/10 px-4 py-3 rounded-xl text-sm font-medium outline-none transition-all duration-300 hover:border-zinc-300 dark:hover:border-white/20 focus:bg-white dark:focus:bg-zinc-900 focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                    </div>
                </div>
            </div>

            {isEditing && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-end mt-6 pt-6 border-t border-zinc-100 dark:border-zinc-800 gap-3">
                    <button onClick={() => setIsEditing(false)} className="px-6 py-2 bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold rounded-full transition-colors">
                        {t('account.cancel')}
                    </button>
                    <button onClick={handleSaveInfo} disabled={isSavingProfile} className="px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-full transition-transform active:scale-95 shadow-lg disabled:opacity-50">
                        {isSavingProfile ? t('account.saving') : t('account.save_changes')}
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
