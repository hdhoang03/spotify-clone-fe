// import { useState, useEffect, useCallback } from 'react';
// import api from '../../../services/api';
// import type { ArtistResponse } from '../../../types/backend';
// import type { ConfirmActionType } from '../ConfirmModal';

// export const useArtistLogic = () => {
//     const [artists, setArtists] = useState<ArtistResponse[]>([]);
//     const [searchTerm, setSearchTerm] = useState('');
//     const [debouncedKeyword, setDebouncedKeyword] = useState('');
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [selectedArtist, setSelectedArtist] = useState<ArtistResponse | null>(null);
//     const [viewDeleted, setViewDeleted] = useState(false);
//     const [currentPage, setCurrentPage] = useState(1);
//     const [totalPages, setTotalPages] = useState(1);
//     const [totalItems, setTotalItems] = useState(0);
//     const ITEMS_PER_PAGE = 10; // Hoặc số lượng bạn muốn hiển thị (5, 8, 10)
//     const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

//     // 2. Hàm chuyển trang
//     const handlePageChange = (page: number) => {
//         setCurrentPage(page);
//     };

//     const [confirmModal, setConfirmModal] = useState<{
//         isOpen: boolean; type: ConfirmActionType; id: string | null; title: string; message: string;
//     }>({ isOpen: false, type: 'DELETE_SOFT', id: null, title: '', message: '' });

//     // 2. CHỐNG SPAM API KHI SEARCH (Debounce)
//     useEffect(() => {
//         const timer = setTimeout(() => setDebouncedKeyword(searchTerm), 500);
//         return () => clearTimeout(timer);
//     }, [searchTerm]);

//     // 3. FETCH DATA API
//     const fetchArtists = useCallback(async () => {
//         try {
//             // Gọi API lấy danh sách nghệ sĩ, truyền params keyword và isDeleted
//             const response = await api.get('/artist/list', {
//                 params: {
//                     keyword: debouncedKeyword,
//                     isDeleted: viewDeleted,
//                     page: 1,
//                     size: 50 // Có thể chỉnh kích thước trang tùy ý
//                 }
//             });
//             // Trích xuất mảng dữ liệu từ cấu trúc ApiResponse -> Page
//             setArtists(response.data.result.content);
//         } catch (error) {
//             console.error("Lỗi khi tải danh sách nghệ sĩ:", error);
//         }
//     }, [debouncedKeyword, viewDeleted]); // Tự động gọi lại khi từ khóa hoặc trạng thái xem thay đổi

//     // Kích hoạt lần đầu
//     useEffect(() => {
//         fetchArtists();
//     }, [fetchArtists]);

//     // 4. HANDLERS BẬT MODAL
//     const handleCreateClick = () => { setSelectedArtist(null); setIsModalOpen(true); };
//     const handleEditClick = (artist: ArtistResponse) => { setSelectedArtist(artist); setIsModalOpen(true); };
//     const closeModal = () => setIsModalOpen(false);

//     // --- MODAL XÁC NHẬN HÀNH ĐỘNG ---
//     const handleDeleteClick = (id: string) => {
//         setConfirmModal({
//             isOpen: true, type: 'DELETE_SOFT', id,
//             title: 'Xóa tạm thời?', message: 'Nghệ sĩ sẽ được chuyển vào thùng rác.'
//         });
//     };

//     const handleRestoreClick = (id: string) => {
//         setConfirmModal({
//             isOpen: true, type: 'RESTORE', id,
//             title: 'Khôi phục nghệ sĩ?', message: 'Nghệ sĩ này sẽ xuất hiện trở lại trong danh sách.'
//         });
//     };

//     const handleHardDeleteClick = (id: string) => {
//         setConfirmModal({
//             isOpen: true, type: 'DELETE_HARD', id,
//             title: 'Xóa vĩnh viễn?', message: 'Hành động này KHÔNG THỂ hoàn tác.'
//         });
//     };

//     // --- THỰC THI GỌI API ---
//     const handleFormSubmit = async (formData: FormData) => {
//         try {
//             const config = { headers: { 'Content-Type': 'multipart/form-data' } };

//             if (selectedArtist) {
//                 // UPDATE
//                 await api.put(`/artist/${selectedArtist.id}/update`, formData, config);
//                 alert("Cập nhật nghệ sĩ thành công!");
//             } else {
//                 // CREATE
//                 await api.post('/artist/create', formData, config);
//                 alert("Thêm nghệ sĩ mới thành công!");
//             }
//             closeModal();
//             fetchArtists(); // Load lại data mới nhất từ Backend
//         } catch (error: any) {
//             console.error("Lỗi lưu nghệ sĩ:", error);
//             alert(error.response?.data?.message || "Có lỗi xảy ra khi lưu nghệ sĩ!");
//         }
//     };

//     const executeAction = async () => {
//         const { type, id } = confirmModal;
//         if (!id) return;

//         try {
//             if (type === 'DELETE_SOFT') {
//                 await api.delete(`/artist/${id}/delete`);
//             } else if (type === 'RESTORE') {
//                 await api.patch(`/artist/${id}/restore`);
//             } else if (type === 'DELETE_HARD') {
//                 await api.delete(`/artist/${id}/force-delete`); // Cần đảm bảo backend có endpoint này
//             }
//             // Gọi lại API để làm mới UI sau khi thao tác thành công
//             fetchArtists();
//         } catch (error: any) {
//             console.error(`Lỗi thực thi ${type}:`, error);
//             alert(error.response?.data?.message || "Thao tác thất bại!");
//         } finally {
//             closeConfirmModal();
//         }
//     };

//     const closeConfirmModal = () => setConfirmModal(prev => ({ ...prev, isOpen: false }));

//     return {
//         filteredArtists: artists, searchTerm, isModalOpen, selectedArtist, viewDeleted,
//         setSearchTerm, setViewDeleted, handleCreateClick, handleEditClick, closeModal, handleFormSubmit,
//         handleDeleteClick, handleRestoreClick, handleHardDeleteClick,
//         confirmModal, executeAction, closeConfirmModal, startIndex,
//         currentPage,
//         totalPages,
//         totalItems,
//         handlePageChange
//     };
// };

import { useState, useEffect, useCallback } from 'react';
import api from '../../../services/api';
import type { ArtistResponse } from '../../../types/backend';
import type { ConfirmActionType } from '../ConfirmModal';

export const useArtistLogic = () => {
    const [artists, setArtists] = useState<ArtistResponse[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedKeyword, setDebouncedKeyword] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedArtist, setSelectedArtist] = useState<ArtistResponse | null>(null);
    const [viewDeleted, setViewDeleted] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const ITEMS_PER_PAGE = 10; // Đang để 10 (tương đương 2 hàng nghệ sĩ trên PC)
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

    // Hàm chuyển trang
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const [confirmModal, setConfirmModal] = useState<{
        isOpen: boolean; type: ConfirmActionType; id: string | null; title: string; message: string;
    }>({ isOpen: false, type: 'DELETE_SOFT', id: null, title: '', message: '' });

    // CHỐNG SPAM API KHI SEARCH
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedKeyword(searchTerm);
            setCurrentPage(1); // MỖI KHI TÌM KIẾM TỪ KHÓA MỚI, PHẢI RESET VỀ TRANG 1
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    // FETCH DATA API (ĐÃ SỬA LỖI PHÂN TRANG Ở ĐÂY)
    const fetchArtists = useCallback(async () => {
        try {
            const response = await api.get('/artist/list', {
                params: {
                    keyword: debouncedKeyword,
                    isDeleted: viewDeleted,
                    page: currentPage,       // SỬA Ở ĐÂY: Dùng biến currentPage thay vì số 1
                    size: ITEMS_PER_PAGE     // SỬA Ở ĐÂY: Dùng biến size thay vì số 50
                }
            });

            // SỬA Ở ĐÂY: Trích xuất thêm totalElements và totalPages từ Backend trả về
            const { content, totalElements, totalPages: tPages } = response.data.result;

            setArtists(content);
            setTotalItems(totalElements); // Cập nhật tổng số Item để hiện phân trang
            setTotalPages(tPages);        // Cập nhật tổng số trang

        } catch (error) {
            console.error("Lỗi khi tải danh sách nghệ sĩ:", error);
        }
    }, [debouncedKeyword, viewDeleted, currentPage]); // SỬA Ở ĐÂY: Thêm currentPage vào dependency

    // Kích hoạt gọi API
    useEffect(() => {
        fetchArtists();
    }, [fetchArtists]);

    // HANDLERS BẬT MODAL
    const handleCreateClick = () => { setSelectedArtist(null); setIsModalOpen(true); };
    const handleEditClick = (artist: ArtistResponse) => { setSelectedArtist(artist); setIsModalOpen(true); };
    const closeModal = () => setIsModalOpen(false);

    // MODAL XÁC NHẬN HÀNH ĐỘNG
    const handleDeleteClick = (id: string) => {
        setConfirmModal({
            isOpen: true, type: 'DELETE_SOFT', id,
            title: 'Xóa tạm thời?', message: 'Nghệ sĩ sẽ được chuyển vào thùng rác.'
        });
    };

    const handleRestoreClick = (id: string) => {
        setConfirmModal({
            isOpen: true, type: 'RESTORE', id,
            title: 'Khôi phục nghệ sĩ?', message: 'Nghệ sĩ này sẽ xuất hiện trở lại trong danh sách.'
        });
    };

    const handleHardDeleteClick = (id: string) => {
        setConfirmModal({
            isOpen: true, type: 'DELETE_HARD', id,
            title: 'Xóa vĩnh viễn?', message: 'Hành động này KHÔNG THỂ hoàn tác.'
        });
    };

    // THỰC THI GỌI API
    const handleFormSubmit = async (formData: FormData) => {
        try {
            const config = { headers: { 'Content-Type': 'multipart/form-data' } };

            if (selectedArtist) {
                await api.put(`/artist/${selectedArtist.id}/update`, formData, config);
                alert("Cập nhật nghệ sĩ thành công!");
            } else {
                await api.post('/artist/create', formData, config);
                alert("Thêm nghệ sĩ mới thành công!");
            }
            closeModal();
            fetchArtists();
        } catch (error: any) {
            console.error("Lỗi lưu nghệ sĩ:", error);
            alert(error.response?.data?.message || "Có lỗi xảy ra khi lưu nghệ sĩ!");
        }
    };

    const executeAction = async () => {
        const { type, id } = confirmModal;
        if (!id) return;

        try {
            if (type === 'DELETE_SOFT') {
                await api.delete(`/artist/${id}/delete`);
            } else if (type === 'RESTORE') {
                await api.patch(`/artist/${id}/restore`);
            } else if (type === 'DELETE_HARD') {
                await api.delete(`/artist/${id}/force-delete`);
            }
            fetchArtists();
        } catch (error: any) {
            console.error(`Lỗi thực thi ${type}:`, error);
            alert(error.response?.data?.message || "Thao tác thất bại!");
        } finally {
            closeConfirmModal();
        }
    };

    const closeConfirmModal = () => setConfirmModal(prev => ({ ...prev, isOpen: false }));

    return {
        filteredArtists: artists, searchTerm, isModalOpen, selectedArtist, viewDeleted,
        setSearchTerm, setViewDeleted, handleCreateClick, handleEditClick, closeModal, handleFormSubmit,
        handleDeleteClick, handleRestoreClick, handleHardDeleteClick,
        confirmModal, executeAction, closeConfirmModal, startIndex,
        currentPage,
        totalPages,
        totalItems,
        handlePageChange
    };
};