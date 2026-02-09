//Service
import { useState, useRef, useEffect } from 'react';

export type RepeatMode = 'off' | 'all' | 'one';

export const useAudioPlayer = (onSongEndedCallback?: () => void, isGuest: boolean = false) => {
    //Ref thẻ audio HTML
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // 1. Quản lý State (Giống Database tạm thời)
    const [isPlaying, setIsPlaying] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [speed, setSpeed] = useState(1);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [prevVolume, setPrevVolume] = useState(1);
    const [isShuffling, setIsShuffling] = useState(false);
    const [repeatMode, setRepeatMode] = useState<RepeatMode>('off');

    // Xử lý cập nhật thanh thời gian khi nhạc chạy
    const onLoadedMetadata = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration);
            audioRef.current.playbackRate = speed;// Set tốc độ phát khi metadata được load ví dụ 2x khi chuyển bài vẫn giữ 2x
        }
    };

    const setInitialDuration = (jsonDuration: number | undefined) => {
        setDuration(jsonDuration || 0);
    }

    const onTimeUpdate = () => {
        if (audioRef.current) {
            const current = audioRef.current.currentTime;
            setCurrentTime(current);

            // --- LOGIC MỚI: CHẶN KHÁCH SAU 30S ---
            if (isGuest && current >= 30) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0; // Reset hoặc giữ nguyên
                setIsPlaying(false);
                
                // Bạn có thể dispatch 1 custom event hoặc dùng state để hiện Modal Login
                alert("Bạn đang nghe thử. Vui lòng đăng nhập để nghe trọn vẹn bài hát!");
                // window.dispatchEvent(new Event('REQUIRE_LOGIN')); // Ví dụ nâng cao
            }
        }
    };

    // Xử lý khi bài hát kết thúc
    const onEnded = () => {
        // Nếu là Repeat One: Thẻ Audio tự loop lại (do useEffect đã set audioRef.loop = true)
        if (repeatMode === 'one') {
            return; 
        }
        
        // Nếu có callback (hàm next bài), gọi nó
        if (onSongEndedCallback) {
            onSongEndedCallback();
        } else {
            // Fallback: Nếu không có logic next, thì dừng nhạc
            setIsPlaying(false);
        }
    };

    // Logic Play/Pause
    const togglePlay = () => {
        setIsPlaying(!isPlaying);
    };
    
    const toggleShuffle = () => {
        setIsShuffling(prev => !prev);
    };

    // --- Logic MỚI: Toggle Repeat (Off -> All -> One -> Off) ---
    const toggleRepeat = () => {
        setRepeatMode(current => {
            if (current === 'off') return 'all';
            if (current === 'all') return 'one';
            return 'off';
        });
    };

    // Logic Seek (kéo thanh tua)
    const handleTimeChange = (time: number) => {
        if (audioRef.current) {
            audioRef.current.currentTime = time;
            setCurrentTime(time);
        }
    };
    
    const handleSpeedChange = (newSpeed: number) => { //hàm thay đổi tốc độ phát
        setSpeed(newSpeed);
        console.log("Speed changed to:", newSpeed);
    }
    // ---EFFECTS---

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.loop = (repeatMode === 'one');
        }
    }, [repeatMode]);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = isMuted ? 0 : volume;
        }
    }, [volume, isMuted]);

    useEffect(() => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.play().catch(error => {
                    console.error("Playback failed", error);
                    setIsPlaying(false);
                });
            } else {
                audioRef.current.pause();
            }
        }
    }, [isPlaying]);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.playbackRate = speed;
        }
    }, [speed]);

    const handleVolumeChange = (newVolume: number) => {
        setVolume(newVolume);
        if (newVolume > 0) {
            setIsMuted(false);
            setPrevVolume(newVolume);
        }
    };

    const toggleMute = () => {
        if (isMuted) {
            setIsMuted(false);
            setVolume(prevVolume);
        } else {
            setPrevVolume(volume);
            setIsMuted(true);
            setVolume(0);
        }
    };

    const toggleVisibility = () => setIsVisible(!isVisible);

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    return {
        audioRef,
        isPlaying,
        isVisible,
        currentTime,
        duration,
        speed,
        volume,
        isMuted,
        isShuffling,
        repeatMode,
        toggleShuffle,
        toggleRepeat,
        togglePlay,
        toggleVisibility,
        handleTimeChange,
        handleSpeedChange,
        formatTime,
        onLoadedMetadata, 
        onTimeUpdate,
        onEnded,
        handleVolumeChange,
        toggleMute,
        setInitialDuration
    };
};