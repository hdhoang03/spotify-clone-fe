import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, Crown, ShieldAlert, Loader2, RefreshCw } from 'lucide-react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import api from '../../../services/api';

interface PlanDetails {
    premiumExpiryDate: string | null;
    daysRemaining: number;
}

interface PlanDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onRenew: () => void;
    isLoadingPayment: boolean;
}

const PlanDetailsModal = ({ isOpen, onClose, onRenew, isLoadingPayment }: PlanDetailsModalProps) => {
    const { t, i18n } = useTranslation();
    const [details, setDetails] = useState<PlanDetails | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchDetails = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await api.get('/user/my-premium/plan-details');
            if (res.data.code === 1000) {
                setDetails(res.data.result);
            } else {
                setError(res.data.message || 'Failed to load details');
            }
        } catch (err: any) {
            console.error('Failed to fetch premium plan details:', err);
            setError(t('account.fetch_error') || 'Failed to fetch plan details');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchDetails();
        }
    }, [isOpen]);

    const formatDate = (dateStr: string | null) => {
        if (!dateStr) return '--';
        try {
            const date = new Date(dateStr);
            return new Intl.DateTimeFormat(i18n.language === 'vi' ? 'vi-VN' : 'en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            }).format(date);
        } catch (e) {
            return dateStr;
        }
    };

    if (!isOpen) return null;

    return createPortal(
        <AnimatePresence>
            <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
                {/* Backdrop overlay */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />

                {/* Modal Container */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    transition={{ type: 'spring', duration: 0.4 }}
                    className="relative w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6 shadow-2xl overflow-hidden z-10 text-zinc-900 dark:text-white"
                >
                    {/* Golden accent glow at top */}
                    <div className="absolute top-0 left-0 right-0 h-[4px] bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600" />

                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold flex items-center gap-2">
                            <Crown className="text-amber-500 fill-amber-500 animate-pulse" size={22} />
                            {t('account.plan_details_title', 'Chi tiết gói cước')}
                        </h3>
                        <button
                            onClick={onClose}
                            className="p-1 rounded-full text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Content Section */}
                    {isLoading ? (
                        <div className="h-48 flex flex-col items-center justify-center gap-3">
                            <Loader2 className="animate-spin text-primary-500" size={32} />
                            <p className="text-zinc-500 text-sm">{t('account.loading_profile', 'Đang tải...')}</p>
                        </div>
                    ) : error ? (
                        <div className="h-48 flex flex-col items-center justify-center gap-4 text-center">
                            <ShieldAlert className="text-red-500" size={32} />
                            <p className="text-zinc-600 dark:text-zinc-300 text-sm max-w-xs">{error}</p>
                            <button
                                onClick={fetchDetails}
                                className="px-4 py-2 bg-zinc-100 dark:bg-zinc-800 text-xs font-semibold rounded-lg flex items-center gap-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                            >
                                <RefreshCw size={12} />
                                {t('account.retry', 'Thử lại')}
                            </button>
                        </div>
                    ) : details ? (
                        <div className="space-y-6">
                            {/* Plan Card visual summary */}
                            <div className="bg-gradient-to-br from-amber-500/10 to-yellow-600/10 dark:from-amber-500/5 dark:to-yellow-600/5 border border-amber-500/20 dark:border-amber-500/10 rounded-xl p-4 flex items-center justify-between">
                                <div>
                                    <h4 className="font-bold text-amber-600 dark:text-amber-400 text-lg">
                                        Springtunes Premium
                                    </h4>
                                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                                        {t('account.personal_profile', 'Gói cá nhân')}
                                    </p>
                                </div>
                                <span className="px-3 py-1 bg-primary-500/10 dark:bg-primary-500/20 text-primary-600 dark:text-primary-400 text-xs font-bold rounded-full uppercase tracking-wider">
                                    {t('account.plan_active', 'Hoạt động')}
                                </span>
                            </div>

                            {/* Details Info List */}
                            <div className="space-y-4">
                                {/* Expiry Date */}
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-zinc-500 flex-shrink-0 mt-0.5">
                                        <Calendar size={18} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                            {t('account.plan_expiry', 'Ngày hết hạn')}
                                        </p>
                                        <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 mt-0.5">
                                            {formatDate(details.premiumExpiryDate)}
                                        </p>
                                    </div>
                                </div>

                                {/* Days Remaining */}
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-zinc-500 flex-shrink-0 mt-0.5">
                                        <Clock size={18} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                            {t('account.plan_days_left', 'Thời gian còn lại')}
                                        </p>
                                        <p className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-yellow-600 mt-0.5">
                                            {t('account.plan_days_format', '{{count}} ngày', { count: details.daysRemaining })}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col gap-2.5 pt-2">
                                <button
                                    onClick={onRenew}
                                    disabled={isLoadingPayment}
                                    className="w-full py-3 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white font-bold rounded-lg shadow-lg shadow-amber-500/10 hover:scale-[1.01] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {isLoadingPayment ? (
                                        <Loader2 size={16} className="animate-spin" />
                                    ) : (
                                        <Crown size={16} fill="currentColor" />
                                    )}
                                    {t('account.plan_extend', 'Gia hạn gói cước')}
                                </button>
                                <button
                                    onClick={onClose}
                                    className="w-full py-2.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 font-semibold rounded-lg transition-colors text-sm"
                                >
                                    {t('account.plan_close', 'Đóng')}
                                </button>
                            </div>
                        </div>
                    ) : null}
                </motion.div>
            </div>
        </AnimatePresence>,
        document.body
    );
};

export default PlanDetailsModal;
