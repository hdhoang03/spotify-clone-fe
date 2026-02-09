import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FastAverageColor } from 'fast-average-color';
import { ListMusic } from 'lucide-react';

import { useAudioPlayer } from './useAudioPlayer';
import MiniPlayer from './MiniPlayer';
import FullScreenPlayer from './FullScreenPlayer';
// 1. Import Context Hook
import { useMusic } from '../../contexts/MusicContent'; 

const MusicPlayer = () => {
    const { currentSong, playlist, playPlaylist } = useMusic();
    const [dominantColor, setDominantColor] = useState<string>('#121212');
    const [isExpanded, setIsExpanded] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    
    const player = useAudioPlayer(); 
    const handleNext = () => {
        if (!currentSong || playlist.length === 0) return;

        const currentIndex = playlist.findIndex(s => s.id === currentSong.id);
        let nextIndex;

        if (player.isShuffling) {
            // Random trong playlist hiện tại
            do {
                nextIndex = Math.floor(Math.random() * playlist.length);
            } while (nextIndex === currentIndex && playlist.length > 1);
        } else {
            // Tuần tự
            if (currentIndex < playlist.length - 1) {
                nextIndex = currentIndex + 1;
            } else {
                // Hết bài
                if (player.repeatMode === 'all') {
                    nextIndex = 0;
                } else {
                    player.togglePlay(); // Dừng
                    return;
                }
            }
        }
        // Gọi Context để đổi bài
        playPlaylist(playlist, nextIndex);
    };

    
    // Đồng bộ thời gian khi bài hát thay đổi (quan trọng để thanh progress chạy đúng)
    useEffect(() => {
        if (currentSong) {
            player.setInitialDuration(currentSong.duration || 0);
            if (!player.isPlaying) {
                player.togglePlay(); // Bỏ comment dòng này nếu muốn auto-play logic ở đây
            }
        }
    }, [currentSong?.id]);

    const handlePrev = () => {
        if (!currentSong || playlist.length === 0) return;

        const currentIndex = playlist.findIndex(s => s.id === currentSong.id);
        let prevIndex;

        if (player.isShuffling) {
            handleNext();
            return;
            
        } else {
            if (currentIndex > 0) {
                prevIndex = currentIndex - 1;
            } else {
                if (player.repeatMode === 'all') {
                    prevIndex = playlist.length - 1;
                } else {
                    return;
                }
            }
        }
        playPlaylist(playlist, prevIndex);
    };

    const handleSongEnded = () => {
        if (player.repeatMode !== 'one') {
            handleNext();
        }
    };

    // --- EFFECTS ---

    // Cập nhật màu khi bài hát thay đổi
    useEffect(() => {
        if (currentSong?.coverUrl) {
            const fac = new FastAverageColor();
            fac.getColorAsync(currentSong.coverUrl, { algorithm: 'dominant' })
                .then(color => setDominantColor(color.hex))
                .catch(() => setDominantColor('#121212'));
        }
    }, [currentSong?.id]);


    // 3. QUAN TRỌNG: Nếu chưa chọn bài nào thì KHÔNG render player
    if (!currentSong) return null;

    const progressPercent = player.duration ? (player.currentTime / player.duration) * 100 : 0;

    return (
        <>
            <audio
                ref={player.audioRef}
                src={currentSong.audioUrl} // Dùng audioUrl từ Context
                crossOrigin="anonymous"      
                onLoadedMetadata={player.onLoadedMetadata}
                onTimeUpdate={player.onTimeUpdate}
                onEnded={handleSongEnded}
                autoPlay={true} // Tự động phát khi src thay đổi
            />

            <AnimatePresence mode="wait">
                {!isVisible && (
                    <motion.button
                        initial={{ y: 100, opacity: 0, scale: 0.8 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        exit={{ y: 100, opacity: 0, scale: 0.8 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsVisible(true)}
                        className="fixed right-4 z-[70] p-3 rounded-full
                                shadow-lg flex items-center gap-2
                                font-bold bottom-20 md:bottom-4 cursor-pointer
                                bg-green-500 text-white 
                                dark:bg-white dark:text-black"
                    >
                        <ListMusic size={20}/>
                        <span className="text-xs">Hiện Player</span>
                    </motion.button>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isVisible && (
                    <>
                        {isExpanded && (
                            <FullScreenPlayer 
                                key="full-player"
                                currentSong={currentSong} // Truyền bài hát từ Context
                                dominantColor={dominantColor}
                                onCollapse={() => setIsExpanded(false)}
                                isPlaying={player.isPlaying}
                                onTogglePlay={player.togglePlay}
                                currentTime={player.currentTime}
                                duration={player.duration}
                                onTimeChange={player.handleTimeChange}
                                formatTime={player.formatTime}
                                speed={player.speed}
                                onSpeedChange={player.handleSpeedChange}
                                volume={player.volume}
                                onVolumeChange={player.handleVolumeChange}
                                toggleMute={player.toggleMute}
                                isMuted={player.isMuted}
                                isShuffling={player.isShuffling}
                                repeatMode={player.repeatMode}
                                onToggleShuffle={player.toggleShuffle}
                                onToggleRepeat={player.toggleRepeat}
                                onNext={handleNext}
                                onPrev={handlePrev}
                            />
                        )}

                        {!isExpanded && (
                            <MiniPlayer 
                                key="mini-player"
                                currentSong={currentSong} // Truyền bài hát từ Context
                                isPlaying={player.isPlaying}
                                onTogglePlay={player.togglePlay}
                                onExpand={() => setIsExpanded(true)}
                                progress={progressPercent}
                                onClose={() => setIsVisible(false)}
                                speed={player.speed}
                                onSpeedChange={player.handleSpeedChange}
                                volume={player.volume}
                                onVolumeChange={player.handleVolumeChange}
                                toggleMute={player.toggleMute}
                                isMuted={player.isMuted}
                                dominantColor={dominantColor}
                            />
                        )}
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default MusicPlayer;