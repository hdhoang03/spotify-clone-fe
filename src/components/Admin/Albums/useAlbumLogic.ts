// import { useState, useEffect, useCallback } from 'react';
// import api from '../../../services/api';
// import type { AlbumResponse } from '../../../types/backend';

// export const useAlbumLogic = () => {
//     const [albums, setAlbums] = useState<AlbumResponse[]>([]);
//     const [totalItems, setTotalItems] = useState(0);
//     const [totalPages, setTotalPages] = useState(0);
//     const [currentPage, setCurrentPage] = useState(1);
//     const [searchTerm, setSearchTerm] = useState('');
//     const [debouncedKeyword, setDebouncedKeyword] = useState('');
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [selectedAlbum, setSelectedAlbum] = useState<AlbumResponse | null>(null);
//     const [isManageSongsOpen, setIsManageSongsOpen] = useState(false);

//     const ITEMS_PER_PAGE = 5;

//     useEffect(() => {
//         const timer = setTimeout(() => {
//             setDebouncedKeyword(searchTerm);
//             setCurrentPage(1);
//         }, 500);
//         return () => clearTimeout(timer);
//     }, [searchTerm]);

//     const fetchAlbums = useCallback(async () => {
//         try {
//             // Gọi API list với đầy đủ param
//             const response = await api.get('/albums/list', {
//                 params: {
//                     keyword: debouncedKeyword,
//                     isDeleted: false,
//                     page: currentPage,
//                     size: ITEMS_PER_PAGE
//                 }
//             });
//             const { content, totalElements, totalPages: tPages } = response.data.result;
//             setAlbums(content);
//             setTotalItems(totalElements);
//             setTotalPages(tPages);
//         } catch (error) {
//             console.error("Lỗi tải album:", error);
//         }
//     }, [debouncedKeyword, currentPage]);

//     useEffect(() => { fetchAlbums(); }, [fetchAlbums]);

//     const handleDeleteClick = async (id: string) => {
//         if (!window.confirm("Xóa album này? Các bài hát bên trong sẽ trở thành bài hát đơn.")) return;
//         try {
//             await api.delete(`/albums/delete/${id}`); //
//             fetchAlbums();
//         } catch (error: any) {
//             alert(error.response?.data?.message || "Xóa thất bại");
//         }
//     };

//     const handleManageSongsClick = (album: AlbumResponse) => {
//         setSelectedAlbum(album); // Lưu album đang chọn để Modal biết đang quản lý cho album nào
//         setIsManageSongsOpen(true);
//     };

//     const handleFormSubmit = async (formData: FormData) => {
//         try {
//             const config = { headers: { 'Content-Type': 'multipart/form-data' } };
//             if (selectedAlbum) {
//                 await api.put(`/albums/update/${selectedAlbum.id}`, formData, config);
//             } else {
//                 await api.post('/albums/create', formData, config);
//             }
//             closeModal();
//             fetchAlbums();
//         } catch (error: any) {
//             alert(error.response?.data?.message || "Lỗi lưu album");
//         }
//     };

//     const handleEditClick = (album: AlbumResponse) => { setSelectedAlbum(album); setIsModalOpen(true); };
//     const handleCreateClick = () => { setSelectedAlbum(null); setIsModalOpen(true); };
//     const closeModal = () => setIsModalOpen(false);

//     return {
//         paginatedAlbums: albums, totalItems, totalPages, currentPage, startIndex: (currentPage - 1) * ITEMS_PER_PAGE,
//         searchTerm, isModalOpen, selectedAlbum,
//         setSearchTerm, handlePageChange: setCurrentPage,
//         handleCreateClick, handleEditClick, handleDeleteClick, handleFormSubmit, handleManageSongsClick, closeModal
//     };
// };

// src/pages/Admin/Albums/useAlbumLogic.ts
import { useState, useEffect, useCallback } from 'react';
import api from '../../../services/api';
import type { AlbumResponse } from '../../../types/backend';

export const useAlbumLogic = () => {
    const [albums, setAlbums] = useState<AlbumResponse[]>([]);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedKeyword, setDebouncedKeyword] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAlbum, setSelectedAlbum] = useState<AlbumResponse | null>(null);
    const [isManageSongsOpen, setIsManageSongsOpen] = useState(false);

    // THÊM: State quản lý việc xem Thùng rác hay Danh sách chính
    const [isDeletedView, setIsDeletedView] = useState(false);

    const ITEMS_PER_PAGE = 5;

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedKeyword(searchTerm);
            setCurrentPage(1);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    const fetchAlbums = useCallback(async () => {
        try {
            const response = await api.get('/albums/list', {
                params: {
                    keyword: debouncedKeyword,
                    isDeleted: isDeletedView, // THAY ĐỔI: Dùng state thay vì false cố định
                    page: currentPage,
                    size: ITEMS_PER_PAGE
                }
            });
            const { content, totalElements, totalPages: tPages } = response.data.result;
            setAlbums(content);
            setTotalItems(totalElements);
            setTotalPages(tPages);
        } catch (error) {
            console.error("Lỗi tải album:", error);
        }
    }, [debouncedKeyword, currentPage, isDeletedView]); // THÊM: isDeletedView vào dependencies

    useEffect(() => { fetchAlbums(); }, [fetchAlbums]);

    const handleDeleteClick = async (id: string) => {
        if (!window.confirm("Xóa album này? Các bài hát bên trong sẽ trở thành bài hát đơn.")) return;
        try {
            await api.delete(`/albums/delete/${id}`);
            fetchAlbums();
        } catch (error: any) {
            alert(error.response?.data?.message || "Xóa thất bại");
        }
    };

    // THÊM: Hàm khôi phục Album
    const handleRestoreClick = async (id: string) => {
        if (window.confirm("Bạn muốn khôi phục album này?")) {
            try {
                // Lưu ý: Kiểm tra lại xem BE của bạn cấu hình endpoint khôi phục album là gì nhé
                await api.patch(`/albums/restore/${id}`);
                fetchAlbums();
            } catch (error: any) {
                alert("Khôi phục thất bại!");
            }
        }
    };

    const handleManageSongsClick = (album: AlbumResponse) => {
        setSelectedAlbum(album);
        setIsManageSongsOpen(true);
    };

    const handleFormSubmit = async (formData: FormData) => {
        try {
            const config = { headers: { 'Content-Type': 'multipart/form-data' } };
            if (selectedAlbum) {
                await api.put(`/albums/update/${selectedAlbum.id}`, formData, config);
            } else {
                await api.post('/albums/create', formData, config);
            }
            closeModal();
            fetchAlbums();
        } catch (error: any) {
            alert(error.response?.data?.message || "Lỗi lưu album");
        }
    };

    const handleEditClick = (album: AlbumResponse) => { setSelectedAlbum(album); setIsModalOpen(true); };
    const handleCreateClick = () => { setSelectedAlbum(null); setIsModalOpen(true); };
    const closeModal = () => setIsModalOpen(false);

    return {
        paginatedAlbums: albums, totalItems, totalPages, currentPage, startIndex: (currentPage - 1) * ITEMS_PER_PAGE,
        searchTerm, isModalOpen, selectedAlbum, isManageSongsOpen,
        isDeletedView, // TRẢ VỀ STATE MỚI
        setSearchTerm, handlePageChange: setCurrentPage,
        handleCreateClick, handleEditClick, handleDeleteClick, handleFormSubmit, handleManageSongsClick, closeModal,
        setIsDeletedView, handleRestoreClick // TRẢ VỀ HÀM MỚI
    };
};