// src/components/Account/components/SecurityCard.tsx
import { Lock, KeyRound, ShieldCheck } from 'lucide-react';
import SettingsToggle from '../Settings/SettingsToggle'; // Tái sử dụng Toggle

const SecurityCard = () => {
    return (
        <div className="bg-white dark:bg-zinc-900/50 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
                <ShieldCheck className="text-orange-500" />
                Bảo mật & Đăng nhập
            </h2>

            <div className="space-y-6">
                {/* Đổi mật khẩu */}
                <div className="space-y-4">
                    <h3 className="text-sm font-bold text-zinc-500 uppercase">Đổi mật khẩu</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="relative">
                            <input
                                type="password" placeholder="Mật khẩu hiện tại"
                                className="w-full bg-zinc-100 dark:bg-zinc-800 px-4 py-2.5 pl-10 rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-500"
                            />
                            <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                        </div>
                        <div className="relative">
                            <input
                                type="password" placeholder="Mật khẩu mới"
                                className="w-full bg-zinc-100 dark:bg-zinc-800 px-4 py-2.5 pl-10 rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-500"
                            />
                            <KeyRound size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <button className="px-4 py-2 text-sm font-bold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors">
                            Cập nhật mật khẩu
                        </button>
                    </div>
                </div>

                <div className="h-[1px] bg-zinc-100 dark:bg-zinc-800" />

                {/* 2FA Toggle - Tái sử dụng component cũ */}
                <div>
                    <SettingsToggle
                        label="Xác thực 2 lớp (2FA)"
                        desc="Thêm một lớp bảo mật bằng mã xác nhận gửi về email"
                        checked={true}
                        onChange={() => { }}
                    />
                </div>
            </div>
        </div>
    );
};

export default SecurityCard;