// components/Artist/ArtistAboutModal.tsx
import React from 'react';
import { X, Globe, Users, TrendingUp, Trophy, Clock } from 'lucide-react';
import { createPortal } from 'react-dom';
import CountUpNumber from '../common/CountUpNumber';

interface ArtistAboutModalProps {
    isOpen: boolean;
    onClose: () => void;
    artist: any;
}

// Helper: Component vẽ biểu đồ sóng nhỏ (Sparkline)
const TrendChart = ({ color = "#22c55e" }: { color?: string }) => {
    // Mock data points
    const points = [40, 35, 45, 50, 48, 60, 55, 70, 75, 65, 80, 85];
    const max = Math.max(...points);
    const min = Math.min(...points);
    const width = 120;
    const height = 40;
    
    // Tạo đường dẫn SVG
    const pathD = points.map((p, i) => {
        const x = (i / (points.length - 1)) * width;
        const y = height - ((p - min) / (max - min)) * height;
        return `${i === 0 ? 'M' : 'L'} ${x},${y}`;
    }).join(' ');

    return (
        <svg width={width} height={height} className="overflow-visible">
            <path d={pathD} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            {/* Hiệu ứng fill mờ bên dưới */}
            <path d={`${pathD} L ${width},${height} L 0,${height} Z`} fill={color} fillOpacity="0.1" stroke="none" />
        </svg>
    );
};

const ArtistAboutModal = ({ isOpen, onClose, artist }: ArtistAboutModalProps) => {
    if (!isOpen) return null;

    // Mock data: Fan Leaderboard
    const topFans = [
        { id: 1, name: 'Minh Tú', score: 15400, avatar: null },
        { id: 2, name: 'An Nhiên', score: 12350, avatar: null },
        { id: 3, name: 'Quốc Bảo', score: 9800, avatar: null },
    ];

    return createPortal (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

            {/* Modal Content */}
            <div className="relative bg-[#1e1e1e] w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200 no-scrollbar border border-white/10">
                
                {/* Close Button */}
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 bg-black/40 hover:bg-black/60 rounded-full text-white z-20 transition"
                >
                    <X size={20} />
                </button>

                {/* 1. Header Image */}
                <div className="relative h-64 md:h-80 w-full">
                    <img 
                        src={artist.coverImage} 
                        alt={artist.name} 
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1e1e1e] to-transparent" />
                    
                    <div className="absolute bottom-6 left-6 md:left-8">
                        <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-2 drop-shadow-lg">
                            {artist.name}
                        </h2>
                        {/* Global Rank Badge */}
                        {artist.globalRank && (
                            <div className="inline-flex items-center gap-2 bg-blue-600/20 border border-blue-500/50 px-3 py-1 rounded-full text-blue-400 font-bold text-sm backdrop-blur-md">
                                <Globe size={14} />
                                #{artist.globalRank} in the world
                            </div>
                        )}
                    </div>
                </div>

                {/* 2. Body Content */}
                <div className="p-6 md:p-8 space-y-8">
                    
                    {/* --- STATS & TREND --- */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Monthly Listeners + Chart */}
                        <div className="bg-[#2a2a2a] p-5 rounded-xl border border-white/5 flex flex-col justify-between h-32 relative overflow-hidden group">
                            <div>
                                <div className="flex items-center gap-2 text-gray-400 font-bold text-xs uppercase tracking-widest mb-1">
                                    <Users size={14} /> Monthly Listeners
                                </div>
                                <p className="text-3xl font-black text-white">
                                    <CountUpNumber endValue={artist.monthlyListeners} duration={2000} />
                                </p>
                            </div>
                            
                            {/* Trend Chart nằm góc phải dưới */}
                            <div className="absolute bottom-4 right-4">
                                <TrendChart color="#22c55e" />
                            </div>
                            
                            <p className="text-xs text-green-400 flex items-center gap-1 mt-2">
                                <TrendingUp size={12} /> +12.5% this month
                            </p>
                        </div>

                        {/* Followers */}
                        <div className="bg-[#2a2a2a] p-5 rounded-xl border border-white/5 h-32 flex flex-col justify-center">
                            <div className="flex items-center gap-2 text-gray-400 font-bold text-xs uppercase tracking-widest mb-2">
                                <Users size={14} /> Followers
                            </div>
                            <p className="text-3xl font-black text-white">
                                <CountUpNumber endValue={artist.followersCount || 4821092} duration={1500} />
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                                New followers daily
                            </p>
                        </div>
                    </div>

                    {/* --- LISTENER VIBE --- */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <Clock size={20} className="text-purple-400"/> Listener Vibe
                        </h3>
                        <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 p-6 rounded-xl border border-white/10 relative overflow-hidden">
                            {/* Decorative Blur */}
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl pointer-events-none"></div>
                            
                            <p className="text-lg text-white/90 font-medium italic relative z-10">
                                "Fan của <span className="text-white font-bold">{artist.name}</span> thường nghe nhạc vào lúc <span className="text-purple-400 font-bold">Đêm khuya (23:00 - 02:00)</span>. Họ là những người giàu cảm xúc và tìm kiếm sự đồng điệu."
                            </p>
                        </div>
                    </div>

                    {/* --- FAN LEADERBOARD (Thay thế Top Cities) --- */}
                    <div>
                        <div className="flex justify-between items-end mb-4">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <Trophy size={20} className="text-yellow-500"/> Top Fans
                            </h3>
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Minutes Streamed</span>
                        </div>
                        
                        <div className="bg-[#2a2a2a] rounded-xl border border-white/5 overflow-hidden">
                            {topFans.map((fan, idx) => (
                                <div key={fan.id} className="flex justify-between items-center p-4 border-b border-white/5 last:border-0 hover:bg-white/5 transition">
                                    
                                    {/* LEFT SIDE: Rank + Avatar + Name */}
                                    {/* Thêm 'flex-1' và 'min-w-0' để vùng này co giãn linh hoạt */}
                                    <div className="flex items-center gap-4 flex-1 min-w-0 mr-4">
                                        
                                        {/* Rank Number (Giữ nguyên) */}
                                        <div className={`w-8 h-8 flex-shrink-0 rounded-full flex items-center justify-center text-sm font-black 
                                            ${idx === 0 ? 'bg-yellow-500 text-black' : 
                                            idx === 1 ? 'bg-gray-400 text-black' : 
                                            idx === 2 ? 'bg-orange-700 text-white' : 'bg-[#333] text-gray-400'}`}>
                                            {idx + 1}
                                        </div>
                                        
                                        <div className="flex items-center gap-3 min-w-0 flex-1">
                                            {/* Avatar (Giữ nguyên) - Thêm flex-shrink-0 để không bị bóp méo */}
                                            <div className="w-8 h-8 flex-shrink-0 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-xs font-bold text-black">
                                                {fan.name.charAt(0)}
                                            </div>
                                            <span className="text-white font-bold truncate">
                                                {fan.name}
                                            </span>
                                        </div>
                                    </div>
                                    <span className="text-green-400 font-mono font-bold whitespace-nowrap flex-shrink-0 text-sm md:text-base">
                                        {fan.score.toLocaleString()} min
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* --- BIOGRAPHY --- */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-white">Biography</h3>
                        <p className="text-gray-300 leading-relaxed text-base whitespace-pre-line">
                            {artist.bio || "Nghệ sĩ chưa cập nhật thông tin tiểu sử."}
                        </p>
                        
                        {/* Social Links */}
                        <div className="flex gap-4 pt-4 border-t border-white/10">
                            <button className="p-2 rounded-full bg-white/5 hover:bg-white/20 text-white transition">
                                <Globe size={20}/>
                            </button>
                            <button className="px-4 py-2 rounded-full bg-white/5 hover:bg-white/20 text-white text-sm font-bold transition">
                                Wikipedia
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>,
        document.body
    );
};

export default ArtistAboutModal;