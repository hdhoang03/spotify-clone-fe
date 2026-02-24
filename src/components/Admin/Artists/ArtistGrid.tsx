import { Edit, Trash2, Users, Music, RefreshCw, XCircle, Clock } from 'lucide-react';
import type { ArtistResponse } from '../../../types/backend';
import { Pagination } from '../../Shared/Pagination';

interface ArtistGridProps {
    artists: ArtistResponse[];
    onEdit: (artist: ArtistResponse) => void;
    onDelete: (id: string) => void;
    onRestore: (id: string) => void;
    onHardDelete: (id: string) => void;
    searchTerm: string;
    isViewDeleted: boolean;

    startIndex: number;
    currentPage: number;
    totalPages: number;
    totalItems: number;
    onPageChange: (page: number) => void
}

const formatCount = (count?: number) => {
    if (!count) return '0';
    if (count >= 1000000) return (count / 1000000).toFixed(1) + 'M';
    if (count >= 1000) return (count / 1000).toFixed(1) + 'K';
    return count.toString();
};

const getDaysRemaining = (deletedAt?: string) => {
    if (!deletedAt) return 30; // Mặc định nếu không có data

    const deleteDate = new Date(deletedAt);
    const expireDate = new Date(deleteDate);
    expireDate.setDate(deleteDate.getDate() + 30); // Cộng thêm 30 ngày

    const today = new Date();
    const diffTime = expireDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays > 0 ? diffDays : 0;
};

export const ArtistGrid = ({
    artists, onEdit, onDelete, onRestore, onHardDelete, searchTerm, isViewDeleted,
    startIndex, currentPage, totalPages, totalItems, onPageChange
}: ArtistGridProps) => {
    return (
        <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                {artists.map((artist: any) => { // Dùng any tạm nếu chưa update interface
                    const daysLeft = isViewDeleted ? getDaysRemaining(artist.deletedAt) : 0;

                    return (
                        <div key={artist.id} className={`group relative flex flex-col items-center bg-white dark:bg-zinc-900 p-4 md:p-6 rounded-2xl border transition duration-300 shadow-sm hover:shadow-xl ${isViewDeleted ? 'border-red-200 dark:border-red-900/30' : 'border-gray-200 dark:border-white/5 hover:border-purple-500'}`}>

                            {/* Badge ngày còn lại */}
                            {isViewDeleted && (
                                <div className={`absolute top-2 left-2 px-2 py-1 rounded-md text-[10px] font-bold flex items-center gap-1 z-20 shadow-sm
                                    ${daysLeft <= 5 ? 'bg-red-500 text-white' : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'}`}>
                                    <Clock size={10} />
                                    <span>Còn {daysLeft} ngày</span>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="absolute top-2 right-2 flex gap-1 z-10 transition-opacity duration-200 opacity-100 lg:opacity-0 lg:group-hover:opacity-100">
                                {!isViewDeleted ? (
                                    <>
                                        <button onClick={() => onEdit(artist)} className="p-2 bg-gray-100 hover:bg-blue-100 text-gray-600 hover:text-blue-600 rounded-full dark:bg-zinc-800 dark:hover:bg-blue-900/30 dark:text-gray-300 transition shadow-sm" title="Sửa">
                                            <Edit size={14} />
                                        </button>
                                        <button onClick={() => onDelete(artist.id)} className="p-2 bg-gray-100 hover:bg-red-100 text-gray-600 hover:text-red-600 rounded-full dark:bg-zinc-800 dark:hover:bg-red-900/30 dark:text-gray-300 transition shadow-sm" title="Chuyển vào thùng rác">
                                            <Trash2 size={14} />
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button onClick={() => onRestore(artist.id)} className="p-2 bg-green-50 hover:bg-green-100 text-green-600 hover:text-green-700 rounded-full transition shadow-sm" title="Khôi phục">
                                            <RefreshCw size={14} />
                                        </button>
                                        <button onClick={() => onHardDelete(artist.id)} className="p-2 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 rounded-full transition shadow-sm" title="Xóa vĩnh viễn">
                                            <XCircle size={14} />
                                        </button>
                                    </>
                                )}
                            </div>

                            {/* Avatar */}
                            <div className={`w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden mb-3 md:mb-4 shadow-lg group-hover:scale-105 transition-transform duration-300 border-2 border-transparent ${isViewDeleted ? 'grayscale opacity-70' : 'group-hover:border-purple-500/20'}`}>
                                <img src={artist.avatarUrl || "https://via.placeholder.com/150"} alt={artist.name} className="w-full h-full object-cover" />
                            </div>

                            {/* Info */}
                            <h3 className="font-bold text-base md:text-lg text-gray-900 dark:text-white text-center mb-1 line-clamp-1 w-full px-2">
                                {artist.name}
                            </h3>
                            {!isViewDeleted && (
                                <p className="text-xs text-gray-500 text-center line-clamp-2 mb-3 md:mb-4 h-8 w-full px-2">
                                    {artist.description || 'Chưa có mô tả chi tiết.'}
                                </p>
                            )}

                            {isViewDeleted && (
                                <p className="text-xs text-red-500 text-center mb-3 md:mb-4 h-8 w-full px-2 flex items-center justify-center">
                                    Đã xóa: {artist.deletedAt ? new Date(artist.deletedAt).toLocaleDateString('vi-VN') : 'Vừa xong'}
                                </p>
                            )}

                            {/* Stats mini */}
                            <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-gray-100 dark:border-white/5">
                                <div className="text-center">
                                    <p className="text-[10px] md:text-xs text-gray-400 mb-0.5 flex items-center justify-center gap-1">
                                        <Music size={10} /> Bài hát
                                    </p>
                                    <p className="font-bold text-xs md:text-sm dark:text-gray-200">
                                        {artist.songCount || 0}
                                    </p>
                                </div>
                                <div className="text-center">
                                    <p className="text-[10px] md:text-xs text-gray-400 mb-0.5 flex items-center justify-center gap-1">
                                        <Users size={10} /> Fan
                                    </p>
                                    <p className="font-bold text-xs md:text-sm dark:text-gray-200">
                                        {formatCount(artist.followerCount)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Empty State */}
            {artists.length === 0 && (
                <div className="col-span-full text-center py-12 text-gray-500 flex flex-col items-center justify-center min-h-[200px] border border-dashed border-gray-200 dark:border-zinc-700 rounded-2xl">
                    <p>{isViewDeleted ? "Thùng rác trống!" : `Không tìm thấy kết quả cho "${searchTerm}"`}</p>
                </div>
            )}

            {/* --- GỌI COMPONENT PHÂN TRANG MÀU TÍM --- */}
            {totalItems > 0 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={totalItems}
                    startIndex={startIndex}
                    currentItemsCount={artists.length}
                    onPageChange={onPageChange}
                    activeColorClass="bg-purple-600 shadow-purple-500/30"
                />
            )}
        </div>
    );
};