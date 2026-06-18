import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Maximize2 } from 'lucide-react';
import ArtistAboutModal from '../../Artist/ArtistAboutModal';
import LyricsDisplay from '../shared/LyricsDisplay';
import api from '../../../services/api';
import FullscreenLyrics from './FullscreenLyrics';
import { useTranslation } from 'react-i18next';

interface LyricLine {
    t: number;
    text: string;
}

interface ExtraInfoProps {
    name: string;
    artistId: string;
    songId: string;
    songTitle: string;
    currentTime: number;
    onCollapse: () => void;
    song?: any;
}

const ExtraInfo = ({ name, artistId, songId, songTitle, currentTime, onCollapse, song }: ExtraInfoProps) => {
    const { t } = useTranslation();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [artistData, setArtistData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Lyrics state
    const [lyrics, setLyrics] = useState<LyricLine[]>([]);
    const [isInstrumental, setIsInstrumental] = useState(false);
    const [isLyricsLoading, setIsLyricsLoading] = useState(false);
    const [isLyricsExpanded, setIsLyricsExpanded] = useState(false);

    const navigate = useNavigate();

    // Fetch artist info
    useEffect(() => {
        const fetchArtistInfo = async () => {
            if (!artistId) return;
            setIsLoading(true);
            try {
                const response = await api.get(`/artist/${artistId}`);
                if (response.data.code === 1000) {
                    const data = response.data.result;
                    setArtistData({
                        ...data,
                        bio: data.description,
                        monthlyListeners: data.followerCount || 0,
                        coverImage: data.avatarUrl
                    });
                }
            } catch (error) {
                console.error("Lỗi lấy thông tin nghệ sĩ:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchArtistInfo();
    }, [artistId]);

    useEffect(() => {
        const fetchLyrics = async () => {
            if (!songId) return;
            setIsLyricsLoading(true);
            setLyrics([]);
            setIsInstrumental(false);
            try {
                const res = await api.get(`/lyrics/${songId}/get`);
                if (res.data?.result) {
                    const isInst = res.data.result.isInstrumental ?? false;
                    setIsInstrumental(isInst);
                    const content: LyricLine[] = res.data.result.content || [];
                    setLyrics(content.sort((a, b) => a.t - b.t));
                }
            } catch {
                // Bài chưa có lời hoặc lỗi mạng
            } finally {
                setIsLyricsLoading(false);
            }
        };
        fetchLyrics();
    }, [songId]);

    const handleArtistClick = useCallback(() => {
        if (!artistId) return;
        onCollapse();
        setTimeout(() => navigate(`/artist/${artistId}`), 100);
    }, [artistId, navigate, onCollapse]);

    // Đóng fullscreen lyrics khi nhấn Escape — dùng stopImmediatePropagation để tránh
    // event leo lên FullScreenPlayer và trigger onCollapse() luôn
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                e.stopImmediatePropagation(); // Chặn listener khác (FullScreenPlayer) nhận event này
                setIsLyricsExpanded(false);
            }
        };
        if (isLyricsExpanded) {
            // Capture phase (true) để chạy TRƯỚC listener của FullScreenPlayer
            window.addEventListener('keydown', handleKey, true);
        }
        return () => window.removeEventListener('keydown', handleKey, true);
    }, [isLyricsExpanded]);

    const hasLyrics = lyrics.length > 0 || isInstrumental;

    if (!artistData && !isLoading) return null;

    return (
        <>
            <div className="flex flex-col gap-6 mt-8 px-2">

                {/* --- LYRICS CARD --- */}
                <div className="backdrop-blur-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] transition-all duration-300">
                    <div className="flex items-center justify-between px-6 pt-5 pb-3">
                        <h3 className="font-bold text-lg">{t('player.lyrics')}</h3>
                        {hasLyrics && !isLyricsLoading && (
                            <button
                                onClick={() => setIsLyricsExpanded(true)}
                                className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-all duration-300 text-zinc-500 hover:text-zinc-800 dark:text-white/50 dark:hover:text-white active:scale-95"
                                title={t('player.view_full_lyrics')}
                            >
                                <Maximize2 size={18} />
                            </button>
                        )}
                    </div>

                    {/* Lyrics content */}
                    <div className="px-5 pb-6">
                        {isLyricsLoading ? (
                            <div className="flex justify-center py-10">
                                <div className="w-6 h-6 border-2 border-black/10 border-t-black/50 dark:border-white/20 dark:border-t-white/70 rounded-full animate-spin" />
                            </div>
                        ) : (
                            <LyricsDisplay
                                lyrics={lyrics}
                                currentTime={currentTime}
                                isInstrumental={isInstrumental}
                                expanded={false}
                            />
                        )}
                    </div>
                </div>

                {/* --- ARTIST SECTION --- */}
                {artistData && (
                    <div className="flex flex-col gap-3">
                        <h3 className="font-bold text-lg px-2">{t('player.about_artist')}</h3>
                        <div
                            onClick={handleArtistClick}
                            className="backdrop-blur-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-3xl overflow-hidden hover:bg-black/10 dark:hover:bg-white/10 transition-all duration-500 cursor-pointer group shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)]"
                        >
                            <div className="h-44 w-full relative overflow-hidden">
                                <img
                                    src={artistData.avatarUrl || "/default-artist.png"}
                                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                                    alt={artistData.name}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex items-end p-5">
                                    <h4 className="text-2xl font-extrabold text-white tracking-tight drop-shadow-md">{artistData.name}</h4>
                                </div>
                            </div>
                            <div className="p-5">
                                <span className="text-zinc-500 dark:text-zinc-400 text-sm font-medium mb-3 block">
                                    {artistData.monthlyListeners.toLocaleString('vi-VN')} {t('player.followers')}
                                </span>
                                <p className="text-sm font-medium line-clamp-3 leading-relaxed opacity-90 drop-shadow-sm">
                                    {artistData.description || t('player.no_artist_description')}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Credits */}
                <div className="pb-24 pt-4 px-2">
                    <h3 className="font-bold text-[11px] tracking-wider uppercase mb-2 text-zinc">{t('player.production_team')}</h3>
                    <div className="flex flex-col gap-1">
                        <p className="text-xs font-medium text-zinc-400">{t('player.performed_by')} <span className="text-xs font-medium text-zinc-200">{artistData?.name}</span></p>
                        <p className="text-[10px] text-zinc-400 mt-1">{t('player.source')}</p>
                    </div>
                </div>

                {artistData && (
                    <ArtistAboutModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        artist={artistData}
                    />
                )}
            </div>

            {/* ====== FULLSCREEN LYRICS OVERLAY ====== */}
            <AnimatePresence>
                {isLyricsExpanded && (
                    <FullscreenLyrics
                        songTitle={songTitle}
                        name={artistData?.name || name}
                        song={song}
                        lyrics={lyrics}
                        currentTime={currentTime}
                        isInstrumental={isInstrumental}
                        onClose={() => setIsLyricsExpanded(false)}
                        onCollapse={onCollapse}
                    />
                )}
            </AnimatePresence>
        </>
    );
};

export default React.memo(ExtraInfo);