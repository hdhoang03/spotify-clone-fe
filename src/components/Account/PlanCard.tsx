// src/components/Account/components/PlanCard.tsx
import { CreditCard, CheckCircle2, Zap } from 'lucide-react';

const PlanCard = () => {
    const isPremium = false; // Thử đổi thành true để xem giao diện Premium

    return (
        <div className="bg-white dark:bg-zinc-900/50 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <CreditCard className="text-purple-500" />
                    Gói dịch vụ
                </h2>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${isPremium ? 'bg-green-500/20 text-green-500' : 'bg-zinc-200 text-zinc-600'}`}>
                    {isPremium ? 'Premium' : 'Miễn phí'}
                </span>
            </div>

            <div className={`
                flex-1 rounded-xl p-6 relative overflow-hidden
                ${isPremium
                    ? 'bg-gradient-to-br from-green-600 to-emerald-900 text-white'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white'}
            `}>
                {/* Background Decor */}
                <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-white/10 rounded-full blur-xl" />

                <div className="relative z-10">
                    <h3 className="text-2xl font-bold mb-1">
                        {isPremium ? 'SpringTunes Premium' : 'SpringTunes Free'}
                    </h3>
                    <p className={`text-sm mb-6 ${isPremium ? 'text-green-100' : 'text-zinc-500'}`}>
                        {isPremium ? 'Gói của bạn sẽ gia hạn vào 20/05/2026' : 'Nghe nhạc có quảng cáo, chất lượng tiêu chuẩn.'}
                    </p>

                    <ul className="space-y-3 mb-8">
                        <li className="flex items-center gap-2 text-sm font-medium">
                            <CheckCircle2 size={18} className={isPremium ? 'text-green-300' : 'text-green-500'} />
                            {isPremium ? 'Nghe nhạc không quảng cáo' : 'Nghe nhạc trên mọi thiết bị'}
                        </li>
                        <li className="flex items-center gap-2 text-sm font-medium">
                            <CheckCircle2 size={18} className={isPremium ? 'text-green-300' : 'text-green-500'} />
                            {isPremium ? 'Chất lượng âm thanh Lossless' : 'Tạo playlist không giới hạn'}
                        </li>
                        <li className="flex items-center gap-2 text-sm font-medium">
                            <CheckCircle2 size={18} className={isPremium ? 'text-green-300' : 'text-green-500'} />
                            {isPremium ? 'Tải nhạc nghe Offline' : 'Bỏ qua bài hát (6 lần/giờ)'}
                        </li>
                    </ul>

                    {!isPremium ? (
                        <button className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-lg shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
                            <Zap size={18} fill="currentColor" />
                            Nâng cấp Premium
                        </button>
                    ) : (
                        <button className="w-full py-3 bg-white/20 hover:bg-white/30 text-white font-bold rounded-lg transition-colors">
                            Quản lý gói cước
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PlanCard;