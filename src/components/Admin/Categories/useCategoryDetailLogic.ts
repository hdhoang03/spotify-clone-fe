import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../../services/api';
import type { CategoryResponse, SongResponse } from '../../../types/backend';

export const ITEMS_PER_PAGE = 20;

export const useCategoryDetailLogic = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    // States
    const [category, setCategory] = useState<CategoryResponse | null>(null);
    const [categorySongs, setCategorySongs] = useState<SongResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; songId: string | null }>({
        isOpen: false,
        songId: null
    });

    // Gọi API
    const fetchCategoryDetail = useCallback(async () => {
        if (!id) return;
        try {
            setIsLoading(true);
            const res = await api.get(`/categories/${id}`);
            const categoryData = res.data.result;
            setCategory(categoryData);

            const songsRes = await api.get('/song/advanced-search', {
                params: { category: categoryData.name, size: 100 }
            });

            if (songsRes.data.result && songsRes.data.result.content) {
                setCategorySongs(songsRes.data.result.content);
            } else {
                setCategorySongs([]);
            }
        } catch (error) {
            console.error("Lỗi lấy dữ liệu danh mục:", error);
        } finally {
            setIsLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchCategoryDetail();
    }, [fetchCategoryDetail]);

    // Phân trang
    const totalPages = Math.ceil(categorySongs.length / ITEMS_PER_PAGE);
    const paginatedSongs = categorySongs.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    // Handlers
    const handleAddSong = async (songId: string) => {
        try {
            await api.post(`/categories/${id}/songs/${songId}`);
            alert(`Đã thêm bài hát vào danh mục thành công!`);
            fetchCategoryDetail();
        } catch (error) {
            console.error("Lỗi khi thêm bài hát:", error);
            alert("Có lỗi xảy ra khi thêm bài hát vào danh mục.");
        }
    };

    const handleRemoveClick = (songId: string) => setConfirmModal({ isOpen: true, songId });
    const closeConfirmModal = () => setConfirmModal({ isOpen: false, songId: null });

    const executeRemoveSong = async () => {
        if (!id || !confirmModal.songId) return;
        try {
            await api.delete(`/categories/${id}/songs/${confirmModal.songId}`);
            fetchCategoryDetail();
        } catch (error: any) {
            console.error("Lỗi xóa bài hát:", error);
            alert(error.response?.data?.message || "Có lỗi xảy ra khi xóa bài hát khỏi danh mục.");
        } finally {
            closeConfirmModal();
        }
    };

    const handleBack = () => navigate('/admin/categories');

    return {
        category, categorySongs, paginatedSongs, isLoading,
        isAddModalOpen, setIsAddModalOpen,
        currentPage, setCurrentPage, totalPages,
        confirmModal, closeConfirmModal,
        handleBack, handleAddSong, handleRemoveClick, executeRemoveSong
    };
};