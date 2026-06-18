import React, { useState } from 'react';
import { Send, CheckCircle2, Loader2, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CustomSelect from '../Settings/components/CustomSelect';
import { useUserProfile } from '../../hooks/useUserProfile';
import { useSupportLogic } from './useSupportLogic';
import { useTranslation } from 'react-i18next';

const REQUEST_TYPES = [
    { value: 'bug', label: 'Báo lỗi kỹ thuật' },
    { value: 'feature', label: 'Đề xuất tính năng mới' },
    { value: 'account', label: 'Vấn đề tài khoản' },
    { value: 'other', label: 'Khác' },
];

const ContactForm = () => {
    const { t } = useTranslation();

    const REQUEST_TYPES = [
        { value: 'bug', label: t('help.bug') },
        { value: 'feature', label: t('help.feature') },
        { value: 'account', label: t('help.account') },
        { value: 'other', label: t('help.other') },
    ];

    const { user } = useUserProfile();
    const { formData, setFormData, isLoading, submitSupportRequest } = useSupportLogic();
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const isSuccess = await submitSupportRequest();
        if (isSuccess) {
            setSent(true);
            setTimeout(() => setSent(false), 4000);
        } else {
            alert(t('help.error'));
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">

            {/* Loại yêu cầu */}
            <div>
                <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
                    {t('help.form_type')}
                </label>
                <CustomSelect
                    value={formData.type}
                    onChange={(val) => setFormData({ ...formData, type: val })}
                    options={REQUEST_TYPES}
                />
            </div>

            {/* Email (disabled) */}
            <div>
                <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
                    {t('help.form_email')}
                </label>
                <input
                    type="email"
                    disabled
                    value={user?.email || 'Đang tải...'}
                    className="w-full px-4 py-3 bg-zinc-100/80 dark:bg-zinc-800/80 text-zinc-500 rounded-xl
                               outline-none cursor-not-allowed text-sm border border-zinc-200 dark:border-zinc-700"
                    title={t('help.form_email_title')}
                />
            </div>

            {/* Nội dung */}
            <div>
                <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
                    {t('help.form_content')}
                </label>
                <textarea
                    required
                    rows={5}
                    placeholder={t('help.form_content_placeholder')}
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="w-full px-4 py-3 bg-zinc-100/80 dark:bg-zinc-800/80 text-zinc-900 dark:text-white
                               rounded-xl outline-none focus:ring-2 focus:ring-green-500/60 text-sm
                               placeholder-zinc-400 resize-none border border-zinc-200 dark:border-zinc-700
                               focus:border-green-500/40 transition-all duration-200"
                />
            </div>

            {/* Submit */}
            <button
                type="submit"
                disabled={isLoading || !user}
                className="w-full py-3 mt-1 bg-green-500 hover:bg-green-600 active:scale-95
                           text-white font-bold rounded-xl transition-all duration-200
                           flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed
                           shadow-lg shadow-green-500/25 hover:shadow-green-500/40"
            >
                {isLoading ? (
                    <><Loader2 size={17} className="animate-spin" /> {t('help.processing')}</>
                ) : (
                    <><Send size={17} /> {t('help.submit')}</>
                )}
            </button>

            {/* Success toast */}
            <AnimatePresence>
                {sent && (
                    <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        className="flex items-center gap-2.5 p-3.5 rounded-xl bg-green-500/10 border border-green-500/25 text-green-600 dark:text-green-400"
                    >
                        <CheckCircle2 size={17} className="flex-shrink-0" />
                        <p className="text-sm font-medium">{t('help.success')}</p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Info note */}
            {!sent && (
                <div className="flex items-start gap-2.5 text-xs text-zinc-500 p-3.5 rounded-xl
                                bg-zinc-100/60 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/60">
                    <Info size={14} className="shrink-0 mt-0.5 text-blue-500" />
                    <p>{t('help.note_1')}&nbsp;
                        <span className="font-semibold text-zinc-700 dark:text-zinc-300">{user?.email || '...'}</span> {t('help.note_2')}
                    </p>
                </div>
            )}
        </form>
    );
};

export default ContactForm;