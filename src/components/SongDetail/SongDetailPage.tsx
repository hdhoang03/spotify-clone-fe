import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMusic } from '../../contexts/MusicContent';
import { Play, Loader2, Music, AlertCircle } from 'lucide-react';
import api from '../../services/api';
import { getUICache } from '../../utils/userStorage';

const SongDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    // Lấy hàm playPlaylist từ MusicContext (giống như trong file index.tsx của bạn)
    const { playPlaylist } = useMusic();

    const [songData, setSongData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSongMetadata = async () => {
            if (!id) return;
            setIsLoading(true);
            setError(null);

            try {
                const response = await api.get(`/song/${id}`);
                const song = response.data?.result;
                if (!song) {
                    throw new Error("Song not found.");
                }
                setSongData(song);

            } catch (err: any) {
                console.error("Error when loading song:", err);
                const errMsg = err.response?.data?.message || err.message || "Failed to connect to the Backend system.";
                setError(errMsg);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSongMetadata();
    }, [id]);

    const isLoggedIn = Boolean(getUICache());

    // Tự động phát khi redirect từ đăng nhập thành công
    useEffect(() => {
        const autoplay = sessionStorage.getItem('post_login_autoplay');
        if (isLoggedIn && autoplay === 'true' && songData) {
            sessionStorage.removeItem('post_login_autoplay');
            playPlaylist([songData], 0);
            navigate('/');
        }
    }, [isLoggedIn, songData, playPlaylist, navigate]);

    const handlePlaySong = () => {
        if (!songData) return;

        // Phát nhạc
        playPlaylist([songData], 0);

        if (!isLoggedIn) {
            // Ghi nhớ để hiển thị login modal và tự phát sau khi đăng nhập thành công
            sessionStorage.setItem('post_login_redirect', `/song/${id}`);
            sessionStorage.setItem('post_login_autoplay', 'true');
        } else {
            navigate('/');
        }
    };

    const handleLoginPrompt = () => {
        sessionStorage.setItem('post_login_redirect', `/song/${id}`);
        sessionStorage.setItem('post_login_autoplay', 'true');
        window.dispatchEvent(new Event('open-auth-modal'));
    };

    return (
        <div className="relative flex flex-col items-center justify-center min-h-[85vh] w-full px-4 py-12 select-none overflow-hidden rounded-lg bg-gradient-to-b from-zinc-900 to-black text-white shadow-2xl border border-zinc-800/20">
            {/* Ambient Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-primary-500/10 rounded-full blur-[100px] pointer-events-none" />

            {/* TRẠNG THÁI ĐANG TẢI */}
            {isLoading && (
                <div className="relative z-10 flex flex-col items-center gap-4 bg-zinc-900/80 p-8 rounded-lg border border-zinc-800/80 backdrop-blur-md animate-pulse">
                    <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
                    <p className="text-zinc-350 font-medium">Đang nhận diện bài hát từ mã QR...</p>
                </div>
            )}

            {/* TRẠNG THÁI LỖI (CORS / KHÔNG TỒN TẠI ID / SAI ĐƯỜNG DẪN) */}
            {error && (
                <div className="relative z-10 flex flex-col items-center gap-4 bg-zinc-900/90 p-8 rounded-lg border border-red-950/30 max-w-sm text-center backdrop-blur-md animate-in fade-in duration-300 shadow-2xl">
                    <AlertCircle className="w-12 h-12 text-red-500" />
                    <h3 className="text-xl font-bold text-red-400">Không thể phát nhạc</h3>
                    <p className="text-zinc-400 text-sm leading-relaxed">{error}</p>
                    <button
                        onClick={() => navigate('/')}
                        className="mt-4 px-6 py-2.5 bg-zinc-800 hover:bg-zinc-700 font-bold rounded-full text-xs transition active:scale-95 text-white"
                    >
                        Quay về Trang chủ
                    </button>
                </div>
            )}

            {/* TRẠNG THÁI THÀNH CÔNG VÀ SẴN SÀNG PHÁT CHUYỂN TIẾP */}
            {!isLoading && !error && songData && (
                <div className="relative z-10 flex flex-col items-center bg-zinc-950/85 p-8 rounded-lg border border-zinc-800/80 shadow-[0_20px_50px_rgba(0,0,0,0.6)] max-w-sm w-full backdrop-blur-md animate-in fade-in zoom-in-95 duration-500">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-500 mb-6 bg-primary-500/10 px-3 py-1.5 rounded-full border border-primary-500/20">
                        Springtunes Share
                    </span>

                    {/* Khung ảnh cover bài hát */}
                    <div className="w-44 h-44 rounded-md overflow-hidden shadow-2xl relative group mb-6 bg-zinc-900 flex items-center justify-center border border-zinc-800/50">
                        {songData.coverUrl ? (
                            <img
                                src={songData.coverUrl}
                                alt={songData.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                            />
                        ) : (
                            <Music className="w-14 h-14 text-zinc-650" />
                        )}
                    </div>

                    {/* Thông tin metadata */}
                    <div className="text-center w-full px-2 mb-6">
                        <h2 className="text-2xl font-black truncate text-white tracking-tight leading-tight" title={songData.title}>
                            {songData.title}
                        </h2>
                        <p className="text-sm font-bold text-zinc-400 mt-1.5 truncate">
                            {songData.artist}
                        </p>
                    </div>

                    {/* Báo hiệu nghe thử nếu chưa đăng nhập */}
                    {songData.is_deleted ? (
                        <div className="w-full bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6 text-center text-xs text-red-400 shadow-inner">
                            Nội dung này không khả dụng. Bài hát có thể đã bị xóa.
                        </div>
                    ) : !isLoggedIn && (
                        <div className="w-full bg-zinc-900/60 border border-zinc-800/80 rounded-lg p-4 mb-6 text-center text-xs text-zinc-400 shadow-inner">
                            Bạn chưa đăng nhập. Bài hát sẽ phát thử <span className="text-primary-500 font-black">20 giây</span>.
                            <button
                                onClick={handleLoginPrompt}
                                className="block mx-auto mt-2 text-primary-500 hover:text-primary-400 font-bold underline transition"
                            >
                                Đăng nhập để nghe bản Full
                            </button>
                        </div>
                    )}

                    {/* Nút Hành Động Phát - Tạo tương tác vật lý trực tiếp từ user để tránh lỗi Autoplay */}
                    <button
                        onClick={handlePlaySong}
                        disabled={songData.is_deleted}
                        className={`w-full ${songData.is_deleted ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed' : 'bg-primary-500 hover:bg-primary-400 text-black shadow-lg shadow-primary-500/25'} font-extrabold py-3.5 rounded-full flex items-center justify-center gap-2.5 transition transform active:scale-95 text-base`}
                    >
                        <Play fill={songData.is_deleted ? 'currentColor' : 'black'} size={16} className="ml-0.5" />
                        Phát bài hát ngay
                    </button>

                    <button
                        onClick={() => navigate('/')}
                        className="mt-6 text-xs font-bold text-zinc-400 hover:text-white transition py-1.5 px-4 rounded-full hover:bg-zinc-900/50"
                    >
                        Bỏ qua và vào Trang chủ
                    </button>
                </div>
            )}
        </div>
    );
};

export default SongDetailPage;