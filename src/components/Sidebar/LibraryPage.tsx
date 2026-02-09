import { useState } from 'react';
import PlaylistCard from './PlaylistCard';
import { Play, Plus, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Mock Data (Hoặc bạn có thể dùng hook usePlaylists ở đây)
const MOCK_PLAYLISTS = Array(6).fill({
    title: "Daily Mix",
    description: "Made for you • The Weeknd, Ariana Grande",
    imageUrl: "https://misc.scdn.co/liked-songs/liked-songs-640.png"
});

const MOCK_ARTISTS = Array(6).fill({
    name: "Sơn Tùng M-TP",
    role: "Artist",
    imageUrl: "https://th.bing.com/th/id/R.38258ebf99837affa696da4845ffacd1?rik=pT0fiZcF5Ck%2b0w&pid=ImgRaw&r=0"
});

const LibraryPage = () => {
    const [activeFilter, setActiveFilter] = useState('Playlists');

    // Content logic (Giữ nguyên logic render của bạn)
    const renderContent = () => {
        const contentVariants = {
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
            exit: { opacity: 0, y: -20, transition: { duration: 0.2 } }
        };

        switch (activeFilter) {
            case 'Playlists':
                return (
                    <motion.div
                        key="playlists"
                        variants={contentVariants}
                        initial="hidden" animate="visible" exit="exit"
                        // Mobile: 2 cột, Desktop: 3-5 cột
                        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6 pb-24 md:pb-0"
                    >
                        {/* Thẻ Liked Songs Đặc biệt */}
                        <motion.div
                            whileTap={{ scale: 0.98 }} // Hiệu ứng nhấn cho mobile
                            whileHover={{ scale: 1.02 }}
                            className="col-span-2 row-span-1 bg-gradient-to-br from-purple-600 to-blue-700 rounded-lg p-4 md:p-6 flex flex-col justify-end cursor-pointer group relative shadow-lg min-h-[140px] md:min-h-auto"
                        >
                            {/* Mobile: Text nhỏ hơn chút */}
                            <div className="mb-2 md:mb-4">
                                <span className="text-white/90 line-clamp-2 text-xs md:text-sm md:text-base">The Weeknd, Post Malone...</span>
                            </div>
                            <h3 className="text-xl md:text-3xl font-bold text-white mb-1 md:mb-2">Liked Songs</h3>
                            <p className="text-white/90 font-medium text-xs md:text-sm">420 songs</p>

                            {/* Nút Play hiển thị luôn trên mobile hoặc ẩn tùy ý */}
                            <div className="absolute bottom-4 right-4 w-10 h-10 md:w-12 md:h-12 bg-green-500 rounded-full flex items-center justify-center shadow-xl text-black md:opacity-0 md:group-hover:opacity-100 md:translate-y-2 md:group-hover:translate-y-0 transition-all duration-300">
                                <Play fill="black" size={20} className="ml-1 md:w-6 md:h-6" />
                            </div>
                        </motion.div>

                        {/* Danh sách Playlist dạng Grid */}
                        {MOCK_PLAYLISTS.map((pl, idx) => (
                            <PlaylistCard key={idx} {...pl} title={`${pl.title} ${idx + 1}`} index={idx} />
                        ))}
                    </motion.div>
                );

            case 'Artists':
                return (
                    <motion.div
                        key="artists"
                        variants={contentVariants}
                        initial="hidden" animate="visible" exit="exit"
                        className="
                            /* MOBILE: Xếp dọc (List) */
                            flex flex-col gap-2
                            /* DESKTOP: Xếp lưới (Grid) như cũ */
                            md:grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 md:gap-6 
                            pb-24 md:pb-0
                        "
                    >
                        {MOCK_ARTISTS.map((artist, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: -10 }} // Mobile lướt từ trái sang nhẹ
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="
                                    group cursor-pointer transition-colors rounded-lg
                                    
                                    /* MOBILE STYLES: Dạng hàng ngang (Row) */
                                    flex items-center gap-4 p-2 
                                    hover:bg-zinc-100 dark:hover:bg-white/5

                                    /* DESKTOP STYLES: Dạng thẻ dọc (Card) */
                                    md:flex-col md:p-4 md:items-center md:bg-zinc-100/50 md:dark:bg-[#181818] md:dark:hover:bg-[#282828]
                                "
                            >
                                {/* Ảnh Artist */}
                                <div className="
                                    shrink-0 overflow-hidden rounded-full shadow-sm
                                    
                                    /* MOBILE: Ảnh nhỏ vừa phải (Size 64px) */
                                    w-16 h-16 

                                    /* DESKTOP: Ảnh to full khung */
                                    md:w-full md:h-auto md:aspect-square md:shadow-lg md:mb-4
                                ">
                                    <img
                                        src={artist.imageUrl}
                                        alt={artist.name}
                                        className="w-full h-full object-cover md:group-hover:scale-105 transition duration-500"
                                    />
                                </div>

                                {/* Thông tin text */}
                                <div className="flex flex-col flex-1 justify-center md:items-center">
                                    <h3 className="
                                        font-bold text-zinc-900 dark:text-white truncate
                                        /* Mobile text to hơn xíu cho dễ đọc */
                                        text-base md:text-base md:text-center
                                    ">
                                        {artist.name}
                                    </h3>
                                    <p className="
                                        text-zinc-500 dark:text-gray-400 capitalize
                                        text-sm md:text-xs md:text-center md:mt-1
                                    ">
                                        {artist.role}
                                    </p>
                                </div>

                                {/* (Optional) Mũi tên > hoặc nút Play nhỏ bên phải cho Mobile */}
                                <div className="md:hidden text-zinc-300 dark:text-zinc-600">
                                    {/* Bạn có thể import ChevronRight từ lucide-react nếu muốn */}
                                    {/* <ChevronRight size={20} /> */}
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                );

            // ... (Giữ nguyên cases khác)
            default: return null;
        }
    };

    return (
        <div className="h-full w-full flex flex-col bg-white dark:bg-black md:bg-transparent">

            {/* --- MOBILE HEADER & FILTERS --- */}
            {/* Chỉ hiện trên Mobile */}
            <div className="md:hidden pt-4 pb-2 px-4 sticky top-0 z-30 bg-white/95 dark:bg-black/95 backdrop-blur-sm">
                {/* Top Row: Avatar + Title + Actions */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <h1 className="text-xl font-bold text-black dark:text-white">Thư viện</h1>
                    </div>

                    <div className="flex items-center gap-4 text-black dark:text-white">
                        <Search size={24} strokeWidth={2} />
                        <Plus size={24} strokeWidth={2} />
                    </div>
                </div>

                {/* Filter Row (Scroll ngang nếu cần) */}
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                    {['Playlists', 'Artists', 'Albums'].map(filter => (
                        <button
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-semibold transition-all border
                            ${activeFilter === filter
                                    ? 'bg-green-500 text-white border-green-500'
                                    : 'bg-transparent text-black dark:text-white border-zinc-300 dark:border-zinc-700'}`}
                        >
                            {filter}
                        </button>
                    ))}
                </div>
            </div>


            {/* --- DESKTOP HEADER (Giữ nguyên logic cũ của bạn) --- */}
            <div className="hidden md:flex items-center gap-4 pb-6 md:pb-8 py-2 bg-inherit w-full px-6 md:px-8 pt-6">
                {['Playlists', 'Artists', 'Albums'].map(filter => (
                    <button
                        key={filter}
                        onClick={() => setActiveFilter(filter)}
                        className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all border border-transparent
                        ${activeFilter === filter
                                ? 'bg-green-500 text-white shadow-md shadow-green-500/20 scale-105 dark:bg-white dark:text-black'
                                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-[#2a2a2a] dark:text-white dark:hover:bg-[#3a3a3a]'}`}
                    >
                        {filter}
                    </button>
                ))}
            </div>

            {/* --- MAIN CONTENT AREA --- */}
            <div className="flex-1 overflow-y-auto px-4 md:px-8 pt-4 pb-48">
                <AnimatePresence mode="wait">
                    {renderContent()}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default LibraryPage;