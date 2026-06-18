import { useState } from 'react';
import { UserX, Radio, Keyboard } from 'lucide-react';
import Footer from '../HomePage/Footer';
import SettingsSection from './components/SettingsSection';
import SettingsToggle from './components/SettingsToggle';
import BlockedListModal from './components/BlockedListModal';
import CustomSelect from './components/CustomSelect';
import BackButton from '../../components/common/BackButton';
import { useAppSettings } from '../../hooks/useAppSettings';
import { usePrivacySettings } from './hooks/usePrivacySettings';
import api from '../../services/api';
import i18n from '../../i18n';
import { Trans, useTranslation } from 'react-i18next';

const SettingsPage = () => {
    const { settings, updateSetting } = useAppSettings();

    const { isPublicProfile, isUpdatingPrivacy, isLoadingPrivacy, togglePrivacy } = usePrivacySettings();
    const { t } = useTranslation();

    const [showBlockedModal, setShowBlockedModal] = useState(false);

    const handleLanguageChange = async (val: string) => {
        updateSetting('language', val);
        i18n.changeLanguage(val);

        const token = localStorage.getItem('token');
        if (token) {
            try {
                await api.patch('/user/profile/language', { language: val });
            } catch (err) {
                console.error("Lỗi khi cập nhật ngôn ngữ lên server:", err);
            }
        }
    };

    return (
        <div className="w-full min-h-screen flex flex-col bg-zinc-50 dark:bg-[#0a0a0a]">
            <div className="flex-1 w-full relative z-10 px-4 md:px-8 py-5 md:py-8 pb-32 max-w-3xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-3 mb-8 md:mb-10">
                    <div>
                        <BackButton className="p-2 -ml-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white">{t('settings.title')}</h1>
                    </div>
                </div>

                {/* Phát nhạc */}
                <SettingsSection title={t('settings.music_playback')}>
                    <SettingsToggle
                        label={t('settings.autoplay')}
                        desc={t('settings.autoplay_desc')}
                        checked={settings.autoplay}
                        onChange={() => updateSetting('autoplay', !settings.autoplay)}
                    />
                    <div className="px-5 py-3 bg-green-500/5 dark:bg-green-500/5 border-t border-zinc-100 dark:border-zinc-800/70">
                        <div className="flex items-start gap-2">
                            <Radio size={13} className="text-green-500 mt-0.5 flex-shrink-0" />
                            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
                                <Trans
                                    i18nKey="settings.autoplay_note"
                                    components={{
                                        1: <span className="font-semibold text-zinc-700 dark:text-zinc-300" />,
                                        3: <span className="font-semibold text-zinc-700 dark:text-zinc-300" />
                                    }}
                                />
                            </p>
                        </div>
                    </div>
                </SettingsSection>

                {/* Quyền riêng tư */}
                <SettingsSection title={t('settings.privacy')}>
                    <SettingsToggle
                        label={t('settings.public_profile')}
                        desc={t('settings.public_profile_desc')}
                        checked={isPublicProfile}
                        onChange={togglePrivacy}
                        disabled={isUpdatingPrivacy || isLoadingPrivacy}
                    />

                    <div
                        className="flex items-center justify-between px-5 py-4 cursor-pointer group border-t border-zinc-100 dark:border-zinc-800/70
                                   hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors duration-200"
                        onClick={() => setShowBlockedModal(true)}
                    >
                        <div className="pr-4 flex-1">
                            <p className="font-semibold text-sm text-zinc-900 dark:text-white group-hover:text-green-500 dark:group-hover:text-green-400 transition-colors">
                                {t('settings.blocked_users')}
                            </p>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                                {t('settings.blocked_users_desc')}
                            </p>
                        </div>
                        <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-xl text-zinc-600 dark:text-zinc-300
                                        group-hover:bg-green-500 group-hover:text-white transition-all duration-200">
                            <UserX size={16} />
                        </div>
                    </div>
                </SettingsSection>

                {/* Cử chỉ & Phím tắt */}
                <SettingsSection title={t('settings.gestures_shortcuts')}>
                    <div className="px-5 py-4 border-b border-zinc-100 dark:border-zinc-800/70">
                        <p className="font-semibold text-sm text-zinc-900 dark:text-white flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                            {t('settings.drag_sidebar')}
                        </p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed pl-3.5">
                            {t('settings.drag_sidebar_desc')}
                        </p>
                    </div>
                    <div className="px-5 py-4">
                        <p className="font-semibold text-sm text-zinc-900 dark:text-white flex items-center gap-2">
                            <Keyboard size={14} className="text-green-500" />
                            {t('settings.esc_key')}
                        </p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed pl-5">
                            {t('settings.esc_key_desc')}
                        </p>
                    </div>
                </SettingsSection>

                {/* Hiệu năng */}
                <SettingsSection title={t('settings.performance')}>
                    <SettingsToggle
                        label={t('settings.low_perf')}
                        desc={t('settings.low_perf_desc')}
                        checked={settings.lowPerf}
                        onChange={() => updateSetting('lowPerf', !settings.lowPerf)}
                    />
                </SettingsSection>

                {/* Hiển thị */}
                <SettingsSection title={t('settings.display')}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between px-5 py-4 gap-3">
                        <div className="flex-1">
                            <p className="font-semibold text-sm text-zinc-900 dark:text-white">{t('settings.language')}</p>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{t('settings.language_desc')}</p>
                        </div>
                        <div className="w-full sm:w-44 z-10">
                            <CustomSelect
                                value={settings.language}
                                onChange={handleLanguageChange}
                                options={[
                                    { value: 'vi', label: 'Tiếng Việt' },
                                    { value: 'en', label: 'English' },
                                    { value: 'ko', label: '한국어' },
                                    { value: 'ja', label: '日本語' }
                                ]}
                            />
                        </div>
                    </div>
                </SettingsSection>
            </div>

            <Footer />

            <BlockedListModal
                isOpen={showBlockedModal}
                onClose={() => setShowBlockedModal(false)}
            />
        </div>
    );
};

export default SettingsPage;