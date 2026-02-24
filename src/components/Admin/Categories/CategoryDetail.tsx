import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Music, PlayCircle, Clock, Plus } from 'lucide-react';
import AddSongToCategoryModal from '../Modals/AddSongToCategoryModal';
import api from '../../../services/api';
import type { CategoryResponse, SongResponse } from '../../../types/backend';

const ITEMS_PER_PAGE = 20;

const CategoryDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    // States quản lý dữ liệu API
    const [category, setCategory] = useState<CategoryResponse | null>(null);
    const [categorySongs, setCategorySongs] = useState<SongResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // States quản lý UI
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    // 1. Hàm gọi API lấy chi tiết danh mục và bài hát
    const fetchCategoryDetail = useCallback(async () => {
        try {
            setIsLoading(true);
            // Lưu ý: Cập nhật endpoint '/categories/${id}' cho khớp với router Backend của bạn
            const res = await api.get(`/categories/${id}`);

            const categoryData = res.data.result;
            setCategory(categoryData);

            // Lấy danh sách bài hát (Giả sử BE trả về mảng songs bên trong category)
            setCategorySongs(categoryData.songs || []);
        } catch (error) {
            console.error("Lỗi khi tải chi tiết danh mục:", error);
        } finally {
            setIsLoading(false);
        }
    }, [id]);

    // 2. Tự động gọi API khi component mount hoặc ID thay đổi
    useEffect(() => {
        if (id) {
            fetchCategoryDetail();
        }
    }, [id, fetchCategoryDetail]);

    // Xử lý phân trang ở Client
    const totalPages = Math.ceil(categorySongs.length / ITEMS_PER_PAGE);
    const paginatedSongs = categorySongs.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    // 3. Xử lý gọi API thêm bài hát
    const handleAddSong = async (songId: string) => {
        try {
            // Lưu ý: Cập nhật endpoint này theo chuẩn thiết kế BE của bạn
            // Ví dụ: api.post('/categories/add-song', { categoryId: id, songId })
            await api.post(`/categories/${id}/songs/${songId}`);

            alert(`Đã thêm bài hát vào danh mục thành công!`);

            // Gọi lại hàm fetch để làm mới danh sách bài hát trên giao diện
            fetchCategoryDetail();
        } catch (error) {
            console.error("Lỗi khi thêm bài hát:", error);
            alert("Có lỗi xảy ra khi thêm bài hát vào danh mục.");
        }
    };

    // Hiển thị màn hình loading
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!category) return <div className="p-8 text-center text-gray-500 font-medium">Không tìm thấy danh mục này hoặc đã bị xóa.</div>;

    return (
        <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500">
            {/* 1. THÔNG TIN DANH MỤC */}
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-200 dark:border-white/5 shadow-sm">
                <div className="w-40 h-40 md:w-48 md:h-48 rounded-xl overflow-hidden shadow-xl border border-gray-100 dark:border-zinc-800 flex-shrink-0 group relative">
                    <img src={category.coverUrl} alt={category.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60"></div>
                </div>

                <div className="flex-1 space-y-3 text-center md:text-left w-full">
                    <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                        <button onClick={() => navigate('/admin/categories')} className="text-sm font-medium text-gray-500 hover:text-pink-500 flex items-center gap-1 transition">
                            <ArrowLeft size={16} /> <span className="hidden xs:inline">Quay lại</span>
                        </button>
                        <span className="text-gray-300">/</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-pink-600 bg-pink-50 dark:bg-pink-900/20 px-2 py-0.5 rounded">
                            {category.type || 'Category'}
                        </span>
                    </div>

                    <h1 className="text-2xl md:text-4xl font-black text-gray-900 dark:text-white tracking-tight">
                        {category.name}
                    </h1>

                    <p className="text-gray-500 dark:text-gray-400 max-w-2xl text-sm leading-relaxed mx-auto md:mx-0">
                        {category.description || 'Chưa có mô tả cho danh mục này.'}
                    </p>

                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2">
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                            <Music size={18} className="text-pink-500" />
                            {categorySongs.length} Bài hát
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-bold ${category.active ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                            {category.active ? 'Đang hoạt động' : 'Đã ẩn'}
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. DANH SÁCH BÀI HÁT */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2 px-1">
                        Danh sách bài hát <span className="text-sm font-normal text-gray-500">({categorySongs.length})</span>
                    </h2>

                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="text-sm bg-pink-600 hover:bg-pink-700 text-white
                                py-2 px-4 rounded-lg font-bold flex items-center
                                gap-2 transition shadow-lg shadow-pink-600/20"
                    >
                        <Plus size={18} /> Thêm bài hát
                    </button>
                </div>

                <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden shadow-sm">
                    {categorySongs.length === 0 ? (
                        <div className="p-8 text-center text-gray-500 text-sm">
                            Danh mục này chưa có bài hát nào. Hãy thêm bài hát mới nhé!
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 dark:bg-zinc-800/50 border-b border-gray-200 dark:border-white/10 text-xs uppercase text-gray-500 dark:text-gray-400 font-semibold">
                                    <th className="hidden md:table-cell p-4 w-12 text-center">#</th>
                                    <th className="p-4">Bài hát</th>
                                    <th className="hidden md:table-cell p-4">Nghệ sĩ</th>
                                    <th className="hidden lg:table-cell p-4">Album</th>
                                    <th className="p-4 text-right"><Clock size={14} className="ml-auto" /></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                                {paginatedSongs.map((song, idx) => (
                                    <tr key={song.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition group">
                                        <td className="hidden md:table-cell p-4 text-center text-gray-400 font-medium text-sm">
                                            {(currentPage - 1) * ITEMS_PER_PAGE + idx + 1}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="relative w-10 h-10 md:w-12 md:h-12 rounded overflow-hidden flex-shrink-0 group-hover:shadow-md transition cursor-pointer">
                                                    <img src={song.coverUrl} alt="" className="w-full h-full object-cover" />
                                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                                                        <PlayCircle size={20} className="text-white" />
                                                    </div>
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-bold text-gray-900 dark:text-white text-sm truncate max-w-[180px] md:max-w-xs">
                                                        {song.title}
                                                    </p>
                                                    <p className="text-xs text-gray-500 truncate md:hidden mt-0.5">
                                                        {song.artist}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="hidden md:table-cell p-4 text-sm text-gray-600 dark:text-gray-300">
                                            {song.artist}
                                        </td>
                                        <td className="hidden lg:table-cell p-4 text-sm text-gray-500">
                                            {song.albumName || '-'}
                                        </td>
                                        <td className="p-4 text-right text-sm text-gray-500 font-feature-settings-tnum">
                                            {Math.floor(song.duration / 60)}:{String(Math.floor(song.duration % 60)).padStart(2, '0')}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}

                    {/* Phân trang */}
                    {totalPages > 1 && (
                        <div className="p-4 border-t border-gray-100 dark:border-white/5 flex justify-center gap-2">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`w-8 h-8 rounded-lg text-sm font-bold transition ${currentPage === page
                                        ? 'bg-pink-600 text-white shadow-lg shadow-pink-500/30'
                                        : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-zinc-800'}`}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* MODAL THÊM BÀI HÁT */}
            {category && (
                <AddSongToCategoryModal
                    isOpen={isAddModalOpen}
                    onClose={() => setIsAddModalOpen(false)}
                    categoryId={category.id}
                    currentSongIds={categorySongs.map(s => s.id)}
                    onAdd={handleAddSong}
                />
            )}
        </div>
    );
};

export default CategoryDetail;