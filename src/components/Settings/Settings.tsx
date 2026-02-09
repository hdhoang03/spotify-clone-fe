import { useState } from 'react';
import { Volume2, Globe, Shield, Mic2, ChevronRight } from 'lucide-react';
import Footer from '../HomePage/Footer';
import SettingsSection from '../Settings/SettingsSection';
import SettingsToggle from '../Settings/SettingsToggle';
import SettingsSelect from '../Settings/SettingsSelect';
import BlockedListModal from '../Settings/BlockedListModal';
import CustomSelect from './CustomSelect';
import BackButton from '../../components/common/BackButton';

const SettingsPage = () => {
    // State Cài đặt
    const [settings, setSettings] = useState({
        audioQuality: 'high',
        crossfade: 5,
        normalizeVolume: true,
        autoplay: true,
        language: 'vi',
        privateSession: false,
    });

    // State cho Modal danh sách chặn
    const [showBlockedModal, setShowBlockedModal] = useState(false);

    const toggleSwitch = (key: string) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));
    };

    const updateSetting = (key: string, value: any) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    return (
        <div>
            <div className="p-4 md:p-10 pb-32 max-w-4xl mx-auto text-zinc-900 dark:text-white">
                <div className="flex items-center gap-3 mb-6 md:mb-8">
                    {/* Nút Back: Chỉ hiện ở Mobile (md:hidden) */}
                    <div className="md:hidden">
                        <BackButton className="p-2 -ml-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors" />
                    </div>

                    {/* Tiêu đề */}
                    <h1 className="text-3xl font-bold">Cài đặt</h1>
                </div>

                {/* SECTION 1: AUDIO */}
                <SettingsSection title="Chất lượng âm thanh" icon={<Volume2 />}>
                    {/* Component Select mới fix responsive & custom UI */}
                    <SettingsSelect
                        label="Chất lượng phát (Wifi)"
                        subLabel="Ảnh hưởng đến băng thông sử dụng"
                        value={settings.audioQuality}
                        onChange={(val) => updateSetting('audioQuality', val)}
                        options={[
                            { value: 'low', label: 'Thấp (24kbit/s)' },
                            { value: 'normal', label: 'Bình thường (96kbit/s)' },
                            { value: 'high', label: 'Cao (160kbit/s)' },
                            { value: 'lossless', label: 'Rất cao (320kbit/s) - Premium' },
                        ]}
                    />

                    <div className="h-[1px] bg-zinc-100 dark:bg-zinc-800 my-2" />

                    <SettingsToggle
                        label="Chuẩn hóa âm lượng"
                        desc="Đặt cùng một mức âm lượng cho tất cả bài hát"
                        checked={settings.normalizeVolume}
                        onChange={() => toggleSwitch('normalizeVolume')}
                    />
                </SettingsSection>

                {/* SECTION 2: PLAYBACK */}
                <SettingsSection title="Phát nhạc" icon={<Mic2 />}>
                    <SettingsToggle
                        label="Tự động phát (Autoplay)"
                        desc="Tiếp tục phát nhạc gợi ý khi hết danh sách"
                        checked={settings.autoplay}
                        onChange={() => toggleSwitch('autoplay')}
                    />

                    <div className="py-3 mt-2">
                        <div className="flex justify-between mb-3">
                            <span className="font-medium">Crossfade (Chuyển bài mượt)</span>
                            <span className="text-green-500 font-bold">{settings.crossfade}s</span>
                        </div>
                        <input
                            type="range" min="0" max="12"
                            value={settings.crossfade}
                            onChange={(e) => updateSetting('crossfade', parseInt(e.target.value))}
                            className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-green-500 hover:accent-green-400"
                        />
                    </div>
                </SettingsSection>

                {/* SECTION 3: PRIVACY */}
                <SettingsSection title="Quyền riêng tư" icon={<Shield />}>
                    <SettingsToggle
                        label="Phiên riêng tư"
                        desc="Ẩn hoạt động nghe nhạc của bạn với người theo dõi"
                        checked={settings.privateSession}
                        onChange={() => toggleSwitch('privateSession')}
                    />

                    {/* Nút mở Modal Chặn */}
                    <div
                        onClick={() => setShowBlockedModal(true)}
                        className="flex items-center justify-between py-4 cursor-pointer group border-t border-zinc-100 dark:border-zinc-800 mt-2"
                    >
                        <div>
                            <p className="font-medium group-hover:text-green-500 transition-colors">Quản lý danh sách chặn</p>
                            <p className="text-xs text-zinc-500">Quản lý nghệ sĩ và người dùng bạn đã chặn</p>
                        </div>
                        <ChevronRight size={20} className="text-zinc-400 group-hover:text-green-500 transition-colors" />
                    </div>
                </SettingsSection>

                {/* SECTION 4: LANGUAGE */}

                <SettingsSection title="Hiển thị" icon={<Globe />}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3 gap-2">
                        <div className="flex-1">
                            <p className="font-medium">Ngôn ngữ ứng dụng</p>
                        </div>
                        {/* Chỉ định width cụ thể cho Settings */}
                        <div className="w-full sm:w-64">
                            <CustomSelect
                                value={settings.language}
                                onChange={(val) => updateSetting('language', val)}
                                options={[
                                    { value: 'vi', label: 'Tiếng Việt' },
                                    { value: 'en', label: 'English (US)' },
                                    { value: 'kr', label: 'Korean' },
                                ]}
                            />
                        </div>
                    </div>
                </SettingsSection>
            </div>

            <Footer />

            {/* Modal nằm ngoài cùng */}
            <BlockedListModal
                isOpen={showBlockedModal}
                onClose={() => setShowBlockedModal(false)}
            />
        </div>
    );
};

export default SettingsPage;