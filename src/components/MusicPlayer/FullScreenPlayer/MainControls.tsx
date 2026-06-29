import React from 'react';
import { motion } from 'framer-motion';
import { Shuffle, SkipBack, Play, Pause, SkipForward, Repeat, Repeat1, Clock } from 'lucide-react';

type RepeatMode = 'off' | 'all' | 'one';

interface MainControlsProps {
    isPlaying: boolean;
    onTogglePlay: () => void;
    speed: number;
    isShuffling: boolean;
    repeatMode: RepeatMode;
    onToggleShuffle: () => void;
    onToggleRepeat: () => void;
    onNext: () => void;
    onPrev: () => void;
}

const MainControls = ({ isPlaying, onTogglePlay, speed, isShuffling, repeatMode, onToggleShuffle, onToggleRepeat, onNext, onPrev }: MainControlsProps) => {

    const getActiveColor = (isActive: boolean) =>
        isActive
            ? 'text-primary-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.5)]'
            : 'text-white/50 hover:text-white';

    return (
        <>
            {/* Main Playback Controls */}
            <div className="flex justify-between items-center mt-5">

                {/* Shuffle */}
                <motion.button
                    onClick={onToggleShuffle}
                    whileTap={{ scale: 0.85 }}
                    className={`relative flex flex-col items-center transition-all duration-200 ${getActiveColor(isShuffling)}`}
                    title="Trộn bài"
                >
                    <Shuffle size={22} />
                    {isShuffling && (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-1 h-1 bg-primary-400 rounded-full mt-1"
                        />
                    )}
                </motion.button>

                {/* Skip Prev */}
                <motion.button
                    onClick={onPrev}
                    whileTap={{ scale: 0.85 }}
                    whileHover={{ scale: 1.1 }}
                    className="text-white/80 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10"
                >
                    <SkipBack size={30} fill="currentColor" />
                </motion.button>

                {/* Play/Pause — premium button */}
                <motion.button
                    onClick={onTogglePlay}
                    whileTap={{ scale: 0.92 }}
                    whileHover={{ scale: 1.05 }}
                    className="relative w-16 h-16 flex items-center justify-center"
                >
                    {/* Ambient glow ring khi playing */}
                    {isPlaying && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 rounded-full bg-white/25 blur-xl"
                        />
                    )}
                    <div className={`relative z-10 w-16 h-16 rounded-full flex items-center justify-center bg-white text-black shadow-[0_0_32px_rgba(255,255,255,0.25)] transition-shadow duration-300 ${isPlaying ? 'shadow-[0_0_40px_rgba(255,255,255,0.35)]' : ''}`}>
                        {isPlaying
                            ? <Pause size={28} fill="black" />
                            : <Play size={28} fill="black" className="ml-1" />
                        }
                    </div>
                </motion.button>

                {/* Skip Next */}
                <motion.button
                    onClick={onNext}
                    whileTap={{ scale: 0.85 }}
                    whileHover={{ scale: 1.1 }}
                    className="text-white/80 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10"
                >
                    <SkipForward size={30} fill="currentColor" />
                </motion.button>

                {/* Repeat */}
                <motion.button
                    onClick={onToggleRepeat}
                    whileTap={{ scale: 0.85 }}
                    className={`relative flex flex-col items-center transition-all duration-200 ${getActiveColor(repeatMode !== 'off')}`}
                    title="Lặp lại"
                >
                    {repeatMode === 'one' ? <Repeat1 size={22} /> : <Repeat size={22} />}
                    {repeatMode !== 'off' && (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-1 h-1 bg-primary-400 rounded-full mt-1"
                        />
                    )}
                </motion.button>
            </div>

            {/* Speed Control */}
            <div className="flex items-center mt-5">
                <div className="relative group">
                    <button className="flex items-center gap-1.5 text-xs font-bold text-white/50 hover:text-white bg-white/8 hover:bg-white/15 px-3 py-1.5 rounded-full transition-all duration-200 border border-white/10 hover:border-white/20">
                        <Clock size={13} />
                        {speed}x
                    </button>
                </div>
            </div>
        </>
    );
};

export default React.memo(MainControls);