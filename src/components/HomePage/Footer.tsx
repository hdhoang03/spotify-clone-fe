import { Copyright, ExternalLink } from 'lucide-react';
import { ICONS } from '../../constants/icons';
import { useTranslation } from 'react-i18next';

// ─── Social Icon Button ───────────────────────────────────────────────────────
const SocialIcon = ({ href, label, path, }: { href: string; label: string; path: string; }) => (
    <a
        href={href}
        target="_blank"
        rel="noreferrer"
        aria-label={label}
        className="group relative w-10 h-10 flex items-center justify-center rounded-full
                   bg-white/5 border border-white/10
                   hover:bg-white/10 hover:border-green-500/40
                   hover:shadow-[0_0_16px_rgba(34,197,94,0.25)]
                   transition-all duration-300"
    >
        <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-[18px] h-[18px] text-zinc-400 transition-colors duration-300"
        >
            <path d={path} />
        </svg>
    </a>
);

// ─── Bottom Legal Link ────────────────────────────────────────────────────────
const LegalLink = ({ label }: { label: string }) => (
    <span className="text-zinc-600 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200
                     text-xs transition-colors duration-200 cursor-pointer select-none">
        {label}
    </span>
);

// ─── Footer ──────────────────────────────────────────────────────────────────
const Footer = () => {
    const year = new Date().getFullYear();
    const { t } = useTranslation();

    return (
        <footer className="relative overflow-hidden mt-20
                           bg-zinc-50 dark:bg-zinc-950/80
                           border-t border-zinc-200/60 dark:border-white/[0.06]">

            {/* Ambient glow — chỉ hiện trong dark mode */}
            <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2
                            w-[600px] h-40 rounded-full
                            bg-green-500/5 blur-3xl dark:bg-green-500/8" />

            <div className="relative max-w-screen-xl mx-auto px-6 pt-12 pb-6 space-y-10">

                {/* ── Brand + Tagline + Socials ── */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">

                    {/* Brand */}
                    <div className="flex items-center gap-3">
                        <div>
                            <p className="text-base font-bold text-zinc-900 dark:text-white tracking-tight">
                                SpringTunes
                            </p>
                            <p className="text-xs text-zinc-500 dark:text-zinc-500 leading-none mt-0.5">
                                {t('home.limit')}
                            </p>
                        </div>
                    </div>

                    {/* Social Icons */}
                    <div className="flex items-center gap-3">
                        <SocialIcon
                            href="https://www.facebook.com/thotslayer213"
                            label="Facebook"
                            path={ICONS.facebook}
                        />
                        <SocialIcon
                            href="https://www.instagram.com/hoang.ho3/"
                            label="Instagram"
                            path={ICONS.instagram}
                        />
                        <SocialIcon
                            href="https://www.reddit.com/user/Hide_on_bush003/"
                            label="Reddit"
                            path={ICONS.reddit}
                        />
                    </div>
                </div>

                {/* ── Divider ── */}
                <div className="h-px bg-gradient-to-r from-transparent via-zinc-300 dark:via-white/10 to-transparent" />

                {/* ── Bottom Bar ── */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center
                                justify-between gap-3 pb-4">

                    {/* Legal links */}
                    {/* <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                        {['Pháp lý', 'Quyền riêng tư', 'Cookie', 'Quảng cáo'].map(item => (
                            <LegalLink key={item} label={item} />
                        ))}
                    </div> */}

                    {/* Copyright */}
                    <div className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-600 text-xs shrink-0">
                        <Copyright size={12} />
                        <span>{year} SpringTunes · Made with ❤️</span>
                        <ExternalLink size={10} className="opacity-40" />
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;