//Service
import { useState, useRef, useEffect } from 'react';
import { useMusic } from '../../../contexts/MusicContent';
import { streamApi } from '../../../services/streamApi';

export type RepeatMode = 'off' | 'all' | 'one';

export const useAudioPlayer = (onSongEndedCallback?: () => void, isGuest: boolean = false) => {
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // 1. Quản lý State (Giống Database tạm thời)
    // const [isPlaying, setIsPlaying] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [speed, setSpeed] = useState(1);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [prevVolume, setPrevVolume] = useState(1);
    const [repeatMode, setRepeatMode] = useState<RepeatMode>('off');
    const { isShuffling, toggleShuffle, currentSong, isPlaying, setIsPlaying, togglePlay } = useMusic();
    const trackedPlayRef = useRef<string | null>(null);   // Tránh gọi API /play 2 lần cho 1 bài
    const trackedStreamRef = useRef<string | null>(null); // Tránh gọi API /create nhiều lần
    const accumulatedTimeRef = useRef<number>(0);         // Tổng thời gian nghe thực tế
    const lastTickRef = useRef<number>(Date.now());

    useEffect(() => {
        if (!currentSong) return;

        // Nếu ID bài hát thay đổi so với bài trước đó
        if (currentSong.id !== trackedPlayRef.current) {
            // 1. Reset lại bộ đếm thời gian
            accumulatedTimeRef.current = 0;
            trackedStreamRef.current = null;
            trackedPlayRef.current = currentSong.id;
        }
    }, [currentSong]);

    // Reset bộ đếm khi trạng thái đăng nhập thay đổi (isGuest thay đổi)
    useEffect(() => {
        accumulatedTimeRef.current = 0;
        trackedStreamRef.current = null;
    }, [isGuest]);

    // Bộ đếm thời gian thực (Chỉ chạy khi isPlaying = true)
    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isPlaying && currentSong) {
            lastTickRef.current = Date.now(); // Cập nhật mốc thời gian khi vừa bấm Play

            interval = setInterval(() => {
                const now = Date.now();
                const delta = (now - lastTickRef.current) / 1000;
                lastTickRef.current = now;

                accumulatedTimeRef.current += (delta * speed);

                // KIỂM TRA ĐIỀU KIỆN ĐỂ TÍNH STREAM (Nghe đủ 30 giây thực tế)
                if (accumulatedTimeRef.current >= 30 && trackedStreamRef.current !== currentSong.id) {
                    // Gọi API tăng lượt Play/Stream count
                    streamApi.increasePlayCount(currentSong.id).catch(err => {
                        console.error("Lỗi tăng Play Count:", err);
                    });

                    streamApi.createStream(currentSong.id, Math.floor(accumulatedTimeRef.current), speed)
                        .catch(err => console.error("Lỗi tạo Stream:", err));

                    // Đánh dấu là đã tính stream cho bài này để không gọi lại nữa
                    trackedStreamRef.current = currentSong.id;
                }
            }, 1000); // Mỗi giây quét 1 lần
        }

        // Cleanup interval khi Pause hoặc unmount
        return () => clearInterval(interval);
    }, [isPlaying, currentSong, speed]);

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

            // --- LOGIC MỚI: CHẶN KHÁCH SAU 20S ---
            if (isGuest && current >= 20) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0; // Reset về đầu
                setIsPlaying(false);

                // Bắn event để thông báo cho UI mở Modal đăng nhập
                window.dispatchEvent(new CustomEvent('show-login-preview-modal'));
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
        toggleVisibility,
        handleTimeChange,
        handleSpeedChange,
        formatTime,
        togglePlay,
        onLoadedMetadata,
        onTimeUpdate,
        onEnded,
        handleVolumeChange,
        toggleMute,
        setInitialDuration
    };
};