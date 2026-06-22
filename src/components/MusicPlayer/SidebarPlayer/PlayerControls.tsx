import { Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Repeat1 } from 'lucide-react';
import type { RepeatMode } from '../FullScreenPlayer/FullScreenPlayer';

interface PlayerControlsProps {
    isPlaying: boolean;
    onTogglePlay: () => void;
    isShuffling: boolean;
    onToggleShuffle: () => void;
    repeatMode: RepeatMode;
    onToggleRepeat: () => void;
    onNext: () => void;
    onPrev: () => void;
    iconBtnClass: string;
    activeIconBtnClass: string;
}

const PlayerControls = ({
    isPlaying, onTogglePlay, isShuffling, onToggleShuffle,
    repeatMode, onToggleRepeat, onNext, onPrev,
    iconBtnClass, activeIconBtnClass
}: PlayerControlsProps) => {
    return (
        <div className="flex items-center justify-between mb-4 flex-shrink-0">
            <button onClick={onToggleShuffle} className={`w-9 h-9 flex items-center justify-center rounded-full transition-all ${isShuffling ? activeIconBtnClass : iconBtnClass}`}>
                <Shuffle size={18} />
            </button>
            <button onClick={onPrev} className={`w-10 h-10 flex items-center justify-center rounded-full transition-all ${iconBtnClass}`}>
                <SkipBack size={22} fill="currentColor" />
            </button>
            <button
                onClick={onTogglePlay}
                className="w-14 h-14 flex items-center justify-center rounded-full bg-white text-black shadow-lg hover:scale-105 active:scale-95 transition-all"
            >
                {isPlaying ? <Pause size={26} fill="currentColor" /> : <Play size={26} fill="currentColor" className="ml-1" />}
            </button>
            <button onClick={onNext} className={`w-10 h-10 flex items-center justify-center rounded-full transition-all ${iconBtnClass}`}>
                <SkipForward size={22} fill="currentColor" />
            </button>
            <button onClick={onToggleRepeat} className={`w-9 h-9 flex items-center justify-center rounded-full transition-all ${repeatMode !== 'off' ? activeIconBtnClass : iconBtnClass}`}>
                {repeatMode === 'one' ? <Repeat1 size={18} /> : <Repeat size={18} />}
            </button>
        </div>
    );
};

export default PlayerControls;