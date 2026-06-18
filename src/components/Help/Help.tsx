// src/components/Help/HelpPage.tsx
import { HelpCircle, MessageSquare, ChevronRight, Headphones } from 'lucide-react';
import Footer from '../HomePage/Footer';
import FAQItem from '../Help/FAQItem';
import ContactForm from '../Help/ContactForm';
import BackButton from '../../components/common/BackButton';
import { useTranslation } from 'react-i18next';

const HelpPage = () => {
    const { t } = useTranslation();

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
                        <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white">{t('help.title')}</h1>
                        {/* <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Chúng tôi luôn sẵn sàng hỗ trợ bạn</p> */}
                    </div>
                </div>

                {/* ── Hero banner ── */}
                {/* <div className="relative mb-8 rounded-2xl overflow-hidden bg-gradient-to-br from-green-600 via-emerald-500 to-teal-500 p-6 md:p-8 shadow-lg shadow-green-500/20">
                    <div className="absolute inset-0 opacity-10"
                        style={{ backgroundImage: `radial-gradient(circle at 80% 20%, white 0%, transparent 60%)` }} />
                    <div className="relative z-10 flex items-center gap-4">
                        <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm flex-shrink-0">
                            <Headphones size={28} className="text-white" />
                        </div>
                        <div>
                            <p className="text-white/70 text-xs font-semibold uppercase tracking-widest mb-0.5">SpringTunes Support</p>
                            <h2 className="text-white text-xl font-black">{t('help.hero_title')}</h2>
                            <p className="text-white/75 text-sm mt-0.5">{t('help.hero_desc')}</p>
                        </div>
                    </div>
                </div> */}

                <div className="grid md:grid-cols-12 gap-6 md:gap-8">

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
                            {[
                                { label: t('help.terms'), href: '#' },
                                { label: t('help.privacy'), href: '#' },
                            ].map(link => (
                                <a
                                    key={link.label}
                                    href={link.href}
                                    className="flex items-center justify-between px-4 py-3 bg-white/60 dark:bg-zinc-900/60
                                               backdrop-blur-xl border border-zinc-200/80 dark:border-zinc-800/80 rounded-xl
                                               hover:border-green-500/40 hover:bg-green-500/5 dark:hover:bg-green-500/5
                                               transition-all duration-200 group"
                                >
                                    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                                        {link.label}
                                    </span>
                                    <ChevronRight size={14} className="text-zinc-400 group-hover:text-green-500 transition-colors" />
                                </a>
                            ))}
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
        </div>
    );
};

export default HelpPage;