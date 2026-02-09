import React, { useState } from 'react';
import ArtistAboutModal from '../Artist/ArtistAboutModal';
import { useNavigate } from 'react-router-dom';

interface ExtraInfoProps {
    artistName: string;
    onCollapse: () => void;
}

const ExtraInfo = ({ artistName, onCollapse }: ExtraInfoProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();
    // Giả lập dữ liệu (Sau này có thể nhận qua props hoặc fetch ở đây)
    const artistData = {
        name: artistName,
        id: 'phuongly',
        description: `Ca sĩ Phương Ly là một hot girl, ca sĩ người Việt Nam. Cô là em gái của ca sĩ Phương Linh. Phương Ly bắt đầu nổi tiếng từ sau khi lọt vào Top 4 cuộc thi Vietnam Idol 2010.`,
        // Modal dùng 'coverImage', ta map từ avatarUrl qua
        avatarUrl: "https://th.bing.com/th/id/R.d9a8f9c4a5d20df9828351001625f9e3?rik=9ykOwOHNJadujQ&pid=ImgRaw&r=0",
        coverImage: "https://th.bing.com/th/id/R.d9a8f9c4a5d20df9828351001625f9e3?rik=9ykOwOHNJadujQ&pid=ImgRaw&r=0",
        monthlyListeners: 1234567, // Dạng số để CountUpNumber chạy được
        followersCount: 4821092,
        globalRank: 15,
        bio: `Ca sĩ Phương Ly là một hot girl, ca sĩ người Việt Nam... (Nội dung chi tiết)`
    };

    const handleArtistClick = () => {
        onCollapse();
        setTimeout(() => {
            navigate(`/artist/${artistData.id}`)
        }, 100);
    }

    return (
        <div className="flex flex-col gap-8 mt-8">
            {/* Lyrics Section */}
            <div className="bg-zinc-800/60 rounded-2xl p-6 hover:bg-zinc-800/80 transition cursor-pointer">
                <h3 className="font-bold text-lg mb-4">Lời bài hát</h3>
                <p className="text-xl font-bold text-white leading-relaxed">
                    Chưa có lời bài hát... <br/>
                    <span className="text-gray-400 text-base font-normal">(Tính năng đang phát triển)</span>
                </p>
            </div>

            {/* Artist Section */}
            <div>
                <h3 className="font-bold text-lg mb-4">Về nghệ sĩ</h3>
                <div 
                    // onClick={() => setIsModalOpen(true)} 
                    onClick={handleArtistClick} //onClick={() => handleArtistClick()}
                    className="bg-zinc-800/60 rounded-2xl overflow-hidden hover:bg-zinc-800/80 transition cursor-pointer group"
                >
                    <div className="h-40 w-full relative">
                        {/* Thêm hiệu ứng zoom nhẹ khi hover */}
                        <img 
                            src={artistData.avatarUrl} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                            alt="Artist Cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-4">
                            <h4 className="text-2xl font-bold">{artistData.name}</h4>
                        </div>
                    </div>
                    <div className="p-4">
                        <span className="text-gray-400 text-sm mb-4 block">
                            {artistData.monthlyListeners.toLocaleString('vi-VN')} người nghe hàng tháng
                        </span>
                        <p className="text-sm text-gray-300 line-clamp-3">
                            {artistData.description}
                        </p>
                        
                        {/* Nút Theo dõi */}
                        <button 
                            onClick={(e) => {
                                e.stopPropagation(); // Ngăn việc click nút này mà mở luôn cả modal (nếu muốn tách biệt)
                                console.log("Đã theo dõi!");
                            }}
                            className="mt-4 border border-white/30 rounded-full px-4 py-1 text-sm font-bold hover:scale-105 hover:bg-white hover:text-black transition"
                        >
                            Theo dõi
                        </button>
                    </div>
                </div>
            </div>

            {/* Credits Section */}
            <div className="pb-24">
                <h3 className="font-bold text-sm uppercase mb-2">Đội ngũ sản xuất</h3>
                <p className="text-xs text-gray-400">Được trình bày bởi {artistName}</p>
                <p className="text-xs text-gray-400">Nguồn: SpringTunes Database</p>
            </div>

            <ArtistAboutModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                artist={artistData} 
            />
        </div>
    );
};

export default React.memo(ExtraInfo);