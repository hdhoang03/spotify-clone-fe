

import React, {useState} from 'react';
import { motion, useDragControls, AnimatePresence } from 'framer-motion';
import PlayerProgressBar from './PlayerProgressBar';
import PlayerHeader from './PlayerHeader';
import SongDetails from './SongDetails';
import MainControls from './MainControls';
import ExtraInfo from './ExtraInfo';
import SongShareCard from './SongShareCard';
import OptionsBottomSheet from '../OptionsBottomSheet';
import { useNavigate } from 'react-router-dom';

export type RepeatMode = 'off' | 'all' | 'one';

interface FullScreenPlayerProps {
    currentSong: any;
    isPlaying: boolean;
    onTogglePlay: () => void;
    onCollapse: () => void;
    currentTime: number;
    duration: number;
    onTimeChange: (time: number) => void;
    formatTime: (time: number) => string;
    speed: number;
    onSpeedChange: (speed: number) => void;
    dominantColor: string;
    volume: number;
    onVolumeChange: (val: number) => void;
    toggleMute: () => void;
    isMuted: boolean;
    isShuffling: boolean;
    repeatMode: RepeatMode;
    onToggleShuffle: () => void;
    onToggleRepeat: () => void;
    onNext: () => void;
    onPrev: () => void;
}

const FullScreenPlayer = (props: FullScreenPlayerProps) => {
    const { currentSong, dominantColor, onCollapse } = props;
    const controls = useDragControls();
    const [isShareOpen, setIsShareOpen] = useState(false);
    const [isOptionsOpen, setIsOptionsOpen] = useState(false);
    const navigate = useNavigate();

    return (
        <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-50 bg-black text-white overflow-y-auto scrollbar-hide"
            style={{ 
                background: `linear-gradient(to bottom, ${dominantColor}, #121212 80%)` 
            }}

            drag="y"
            dragListener={false} 
            dragControls={controls}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.7 }}
            onDragEnd={(event, info) => {
                if (info.offset.y > 200 || info.velocity.y > 300) {
                    onCollapse(); 
                }
            }}
        >
            <PlayerHeader
                onCollapse={onCollapse}
                dragControls={controls}
                onShare={() => setIsShareOpen(true)}
                onMoreOptions={() => setIsOptionsOpen(true)}
            />

            {/* Main Content */}
            <div className="px-6 pb-10 max-w-2xl mx-auto flex flex-col">
                
                <SongDetails 
                    coverUrl={currentSong.coverUrl} 
                    title={currentSong.title} 
                    artist={currentSong.artist} 
                />

                <div className="mt-8 mb-4">
                    <PlayerProgressBar 
                        currentTime={props.currentTime} 
                        duration={props.duration} 
                        onTimeChange={props.onTimeChange}
                        formatTime={props.formatTime}
                    />
                </div>

                <MainControls 
                    isPlaying={props.isPlaying}
                    onTogglePlay={props.onTogglePlay}
                    speed={props.speed}
                    isShuffling={props.isShuffling}
                    repeatMode={props.repeatMode}
                    onToggleShuffle={props.onToggleShuffle}
                    onToggleRepeat={props.onToggleRepeat}
                    onNext={props.onNext} 
                    onPrev={props.onPrev}
                />

                <ExtraInfo artistName={currentSong.artist} onCollapse={onCollapse} />
            </div>
            <SongShareCard 
                song={currentSong}
                isOpen={isShareOpen}
                onClose={() => setIsShareOpen(false)}
            />
            <AnimatePresence>
                {isOptionsOpen && (
                    <OptionsBottomSheet 
                        isOpen={isOptionsOpen}
                        onClose={() => setIsOptionsOpen(false)}
                        song={currentSong}
                        onShare={() => setIsShareOpen(true)}
                        onNavigate={(screen) => {
                            if (screen === 'ARTIST'){
                                // 1. Đóng menu tùy chọn ngay lập tức
                                setIsOptionsOpen(false);
                                onCollapse();
                                // 3. Dùng setTimeout để đẩy việc chuyển trang ra sau
                                // Điều này giúp React cập nhật xong state "đóng player" rồi mới load trang mới
                                setTimeout(() => {
                                    // Thay 'phuongly' bằng dynamic ID nếu có: currentSong.artistId
                                    navigate('/artist/phuongly'); 
                                }, 300); // Đợi khoảng 300ms (gần bằng thời gian animation) để tạo cảm giác mượt
                            }
                        }}
                    />
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default FullScreenPlayer;