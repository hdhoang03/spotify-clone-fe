import { useState, useEffect } from 'react';
import { CreditCard, CheckCircle2, Zap, Loader2, Crown, ExternalLink } from 'lucide-react';
import api from '../../../services/api';
import { useTranslation } from 'react-i18next';
import { usePremiumStatus } from '../../../hooks/usePremiumStatus';
import PlanDetailsModal from './PlanDetailsModal';

/**
 * Tạo orderCode theo format: YYMMDDHHmmss + 3 số random = 15 chữ số
 * Ví dụ: 260611120134582
 * PayOS giới hạn: orderCode ≤ 9007199254740991 (16 chữ số)
 */
const generateOrderCode = (): number => {
    const now = new Date();
    const pad = (n: number, len = 2) => String(n).padStart(len, '0');
    const datePart = [
        pad(now.getFullYear() % 100), // YY: 2 chữ số (26 thay vì 2026)
        pad(now.getMonth() + 1),      // MM
        pad(now.getDate()),            // DD
        pad(now.getHours()),           // HH
        pad(now.getMinutes()),         // mm
        pad(now.getSeconds()),         // ss
    ].join('');
    const random = pad(Math.floor(Math.random() * 1000), 3); // 000–999
    return parseInt(datePart + random, 10); // 15 chữ số, luôn < 9007199254740991
};

const PlanCard = () => {
    const { t } = useTranslation();
    const { isPremium, isLoading } = usePremiumStatus();
    const [isLoadingPayment, setIsLoadingPayment] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Gọi API tạo link thanh toán PayOS
    const handleUpgrade = async () => {
        setIsLoadingPayment(true);
        try {
            const orderCode = generateOrderCode();
            const res = await api.post('/api/payment/create-link', {
                orderCode,
                amount: 10000,
                description: 'Premium 1 thang',
                planType: 'MONTHLY',
                cancelUrl: `${window.location.origin}/account?payment=cancel`,
                returnUrl: `${window.location.origin}/account?payment=success`,
            });

            console.log('[PlanCard] Full response:', JSON.stringify(res.data, null, 2));

            const payosResult = res.data?.result;
            const checkoutUrl =
                payosResult?.data?.checkoutUrl
                ?? payosResult?.checkoutUrl
                ?? res.data?.checkoutUrl;

            console.log('[PlanCard] checkoutUrl extracted:', checkoutUrl);

            if (checkoutUrl) {
                window.location.href = checkoutUrl;
            } else {
                console.error('[PlanCard] Không tìm thấy checkoutUrl trong response:', res.data);
                alert(t('account.payment_link_error'));
            }
        } catch (error) {
            console.error('Lỗi tạo link thanh toán:', error);
            alert(t('account.order_error'));
        } finally {
            setIsLoadingPayment(false);
        }
    };

    // Kiểm tra kết quả thanh toán khi quay lại từ PayOS
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const paymentStatus = params.get('payment');

        if (paymentStatus === 'success') {
            const recheck = async () => {
                try {
                    const res = await api.get('/user/my-premium');
                    if (res.data.code === 1000) {
                        // Bắn sự kiện global để cập nhật premium status cho tất cả các component
                        window.dispatchEvent(new CustomEvent('premium-updated', { detail: { isPremium: Boolean(res.data.result) } }));
                    }
                } catch { }
            };
            recheck();
            window.history.replaceState({}, '', window.location.pathname);
        } else if (paymentStatus === 'cancel') {
            window.history.replaceState({}, '', window.location.pathname);
        }
    }, []);

    if (isLoading) {
        return (
            <div className="bg-white dark:bg-zinc-900/50 rounded-lg p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm h-full flex items-center justify-center">
                <Loader2 className="animate-spin text-zinc-400" size={24} />
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-zinc-900/50 rounded-lg p-4 sm:p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <CreditCard className="text-purple-500" />
                    {t('account.plan_title')}
                </h2>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${isPremium ? 'bg-primary-500/20 text-primary-500' : 'bg-zinc-200 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'}`}>
                    {isPremium ? t('account.premium') : t('account.free')}
                </span>
            </div>

            <div className={`
                    flex-1 rounded-lg p-4 sm:p-7 relative overflow-hidden transition-all duration-500
                    ${isPremium
                    ? 'bg-gradient-to-br from-primary-500 via-emerald-700 to-teal-900 text-white shadow-lg shadow-primary-900/20'
                    : 'bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/50 dark:border-white/5 text-zinc-900 dark:text-white'}
`}>
                {/* Decor */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-primary-400/20 rounded-full blur-2xl" />
                <div className="relative z-10">
                    <h3 className="text-2xl font-bold mb-1 flex items-center gap-2">
                        {isPremium && <Crown size={20} className="text-yellow-300" />}
                        {isPremium ? t('account.springtunes_premium') : t('account.springtunes_free')}
                    </h3>
                    <p className={`text-sm mb-6 ${isPremium ? 'text-primary-100' : 'text-zinc-500'}`}>
                        {isPremium
                            ? t('account.premium_thanks')
                            : t('account.upgrade_prompt')}
                    </p>

                    <ul className="space-y-3 mb-8">
                        <li className="flex items-center gap-2 text-sm font-medium">
                            <CheckCircle2 size={18} className={isPremium ? 'text-primary-300' : 'text-primary-500'} />
                            {isPremium ? t('account.feature_no_ads') : t('account.feature_all_devices')}
                        </li>
                        <li className="flex items-center gap-2 text-sm font-medium">
                            <CheckCircle2 size={18} className={isPremium ? 'text-primary-300' : 'text-primary-500'} />
                            {isPremium ? t('account.feature_lossless') : t('account.feature_unlimited_playlist')}
                        </li>
                        <li className="flex items-center gap-2 text-sm font-medium">
                            <CheckCircle2 size={18} className={isPremium ? 'text-primary-300' : 'text-primary-500'} />
                            {isPremium ? t('account.feature_2x_lossless') : t('account.feature_skip_limit')}
                        </li>
                    </ul>

                    {!isPremium ? (
                        <button
                            onClick={handleUpgrade}
                            disabled={isLoadingPayment}
                            className="w-full py-3 px-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-lg shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:scale-100 text-sm sm:text-base"
                        >
                            {isLoadingPayment ? (
                                <><Loader2 size={16} className="animate-spin flex-shrink-0" /> {t('account.processing')}</>
                            ) : (
                                <><Zap size={16} fill="currentColor" className="flex-shrink-0" />
                                <span className="leading-tight hidden sm:inline">{t('account.upgrade_btn_desktop')}</span>
                                <span className="leading-tight sm:hidden">{t('account.upgrade_btn_mobile')}</span>
                                </>
                            )}
                        </button>
                    ) : (
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="w-full py-3 bg-white/20 hover:bg-white/30 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                            <ExternalLink size={16} />
                            {t('account.manage_plan')}
                        </button>
                    )}
                </div>
            </div>

            <PlanDetailsModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onRenew={handleUpgrade}
                isLoadingPayment={isLoadingPayment}
            />
        </div>
    );
};

export default PlanCard;
