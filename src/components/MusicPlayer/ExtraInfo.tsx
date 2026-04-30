import React, { useState, useEffect } from 'react';
import ArtistAboutModal from '../Artist/ArtistAboutModal';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

interface ExtraInfoProps {
    artistName: string;
    artistId: string;
    onCollapse: () => void;
}

const ExtraInfo = ({ artistName, artistId, onCollapse }: ExtraInfoProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [artistData, setArtistData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchArtistInfo = async () => {
            if (!artistId) return;
            setIsLoading(true);
            try {
                const response = await api.get(`/artist/${artistId}`);
                if (response.data.code === 1000) {
                    const data = response.data.result;
                    setArtistData({
                        ...data,
                        bio: data.description,
                        monthlyListeners: data.followerCount || 0,
                        coverImage: data.avatarUrl
                    });
                }
            } catch (error) {
                console.error("Lỗi lấy thông tin nghệ sĩ:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchArtistInfo();
    }, [artistId]);

    const handleArtistClick = () => {
        if (!artistId) return;
        onCollapse();
        setTimeout(() => {
            navigate(`/artist/${artistId}`);
        }, 100);
    };

    // Nếu đang load hoặc không có data thì ẩn phần "Về nghệ sĩ" hoặc hiện skeleton
    if (!artistData && !isLoading) return null;

    return (
        <div className="flex flex-col gap-8 mt-8">
            <div className="bg-zinc-800/60 rounded-2xl p-6 hover:bg-zinc-800/80 transition cursor-pointer">
                <h3 className="font-bold text-lg mb-4">Lời bài hát</h3>
                <p className="text-xl font-bold text-white leading-relaxed">
                    Chưa có lời bài hát... <br />
                    <span className="text-gray-400 text-base font-normal">(Tính năng đang phát triển)</span>
                </p>
            </div>

            {artistData && (
                <div>
                    <h3 className="font-bold text-lg mb-4">Về nghệ sĩ</h3>
                    <div
                        onClick={handleArtistClick}
                        className="bg-zinc-800/60 rounded-2xl overflow-hidden hover:bg-zinc-800/80 transition cursor-pointer group"
                    >
                        <div className="h-40 w-full relative">
                            <img
                                src={artistData.avatarUrl || "/default-artist.png"}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                alt={artistData.name}
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
                                {artistData.description || "Nghệ sĩ chưa có mô tả."}
                            </p>

                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    // Logic follow sẽ gọi API /user/{userId}/follow ở UserController.java
                                    console.log("Đã theo dõi nghệ sĩ:", artistData.id);
                                }}
                                className="mt-4 border border-white/30 rounded-full px-4 py-1 text-sm font-bold hover:scale-105 hover:bg-white hover:text-black transition"
                            >
                                Theo dõi
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Credits Section */}
            <div className="pb-24">
                <h3 className="font-bold text-sm uppercase mb-2">Đội ngũ sản xuất</h3>
                <p className="text-xs text-gray-400">Được trình bày bởi {artistName}</p>
                <p className="text-xs text-gray-400">Nguồn: SpringTunes Database</p>
            </div>

            {artistData && (
                <ArtistAboutModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    artist={artistData}
                />
            )}
        </div>
    );
};

export default React.memo(ExtraInfo);