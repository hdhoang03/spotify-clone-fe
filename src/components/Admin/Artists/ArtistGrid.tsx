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
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                {artists.map((artist: any) => { // Dùng any tạm nếu chưa update interface
                    const daysLeft = isViewDeleted ? getDaysRemaining(artist.deletedAt) : 0;

                    return (
                        <div key={artist.id} className={`group relative flex flex-col items-center bg-white/70 dark:bg-zinc-950/40 backdrop-blur-xl p-5 md:p-6 rounded-lg border transition-all duration-300 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] hover:-translate-y-0.5 ${isViewDeleted ? 'border-red-200 dark:border-red-900/35' : 'border-zinc-200/50 dark:border-zinc-800/40 hover:border-emerald-500/35'}`}>

                            {/* Badge ngày còn lại */}
                            {isViewDeleted && (
                                <div className={`absolute top-3 left-3 px-2 py-1 rounded-lg text-[9px] font-extrabold flex items-center gap-1 z-20 shadow-sm tracking-wider uppercase
                                    ${daysLeft <= 5 ? 'bg-red-500 text-white' : 'bg-orange-50 text-orange-700 dark:bg-orange-950/20 dark:text-orange-400 border border-orange-100 dark:border-orange-950/20'}`}>
                                    <Clock size={10} />
                                    <span>Còn {daysLeft} ngày</span>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="absolute top-3 right-3 flex gap-1 z-10 transition-opacity duration-300 opacity-100 lg:opacity-0 lg:group-hover:opacity-100">
                                {!isViewDeleted ? (
                                    <>
                                        <button onClick={() => onEdit(artist)} className="p-2 bg-zinc-100/80 hover:bg-blue-50 text-zinc-650 hover:text-blue-600 rounded-xl dark:bg-zinc-900 dark:hover:bg-blue-950/30 dark:text-zinc-400 transition duration-300 shadow-sm" title="Sửa">
                                            <Edit size={13} />
                                        </button>
                                        <button onClick={() => onDelete(artist.id)} className="p-2 bg-zinc-100/80 hover:bg-rose-50 text-zinc-650 hover:text-rose-600 rounded-xl dark:bg-zinc-900 dark:hover:bg-rose-950/30 dark:text-zinc-400 transition duration-300 shadow-sm" title="Chuyển vào thùng rác">
                                            <Trash2 size={13} />
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button onClick={() => onRestore(artist.id)} className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 hover:text-emerald-700 rounded-xl transition duration-300 shadow-sm border border-emerald-100" title="Khôi phục">
                                            <RefreshCw size={13} />
                                        </button>
                                        <button onClick={() => onHardDelete(artist.id)} className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-650 hover:text-rose-700 rounded-xl transition duration-300 shadow-sm border border-rose-100" title="Xóa vĩnh viễn">
                                            <XCircle size={13} />
                                        </button>
                                    </>
                                )}
                            </div>

                            {/* Avatar */}
                            <div className={`w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden mb-4 shadow-lg group-hover:scale-105 transition-transform duration-350 border-2 border-transparent ${isViewDeleted ? 'grayscale opacity-75' : 'group-hover:border-emerald-500/20'}`}>
                                <img src={artist.avatarUrl || "https://via.placeholder.com/150"} alt={artist.name} className="w-full h-full object-cover" />
                            </div>

                            {/* Info */}
                            <h3 className="font-extrabold text-base text-zinc-950 dark:text-zinc-100 text-center mb-1.5 line-clamp-1 w-full px-1 tracking-tight">
                                {artist.name}
                            </h3>
                            {!isViewDeleted && (
                                <p className="text-xs text-zinc-400 dark:text-zinc-500 text-center line-clamp-2 mb-3 h-8 w-full px-1 leading-relaxed">
                                    {artist.description || 'Chưa có mô tả chi tiết.'}
                                </p>
                            )}

                            {isViewDeleted && (
                                <p className="text-[11px] font-semibold text-rose-500 dark:text-rose-400 text-center mb-3 h-8 w-full px-1 flex items-center justify-center">
                                    Đã xóa: {artist.deletedAt ? new Date(artist.deletedAt).toLocaleDateString('vi-VN') : 'Vừa xong'}
                                </p>
                            )}

                            {/* Stats mini */}
                            <div className="flex items-center justify-center gap-5 mt-2 pt-3 border-t border-zinc-100 dark:border-zinc-900/60 w-full">
                                <div className="text-center">
                                    <p className="text-[10px] text-zinc-450 dark:text-zinc-550 mb-0.5 flex items-center justify-center gap-1">
                                        <Music size={10} /> Bài hát
                                    </p>
                                    <p className="font-extrabold text-xs text-zinc-700 dark:text-zinc-300">
                                        {artist.songCount || 0}
                                    </p>
                                </div>
                                <div className="text-center">
                                    <p className="text-[10px] text-zinc-450 dark:text-zinc-550 mb-0.5 flex items-center justify-center gap-1">
                                        <Users size={10} /> Fan
                                    </p>
                                    <p className="font-extrabold text-xs text-zinc-700 dark:text-zinc-300">
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
                <div className="col-span-full text-center py-12 text-gray-500 flex flex-col items-center justify-center min-h-[200px] border border-dashed border-gray-200 dark:border-zinc-700 rounded-lg">
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