import React, { useRef, useEffect, useState } from 'react';
import ArtistActionSheet from './ArtistActionSheet';
import { Play, Pause, Shuffle, MoreHorizontal, Ban, Flag, Share2, Copy } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ArtistActionBarProps {
    isPlaying: boolean;
    isFollowing: boolean;
    isShuffling: boolean;
    onTogglePlay: () => void;
    onToggleFollow: () => void;
    onToggleShuffle: () => void;
    artistName: string;
    artistImage: string;
    isSticky?: boolean;
    isLoggedIn?: boolean;
    onShareArtist?: () => void;
    onCopyLink?: () => void;
}

const ArtistActionBar = ({
    isPlaying,
    isFollowing,
    isShuffling,
    onTogglePlay,
    onToggleFollow,
    onToggleShuffle,
    artistName,
    artistImage,
    isSticky = false,
    isLoggedIn = false,
    onShareArtist,
    onCopyLink
}: ArtistActionBarProps & { artistName: string, artistImage: string }) => {
    const { t } = useTranslation();
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (isDropdownOpen && dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isDropdownOpen]);

    const handleMoreClick = () => {
        if (window.innerWidth < 768) {
            setIsSheetOpen(true);
        } else {
            setIsDropdownOpen(!isDropdownOpen);
        }
    };

    return (
        <div
            className={`flex items-center justify-between md:justify-start gap-4 md:gap-6 px-6 md:px-8 py-3
                sticky top-0 z-40 transition-all duration-300 ease-in-out
                ${isSticky
                    /* Sticky: nền mờ hòa vào background thay vì box trắng/đen đặc */
                    ? 'bg-black/[0.05] dark:bg-black/[0.30] backdrop-blur-xl border-b border-black/[0.06] dark:border-white/[0.07]'
                    : 'bg-transparent border-b border-transparent'
                }`}
        >

            {/* --- KHỐI TRÁI: Play Button + Tên Nghệ Sĩ (Ẩn/Hiện khi sticky) --- */}
            <div className="flex items-center gap-4 flex-1 min-w-0">
                {/* Play/Pause button — shadow xanh lá 2026 */}
                <button
                    onClick={onTogglePlay}
                    className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-primary-500 text-black
                               flex items-center justify-center
                               transition-all duration-200 hover:scale-105 active:scale-95
                               shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 hover:bg-primary-400
                               flex-shrink-0"
                >
                    {isPlaying
                        ? <Pause size={24} fill="black" />
                        : <Play size={24} fill="black" className="ml-1" />
                    }
                </button>

                {/* Tên nghệ sĩ — hiện khi sticky */}
                <div className={`flex flex-col transition-all duration-500 overflow-hidden min-w-0
                                ${isSticky ? 'opacity-100 translate-y-0 w-full' : 'opacity-0 translate-y-4 w-0'}`}>
                    <span className="text-xl md:text-2xl font-bold text-zinc-900 dark:text-white truncate block">
                        {artistName}
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-3 md:gap-5 ml-auto md:ml-0 flex-shrink-0">

                {/* Shuffle button */}
                <button
                    onClick={onToggleShuffle}
                    className={`transition-all duration-200 relative
                        ${isShuffling
                            ? 'text-primary-500 scale-110'
                            : 'text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:scale-105'
                        }`}
                >
                    <Shuffle className="w-5 h-5 md:w-6 md:h-6" />
                    {/* Dấu chấm xanh khi active */}
                    {isShuffling && (
                        <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary-500 rounded-full" />
                    )}
                </button>

                {/* Follow button — ẩn khi chưa đăng nhập */}
                {isLoggedIn && (
                    <button
                        onClick={onToggleFollow}
                        className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-bold tracking-wide
                                    transition-all duration-200 hover:scale-105 active:scale-95
                                    ${isFollowing
                                ? 'border border-primary-500 text-primary-500 hover:bg-primary-500/10'
                                : 'border border-zinc-300/80 dark:border-zinc-600/80 text-zinc-900 dark:text-white hover:border-zinc-500 dark:hover:border-zinc-400 hover:bg-black/5 dark:hover:bg-white/10'
                            }`}
                    >
                        {isFollowing ? t('artist.following') : t('artist.follow')}
                    </button>
                )}

                {/* Nút More (3 chấm) — ẩn khi chưa đăng nhập */}
                {isLoggedIn && (
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={handleMoreClick}
                            className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white
                                       transition-colors duration-200 flex items-center
                                       hover:scale-105 active:scale-95"
                        >
                            <MoreHorizontal size={28} />
                        </button>

                        {/* Dropdown Menu (Desktop) — glassmorphism 2026 */}
                        {isDropdownOpen && (
                            <div className="hidden md:block absolute right-0 top-full mt-2 rounded-xl shadow-2xl p-1.5 w-56 z-50
                                            bg-white/95 dark:bg-[#1e1e1e]/95 backdrop-blur-xl
                                            border border-zinc-200/60 dark:border-white/[0.10]
                                            animate-in fade-in zoom-in-95 duration-150 origin-top-right">
                                <MenuItem icon={<Share2 size={15} />} label={t('player.share')} onClick={() => { setIsDropdownOpen(false); onShareArtist?.(); }} />
                                <MenuItem icon={<Copy size={15} />} label={t('player.copy_link')} onClick={() => { setIsDropdownOpen(false); onCopyLink?.(); }} />
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Action Sheet (Mobile) */}
            <ArtistActionSheet
                isOpen={isSheetOpen}
                onClose={() => setIsSheetOpen(false)}
                artistName={artistName}
                artistImage={artistImage}
                onShareArtist={() => { setIsSheetOpen(false); onShareArtist?.(); }}
                onCopyLink={() => { setIsSheetOpen(false); onCopyLink?.(); }}
            />
        </div>
    );
};

const MenuItem = ({ icon, label, onClick }: { icon: React.ReactNode, label: string, onClick?: () => void }) => (
    <button
        onClick={onClick}
        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg text-left
                      transition-colors duration-150
                      text-zinc-700 dark:text-white/90
                      hover:bg-zinc-100 dark:hover:bg-white/[0.08]">
        <span className="text-zinc-500 dark:text-zinc-400">{icon}</span>
        <span>{label}</span>
    </button>
);

export default ArtistActionBar;