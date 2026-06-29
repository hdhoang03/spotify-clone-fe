import React from 'react';
import { Heart } from 'lucide-react';
import { useLikeSong } from '../../../hooks/useLikeSong'; // 1. Import hook
import { motion } from 'framer-motion';

interface SongDetailsProps {
    songId: string; // 2. Thêm songId để hook biết đang thao tác với bài nào
    coverUrl: string;
    title: string;
    artist: string;
    song?: any; // Truyền toàn bộ đối tượng song để lấy featuredArtists
    isLiked?: boolean; // Đóng vai trò là trạng thái khởi tạo ban đầu
    dominantColor?: string;
    onCollapse?: () => void;
    isLoggedIn?: boolean;
}

import ArtistLinks from '../../common/ArtistLinks';

const SongDetails = ({ songId, coverUrl, title, artist, song, isLiked, dominantColor, onCollapse, isLoggedIn = true }: SongDetailsProps) => {
    // 3. Khởi tạo hook để lắng nghe sự kiện đồng bộ toàn cục
    const { isLiked: syncedIsLiked, toggleLike } = useLikeSong(songId, isLiked);

    return (
        <>
            {/* Album Art với Ambient Glow */}
            <div className="relative w-full mt-4 group">
                {/* Ambient glow blur dưới ảnh */}
                <div
                    className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-4/5 h-16 rounded-full blur-2xl opacity-60 transition-opacity duration-700 group-hover:opacity-80"
                    style={{ background: dominantColor || 'rgba(255,255,255,0.15)' }}
                />
                {/* Album art container */}
                <div className="relative w-full aspect-square rounded-2xl overflow-hidden ring-1 ring-white/10 shadow-[0_24px_64px_rgba(0,0,0,0.7)]">
                    <img
                        src={coverUrl}
                        alt="cover"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                    {/* Inner vignette overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
                </div>
            </div>

            {/* Song Info Row */}
            <div className="flex justify-between items-center mt-8 gap-4">
                <div className="min-w-0 flex-1">
                    <h2 className="text-3xl font-black tracking-tight leading-tight truncate mb-1">
                        {title}
                    </h2>
                    <p className="text-base text-white/60 font-medium truncate pointer-events-auto">
                        {song ? <ArtistLinks song={song} spanClassName="hover:text-white" onNavigate={onCollapse} /> : artist}
                    </p>
                </div>

                {/* Like button với animated glow */}
                {isLoggedIn && (
                    <motion.button
                        onClick={(e) => {
                            e.stopPropagation();
                            toggleLike();
                        }}
                        whileTap={{ scale: 0.85 }}
                        whileHover={{ scale: 1.1 }}
                        className="relative flex-shrink-0 w-10 h-10 flex items-center justify-center"
                    >
                        {syncedIsLiked && (
                            <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0, opacity: 0 }}
                                className="absolute inset-0 rounded-full bg-primary-500/20 blur-md"
                            />
                        )}
                        <Heart
                            size={28}
                            className={`relative z-10 transition-colors duration-300 ${
                                syncedIsLiked
                                    ? 'text-primary-400 fill-primary-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.6)]'
                                    : 'text-white/50 hover:text-white'
                            }`}
                        />
                    </motion.button>
                )}
            </div>
        </>
    );
};

export default React.memo(SongDetails);