// src/components/Help/HelpPage.tsx
import { useState } from 'react';
import { HelpCircle, MessageSquare, ChevronRight, Headphones } from 'lucide-react';
import Footer from '../HomePage/Footer';
import FAQItem from '../Help/FAQItem';
import ContactForm from '../Help/ContactForm';
import BackButton from '../../components/common/BackButton';
import { useTranslation } from 'react-i18next';
import HelpDocumentModal from './HelpDocumentModal';

const HelpPage = () => {
    const { t } = useTranslation();
    const [docModalOpen, setDocModalOpen] = useState(false);
    const [docType, setDocType] = useState<'terms' | 'privacy'>('terms');

    const openDocument = (type: 'terms' | 'privacy') => {
        setDocType(type);
        setDocModalOpen(true);
    };

    const FAQ_DATA = [
        {
            q: t('help.faq_1_q'),
            a: t('help.faq_1_a')
        },
        {
            q: t('help.faq_2_q'),
            a: t('help.faq_2_a')
        },
        {
            q: t('help.faq_3_q'),
            a: t('help.faq_3_a')
        },
        {
            q: t('help.faq_4_q'),
            a: t('help.faq_4_a')
        },
    ];

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-[#0a0a0a]">
            <div className="px-4 md:px-8 py-5 md:py-8 pb-32 max-w-5xl mx-auto">

                {/* ── Header ── */}
                <div className="flex items-center gap-3 mb-8 md:mb-10">
                    <div>
                        <BackButton className="p-2 -ml-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors" />
                    </div>
                    <div>
                        <h1 className="text-xl md:text-2xl font-black text-zinc-900 dark:text-white leading-none">
                            {t('help.title')}
                        </h1>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10">

                    {/* ── CỘT TRÁI: FAQ ── */}
                    <div className="md:col-span-7">
                        <div className="flex items-center gap-2.5 mb-4 px-1">
                            <span className="p-1.5 bg-green-500/10 rounded-lg text-green-500 border border-green-500/20">
                                <HelpCircle size={16} />
                            </span>
                            <h2 className="text-sm font-bold tracking-widest uppercase text-zinc-500 dark:text-zinc-400">
                                {t('help.faq_title')}
                            </h2>
                        </div>

                        <div className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 overflow-hidden shadow-sm">
                            {FAQ_DATA.map((item, idx) => (
                                <FAQItem key={idx} question={item.q} answer={item.a} isLast={idx === FAQ_DATA.length - 1} />
                            ))}
                        </div>

                        {/* Quick links */}
                        <div className="mt-4 grid grid-cols-2 gap-3">
                            <button
                                onClick={() => openDocument('terms')}
                                className="flex items-center justify-between px-4 py-3 bg-white/60 dark:bg-zinc-900/60
                                           backdrop-blur-xl border border-zinc-200/80 dark:border-zinc-800/80 rounded-xl
                                           hover:border-green-500/40 hover:bg-green-500/5 dark:hover:bg-green-500/5
                                           transition-all duration-200 group text-left w-full"
                            >
                                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                                    {t('help.terms')}
                                </span>
                                <ChevronRight size={14} className="text-zinc-400 group-hover:text-green-500 transition-colors" />
                            </button>
                            <button
                                onClick={() => openDocument('privacy')}
                                className="flex items-center justify-between px-4 py-3 bg-white/60 dark:bg-zinc-900/60
                                           backdrop-blur-xl border border-zinc-200/80 dark:border-zinc-800/80 rounded-xl
                                           hover:border-green-500/40 hover:bg-green-500/5 dark:hover:bg-green-500/5
                                           transition-all duration-200 group text-left w-full"
                            >
                                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                                    {t('help.privacy')}
                                </span>
                                <ChevronRight size={14} className="text-zinc-400 group-hover:text-green-500 transition-colors" />
                            </button>
                        </div>
                    </div>

                    {/* ── CỘT PHẢI: FORM ── */}
                    <div className="md:col-span-5">
                        <div className="sticky top-24">
                            <div className="flex items-center gap-2.5 mb-4 px-1">
                                <span className="p-1.5 bg-blue-500/10 rounded-lg text-blue-500 border border-blue-500/20">
                                    <MessageSquare size={16} />
                                </span>
                                <h2 className="text-sm font-bold tracking-widest uppercase text-zinc-500 dark:text-zinc-400">
                                    {t('help.support_title')}
                                </h2>
                            </div>

                            <div className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 p-6 shadow-sm">
                                <ContactForm />
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            <Footer />

            {/* Terms and Privacy Pop-up Modal */}
            <HelpDocumentModal
                isOpen={docModalOpen}
                onClose={() => setDocModalOpen(false)}
                type={docType}
            />
        </div>
    );
};

export default HelpPage;