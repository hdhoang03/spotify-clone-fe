import { useState, useEffect, useCallback } from 'react';
import api from '../../../services/api';
import type { SongResponse } from '../../../types/backend';
import type { ConfirmActionType } from '../ConfirmModal'; // IMPORT TYPE CỦA MODAL

const ITEMS_PER_PAGE = 10;

export interface SongFilterState {
    keyword: string;
    artist: string;
    category: string;
    year: string;
}

export const useSongLogic = () => {
    const [songs, setSongs] = useState<SongResponse[]>([]);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    const [isDeletedView, setIsDeletedView] = useState(false);

    const [filters, setFilters] = useState<SongFilterState>({
        keyword: '', artist: '', category: '', year: ''
    });
    const [debouncedFilters, setDebouncedFilters] = useState<SongFilterState>(filters);

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [selectedSong, setSelectedSong] = useState<SongResponse | null>(null);

    // --- STATE QUẢN LÝ CONFIRM MODAL ---
    const [confirmModal, setConfirmModal] = useState<{
        isOpen: boolean; type: ConfirmActionType; id: string | null; title: string; message: string;
    }>({ isOpen: false, type: 'DELETE_SOFT', id: null, title: '', message: '' });

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedFilters(filters);
            setCurrentPage(1);
        }, 500);
        return () => clearTimeout(timer);
    }, [filters, isDeletedView]);

    const fetchSongs = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/song/advanced-search', {
                params: {
                    keyword: debouncedFilters.keyword || undefined,
                    artist: debouncedFilters.artist || undefined,
                    category: debouncedFilters.category || undefined,
                    year: debouncedFilters.year ? parseInt(debouncedFilters.year) : undefined,
                    page: currentPage,
                    size: ITEMS_PER_PAGE,
                    isDeleted: isDeletedView
                }
            });
            const { content, totalElements, totalPages: tPages } = response.data.result;
            setSongs(content);
            setTotalItems(totalElements);
            setTotalPages(tPages);
        } catch (error) {
            console.error("Lỗi khi tải danh sách bài hát:", error);
        } finally {
            setIsLoading(false);
        }
    }, [debouncedFilters, currentPage, isDeletedView]);

    useEffect(() => {
        fetchSongs();
    }, [fetchSongs]);

    const handleFilterChange = (key: keyof SongFilterState, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const handlePageChange = (page: number) => setCurrentPage(page);
    const handleCreateClick = () => setIsCreateModalOpen(true);
    const handleEditClick = (song: SongResponse) => { setSelectedSong(song); setIsUpdateModalOpen(true); };

    // --- XỬ LÝ BẬT MODAL ---
    const handleDeleteClick = (id: string) => {
        setConfirmModal({
            isOpen: true, type: 'DELETE_SOFT', id,
            title: 'Chuyển vào thùng rác?', message: 'Bài hát sẽ được ẩn khỏi danh sách và có thể khôi phục sau.'
        });
    };

    const handleRestoreClick = (id: string) => {
        setConfirmModal({
            isOpen: true, type: 'RESTORE', id,
            title: 'Khôi phục bài hát?', message: 'Bài hát sẽ hiển thị trở lại trong kho nhạc chính.'
        });
    };

    const handleHardDeleteClick = (id: string) => {
        setConfirmModal({
            isOpen: true, type: 'DELETE_HARD', id,
            title: 'Xóa vĩnh viễn?', message: 'Hành động này sẽ xóa vĩnh viễn bài hát, toàn bộ lượt stream và lượt like. KHÔNG THỂ hoàn tác.'
        });
    };

    const closeConfirmModal = () => setConfirmModal(prev => ({ ...prev, isOpen: false }));

    // --- THỰC THI GỌI API KHI XÁC NHẬN MODAL ---
    const executeAction = async () => {
        const { type, id } = confirmModal;
        if (!id) return;

        try {
            if (type === 'DELETE_SOFT') {
                await api.delete(`/song/delete/${id}`);
            } else if (type === 'RESTORE') {
                await api.patch(`/song/restore/${id}`);
            } else if (type === 'DELETE_HARD') {
                await api.delete(`/song/force-delete/${id}`);
            }
            fetchSongs();
        } catch (error: any) {
            console.error(`Lỗi thực thi ${type}:`, error);
            alert(error.response?.data?.message || "Thao tác thất bại!");
        } finally {
            closeConfirmModal();
        }
    };

    const handleCreateSubmit = async (formData: FormData) => {
        try {
            await api.post('/song/create2', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setIsCreateModalOpen(false);
            fetchSongs();
        } catch (error: any) {
            alert(error.response?.data?.message || "Lỗi khi upload bài hát!");
        }
    };

    const handleUpdateSubmit = async (id: string, formData: FormData) => {
        try {
            await api.put(`/song/update/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setIsUpdateModalOpen(false);
            fetchSongs();
        } catch (error: any) {
            alert(error.response?.data?.message || "Lỗi khi cập nhật!");
        }
    };

    return {
        paginatedSongs: songs, totalItems, totalPages, currentPage, startIndex: (currentPage - 1) * ITEMS_PER_PAGE,
        filters, isCreateModalOpen, isUpdateModalOpen, selectedSong, isLoading,
        isDeletedView, setIsDeletedView,
        handleFilterChange, handlePageChange, handleCreateClick, handleEditClick,

        // Trả ra các hàm và state của Modal
        handleDeleteClick, handleRestoreClick, handleHardDeleteClick,
        confirmModal, executeAction, closeConfirmModal,

        handleCreateSubmit, handleUpdateSubmit, setIsCreateModalOpen, setIsUpdateModalOpen
    };
};